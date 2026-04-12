from ultralytics import YOLO

# Load pretrained YOLOv8 model
general_model = YOLO("yolov8n.pt")

# Only allow animal species relevant to PawHelp
ANIMAL_CLASSES = [
    "dog",
    "cat",
    "cow",
    "horse",
    "sheep",
    "elephant",
    "bear",
    "zebra",
    "giraffe"
]

def detect_general_species(image_path):

    results = general_model(image_path, conf=0.4)

    detections = []

    for r in results:
        for box in r.boxes:

            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            label = general_model.names[cls_id]

            # Skip non-animal detections
            if label not in ANIMAL_CLASSES:
                continue

            detections.append({
                "species": label,
                "confidence": round(conf, 2),
                "type": "general"
            })

    # Sort by highest confidence
    detections.sort(key=lambda x: x["confidence"], reverse=True)

    return detections