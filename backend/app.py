import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv('MONGO_URI', "mongodb://localhost:27018/")
client = MongoClient(MONGO_URI)
db = client.infiniteCraftDB
elements_collection = db.elements
recipes_collection = db.recipes
GEMINI_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-flash-latest')

@app.route('/combine', methods=['POST'])
def combine_elements():
    data = request.get_json()
    element1 = data.get('element1')
    element2 = data.get('element2')
    if not element1 or not element2:
        return jsonify({"error": "Two elements are required"}), 400
    
    sorted_elements = sorted([element1, element2])
    existing_recipe = recipes_collection.find_one({"element1": sorted_elements[0], "element2": sorted_elements[1]})
    
    if existing_recipe:
        return jsonify({"result": existing_recipe['result'], "emoji": existing_recipe.get('emoji', '✨'), "isNew": False})

    prompt = f"""You are an imaginative crafting game engine.
    Task: Combine '{element1}' and '{element2}' to create a new concept, place, object, or idea. The result can be one or more words. Make a creative leap that is logical but not always literal.
    Format: Respond with ONLY the name of the result, a colon, and a single, relevant emoji.
    Examples:
    - Water + Earth = Mud:🟫
    - Human + Skyscraper = King Kong:🦍
    - City + Skyscraper = Empire State Building:🏙️
    Constraint: DO NOT add any explanations, equations, or extra text."""

    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        
        # Stricter parsing to prevent saving bad data like equations
        if ':' in raw_text and '+' not in raw_text and '=' not in raw_text and len(raw_text.split()) < 5:
            parts = raw_text.split(':', 1)
            new_element_name = parts[0].strip().title()
            new_element_emoji = parts[1].strip().split()[0]
        else:
            print(f"AI format failure. Response: '{raw_text}'. Using fallback.")
            new_element_name = "Muddle"
            new_element_emoji = "❓"

        new_recipe = {"element1": sorted_elements[0], "element2": sorted_elements[1], "result": new_element_name, "emoji": new_element_emoji}
        recipes_collection.insert_one(new_recipe)
        elements_collection.update_one({"name": new_element_name}, {"$setOnInsert": {"name": new_element_name, "emoji": new_element_emoji}}, upsert=True)
        
        return jsonify({"result": new_element_name, "emoji": new_element_emoji, "isNew": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_elements', methods=['GET'])
def get_elements():
    try:
        all_elements = list(elements_collection.find({}, {'_id': 0}))
        base = [{"name": "Fire", "emoji": "🔥"}, {"name": "Water", "emoji": "💧"}, {"name": "Earth", "emoji": "🌍"}, {"name": "Air", "emoji": "💨"}]
        
        element_names = {el['name'] for el in all_elements}
        for b in base:
            if b['name'] not in element_names:
                all_elements.append(b)
        
        # Ensure every element sent to frontend has an emoji, even if somehow created without one
        for el in all_elements:
            if 'emoji' not in el or not el['emoji']:
                el['emoji'] = '✨'
        
        return jsonify(all_elements)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)