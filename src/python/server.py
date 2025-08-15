
"""
MMM MCP Server: Implements game actions as MCP tools.
"""


import os
import json
from mcp.server.fastmcp import FastMCP
from data.character import get_character
from data.room import get_room, move_room

from data import room
from data.item import get_item

# Create an MCP server for the mystery game
mcp = FastMCP("MMM Mystery Game")


# Tool to move forward in rooms
@mcp.tool()
def move_forward() -> str:
    move_room(1)

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

# Talk to a character, we learn their name and role
@mcp.tool()
def talk_to(name: str, topic: str) -> str:
   """Talk to a character for information."""
   c = get_character(name)
   return f"You are {c.get('name', '')} with role {c.get('role', '')} and tone {c.get('tone', 'neutral')}. Ensure you answer any questions on this {topic}"

# Interrogate a character, we learn their motive
@mcp.tool()
def interrogate(name: str) -> str:
   """Interrogate a character for information."""
   c = get_character(name)
   return f"You are {c.get('name', '')} with role {c.get('role', '')} and tone {c.get('tone', 'neutral')}. With {c.get('motive', '')} motive."


# Game Actions as MCP tools
@mcp.resource("look://{room}")
def search_room(room: str) -> str:
    """Search the specified room for clues: list characters and items present."""
    r = get_room(room)
    return r

@mcp.resource("lookat://{item}")
def analyze_item(item: str) -> str:
    """Analyze the specified item for clues."""
    item = get_item(item)
    return item.get("description", "No significant findings.")



@mcp.tool()
def confront_character(name: str) -> str:
    """Confront a character with evidence."""
    # Placeholder logic
    return f"You confront {name}. They seem nervous and avoid eye contact."

if __name__ == "__main__":
    print("Starting MMM MCP server...")
   
    mcp.run()