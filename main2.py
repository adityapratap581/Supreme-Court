from fastapi import FastAPI, HTTPException, UploadFile, File, status
import zipfile
import os
from Vision_Pipeline.image_translation import process_images_in_folder
from Vision_Pipeline.extract_image import extract_images_from_pdf
from Vision_Pipeline.stamp_detection import load_yolo_model, detect_objects, check_overlap
from Vision_Pipeline.underline_detection import detect_defect
from Text_Pipeline.img_to_text import convert_pdf_to_text_pdf
from Text_Pipeline.save_text import pdf_to_text
from Supreme_Court_New_Pipeline.llm import find_files_with_pattern, process_text_files,check_defects
from fastapi.middleware.cors import CORSMiddleware
from Supreme_Court_New_Pipeline.lang_detect_llm import detect_languages
from Supreme_Court_New_Pipeline.filter_texts import text_filter
from Supreme_Court_New_Pipeline.alias_detection import find_pet_res, search_patterns_in_directory,check_alias_defect,search_category_in_directory

app = FastAPI()

app.add_middleware(
CORSMiddleware,
allow_origins = ['*'],
allow_credentials = True,
allow_methods = ["GET","OPTIONS","POST","DELETE","PUT"],
allow_headers = ["*"],
expose_headers=["*"],
)

UPLOAD_DIR = r'/home/xstats/Documents/Aditya/SupremeCourtComplete/Uploaded_PDFs'
extract_images_path = r'/home/xstats/Documents/Aditya/SupremeCourtComplete/Extracted Images'
stamp_model_path = r'/home/xstats/Documents/Aditya/SupremeCourtComplete/Stamp_Final_Model/detect/train/weights/best.pt'
underline_model_path = r'/home/xstats/Documents/Aditya/SupremeCourtComplete/underline_model/detect/train/weights/best.pt'
converted_pdfs = r'/home/xstats/Documents/Aditya/SupremeCourtComplete/converted_pdf'
converted_texts = r'/home/xstats/Documents/Aditya/SupremeCourtComplete/converted_texts'

@app.post("/upload_PDF")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        
    final_result = []
    defected_images = {
        'filename':file.filename,
        "Scan_Defect": [],
        "Stamp_Defect": [],
        "Underline_Defect": []
    }
    
    pdf_path = os.path.join(UPLOAD_DIR, file.filename)
    output_dir = os.path.join(extract_images_path, file.filename)
    os.makedirs(output_dir, exist_ok=True)

    extract_images = extract_images_from_pdf(pdf_path=pdf_path, output_dir=output_dir)
    
    translation_defect = process_images_in_folder(output_dir)
    print('translation_defect : ', translation_defect)
    for image, defect in translation_defect.items():
        if defect == 'Scan Defect':
            defected_images["Scan_Defect"].append(image)

    stamp_model = load_yolo_model(stamp_model_path)
    underline_model = load_yolo_model(underline_model_path)

    all_images = os.listdir(output_dir)

    # Stamp Detection
    for i in all_images:
        image_path = os.path.join(output_dir, i)
        stamp_boxes = detect_objects(model=stamp_model, image_path=image_path)
        result = check_overlap(stamp_boxes)
        if result == 'Stamp Defect':
            defected_images["Stamp_Defect"].append(i)
    
    print('stamp detection completed')

    # Underline Detection
    for i in all_images:
        image_path = os.path.join(output_dir, i)
        underline_result = detect_defect(model=underline_model, image_path=image_path)
        if underline_result == 'Underline Defect':
            defected_images["Underline_Defect"].append(i)


    
    print('Underline detection completed')
    
    print('pdf path : ', pdf_path)
    convert_pdf_to_text_pdf(pdf_path=pdf_path,save_path=converted_texts)
    
    TEXT_FILES_PATH = os.path.join(converted_texts,file.filename).removesuffix('.pdf')
    
    # filter_files = text_filter(TEXT_FILES_PATH)
    
    languages = detect_languages(TEXT_FILES_PATH)
    
    for key,value in languages.items():
        if 'Other Language Found' in value:
            dict1 = {'language_defect' : ['Other Language Found']}
            defected_images.update(dict1)
        else:
            pass
        
    
    matching_files = find_files_with_pattern(TEXT_FILES_PATH)
    print('matching_files : ', matching_files)
    results = process_text_files(TEXT_FILES_PATH,matching_files)
    
    final_length = len(results)
    length_onwards = results[final_length-1].find('type of petition')
    
    # results[final_length-1][length_onwards:]
    petition_length = len('type of petition')
    start_petition = length_onwards + petition_length + 3
    petitioner_dict = {results[final_length-1][length_onwards:length_onwards+petition_length]: results[final_length-1][start_petition:-1]}
    petitioner_dict['type of petition'] = petitioner_dict['type of petition'].split('(')[0].rstrip()
    print('petitioner_dict : ', petitioner_dict)
    
    category = search_category_in_directory(TEXT_FILES_PATH, matching_files[0], petitioner_dict['type of petition'])
    
    defected_images.update(petitioner_dict)
    defected_images.update(category)
    
    pet_res_dict = find_pet_res(results)
    
    petitioner_name = pet_res_dict['petioner_name']
    respondent_name = pet_res_dict['respondent_name']
    
    print('petitioner_name : ', petitioner_name)
    print('respondent_name : ', respondent_name)
    
    alias = search_patterns_in_directory(directory_path=TEXT_FILES_PATH,petitioner_name=petitioner_name,respondent_name=respondent_name)
    
    print('alias is : ', alias)
    if alias['alias'] == 'detected':
        alias_in = alias['name']
        if alias_in == petitioner_name:
            type_alias = 'Petitioner'
            alias_defects = check_alias_defect(directory=TEXT_FILES_PATH,file_list=matching_files,name=alias_in,type_alias=type_alias)
        if alias_in == respondent_name:
            type_alias = 'Respondent'
            alias_defects = check_alias_defect(directory=TEXT_FILES_PATH,file_list=matching_files,name=alias_in,type_alias=type_alias)
        
        defected_images.update(alias_defects)
        
    
        
    defect_result,wrong_petitioner,wrong_respondent = check_defects(results)
    print('wrong_petitioner : ', wrong_petitioner)
    print('wrong_respondent : ', wrong_respondent)
    
    for i in matching_files:
        txt_path = os.path.join(TEXT_FILES_PATH,i)
        with open(txt_path,'r') as f:
            data = f.read()
            
        
        if wrong_petitioner in data:
            if len(wrong_petitioner) > 2:
                page_dict = {'page_num' : []}
                page_dict['page_num'].append(i)
                print('wrong petitioner on page : ', i)
                defect_result.update(page_dict)
                
        elif wrong_respondent in data:
            if len(wrong_respondent) > 2:
                page_dict = {'page_num' : []}
                page_dict['page_num'].append(i)
                print('wrong respondent on page :', i)
                defect_result.update(page_dict)
        
        else:
            print('not found')
        
    defected_images.update(defect_result)
    
    defected_images.update(pet_res_dict)
    
    final_result.append(defected_images)
    
    
    return final_result

