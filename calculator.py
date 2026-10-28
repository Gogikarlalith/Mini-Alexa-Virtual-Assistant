"""Safe basic arithmetic parser; no eval() is used."""
import re

def calculate(expression):
    """Calculate two numbers and one operator, e.g. '12 + 8'."""
    match = re.fullmatch(r"\s*(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)\s*", expression)
    if not match:
        raise ValueError("Use the format: calculate 12 + 8")
    left, operator, right = match.groups()
    a, b = float(left), float(right)
    if operator == "+": result = a + b
    elif operator == "-": result = a - b
    elif operator == "*": result = a * b
    else:
        if b == 0: raise ZeroDivisionError("division by zero is not allowed")
        result = a / b
    return int(result) if result.is_integer() else round(result, 6)
