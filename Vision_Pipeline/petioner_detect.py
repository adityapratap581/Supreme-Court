import os
from ultralytics import YOLO

def load_yolo_model(model_path):
    model = YOLO(model_path)
    print('model succussfully loaded')
    return model

def detect_objects(model, image_path):
    results = model(image_path)
    
    boxes = results[0].boxes
    return boxes

def petioner_defect(folder_path,model):
    detected_class = []
    all_images = os.listdir(folder_path)
    for i in all_images:
        image_path = os.path.join(folder_path,i)
        boxes = detect_objects(model=model,image_path=image_path)
        box_class = boxes.cls
        if 0 in box_class:
            detected_class.append(i)
        
    return detected_class