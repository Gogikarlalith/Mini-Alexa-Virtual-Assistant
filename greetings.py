"""Greeting and session-name helpers."""
def get_user_name(input_fn=input):
    name = input_fn("You: ").strip()
    return name or "friend"

def build_greeting(name):
    return f"Nice to meet you, {name}! Type 'help' to see what I can do."
