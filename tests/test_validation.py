import sys
import unittest
from pathlib import Path

# Ensure `src/` is importable when running tests without packaging.
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from aicom.validation import validate_account_input


class TestValidateAccountInput(unittest.TestCase):
    def test_required_fields_missing(self) -> None:
        result = validate_account_input({"email": "a@b.com"})
        self.assertEqual(result["ok"], False)
        self.assertTrue(any(e.field == "password" and e.code == "required" for e in result["errors"]))

    def test_invalid_email(self) -> None:
        result = validate_account_input({"email": "not-an-email", "password": "12345678"})
        self.assertEqual(result["ok"], False)
        self.assertTrue(any(e.field == "email" and e.code == "invalid_format" for e in result["errors"]))

    def test_password_min_length(self) -> None:
        result = validate_account_input({"email": "a@b.com", "password": "1234567"})
        self.assertEqual(result["ok"], False)
        self.assertTrue(any(e.field == "password" and e.code == "too_short" for e in result["errors"]))

    def test_valid_input_returns_ok(self) -> None:
        result = validate_account_input({"email": "a@b.com", "password": "12345678"})
        self.assertEqual(result["ok"], True)
        self.assertEqual(result["errors"], [])


if __name__ == "__main__":
    unittest.main()

