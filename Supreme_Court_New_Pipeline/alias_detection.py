import os
import re

def find_pet_res(l2):
    start = len('Petitioner name')
    end = len('Respondent name')
    len_type = len('type of petition')
    pet_start = l2[0].find('Petitioner name')
    res_start = l2[0].find('Respondent name')
    type_start = l2[0].find('type of petition')
    pet_name_index = pet_start+start + 3
    petioner_name = l2[0][pet_name_index:res_start-3]
    respondent_name_index = res_start+end + 3
    respondent_name = l2[0][respondent_name_index:type_start-3]
    
    return {'petioner_name':petioner_name, 
            'respondent_name':respondent_name}
    


def search_patterns_in_file(file_path, petitioner_name, respondent_name):
    patterns = {
        'petitioner': rf'{petitioner_name}\s*@\s*.+',
        'respondent': rf'{respondent_name}\s*@\s*.+',
        'petitioner_alias': rf'{petitioner_name}\s*alias\s*.+',
        'respondent_alias': rf'{respondent_name}\s*alias\s*.+' 
    }

    regex_patterns = {key: re.compile(pattern, re.IGNORECASE) for key, pattern in patterns.items()}

    with open(file_path, 'r') as file:
        content = file.read()
        for key, pattern in regex_patterns.items():
            if pattern.search(content):
                print(f'Alias detected for {key}')
                if 'petitioner' in key:
                    return {'alias': 'detected', 'name': petitioner_name}
                else:
                    return {'alias': 'detected', 'name': respondent_name}

    return {'alias': 'not detected', 'name': None}

def search_patterns_in_directory(directory_path, petitioner_name, respondent_name):
    for filename in os.listdir(directory_path):
        if filename.endswith('.txt'):
            file_path = os.path.join(directory_path, filename)
            result = search_patterns_in_file(file_path, petitioner_name, respondent_name)
            if result['alias'] == 'detected':
                return result

    return {'alias': 'not detected', 'name': None}




def check_alias_defect(directory, file_list, name,type_alias):
    pattern = re.compile(rf"{name} @ \w+|\b{name} alias \w+", re.IGNORECASE)
    defect_files = []
    
    for file_name in file_list:
        file_path = os.path.join(directory, file_name)
        
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                content = file.read()

                if not pattern.search(content):
                    defect_files.append(file_name)
        else:
            defect_files.append(file_name)

    if defect_files:
        return {'Alias_defect': defect_files,
                'type_alias':type_alias}
    else:
        return {'Alias_defect': 'no defect found'}


def search_category_in_file(file_path, type_of_petition):
    patterns = {
        'transfer petition': rf'{type_of_petition}.*\b(civil|criminal)\b',
        'special leave petition': rf'{type_of_petition}.*\b(civil|criminal)\b'
    }

    if type_of_petition not in patterns:
        raise ValueError("Invalid type_of_petition provided. Choose 'transfer petition' or 'special leave petition'.")
    
    pattern = re.compile(patterns[type_of_petition], re.IGNORECASE)

    with open(file_path, 'r') as file:
        content = file.read()
        match = pattern.search(content)
        if match:
            return {'category': match.group(1).lower()}
    
    return {'category': None}

def search_category_in_directory(directory_path, file_name, type_of_petition):
    file_path = os.path.join(directory_path, file_name)
    return search_category_in_file(file_path, type_of_petition)
