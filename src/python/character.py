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

def interrogate(c) -> str:
    """Interrogate a character for information."""
   
    motive = c.get("motive", "")
    prompt = f"I'm inspector Depardieu, {c.get('name')}, tell me more about your {motive} and yourself?"
    system_prompt = f'You are {c.get("name")} with role {c.get("role")}, answer in the following {c.get("tone", "neutral")}. Character should respond back like its a conversation. '
    result = call_llm(prompt, system_prompt)
    return result
    

if __name__ == "__main__":
    character_name = input("Enter character name to interrogate: ")
    c = get_character(character_name)
    result = interrogate(c)
    print(result)