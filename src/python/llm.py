import os
from openai import OpenAI

def call_llm(prompt, system_prompt):
    client = OpenAI(
        base_url="https://models.github.ai/inference",
        api_key=os.environ["GITHUB_TOKEN"],
    )
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="openai/gpt-4o",
        temperature=1,
        max_tokens=4096,
        top_p=1
    )
    

    return response.choices[0].message.content