from ultralytics import YOLO

wild_model = YOLO("models/species_yolo.pt")

def detect_wild_species(image_path):
    results = wild_model(image_path, conf=0.4)

    detections = []

    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            label = wild_model.names[cls_id]

            detections.append({
                "species": label,
                "confidence": round(conf, 2),
                "type": "wild"
            })

    return detections
