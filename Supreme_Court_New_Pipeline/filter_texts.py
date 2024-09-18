import os

# def text_filter(text_path):
#     print('text_path : ', text_path)
#     all_txts = os.listdir(text_path)
#     all_lens = {}
#     for i in all_txts:
#         print('i : ', i)
#         text_path = os.path.join(text_path,i)
#         print('text_path : ', text_path)
#         with open (text_path,'r') as f:
#             text = f.read()
#             length = len(text)
        
#         all_lens[i] = length
        
#     keys_less_than_1000 = []

#     for key, value in all_lens.items():
#         if value < 800:
#             keys_less_than_1000.append(key)
    
#     return keys_less_than_1000


import os

def text_filter(directory_path):
    print('directory_path : ', directory_path)
    all_txts = os.listdir(directory_path)
    all_lens = {}
    
    for filename in all_txts:
        print('filename : ', filename)
        file_path = os.path.join(directory_path, filename)
        print('file_path : ', file_path)

        if os.path.isfile(file_path):
            with open(file_path, 'r') as f:
                text = f.read()
                length = len(text)
            all_lens[filename] = length
        else:
            print(f"Skipping non-file: {file_path}")
    
    keys_less_than_800 = []
    
    for key, value in all_lens.items():
        # if value < 800:
            keys_less_than_800.append(key)
    
    return keys_less_than_800
