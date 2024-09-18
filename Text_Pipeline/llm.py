import os
import re
from collections import defaultdict
from fastapi import FastAPI
from pydantic import BaseModel
import logging
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import Ollama
from PyPDF2 import PdfReader


logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(message)s',
                    handlers=[logging.StreamHandler(), logging.FileHandler('output_logs.log', mode='a')],
                    force=True)

TEXT_FILES_PATH = '/home/xstats/Documents/Aditya/Supreme_Court_Text_pipeline/converted_texts/s3.pdf'
DATA_PATH = '/home/xstats/Documents/Aditya/Supreme_Court_Text_pipeline/converted_pdf'

pattern = re.compile(r'\b\w+@\w+|\b\w+\s+alias\s+\w+\b', re.IGNORECASE)
top5 = ['page1.txt','page2.txt','page3.txt','page4.txt','page5.txt']


app = FastAPI()

cot_prompt_template = """
You are analyzing a legal document to extract specific information related to names, aliases, and types of petitions. Your task is to identify and extract the following:

1. The MAIN PETITIONER in the document.
2. The MAIN RESPONDENT in the document.
3. The MAIN ADVOCATE in the document.
4. The TYPE OF PETITION mentioned in the document.
5. Any ALIAS (a woman's name that changes after marriage, e.g., 'Karuna Vilas Kamble' as an Alias for 'Karuna Bipin Atyale').

Instructions:
1. Identify all occurrences of names in the document.
2. Determine and extract the MAIN PETITIONER, MAIN RESPONDENT, MAIN ADVOCATE, and the TYPE OF PETITION based on the content of the document.
3. Identify and extract any aliases used in the document, specifically focusing on cases where a name may have changed after marriage.
4. List all names corresponding to these roles, the alias, and the type of petition.
5. Ensure all extracted names, aliases, and the type of petition are recorded in the specified format.

Provided Text:
{retrieved_text}

Output Format:
For each identified role, alias, and type of petition, provide the result in the following key:value pair format:

1. 'Main Petitioner' : 'Name'
2. 'Main Respondent' : 'Name'
3. 'Main Advocate' : 'Name'
4. 'Type of Petition' : 'Type'
5. 'Alias' : 'Name (Original Name)'

Make sure to strictly follow this format and include all the main roles, aliases, and types of petitions as specified.
"""

cot_prompt = PromptTemplate(
    input_variables=["retrieved_text"],
    template=cot_prompt_template,
)
ollama_llm = Ollama(model='mistral')

def check_inconsistencies(text_chunks):
    results = []
    for chunk in text_chunks:
        formatted_prompt = cot_prompt.format_prompt(retrieved_text=chunk)
        prompt_text = formatted_prompt.to_string()
        result = ollama_llm(prompt_text)
        results.append(result)
    return results

# cot_prompt_template2 = """
# You are analyzing a legal document to extract specific information related to names and types of petitions. Your task is to identify and extract all names mentioned in the document that are associated with the roles 'PETITIONER', or 'RESPONDENT'.

# Instructions:
# 1. Identify all occurrences of names in the document.
# 2. Specifically extract names related to the following roles:
#    - 'PETITIONER'
#    - 'RESPONDENT'
# 3. Consider those names only around which petioner or respondent word has been explicitly mentioned. Based on the context understanding don't pick names from the text in which the petitioner and respondent are referring to some historical judgements. Also don't pick those names which you think are not names, like 'your','disabled','client' etc.

# Provided Text:
# {retrieved_text}

# Output Format:
# For each name associated with the roles or 'Type of Petition', provide the result in the following key:value pair format:

# 1. 'Name' : 'Role'
# 2. 'Name' : 'Role'
# 3. 'Name' : 'Role'
# 4. 'Type of Petition' : 'Type'

# Example Output:
# 1. 'Karuna Bipin Atyale' : 'Petitioner'
# 2. 'Bipin Prabhakar Atyale' : 'Respondent'
# 3. 'Dr. Ravindra S. Chingale' : 'Advocate'
# 4. 'TRANSFER PETITION' : 'Type of Petition'

# Make sure to strictly follow this format and include all occurrences of names and types of petitions as specified.
# """

