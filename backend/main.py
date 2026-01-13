import pdfplumber
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import io
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "Backend running 🚀"}

def clean_page_text(text: str) -> str:
    """Remove headers, footers, page numbers, junk lines"""
    if not text:
        return ""

    lines = text.splitlines()
    cleaned_lines = []

    for line in lines:
        line = line.strip()

        if not line:
            continue

        # Remove page numbers
        if re.fullmatch(r"(page\s*)?\d+", line.lower()):
            continue

        # Remove copyright / URLs / boilerplate
        if re.search(r"(copyright|all rights reserved|www\.|http)", line.lower()):
            continue

        cleaned_lines.append(line)

    return " ".join(cleaned_lines)


def is_front_matter(text: str) -> bool:
    """Detect TOC, copyright, title pages"""
    front_keywords = [
        "table of contents",
        "copyright",
        "first published",
        "published by",
        "publishing group",
        "translated by",
        "cover design",
        "library of congress",
        "cataloging-in-publication",
        "isbn",
        "imprint",
        "all rights reserved",
    ]

    lowered = text.lower()
    return any(keyword in lowered for keyword in front_keywords)


@app.post("/extract-text/")
async def extract_text(file: UploadFile = File(...)):
    content = await file.read()

    final_text = []
    content_started = False

    with pdfplumber.open(io.BytesIO(content)) as pdf:
        is_small_pdf = len(pdf.pages) <= 2
        for page in pdf.pages:
            raw_text = page.extract_text()
            if not raw_text:
                continue

            cleaned = clean_page_text(raw_text)

            if is_small_pdf:
                final_text.append(cleaned)
                continue

            # Skip front matter until actual content starts
            if not content_started:
                if is_front_matter(cleaned):
                    continue

                if re.search(r"(chapter\s+\d+|foreword|introduction)", cleaned.lower()):
                    content_started = True

            if content_started:
                final_text.append(cleaned)

    return {
        "pdf_content": "\n\n".join(final_text)
    }