import os
from dotenv import load_dotenv
from groq import Groq

# 1. Load Secrets
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

print("--- 🔍 DIAGNOSTIC START ---")

# Check if key loaded
if not api_key:
    print("❌ ERROR: GROQ_API_KEY is missing from .env file!")
    exit()
else:
    print(f"✅ Key found: {api_key[:10]}...")

# 2. Test Connection
try:
    print("⏳ Testing Groq API connection...")
    client = Groq(api_key=api_key)
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Reply with the word 'Success' if you can hear me.",
            }
        ],
        model="llama3-8b-8192",
    )
    print(f"✅ API Response: {chat_completion.choices[0].message.content}")
    print("🚀 SYSTEM IS READY. The issue is likely the Image URL.")

except Exception as e:
    print(f"❌ CRITICAL ERROR: {e}")
    print("This means your API Key is invalid or Groq is down.")