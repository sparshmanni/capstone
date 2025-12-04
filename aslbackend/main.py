# aslbackend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import cv2
import numpy as np
import mediapipe as mp

from realtime_detection import rf_model  # uses your existing ASL_model.p

app = FastAPI(title="ASL Backend")

# CORS so frontend (localhost:3000) can call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Mediapipe Hands setup ----
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5,
)

def predict_from_landmarks(hand_landmarks):
    """
    Rebuild the same 42 features you used for training:
      (x - min_x, y - min_y) for each of the 21 landmarks.
    """
    x_coords = [lm.x for lm in hand_landmarks.landmark]
    y_coords = [lm.y for lm in hand_landmarks.landmark]
    min_x, min_y = min(x_coords), min(y_coords)

    features = []
    for lm in hand_landmarks.landmark:
        features.append(lm.x - min_x)
        features.append(lm.y - min_y)

    sample = np.asarray(features, dtype=np.float32).reshape(1, -1)
    pred = rf_model.predict(sample)[0]   # "a".."z","1","2","3","4"
    return pred

@app.get("/ping")
def ping():
    return {"status": "asl-ok"}

@app.post("/asl/predict-frame")
async def asl_predict_frame(file: UploadFile = File(...)):
    """
    Receives a single image frame from frontend (webcam),
    runs Mediapipe + RandomForest, returns one character.
    """
    try:
        img_bytes = await file.read()
        img_array = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        if frame is None:
            return JSONResponse({"prediction": "4"})  # treat as "no hand"

        # BGR -> RGB
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb)

        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]
            pred = predict_from_landmarks(hand_landmarks)
        else:
            pred = "4"  # no hand

        return {"prediction": pred}
    except Exception as e:
        print("ASL backend error:", e)
        return JSONResponse({"prediction": "4"})
