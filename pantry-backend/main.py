import os
import json
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from groq import Groq

# 1. Load Secrets
load_dotenv()

# 2. Configure Groq
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

# 3. Configure Supabase Details
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

# Headers for Supabase (REST API)
DB_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    image_url: str

class RecipeRequest(BaseModel):
    ingredients: List[str]

# --- API Endpoints ---

@app.get("/")
def home():
    return {"status": "Groq Chef is ready!"}

@app.post("/analyze-fridge")
def analyze_fridge(request: ImageRequest):
    print(f"Analyzing image: {request.image_url}")

    try:
        # UPDATED: Using the new Llama 4 Scout model
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct", 
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": "Look at this image. Identify the food ingredients visible. Return ONLY a valid JSON object with a single key 'ingredients' containing a list of strings. Do not add markdown formatting."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": request.image_url
                            }
                        }
                    ]
                }
            ],
            temperature=0.1,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )

        content = completion.choices[0].message.content
        data = json.loads(content)
        
        # Save to Supabase
        db_url = f"{SUPABASE_URL}/rest/v1/pantry_scans"
        payload = {
            "image_url": request.image_url,
            "ingredients": data['ingredients']
        }
        requests.post(db_url, headers=DB_HEADERS, json=payload)
        print("Saved scan to DB via REST")

        return data

    except Exception as e:
        print(f"Groq Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-recipe")
def generate_recipe(request: RecipeRequest):
    print(f"Cooking with: {request.ingredients}")
    ingredients_text = ", ".join(request.ingredients)
    
    prompt = f"Create a simple recipe using these ingredients: {ingredients_text}. Return ONLY a valid JSON object with keys: 'title', 'time', 'difficulty', 'ingredients' (list), and 'instructions' (list)."

    try:
        # Using Llama 3.3 for text generation (still supported)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful chef who outputs only JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        content = completion.choices[0].message.content
        recipe_data = json.loads(content)

        # Save to Supabase
        db_url = f"{SUPABASE_URL}/rest/v1/recipes"
        payload = {
            "title": recipe_data['title'],
            "cooking_time": recipe_data['time'], 
            "difficulty": recipe_data['difficulty'],
            "ingredients_used": recipe_data['ingredients'],
            "instructions": recipe_data['instructions']
        }
        requests.post(db_url, headers=DB_HEADERS, json=payload)
        print("Saved recipe to DB via REST")

        return recipe_data

    except Exception as e:
        print(f"Groq Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history():
    db_url = f"{SUPABASE_URL}/rest/v1/recipes?select=*&order=created_at.desc&limit=10"
    try:
        response = requests.get(db_url, headers=DB_HEADERS)
        return response.json()
    except Exception as e:
        print(f"Error fetching history: {e}")
        return []