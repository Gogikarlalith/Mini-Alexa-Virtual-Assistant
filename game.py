"""Console number guessing game."""
import random

def play_guessing_game(input_fn=input, print_fn=print):
    target = random.randint(1, 20)
    print_fn("I'm thinking of a number between 1 and 20. You have 5 tries.")
    for attempt in range(5):
        try:
            guess = int(input_fn(f"Guess {attempt + 1}/5: "))
        except ValueError:
            print_fn("Please enter a whole number.")
            continue
        if guess == target:
            print_fn("Correct! You guessed it.")
            return True
        print_fn("Higher!" if guess < target else "Lower!")
    print_fn(f"Out of tries! The number was {target}.")
    return False
