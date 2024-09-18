import os
import re
from collections import defaultdict
from fastapi import FastAPI
from pydantic import BaseModel
import logging
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import Ollama
from PyPDF2 import PdfReader

app = FastAPI()

TEXT_FILES_PATH = '/home/xstats/Documents/Aditya/SupremeCourtComplete/converted_texts/d2 1'

cot_prompt_template = '''
You are analyzing a legal document. You will be given text documents where each document represents a single page of the complete document. You will receive these pages one by one.

For each page, your task is to:

1. Read the current page carefully.
2. Check the type of petition in the document. type of petition could be of multiple types ['transfer petition ('civil'/'criminal')','special leave petition ('civil'/'criminal')']
2. Identify if the name of the petitioner and the respondent is present on this page.
3. Look for a specific pattern where the names appear directly following or preceding terms like "Petitioner" and "Respondent" (e.g., "...Petitioner ...Respondent" or "....Petitioner ....Respondent"). Only consider names in this pattern.
4. Ensure that the names are not generic terms like 'client', 'petitioner', 'respondent', 'you', etc. Only consider actual names (e.g., 'Aditya Singh', 'Chanak Agarwal', 'Manish Sisodia', 'Akshay Aeran').
5. Do not consider names that refer to another case.
6. If both names are present and match the pattern, provide the names in the following format:
Petitioner name: 'xyz', Respondent name: 'abc', type of petition: 'transfer petition'
7. If either or both names are not present, or if they do not match the pattern, write:
Petitioner name: 'not present', Respondent name: 'not present',type of petition: 'transfer petition'

You must answer strictly in the format provided, without adding any extra information. Use this approach for all examples you receive.

Provided Text: {retrieved_text}
'''
cot_prompt = PromptTemplate(
    input_variables=["retrieved_text"],
    template=cot_prompt_template,
)
ollama_llm = Ollama(model='mistral')


# def process_text_files(TEXT_FILES_PATH):
#     results = []
#     txt_files = []

#     for file_name in os.listdir(TEXT_FILES_PATH):
#         if file_name.endswith('.txt'):
#             txt_files.append(file_name)
    
#     txt_files.sort()
    
#     for file_name in txt_files:
#         file_path = os.path.join(TEXT_FILES_PATH, file_name)
        
#         with open(file_path, 'r') as file:
#             chunk = file.read()
        
#         formatted_prompt = cot_prompt.format_prompt(retrieved_text=chunk)
#         prompt_text = formatted_prompt.to_string()
        
#         result = ollama_llm(prompt_text)
        
#         results.append(result)
    
#     return results

def find_files_with_pattern(directory_path):
    pattern = re.compile(r'\.\.\.?Petitioner|\.\.\.?Respondent')
    matching_files = []

    for filename in os.listdir(directory_path):
        if filename.endswith('.txt'):
            file_path = os.path.join(directory_path, filename)
            with open(file_path, 'r') as file:
                content = file.read()
                if pattern.search(content):
                    matching_files.append(filename)
    
    return matching_files

def process_text_files(TEXT_FILES_PATH, file_names):
    results = []
    txt_files = file_names

    txt_files.sort()
    
    for file_name in txt_files:
        file_path = os.path.join(TEXT_FILES_PATH, file_name)
        
        with open(file_path, 'r') as file:
            chunk = file.read()
        
        formatted_prompt = cot_prompt.format_prompt(retrieved_text=chunk)
        prompt_text = formatted_prompt.to_string()
        
        result = ollama_llm(prompt_text)
        
        results.append(result)
        
    print('results : ', results)
    
    return results

def check_defects(entries):
    petitioners = []
    respondents = []
    
    for entry in entries:
        petitioner_start = entry.find("Petitioner name: '") + len("Petitioner name: '")
        petitioner_end = entry.find("'", petitioner_start)
        respondent_start = entry.find("Respondent name: '") + len("Respondent name: '")
        respondent_end = entry.find("'", respondent_start)
        
        petitioner = entry[petitioner_start:petitioner_end]
        respondent = entry[respondent_start:respondent_end]
        
        petitioners.append(petitioner)
        respondents.append(respondent)
    
    all_petitioners_consistent = True
    for petitioner in petitioners:
        if petitioner != petitioners[0]:
            all_petitioners_consistent = False
            break
    
    all_respondents_consistent = True
    for respondent in respondents:
        if respondent != respondents[0]:
            all_respondents_consistent = False
            break
    
    if all_petitioners_consistent and all_respondents_consistent:
        return {'defect': 'Not Found', 'details': {}}
    
    for i in range(len(petitioners)):
        if petitioners[i] != petitioners[0] or respondents[i] != respondents[0]:
            dict1 = {
                # 'defect': ['Found'],
                'names_Defect': [{
                    'petitioner': petitioners[i],
                    'respondent': respondents[i]
                }],
                'General_Defect':['PETITIONER, RESPONDENT NAME NOT TALLY WITH I/O']
            }
            wrong_petitioner = dict1['names_Defect'][0]['petitioner']
            wrong_respondent = dict1['names_Defect'][0]['respondent']
            
            return dict1,wrong_petitioner,wrong_respondent
    
    return {'defect': 'None', 'details': {}}


@app.get("/check_petitioner_name")
def check_petitioner_name():
    matching_files = find_files_with_pattern(TEXT_FILES_PATH)
    print('matching_files : ', matching_files)
    results = process_text_files(TEXT_FILES_PATH,matching_files)
    
    defect_result = check_defects(results)
    
    return defect_result