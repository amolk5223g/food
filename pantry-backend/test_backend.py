import os
from dotenv import load_dotenv
import google.generativeai as genai
import requests

# 1. Load Secrets
load_dotenv()

GOOGLE_KEY = os.getenv("GOOGLE_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print("--- 🔍 SYSTEM DIAGNOSTIC ---")

# Check 1: Are keys present?
if not GOOGLE_KEY:
    print("❌ ERROR: GOOGLE_API_KEY is missing in .env")
else:
    print(f"✅ Google Key found: {GOOGLE_KEY[:5]}...")

if not SUPABASE_URL:
    print("❌ ERROR: SUPABASE_URL is missing in .env")
else:
    print(f"✅ Supabase URL found: {SUPABASE_URL}")

# Check 2: Test Google Gemini AI
print("\n--- 🤖 TESTING AI CONNECTION ---")
try:
    genai.configure(api_key=GOOGLE_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say 'Hello' if you can hear me.")
    print(f"✅ AI Response: {response.text.strip()}")
except Exception as e:
    print(f"❌ AI CRITICAL FAILURE: {e}")

# Check 3: Test Supabase Database (REST API)
print("\n--- 🗄️ TESTING DATABASE CONNECTION ---")
try:
    db_url = f"{SUPABASE_URL}/rest/v1/pantry_scans?select=*&limit=1"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    response = requests.get(db_url, headers=headers)
    
    if response.status_code == 200:
        print("✅ Database Connection Successful!")
    else:
        print(f"❌ Database Error: Status {response.status_code}")
        print(f"   Reason: {response.text}")

except Exception as e:
    print(f"❌ DB CRITICAL FAILURE: {e}")

print("\n--- DIAGNOSTIC COMPLETE ---")