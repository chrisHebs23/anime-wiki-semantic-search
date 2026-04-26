import os
from google import genai
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

model = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
sb: Client = create_client(url, key)
