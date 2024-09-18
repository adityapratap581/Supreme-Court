import torch
from ultralytics import YOLO

model_path = r'/home/xstats/Documents/Aditya/SupremeCourtComplete/Underline_Model_New/detect/train/weights/best.pt'

def load_yolo_model(model_path):
    model = YOLO(model_path)
    print('model succussfully loaded')
    return model

def detect_objects(model, image_path):
    results = model(image_path)
    
    boxes = results[0].boxes
    return boxes

def detect_defect(model,image_path):
    results = model(image_path)
    boxes = results[0].boxes
    if 1 in boxes.cls:
        defect = 'Underline Defect'
        print(defect)
    else:
        defect = 'No defect detected'
        print(defect)
    
    return defect
