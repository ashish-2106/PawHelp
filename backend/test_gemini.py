from openai import OpenAI
import os
from dotenv import load_dotenv

# Load env
load_dotenv()

# Init client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Simple test
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "Say hello"}
    ]
)

print(response.choices[0].message.content)