import fitz 
import os

def extract_images_from_pdf(pdf_path, output_dir):
    pdf_document = fitz.open(pdf_path)
    page_count = pdf_document.page_count

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for page_num in range(page_count):
        page = pdf_document.load_page(page_num) 

        pix = page.get_pixmap()

        output_filename = os.path.join(output_dir, f"p{page_num + 1}.png")


        pix.save(output_filename)
        print(f"Saved: {output_filename}")

    pdf_document.close()
    return output_dir