cot_prompt_template2 = """
You are analyzing a legal document to extract specific information related to names and types of petitions. Your task is to identify and extract all names mentioned in the document that are associated with the roles 'ADVOCATE FOR THE PETITIONER', 'PETITIONER', or 'RESPONDENT'. Additionally, you need to extract the 'Type of Petition'.

Instructions:
1. Identify all occurrences of names in the document.
2. Specifically extract names related to the following roles:
   - 'ADVOCATE FOR THE PETITIONER'
   - 'PETITIONER'
   - 'RESPONDENT'
3. Extract the 'Type of Petition' mentioned in the document.
4. List all names that correspond to these roles, even if they repeat.
5. Ensure all extracted names and the 'Type of Petition' are recorded in the specified format.

Provided Text:
{retrieved_text}

Output Format:
For each name associated with the roles or 'Type of Petition', provide the result in the following key:value pair format:

1. 'Name' : 'Role'
2. 'Name' : 'Role'
3. 'Name' : 'Role'
4. 'Type of Petition' : 'Type'

Example Output:
1. 'Karuna Bipin Atyale' : 'Petitioner'
2. 'Bipin Prabhakar Atyale' : 'Respondent'
3. 'Dr. Ravindra S. Chingale' : 'Advocate'
4. 'TRANSFER PETITION' : 'Type of Petition'

Make sure to strictly follow this format and include all occurrences of names and types of petitions as specified.
"""

cot_prompt2 = PromptTemplate(
    input_variables=["retrieved_text"],
    template=cot_prompt_template2,
)
ollama_llm = Ollama(model='mistral')

def check_inconsistencies2(text_chunks):
    results = []
    
    for chunk in text_chunks:
        formatted_prompt = cot_prompt2.format_prompt(retrieved_text=chunk)
        prompt_text = formatted_prompt.to_string()

        result = ollama_llm(prompt_text)
        results.append(result)
    
    return results

def read_text_files(text_files_path):
    texts = []
    for file_name in sorted(os.listdir(text_files_path)):
        if file_name.endswith('.txt'):
            with open(os.path.join(text_files_path, file_name), 'r') as file:
                texts.append(file.read())
    return texts

# def read_text_files2(text_file,parent_folder):
#     texts = []
#     for i in text_file:
#         text_path = os.path.join(parent_folder,i)
#         print(text_path)
#         with open(text_path, 'r') as file:
#                 texts.append(file.read())
    
#     return texts


# @app.get("/check_petitioner_name")
# def check_petitioner_name():
#     text_chunks = read_text_files(TEXT_FILES_PATH)
    
#     results = check_inconsistencies(text_chunks)
    
#     results2 = check_inconsistencies2(text_chunks)
    
#     processed_results = process_results(results)
#     print('supreme 11 Processed Results:', processed_results)
    
#     processed_results2 = process_results2(results2)
#     print('supreme 9 Processed Results:', processed_results2)
    
#     pdf_names = extract_names_from_pdf(DATA_PATH)
#     iterative_results = filter_names_from_processed_results(processed_results, pdf_names)
    
#     iterative_results2 = filter_names_from_processed_results(processed_results2, pdf_names)
    
    
#     supreme11_results = print_iterative_results(iterative_results)
#     print('supreme11_results : ',supreme11_results)
#     supreme9_results = print_iterative_results2(iterative_results2)
#     print('supreme9_results : ',supreme9_results)
    
#     final_response = find_defect(main_dict=supreme11_results,sub_dict=supreme9_results)

#     # inconsistencies = [res for res in results if "defect" in res.lower()]
#     # if inconsistencies:
#     #     return {"status": "success", "inconsistencies": final_response}
#     # else:
#     #     return {"status": "success", "message": "No inconsistencies found."}
#     return final_response

def process_results(results):
    role_dict = defaultdict(list)
    pattern = re.compile(r"'(.*?)' : '(.*?)'")

    for result in results:
        matches = pattern.findall(result)
        for role, name in matches:
            role_dict[role].append(name)

    formatted_result = []
    for role, names in role_dict.items():
        if role == 'Type of Petition':
            formatted_result.append(f"'{role}' : '{', '.join(names)}'")
        else:
            formatted_result.append(f"'{role}' : '{names[0]}'")

    return formatted_result

