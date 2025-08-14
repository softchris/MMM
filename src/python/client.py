from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client
from mcp.shared.context import RequestContext

from llm import call_llm

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