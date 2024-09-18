# import os
# from PyPDF2 import PdfReader

# pdf_path = "/home/xstats/Documents/Aditya/Supreme_Court_Text_pipeline/converted_pdf/karuna_corrected.pdf"
# output_dir = "/home/xstats/Documents/Aditya/Supreme_Court_Text_pipeline/converted_texts"

# if not os.path.exists(output_dir):
#     os.makedirs(output_dir)

# basename = os.path.basename(pdf_path)
# save_text_pdf = os.path.join(output_dir,basename)
# os.makedirs(save_text_pdf,exist_ok=True)
# reader = PdfReader(pdf_path)
# number_of_pages = len(reader.pages)


# for page_number in range(number_of_pages):
#     page = reader.pages[page_number]
#     text = page.extract_text()


#     text_file_path = os.path.join(save_text_pdf, f"page{page_number + 1}.txt")


#     with open(text_file_path, 'w', encoding='utf-8') as text_file:
#         text_file.write(text)



import os
from PyPDF2 import PdfReader

def pdf_to_text(pdf_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Get the base name of the PDF file and prepare output directory
    basename = os.path.basename(pdf_path)
    save_text_pdf = os.path.join(output_dir, os.path.splitext(basename)[0])
    os.makedirs(save_text_pdf, exist_ok=True)

    # Read the PDF file
    reader = PdfReader(pdf_path)
    number_of_pages = len(reader.pages)

    # Process each page in the PDF
    for page_number in range(number_of_pages):
        page = reader.pages[page_number]
        text = page.extract_text()

        # Define the path for the text file
        text_file_path = os.path.join(save_text_pdf, f"p{page_number + 1}.txt")

        # Write the extracted text to the file
        with open(text_file_path, 'w', encoding='utf-8') as text_file:
            text_file.write(text)


# pdf_path = "/home/xstats/Documents/Aditya/Supreme_Court_Text_pipeline/converted_pdf/karuna_corrected.pdf"
# output_dir = "/home/xstats/Documents/Aditya/Supreme_Court_Text_pipeline/converted_texts"
# pdf_to_text(pdf_path, output_dir)
