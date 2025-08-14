import os
import json

items_path = os.path.join(os.path.dirname(__file__), '../assets/items.json')

def get_item(name: str) -> dict:
    """Retrieve an item by name."""
    try:
        with open(items_path, 'r') as f:
            items = json.load(f)
        for item in items:
            if item['name'].lower() == name.lower():
                return item
    except Exception as e:
        print(f"Error reading items: {e}")
    return {}
