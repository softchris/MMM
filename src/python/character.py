import os
import json
from llm import call_llm
import traceback

 # Load characters
chars_path = os.path.join(os.path.dirname(__file__), '../assets/characters.json')

def get_character(name: str):
    """Get a character by name."""
    try:
        with open(chars_path, 'r') as f:
            characters = json.load(f)
        for c in characters:
            if c["name"].lower() == name.lower():
                return c
    except Exception as e:
        error_details = traceback.format_exc()
        return {"error": f"Error getting character: {e}\nDetails:\n{error_details}"}
    return {"error": "Character not found."}



if __name__ == "__main__":
    character_name = "Henri Duval"