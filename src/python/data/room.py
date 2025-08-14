import os
import json
 # Load rooms

rooms_path = os.path.join(os.path.dirname(__file__), '../../assets/rooms.json')

def move_room(delta: int):
    """Move the current room pointer by delta."""
    global current_room
    current_room += delta
    # Clamp the room index to the valid range
    current_room = max(0, min(current_room, len(ROOMS) - 1))

def get_room(name: str):
    """Get a room by name."""
    try:
        with open(rooms_path, 'r') as f:
            rooms = json.load(f)
        for r in rooms:
            if r["name"].lower() == name.lower():
                return r
    except Exception as e:
       
        return {"error": f"Error getting room: {e}\nDetails:\n{e}"}
    return {"error": "Room not found."}

def get_rooms():
    """Get all rooms."""
    try:
        with open(rooms_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        return {"error": f"Error getting rooms: {e}\nDetails:\n{e}"}
    
current_room = 0

ROOMS = get_rooms()