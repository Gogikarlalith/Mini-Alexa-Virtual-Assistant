"""Mini Alexa: offline, rule-based console assistant."""
from datetime_utils import get_current_date, get_current_time
from calculator import calculate
from content import get_random_quote, get_random_joke, get_random_fact
from game import play_guessing_game
from greetings import get_user_name, build_greeting
from ai_concepts import recommend_activity, perceptron_demo
from help_menu import print_help

def handle_command(command, user_name):
    """Route normalized text commands to beginner-friendly feature functions."""
    text = command.strip().lower()
    if not text:
        return "Please type a command, or type 'help' to see the options."
    if text in {"exit", "quit", "bye"}:
        return f"Goodbye, {user_name}! Have a great day."
    if text in {"help", "commands"}:
        return print_help()
    if "time" in text:
        return f"It's currently {get_current_time()}."
    if "date" in text or "today" in text:
        return f"Today's date is {get_current_date()}."
    if text.startswith("calculate ") or text.startswith("calc "):
        expression = text.split(" ", 1)[1]
        try:
            return f"The result is {calculate(expression)}"
        except (ValueError, ZeroDivisionError) as exc:
            return f"I couldn't calculate that: {exc}"
    if text in {"calculator", "calculate", "calc"}:
        return "Try a calculation like: calculate 12 + 8"
    if "quote" in text or "motivat" in text:
        return get_random_quote()
    if "joke" in text or "funny" in text:
        return get_random_joke()
    if "fact" in text:
        return get_random_fact()
    if text in {"game", "guess", "number game"}:
        return "Open the Number Game panel in the Mini Alexa web interface, or run the game from the console menu."
    if "recommend" in text or "activity" in text:
        return recommend_activity()
    if "perceptron" in text or "neuron" in text:
        return perceptron_demo(1, -1)
    if text in {"hello", "hi", "hey"} or text.startswith(("hello ", "hi ", "hey ")):
        return f"Hello, {user_name}! What would you like to explore?"
    if "name" in text or "who are you" in text:
        return f"I'm Mini Alexa, your offline rule-based assistant, {user_name}."
    return "I'm not sure I understood that — type 'help' to see what I can do."

def main():
    print("=" * 48)
    print("          MINI ALEXA - VIRTUAL ASSISTANT")
    print("=" * 48)
    print("Assistant: Hi! I'm Mini Alexa. What's your name?")
    user_name = get_user_name()
    print(f"Assistant: {build_greeting(user_name)}")
    while True:
        try:
            command = input("\nYou: ")
        except (EOFError, KeyboardInterrupt):
            print(f"\nAssistant: Goodbye, {user_name}!")
            break
        if command.strip().lower() in {"game", "guess", "number game"}:
            play_guessing_game()
            continue
        response = handle_command(command, user_name)
        print(f"Assistant: {response}")
        if command.strip().lower() in {"exit", "quit", "bye"}:
            break

if __name__ == "__main__":
    main()
