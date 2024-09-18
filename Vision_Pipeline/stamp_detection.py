import torch
import os
import cv2
from ultralytics import YOLO
import matplotlib.pyplot as plt

def load_yolo_model(model_path):
    model = YOLO(model_path)
    print('model succussfully loaded')
    return model

def detect_objects(model, image_path):
    results = model(image_path)
    
    boxes = results[0].boxes
    return boxes

def check_overlap(boxes):
    stamp_boxes = []
    text_boxes = []
    # stamp_defect = {}

    for box in boxes:
        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()  
        cls = int(box.cls[0].cpu().numpy()) 

        if cls == 0:  
            stamp_boxes.append([x1, y1, x2, y2])
        elif cls == 1:  
            text_boxes.append([x1, y1, x2, y2])

    for stamp_box in stamp_boxes:
        # print('stamp box : ', stamp_box)
        for text_box in text_boxes:
            # print('text box : ', text_box)
            if iou(stamp_box, text_box) > 0:
                print("Stamp Defect")
                return "Stamp Defect"
            else:
                return "No defect detected"
                print("No defect detected")
                # return "Defect detected"
            # stamp_defect[image] = defect
    
    # return defect

def iou(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0, xB - xA) * max(0, yB - yA)

    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

    iou = interArea / float(boxAArea + boxBArea - interArea)
    print('iou : ', iou)
    return iou



