from fastapi import FastAPI
from routers import chatbot,auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SignSpeak AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # For testing — change to ["http://localhost:5173"] later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chatbot routes
app.include_router(chatbot.router)
app.include_router(auth.router)



@app.get("/ping")
def ping():
    return {"status": "ok"}