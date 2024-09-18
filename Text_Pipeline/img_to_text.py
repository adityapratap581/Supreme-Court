# import pytesseract
# from pdf2image import convert_from_path
# import os
# from reportlab.lib.pagesizes import letter
# from reportlab.pdfgen import canvas
# from reportlab.lib.units import inch

# pdf_folder = r'/home/xstats/Documents/Aditya/Supreme_Court_Text_pipeline/uploaded_pdf'
# save_path = r'/home/xstats/Documents/Aditya/Supreme_Court_Text_pipeline/converted_pdf'

# pdfs = os.listdir(pdf_folder)

# for i in pdfs:
#     if i.endswith('.pdf'):
#         print(i)
#         base_name = i.removesuffix('.pdf')
#         print(base_name)
#         pdf_path = os.path.join(pdf_folder, i)
#         print(pdf_path)
        
#         pages = convert_from_path(pdf_path, 500)
#         print('pages : ', pages)
#         per_pdf_destination = os.path.join(save_path, f'{base_name}.pdf')
#         print('per_pdf_destination : ', per_pdf_destination)

#         all_text = ""

#         for pageNum, img in enumerate(pages):
#             print('pagenum : ', pageNum)
#             text = pytesseract.image_to_string(img, lang='eng')
#             print('text : ', text)
#             all_text += text + "\n\n" 

#         c = canvas.Canvas(per_pdf_destination, pagesize=letter)
#         width, height = letter 
#         text_object = c.beginText(72, height - 72)  
#         text_object.setFont("Helvetica", 12)
#         text_object.setTextOrigin(72, height - 72)
        
#         for line in all_text.splitlines(True):
#             if text_object.getY() < 72:  
#                 c.drawText(text_object)
#                 c.showPage()
#                 text_object = c.beginText(72, height - 72)
#                 text_object.setFont("Helvetica", 12)
#                 text_object.setTextOrigin(72, height - 72)
#             text_object.textLines(line)
        
#         c.drawText(text_object)
#         c.save()

from fastapi import HTTPException
import pytesseract
from pdf2image import convert_from_path
import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from langdetect import detect

# def convert_pdf_to_text_pdf(pdf_path, save_path, resolution=500):
            
#     pages = convert_from_path(pdf_path, resolution)
#     print('length of pages in pdf : ', pages)
    
#     base_name = os.path.basename(pdf_path).removesuffix('.pdf')
#     # base_name = pdf_path.removesuffix('.pdf')
    
#     print('save_path inside : ',save_path)

#     per_pdf_destination = os.path.join(save_path, f'{base_name}.pdf')
    
#     print('per_pdf_destination : ', per_pdf_destination)

#     all_text = ""

#     for pageNum, img in enumerate(pages):
#         print('pagenum : ', pageNum)
#         text = pytesseract.image_to_string(img, lang='eng')
#         all_text += text + "\n\n" 

#     c = canvas.Canvas(per_pdf_destination, pagesize=letter)
#     width, height = letter 
#     text_object = c.beginText(72, height - 72)  
#     text_object.setFont("Helvetica", 12)
#     text_object.setTextOrigin(72, height - 72)
    
#     for line in all_text.splitlines(True):
#         if text_object.getY() < 72:  
#             c.drawText(text_object)
#             c.showPage()
#             text_object = c.beginText(72, height - 72)
#             text_object.setFont("Helvetica", 12)
#             text_object.setTextOrigin(72, height - 72)
#         text_object.textLines(line)
    
#     c.drawText(text_object)
#     c.save()

# def convert_pdf_to_text_pdf(pdf_path, save_path, resolution=500):
#     pages = convert_from_path(pdf_path, resolution)
#     print('Length of pages in PDF:', len(pages))
    
#     base_name = os.path.basename(pdf_path).removesuffix('.pdf')
#     print('Save path inside:', save_path)

#     per_pdf_destination = os.path.join(save_path, f'{base_name}.pdf')
#     print('Per PDF destination:', per_pdf_destination)

