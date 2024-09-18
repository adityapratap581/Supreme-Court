from fastapi import FastAPI, HTTPException, UploadFile, File, status
import zipfile
import os
from Vision_Pipeline.image_translation import process_images_in_folder
from Vision_Pipeline.extract_image import extract_images_from_pdf
from Vision_Pipeline.stamp_detection import load_yolo_model, detect_objects, check_overlap
from Vision_Pipeline.underline_detection import detect_defect
from Text_Pipeline.img_to_text import convert_pdf_to_text_pdf
from Text_Pipeline.save_text import pdf_to_text
from Text_Pipeline.llm import read_text_files, check_inconsistencies, check_inconsistencies2, process_results,process_results2,extract_names_from_pdf, filter_names_from_processed_results,print_iterative_results,print_iterative_results2,find_defect
from fastapi.middleware.cors import CORSMiddleware


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
        "Scan Defect": [],
        "Stamp Defect": [],
        "Underline Defect": []
    }
    
    pdf_path = os.path.join(UPLOAD_DIR, file.filename)
    output_dir = os.path.join(extract_images_path, file.filename)
    os.makedirs(output_dir, exist_ok=True)

    extract_images = extract_images_from_pdf(pdf_path=pdf_path, output_dir=output_dir)
    
    translation_defect = process_images_in_folder(output_dir)
    print('translation_defect : ', translation_defect)
    for image, defect in translation_defect.items():
        if defect == 'Scan Defect':
            defected_images["Scan Defect"].append(image)

    stamp_model = load_yolo_model(stamp_model_path)
    underline_model = load_yolo_model(underline_model_path)

    all_images = os.listdir(output_dir)

    # Stamp Detection
    for i in all_images:
        image_path = os.path.join(output_dir, i)
        stamp_boxes = detect_objects(model=stamp_model, image_path=image_path)
        result = check_overlap(stamp_boxes)
        if result == 'Stamp Defect':
            defected_images["Stamp Defect"].append(i)
    
    print('stamp detection completed')

    # Underline Detection
    for i in all_images:
        image_path = os.path.join(output_dir, i)
        underline_result = detect_defect(model=underline_model, image_path=image_path)
        if underline_result == 'Underline Defect':
            defected_images["Underline Defect"].append(i)


    
    print('Underline detection completed')
    
    print('pdf path : ', pdf_path)
    print('converted_pdfs : ', converted_pdfs)
    convert_pdf_to_text_pdf(pdf_path=pdf_path,save_path=converted_pdfs)
    
    converted_per_pdf = os.path.join(converted_pdfs,file.filename)
    
    print('converted_per_pdf : ', converted_per_pdf)
    
    pdf_to_text(converted_per_pdf, converted_texts)
    
    print('h2')
    
    TEXT_FILES_PATH = os.path.join(converted_texts,file.filename).removesuffix('.pdf')
    print('TEXT_FILES_PATH : ', TEXT_FILES_PATH)
    text_chunks = read_text_files(TEXT_FILES_PATH)
    
    results = check_inconsistencies(text_chunks)
    
    results2 = check_inconsistencies2(text_chunks)
    
    processed_results = process_results(results)
    print('supreme 11 Processed Results:', processed_results)
    
    processed_results2 = process_results2(results2)
    print('supreme 9 Processed Results:', processed_results2)
    
    pdf_names = extract_names_from_pdf(converted_pdfs)
    iterative_results = filter_names_from_processed_results(processed_results, pdf_names)
    
    iterative_results2 = filter_names_from_processed_results(processed_results2, pdf_names)
    
    
    supreme11_results = print_iterative_results(iterative_results)
    print('supreme11_results : ',supreme11_results)
    supreme9_results = print_iterative_results2(iterative_results2)
    print('supreme9_results : ',supreme9_results)
    
    final_response = find_defect(main_dict=supreme11_results,sub_dict=supreme9_results)
    
    print('final response : ', final_response)
    
    defected_images.update(final_response)
    
    final_result.append(defected_images)

    return final_result