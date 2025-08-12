"""
cd to the `examples/snippets/clients` directory and run:
    uv run client
"""

import asyncio
import os
import json

from pydantic import AnyUrl

from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client
from mcp.shared.context import RequestContext
from llm import call_llm
from flask import Flask, jsonify
from flask_cors import CORS

# Create server parameters for stdio connection
server_params = StdioServerParameters(
    command="python",  # Using python to run the server
    args=["/workspaces/MMM/src/python/server.py"],
    env={},
)

async def run_tool(tool, args, prompt):
    async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                # Initialize the connection
                await session.initialize()
        
                result = await session.call_tool(tool, arguments=args)
                # result.content[0].text
                r = call_llm(prompt, f"Answer the question, you are: {result.content[0].text}")
                return f"{r}"

# can be removed
async def run():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()

            # List available prompts
            prompts = await session.list_prompts()
            print(f"Available prompts: {[p.name for p in prompts.prompts]}")

            # Get a prompt (greet_user prompt from fastmcp_quickstart)
            if prompts.prompts:
                prompt = await session.get_prompt("greet_user", arguments={"name": "Alice", "style": "friendly"})
                print(f"Prompt result: {prompt.messages[0].content}")

            # List available resources
            resources = await session.list_resources()
            print(f"Available resources: {[r.uri for r in resources.resources]}")

            # List available tools
            tools = await session.list_tools()
            print(f"Available tools: {[t.name for t in tools.tools]}")

            # Read a resource (greeting resource from fastmcp_quickstart)
            print("Reading resource content...")
            resource_content = await session.read_resource(AnyUrl("look://Study"))
            content_block = resource_content.contents[0]
            print(content_block.text)

            # Analyze items in the current room
            print("Reading resource content...")
            resource_content = await session.read_resource(AnyUrl("lookat://LeatherGloves"))
            content_block = resource_content.contents[0]
            print(content_block.text)
            

            # Call a tool (add tool from fastmcp_quickstart)
            name = "Henri Duval"
            result = await session.call_tool("talk_to_character", arguments={"name": name})
            # print("Result", result)
            r = call_llm("I'm Detective Depardieu tell me about you", f"You are {result.content[0].text}")
            print(f"\033[1m{name}\033[0m > {r}")
            # result_unstructured = result.content[0]
            # if isinstance(result_unstructured, types.TextContent):
            #     print(f"Tool result: {result_unstructured.text}")
            # result_structured = result.structuredContent
            # print(f"Structured tool result: {result_structured}")


app = Flask(__name__)

ROOMS = [
    {
        "title": 'Study',
        "img": '/assets/study.png',
        "desc": 'The study is shrouded in shadows. Flickering candlelight reveals a blood-stained letter opener on the desk. The air is thick with secrets and the scent of old books. You feel a chill as if someone—or something—is watching you.',
        "characterName": 'Margaux Lefevre'
    },
    {
        "title": 'Library',
        "img": '/assets/library.png',
        "desc": 'The library is lined with ancient tomes. A broken window lets in a cold draft. Something rustles behind the shelves.',
        "characterName": 'Madeleine Rousseau'
    },
    {
        "title": 'Hall',
        "img": '/assets/hall.png',
        "desc": 'The grand hall echoes with distant footsteps. Portraits stare down from the walls, their eyes following your every move.',
        "characterName": 'Julien Armand'
    }
]

CORS(app)

@app.route("/rooms")
async def rooms():
    return jsonify({"status": "ok", "rooms": ROOMS})    

from flask import request

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

@app.route("/status")
async def status():
    
    return jsonify({"status": "ok", "response": "running"})



if __name__ == "__main__":
    # asyncio.run(main())
    app.run(debug=True, port=5000)