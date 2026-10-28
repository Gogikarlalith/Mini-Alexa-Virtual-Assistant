import unittest
from calculator import calculate
from ai_concepts import perceptron_calculation, recommend_activity
from main import handle_command

class MiniAlexaTests(unittest.TestCase):
    def test_calculator_operations(self):
        self.assertEqual(calculate("12 + 8"), 20)
        self.assertEqual(calculate("9 - 3"), 6)
        self.assertEqual(calculate("4 * 5"), 20)
        self.assertEqual(calculate("8 / 2"), 4)
    def test_division_by_zero(self):
        with self.assertRaises(ZeroDivisionError): calculate("5 / 0")
    def test_invalid_expression(self):
        with self.assertRaises(ValueError): calculate("hello")
    def test_perceptron(self):
        total, output = perceptron_calculation(1, 1)
        self.assertAlmostEqual(total, 0.4)
        self.assertEqual(output, 1)
    def test_recommendation(self):
        self.assertIn("breakfast", recommend_activity(8))
    def test_personalized_exit(self):
        self.assertIn("Alex", handle_command("exit", "Alex"))
    def test_fallback(self):
        self.assertIn("help", handle_command("something random", "Alex"))
if __name__ == "__main__": unittest.main()
