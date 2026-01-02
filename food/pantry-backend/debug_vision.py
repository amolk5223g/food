import os
from dotenv import load_dotenv
from groq import Groq

# 1. Load Secrets
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

print("--- 🔍 VISION DIAGNOSTIC ---")

if not api_key:
    print("❌ ERROR: GROQ_API_KEY is missing.")
    exit()

print(f"✅ Key found: {api_key[:10]}...")

# 2. Test Groq Vision with a KNOWN PUBLIC IMAGE
try:
    print("⏳ Sending test image to Groq...")
    client = Groq(api_key=api_key)
    
    completion = client.chat.completions.create(
        model="llama-3.2-11b-vision-preview",  # The specific vision model
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text", 
                        "text": "What is in this image?"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg"
                        }
                    }
                ]
            }
        ],
        temperature=0.1,
        max_tokens=1024,
    )
    print("✅ SUCCESS! Groq replied:")
    print(completion.choices[0].message.content)

except Exception as e:
    print(f"❌ CRITICAL FAILURE: {e}")
    if "403" in str(e):
        print(">> HINT: This is a permission error (Check API Key).")
    if "404" in str(e):
        print(">> HINT: The model name might be wrong or deprecated.")
    if "400" in str(e):
        print(">> HINT: Bad Request. The image URL might be unreachable.")