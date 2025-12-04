from fastapi import FastAPI
from routers import chatbot, auth , voice
from fastapi.middleware.cors import CORSMiddleware
from routers import voice



app = FastAPI(title="SignSpeak AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot.router)
app.include_router(auth.router)
app.include_router(voice.router)

@app.get("/ping")
def ping():
    return {"status": "ok"}
