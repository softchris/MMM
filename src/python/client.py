"""
cd to the `examples/snippets/clients` directory and run:
    uv run client
"""

import asyncio
import os

from pydantic import AnyUrl

from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client
from mcp.shared.context import RequestContext

# Create server parameters for stdio connection
server_params = StdioServerParameters(
    command="python",  # Using python to run the server
    args=["/workspaces/MMM/src/python/server.py"],
    env={},
)

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
            

            # Call a tool (add tool from fastmcp_quickstart)
            # result = await session.call_tool("add", arguments={"a": 5, "b": 3})
            # result_unstructured = result.content[0]
            # if isinstance(result_unstructured, types.TextContent):
            #     print(f"Tool result: {result_unstructured.text}")
            # result_structured = result.structuredContent
            # print(f"Structured tool result: {result_structured}")


def main():
    """Entry point for the client script."""
    asyncio.run(run())


if __name__ == "__main__":
    main()