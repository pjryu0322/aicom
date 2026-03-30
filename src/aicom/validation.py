from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, Iterable, Mapping


@dataclass(frozen=True, slots=True)
class ValidationError:
    field: str
    code: str
    message: str


EMAIL_RE = re.compile(
    # Pragmatic email check: require one "@", at least one dot in domain,
    # and no whitespace. This intentionally avoids full RFC complexity.
    r"^(?P<local>[^\s@]+)@(?P<domain>[^\s@]+\.[^\s@]+)$"
)


def validate_account_input(
    data: Mapping[str, Any] | None,
    *,
    required_fields: Iterable[str] = ("email", "password"),
) -> dict[str, Any]:
    """
    Validate user-provided account info on the server.

    Rules (acceptance criteria):
    - All required fields must exist and be non-empty.
    - Email must have a valid format.
    - Password must be at least 8 characters.
    """
    errors: list[ValidationError] = []

    if not isinstance(data, Mapping):
        for f in required_fields:
            errors.append(
                ValidationError(field=f, code="required", message=f"{f} is required")
            )
        return {"ok": False, "errors": errors}

    for f in required_fields:
        if f not in data or data.get(f) in (None, ""):
            errors.append(ValidationError(field=f, code="required", message=f"{f} is required"))

    email = data.get("email")
    if email not in (None, ""):
        if not isinstance(email, str) or EMAIL_RE.match(email) is None:
            errors.append(
                ValidationError(field="email", code="invalid_format", message="email is invalid")
            )

    password = data.get("password")
    if password not in (None, ""):
        if not isinstance(password, str):
            errors.append(
                ValidationError(field="password", code="invalid_type", message="password is invalid")
            )
        elif len(password) < 8:
            errors.append(
                ValidationError(
                    field="password",
                    code="too_short",
                    message="password must be at least 8 characters",
                )
            )

    return {"ok": len(errors) == 0, "errors": errors}

