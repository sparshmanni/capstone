from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dependencies import get_current_user, get_db
from models import ChatSession, ChatMessage
from perplexity import Perplexity

from google.cloud import speech
from pydub import AudioSegment
import io

from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

# Initialize the Perplexity client
client = Perplexity(api_key=os.getenv("PERPLEXITY_API_KEY"))

class ChatRequest(BaseModel):
    query: str
    session_id: int | None = None

class ChatResponse(BaseModel):
    id: int
    role: str
    text: str

import re

def clean_response(text):
    # Remove trailing numbers, references, or extra symbols
    text = re.sub(r'\s*\[\d+\]', '', text)  # remove [1], [2], etc.
    text = re.sub(r'\s*\d+$', '', text)     # remove trailing numbers
    text = text.strip()
    return text

@router.get("/history")
def get_chat_history(user=Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.user_id == user.id).order_by(ChatSession.created_at.desc()).first()
    if not session:
        return {"messages": []}
    messages = [{"id": msg.id, "role": msg.role, "text": msg.content} for msg in session.messages]
    return {"messages": messages}



from fastapi import Depends, HTTPException, status

@router.get("/sessions")
def get_chat_sessions(user=Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(ChatSession).filter(ChatSession.user_id == user.id).order_by(ChatSession.created_at.desc()).all()
    result = []
    for s in sessions:
        # If title is default, set it to first user message or "New Chat"
        if s.title == "New Chat" and s.messages:
            first_msg = next((m for m in s.messages if m.role == "user"), None)
            s.title = first_msg.content[:30] + "..." if first_msg else "New Chat"
        result.append({"id": s.id, "title": s.title})
    return result

@router.post("/new_session", response_model=ChatResponse)
def create_new_session(user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Create a new empty chat session
        session = ChatSession(user_id=user.id, title="New Chat")
        db.add(session)
        db.commit()
        db.refresh(session)

        # Return the new session
        return {"id": session.id, "role": "assistant", "text": "Welcome to your new chat!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session/{session_id}")
def get_session_messages(session_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = [{"id": msg.id, "role": msg.role, "text": msg.content} for msg in session.messages]
    return {"messages": messages}




@router.post("/", response_model=ChatResponse)
def chatbot(request: ChatRequest, user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # 1. Use session_id from request if provided
        if request.session_id:
            session = db.query(ChatSession).filter(
                ChatSession.id == request.session_id,
                ChatSession.user_id == user.id
            ).first()
        else:
            session = None

        # 2. If no session found, create a new one
        if not session:
            session = ChatSession(user_id=user.id, title="New Chat")
            db.add(session)
            db.commit()
            db.refresh(session)

        # 3. Get last few messages from this session
        history = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session.id)
            .order_by(ChatMessage.id.asc())
            .all()
        )

        # 4. Prepare messages for AI model
        messages = [
            {"role": "system",
             "content": (
                 "You are an empathetic and patient AI tutor who helps students learn. "
                 "You are especially designed to assist students with disabilities, "
                 "including those using ASL gesture input that may have spelling mistakes. "
                 "Your job is to:\n"
                 "1. Understand the question even if it has misspellings.\n"
                 "2. Provide a brief and clear initial explanation — short and simple.\n"
                 "3. If the student wants more detail, they can ask follow-up questions.\n"
                 "4. Be encouraging, inclusive, and avoid complex jargon.\n"
                 "5. Focus on helping the student understand, not just giving the answer.\n"
                 "6. Keep responses under 150 words Do NOT add numbers, citations, references, or extra symbols at the end."
             )},
        ]

        for msg in history[-10:]:  # last 10 messages
            messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": request.query})

        # 5. Get model response
        completion = client.chat.completions.create(
            model="sonar",
            messages=messages,
            max_tokens=180,
            temperature=0.6,
        )

        response_text = clean_response(completion.choices[0].message.content.strip())

        # 6. Save messages
        user_msg = ChatMessage(session_id=session.id, role="user", content=request.query)
        assistant_msg = ChatMessage(session_id=session.id, role="assistant", content=response_text)
        db.add_all([user_msg, assistant_msg])
        db.commit()

        return {"id": assistant_msg.id, "role": "assistant", "text": response_text, "session_id": session.id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    







from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
import os, tempfile
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session

@router.get("/session/{session_id}/download_pdf")
def download_chat_session_pdf(session_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.user_id == user.id
        ).first()

        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session.id
        ).order_by(ChatMessage.id.asc()).all()

        if not messages:
            raise HTTPException(status_code=404, detail="No messages in this chat yet")

        pdf_filename = f"chat_{session.id}.pdf"
        pdf_path = os.path.join(tempfile.gettempdir(), pdf_filename)

        doc = SimpleDocTemplate(pdf_path, pagesize=letter,
                                rightMargin=72, leftMargin=72,
                                topMargin=72, bottomMargin=72)
        styles = getSampleStyleSheet()
        content = []

        content.append(Paragraph(f"<b>Chat Title:</b> {session.title or 'Untitled Chat'}", styles["Title"]))
        content.append(Spacer(1, 0.3 * inch))

        for msg in messages:
            role = "You" if msg.role == "user" else "Assistant"
            text = f"<b>{role}:</b> {msg.content}"
            content.append(Paragraph(text, styles["Normal"]))
            content.append(Spacer(1, 0.2 * inch))

        doc.build(content)

        return FileResponse(pdf_path, media_type="application/pdf", filename=pdf_filename)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




























# 🗑️ Delete a chat session (and its messages)
@router.delete("/session/{session_id}")
def delete_chat_session(session_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Find session belonging to current user
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.user_id == user.id
        ).first()

        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        # Delete all messages linked to this session first (to avoid FK errors)
        db.query(ChatMessage).filter(ChatMessage.session_id == session.id).delete()

        # Delete the session itself
        db.delete(session)
        db.commit()

        return {"status": "success", "deleted_session": session_id}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
