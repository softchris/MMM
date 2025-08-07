
"""
MMM MCP Server: Implements game actions as MCP tools.
"""


import os
import json
from mcp.server.fastmcp import FastMCP
from character import get_character

items_path = os.path.join(os.path.dirname(__file__), '../assets/items.json')
 # Load characters
chars_path = os.path.join(os.path.dirname(__file__), '../assets/characters.json')
# Load items
items_path = os.path.join(os.path.dirname(__file__), '../assets/items.json')

# Create an MCP server for the mystery game
mcp = FastMCP("MMM Mystery Game")

current_room = "Study" # Default starting room

# Load room order from rooms.json
rooms_path = os.path.join(os.path.dirname(__file__), '../assets/rooms.json')
try:
    with open(rooms_path, 'r') as f:
        ROOMS = [r['name'] for r in json.load(f)]
except Exception:
    ROOMS = []

# Tool to move forward in rooms
@mcp.tool()
def move_forward() -> str:
    """Move to the next room in the game."""
    global current_room
    if current_room not in ROOMS:
        current_room = ROOMS[0] if ROOMS else ""
        return f"Moved to {current_room}."
    idx = ROOMS.index(current_room)
    if idx < len(ROOMS) - 1:
        current_room = ROOMS[idx + 1]
        return f"Moved forward to {current_room}."
    else:
        return f"Already at the last room: {current_room}."

@mcp.tool()
def current_room_name() -> str:
    """Return the name of the current room."""
    return current_room

# Tool to move backward in rooms
@mcp.tool()
def move_backward() -> str:
    """Move to the previous room in the game."""
    global current_room
    if current_room not in ROOMS:
        current_room = ROOMS[0] if ROOMS else ""
        return f"Moved to {current_room}."
    idx = ROOMS.index(current_room)
    if idx > 0:
        current_room = ROOMS[idx - 1]
        return f"Moved backward to {current_room}."
    else:
        return f"Already at the first room: {current_room}."

# Add interrogation tool
@mcp.tool()
def talk_to_character(name: str) -> str:
   """Interrogate a character for information."""
   c = get_character(name)
   return f"{c['name']} with {c.get('role', '')} {c.get('tone', 'neutral')} with secret {c.get('secret', '')}"

# Game Actions as MCP tools
@mcp.resource("look://{room}")
def search_room(room: str) -> str:
    """Search the specified room for clues: list characters and items present."""
    # Normalize room name for matching
    room_norm = room.strip().lower()

    try:
        with open(chars_path, 'r') as f:
            characters = json.load(f)
    except Exception:
        characters = []

    try:
        with open(items_path, 'r') as f:
            items = json.load(f)
    except Exception:
        items = []

    # Find characters in the room
    chars_in_room = [c['name'] for c in characters if c.get('location', '').strip().lower() == room_norm]
    # Find items in the room
    items_in_room = [i['name'] for i in items if i.get('location', '').strip().lower() == room_norm]

    result = f"You search the {room}.\n"
    if chars_in_room:
        result += "Characters present: " + ", ".join(chars_in_room) + "\n"
    else:
        result += "No characters present.\n"
    if items_in_room:
        result += "Items found: " + ", ".join(items_in_room) + "\n"
    else:
        result += "No items found.\n"
    return result.strip()

@mcp.resource("lookat://{item}")
def analyze_item(item: str) -> str:
    """Analyze the specified item for clues."""
    
    try:
        with open(items_path, 'r') as f:
            items = json.load(f)
        for obj in items:
            if obj["name"].lower() == item.lower():
                return obj["description"]
    except Exception as e:
        return f"Error reading items: {e}"
    return "No significant findings."



@mcp.tool()
def confront_character(name: str) -> str:
    """Confront a character with evidence."""
    # Placeholder logic
    return f"You confront {name}. They seem nervous and avoid eye contact."

if __name__ == "__main__":
    print("Starting MMM MCP server...")
    mcp.run()