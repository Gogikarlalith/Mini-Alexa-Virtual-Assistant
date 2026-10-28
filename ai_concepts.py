"""Small educational AI/ML/DL analogies, not trained models."""

def recommend_activity(hour=None):
    """Choose an activity using explicit rules based on the current hour."""
    from datetime import datetime
    if hour is None:
        hour = datetime.now().hour
    if 5 <= hour < 11:
        activity = "have breakfast or plan your day"
    elif 11 <= hour < 14:
        activity = "take a lunch break"
    elif 14 <= hour < 18:
        activity = "focus on a learning task"
    elif 18 <= hour < 22:
        activity = "relax, exercise, or enjoy a hobby"
    else:
        activity = "wind down and get some rest"
    return f"Based on the current hour ({hour:02d}:00), I recommend you {activity}. This is rule-based logic, not a trained model."

def perceptron_calculation(input_1, input_2, weight_1=0.7, weight_2=-0.4, bias=0.1):
    """Return weighted sum and step activation output."""
    weighted_sum = input_1 * weight_1 + input_2 * weight_2 + bias
    return weighted_sum, 1 if weighted_sum > 0 else 0

def perceptron_demo(input_1=None, input_2=None):
    if input_1 is None: input_1 = 1
    if input_2 is None: input_2 = 1
    total, output = perceptron_calculation(float(input_1), float(input_2))
    return (f"Perceptron demo: ({input_1} × 0.7) + ({input_2} × -0.4) + 0.1 "
            f"= {total:.2f}; step output = {output}. The weights are fixed; no training occurs.")
