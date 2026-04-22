import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origin=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = genai.Client(os.environ.get("GEMINI_API_KEY"))

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
sb: Client = create_client(url, key)