#     all_text = ""

#     for pageNum, img in enumerate(pages):
#         print('Processing page number:', pageNum + 1)
#         text = pytesseract.image_to_string(img, lang='eng')
#         all_text += text + "\n\n"

#     try:
#         detected_language = detect(all_text)
#         print('Detected language:', detected_language)
        
#         if detected_language != 'en':
#             print('Error Detected: Language is not English')
#             raise TypeError('Error Detected: Language is not English')

#     except (Exception,TypeError) as e:
#         print('Error in language detection:', str(e))
#         raise HTTPException(status_code=400, detail=str(e))
#     c = canvas.Canvas(per_pdf_destination, pagesize=letter)
#     width, height = letter
#     text_object = c.beginText(72, height - 72)
#     text_object.setFont("Helvetica", 12)
#     text_object.setTextOrigin(72, height - 72)

#     for line in all_text.splitlines(True):
#         if text_object.getY() < 72:
#             c.drawText(text_object)
#             c.showPage()
#             text_object = c.beginText(72, height - 72)
#             text_object.setFont("Helvetica", 12)
#             text_object.setTextOrigin(72, height - 72)
#         text_object.textLines(line)

#     c.drawText(text_object)
#     c.save()



from pdf2image import convert_from_path
import pytesseract
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os
from langdetect import detect, DetectorFactory

# DetectorFactory.seed = 0

# def convert_pdf_to_text_pdf(pdf_path, save_path, resolution=500):
#     pages = convert_from_path(pdf_path, resolution)
#     print('Length of pages in PDF:', len(pages))
    
#     base_name = os.path.basename(pdf_path).removesuffix('.pdf')
#     print('Save path inside:', save_path)

#     per_pdf_destination = os.path.join(save_path, f'{base_name}.pdf')
#     print('Per PDF destination:', per_pdf_destination)

#     all_text = ""
#     detected_non_english = False

#     for pageNum, img in enumerate(pages):
#         print('Processing page number:', pageNum + 1)
        
#         text = pytesseract.image_to_string(img, lang='eng')
        
#         try:
#             detected_lang = detect(text)
#             print('Detected language:', detected_lang)
#             if detected_lang != 'en':
#                 detected_non_english = True
#                 break
#         except Exception as e:
#             print('Error detecting language:', e)
#             detected_non_english = True
#             break
        
#         all_text += text + "\n\n"

#     if detected_non_english:
#         return "Found Defect, Language other than English detected."

#     c = canvas.Canvas(per_pdf_destination, pagesize=letter)
#     width, height = letter
#     text_object = c.beginText(72, height - 72)
#     text_object.setFont("Helvetica", 12)
#     text_object.setTextOrigin(72, height - 72)

#     for line in all_text.splitlines(True):
#         if text_object.getY() < 72:
#             c.drawText(text_object)
#             c.showPage()
#             text_object = c.beginText(72, height - 72)
#             text_object.setFont("Helvetica", 12)
#             text_object.setTextOrigin(72, height - 72)
#         text_object.textLines(line)

#     c.drawText(text_object)
#     c.save()

#     return "PDF successfully created."

def convert_pdf_to_text_pdf(pdf_path, save_path, resolution=500):
    pages = convert_from_path(pdf_path, resolution)
    print('Length of pages in PDF:', len(pages))
    
    base_name = os.path.basename(pdf_path).removesuffix('.pdf')
    print('Save path inside:', save_path)

    per_pdf_destination = os.path.join(save_path, f'{base_name}')
    os.makedirs(per_pdf_destination,exist_ok=True)
    print('Per PDF destination:', per_pdf_destination)

    all_text = ""

    for pageNum, img in enumerate(pages):
        print('Processing page number:', pageNum + 1)
        
        text = pytesseract.image_to_string(img, lang='eng')
        
        page_num = f'{per_pdf_destination}/p{pageNum+1}.txt'

        with open(page_num, 'w', encoding='utf-8') as text_file:
            text_file.write(text)
    
    return per_pdf_destination
