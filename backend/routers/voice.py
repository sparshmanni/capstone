from fastapi import APIRouter, UploadFile, File
from vosk import Model, KaldiRecognizer
import wave
import json
import os
import io

router = APIRouter(prefix="/voice", tags=["Voice"])

# ------------------------------------
# Load Vosk Model once
# ------------------------------------
MODEL_PATH = "model/vosk-model-small-en-us-0.15"

if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"Vosk model not found at {MODEL_PATH}")

model = Model(MODEL_PATH)


# ------------------------------------
# Speech-to-text endpoint
# ------------------------------------
@router.post("/stt")
async def stt_audio(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()

        # Load WAV in memory
        wf = wave.open(io.BytesIO(audio_bytes), "rb")

        # Must be mono & 16kHz
        if wf.getnchannels() != 1 or wf.getframerate() != 16000:
            return {"text": ""}

        rec = KaldiRecognizer(model, 16000)

        final_text = ""

        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break

            if rec.AcceptWaveform(data):
                partial_json = json.loads(rec.Result())
                partial_text = partial_json.get("text", "")
                if partial_text:
                    final_text += " " + partial_text

        # Final result
        final_json = json.loads(rec.FinalResult())
        final_text += " " + final_json.get("text", "")

        final_text = final_text.strip()

        return {"text": final_text}

    except Exception as e:
        return {"error": str(e)}
