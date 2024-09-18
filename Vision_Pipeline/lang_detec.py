from ultralytics import YOLO

def main():
    model = YOLO("yolov8n.yaml")

    results = model.train(
        data=r"/home/xstats/Documents/Aditya/SupremeCourtComplete/Hindi_Eng_Detection/labels.yaml",
        epochs=200,
        imgsz=540,
        batch=1,
        verbose=True,
        lr0=0.01,
        device='cuda'
    )

if __name__ == '__main__':
    main()
