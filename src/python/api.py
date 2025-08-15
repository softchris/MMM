"""
cd to the `examples/snippets/clients` directory and run:
    uv run client
"""

import asyncio
import os
import json

from flask import Flask, jsonify
from flask import request
from flask_cors import CORS

# it shouldn't do this, user mcp server tool call
from data.room import get_rooms

from client import run_tool, read_resource

app = Flask(__name__)

CORS(app)

@app.route("/rooms")
async def rooms():
    return jsonify({"status": "ok", "rooms": get_rooms()})

@app.route("/interrogate", methods=["POST"])
async def interrogate():
    data = request.get_json()
    name = data.get("name") if data else None
    r = await run_tool("interrogate", {"name": name}, f"I'm Detective Depardieu, tell me about yourself.")
    return jsonify({"status": "ok", "response": r})

@app.route("/talk", methods=["POST"])
async def talk():
    data = request.get_json()
    name = data.get("name") if data else None
    topic = data.get("topic") if data else None
    r = await run_tool("talk_to", {"name": name, "topic": topic}, f"I'm Detective Depardieu, tell me about {topic}.")
    return jsonify({"status": "ok", "response": r})

@app.route("/item/<name>", methods=["POST"])
async def item(name):

    # todo, call resource
    item = await read_resource("lookat", name)
    return jsonify({"status": "ok", "item": item})

@app.route("/status")
async def status():
    return jsonify({"status": "ok", "response": "running"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)