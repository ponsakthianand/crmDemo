import hashlib
import secrets
from passlib.context import CryptContext

pwd_context = CryptContext(["sha256_crypt"])


def generate_temp_password(length=8):
    # Generate a random temporary password
    alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
    temp_password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return temp_password


# def hash_password(password):
#     # Hash the password using SHA-256
#     hashed_password = hashlib.sha256(password.encode()).hexdigest()
#     return hashed_password

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str):
    try:
        return pwd_context.verify(password, hashed_password)
    except:
        return None
# def verify_password(plain_password, hashed_password):
#     # Verify the plain password against the hashed password
#     return hash_password(plain_password) == hashed_password


def generate_html_message(changes: dict) -> str:
    html_message = "<ul>"
    for field, value in changes.items():
        html_message += f"<li><strong>{field.capitalize()}:</strong> {value}</li>"
    html_message += "</ul>"
    return html_message
