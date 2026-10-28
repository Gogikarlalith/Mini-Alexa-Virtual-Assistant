"""Offline lists for entertainment responses."""
import random

QUOTES = [
    "Great things are done by a series of small things brought together. — Vincent van Gogh",
    "It always seems impossible until it's done. — Nelson Mandela",
    "The secret of getting ahead is getting started. — Mark Twain",
    "Success is the sum of small efforts, repeated day in and day out. — Robert Collier",
]
JOKES = [
    "Why did the developer go broke? Because they used up all their cache.",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "Why was the computer cold? It left its Windows open.",
    "What do you call 8 hobbits? A hobbyte.",
]
FACTS = [
    "Octopuses have three hearts.",
    "A day on Venus is longer than its year.",
    "Honey can remain edible for a very long time when stored properly.",
    "The Eiffel Tower can grow slightly taller in hot weather because metal expands.",
]
def get_random_quote(): return random.choice(QUOTES)
def get_random_joke(): return random.choice(JOKES)
def get_random_fact(): return random.choice(FACTS)
