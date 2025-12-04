import cv2
import numpy as np
import mediapipe as mp
import pickle


# Load Random Forest model
with open("./asl_prediction/ASL_model.p", "rb") as f:
    model = pickle.load(f)

rf_model = model["model"]


# Mediapipe Initialization
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.9
)


# --- SHARED STATE FOR PREDICTION ---
predicted_text = ""
same_characters = ""
final_characters = ""
count = 0


def update_frame_for_web(hand_landmarks, rf_model):
    global predicted_text, same_characters, final_characters, count

    # no hand detected → return "4"
    if hand_landmarks is None:
        return "4"

    # Extract and normalize landmarks
    x_coordinates = [p.x for p in hand_landmarks.landmark]
    y_coordinates = [p.y for p in hand_landmarks.landmark]
    min_x, min_y = min(x_coordinates), min(y_coordinates)

    normalized = []
    for p in hand_landmarks.landmark:
        normalized.append(p.x - min_x)
        normalized.append(p.y - min_y)

    sample = np.array(normalized).reshape(1, -1)

    # Predict character
    predicted_character = rf_model.predict(sample)[0]

    if predicted_character != "4":  # not "no hand"
        predicted_text += predicted_character

        # Duplicate handling
        if len(predicted_text) < 2 or predicted_text[-1] != predicted_text[-2]:
            count = 0
            same_characters = ""
        else:
            same_characters += predicted_character
            count += 1

        # Make final decision
        if count >= 8:  # 8 frames = smooth
            if predicted_character == "1":
                final_characters = final_characters[:-1]

            elif predicted_character == "2":
                final_characters = ""

            elif predicted_character == "3":
                final_characters += " "

            else:
                final_characters += predicted_character

            # Reset
            predicted_text = ""
            same_characters = ""
            count = 0

    return predicted_character


def release_video():
    cv2.destroyAllWindows()
