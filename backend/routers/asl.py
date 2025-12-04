from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import mediapipe as mp

from realtime_detection import rf_model  # your existing RF model

router = APIRouter(prefix="/asl", tags=["ASL"])

# Mediapipe hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5,
)

def extract_42_features(hand_landmarks):
    """Recreate EXACT same 42 landmark features your RF model expects."""
    x = [lm.x for lm in hand_landmarks.landmark]
    y = [lm.y for lm in hand_landmarks.landmark]
    min_x, min_y = min(x), min(y)

    features = []
    for lm in hand_landmarks.landmark:
        features.append(lm.x - min_x)
        features.append(lm.y - min_y)

    return np.array(features, dtype=np.float32).reshape(1, -1)

@router.post("/predict-frame")
async def predict_frame(file: UploadFile = File(...)):
    """Frontend sends a frame → backend returns predicted ASL character."""
    try:
        img_bytes = await file.read()
        img = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(img, cv2.IMREAD_COLOR)

        if frame is None:
            return {"prediction": "4"}

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb)

        if results.multi_hand_landmarks:
            hand = results.multi_hand_landmarks[0]
            sample = extract_42_features(hand)
            pred = rf_model.predict(sample)[0]
        else:
            pred = "4"

        return {"prediction": pred}

    except Exception as e:
        print("ASL ERROR:", e)
        return JSONResponse({"prediction": "4"})
