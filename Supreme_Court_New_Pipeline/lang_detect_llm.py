from langchain_core.prompts import PromptTemplate
from langchain_community.llms import Ollama
import os

lang_detect_template = '''
You are analyzing a document. You will be given text documents where each document represents a single page of the complete document. You will receive these pages one by one.
you have to analyze the document based on the context of the document label them as below:
1. If the doument seems to be Legal, tag as 'Legal document'
2.there are jumbled words, tag as 'Not Legal'
provide only one tag out of it. follow the instructions strictly.
Provided Text: {retrieved_text}'''

lang_detect_prompt = PromptTemplate(
    input_variables=["retrieved_text"],
    template=lang_detect_template,
)
ollama_llm = Ollama(model='mistral')
# 2. if the context seems unclear  or not aligiing to legal writing, tag as 'Not Legal'

def detect_languages(text_files_path):
    results = {'defects':[]}
    all_text_files = os.listdir(text_files_path)
    for i in all_text_files:
        with open(os.path.join(text_files_path, i), 'r') as f:
            chunk = f.read()
            # print('chunk : ', chunk)
        
        formatted_prompt = lang_detect_prompt.format_prompt(retrieved_text=chunk)
        
        prompt_text = formatted_prompt.to_string()
        result = ollama_llm(prompt_text)
        
        # print(result)
        if 'Legal document' in result:
            results['defects'].append('No Defect Found')
        elif 'Not Legal' in result:
            print('page number : ', i )
            print('Other Language Found')
            results['defects'].append('Other Language Found')
            
        # results.append(result)
        
        print('results : ', results)
    return results

# import os

# def detect_languages(text_files_path, exclude_files):
#     results = {'defects': []}
#     all_text_files = os.listdir(text_files_path)
    
#     exclude_files_set = set(exclude_files)
    
#     for filename in all_text_files:
#         if filename in exclude_files_set:
#             print(f"Skipping file: {filename}")
#             continue
        
#         file_path = os.path.join(text_files_path, filename)
#         with open(file_path, 'r') as f:
#             chunk = f.read()
#             print('chunk : ', chunk)
        
#         formatted_prompt = lang_detect_prompt.format_prompt(retrieved_text=chunk)
        
#         prompt_text = formatted_prompt.to_string()
#         result = ollama_llm(prompt_text)
        
#         print(result)
#         if 'Legal document' in result:
#             results['defects'].append('No Defect Found')
#         elif 'Not Legal' in result:
#             results['defects'].append('Other Language Found')
        
#         print('results : ', results)
    
#     return results
