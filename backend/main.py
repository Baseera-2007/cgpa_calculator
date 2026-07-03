from fastapi import FastAPI, UploadFile, File
import shutil
import os

from parser import parse_pdf

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "CGPA Calculator Backend Running Successfully"
    }


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    data = parse_pdf(file_path)

    return data