def process_results2(results):
    # Initialize a dictionary to store names by role/type
    role_dict = defaultdict(list)
    
    # Regex to extract name and role/type
    pattern = re.compile(r"'(.*?)' : '(.*?)'")
    
    for result in results:
        matches = pattern.findall(result)
        for name, role in matches:
            if role in ['Petitioner', 'Respondent', 'Advocate for the Petitioner', 'Type of Petition']:
                role_dict[role].append(name)
    
    # Convert to the desired format
    formatted_result = []
    for role, names in role_dict.items():
        if role == 'Type of Petition':
            formatted_result.append(f"'{role}' : '{', '.join(names)}'")
        else:
            formatted_result.append(f"'{role}' : '{', '.join(names)}'")
    
    return formatted_result


def extract_names_from_pdf(pdf_dir_path):
    pdf_names = set()
    
    for file_name in os.listdir(pdf_dir_path):
        if file_name.lower().endswith('.pdf'):
            pdf_path = os.path.join(pdf_dir_path, file_name)
            reader = PdfReader(pdf_path)
            text = ''
            
            for page in reader.pages:
                text += page.extract_text()

            name_pattern = re.compile(r'\b([A-Z][a-z]+(?: [A-Z][a-z]+)*)\b')
            pdf_names.update(name_pattern.findall(text))
    
    return pdf_names


def filter_names_from_processed_results(processed_results, pdf_names):
    iterative_results = defaultdict(list)
    
    pattern = re.compile(r"'(.*?)' : '(.*?)'")
    
    for entry in processed_results:
        matches = pattern.findall(entry)
        for role, names in matches:
            name_list = [name.strip() for name in names.split(',')]
            for name in name_list:

                if any(name.lower() in pdf_name.lower() for pdf_name in pdf_names):
                    iterative_results[role].append(name)
    
    return iterative_results


# def print_iterative_results(iterative_results):
#     print("Iterative Results supreme 11:")
#     for role, names in iterative_results.items():
#         if role == 'Type of Petition':
#             return f"'{role}' : '{', '.join(names)}'"
#         else:
#             return f"'{role}' : '{', '.join(names)}'"

def print_iterative_results(iterative_results):
    results_dict = {}
    for role, names in iterative_results.items():
         results_dict[role] = ', '.join(names)
    
    return results_dict
            

# def print_iterative_results2(iterative_results):
#     print("Iterative Results supreme 9:")
#     for role, names in iterative_results.items():
#         if role == 'Type of Petition':
#             return f"'{role}' : '{', '.join(names)}'"
#         else:
#             return f"'{role}' : '{', '.join(names)}'"


def print_iterative_results2(iterative_results):
    results_dict = {}
    for role, names in iterative_results.items():
         results_dict[role] = ', '.join(names)
    
    return results_dict


def find_defect(main_dict,sub_dict):
    final_dict = {'Wrong_Petitioner':[],
                  'Wrong_Respondent':[]
                  }
    main_petitioner = main_dict['Main Petitioner']
    main_respondent = main_dict['Main Respondent']
    
    all_petitioner = sub_dict['Petitioner'].split(', ')
    all_respondent = sub_dict['Respondent'].split(', ')
    
    faltu_list = ['petitioner','Petitioner','Respondent','respondent','The Respondent','you','You','my client','My client','Your Client']
    for i in all_petitioner:
        if main_petitioner != i:
            if i not in faltu_list:
                if len(i) >3:
                    final_dict['Wrong_Petitioner'].append(i)
    
    for j in all_respondent:
        if main_respondent != j:
            if j not in faltu_list:
                if len(j) >3:
                    final_dict['Wrong_Respondent'].append(j)
    
    # pattern_found = search_pattern_in_files(TEXT_FILES_PATH, top5, pattern)
    
    # if pattern_found == False:
    #     final_dict['Alias Defect Detected']
    
    return final_dict


def search_pattern_in_files(folder_path, files, pattern):
    found = False
    for file_name in files:
        file_path = os.path.join(folder_path, file_name)
        with open(file_path, 'r') as file:
            content = file.read()
            if pattern.search(content):
                found = True
                break
    return found


