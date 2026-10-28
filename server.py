"""Mini Alexa local web server and optional OpenAI-compatible chat bridge.
Uses only Python's standard library. Never put API keys in browser JavaScript.
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse
import json, os, urllib.request, urllib.error

ROOT = Path(__file__).resolve().parent
HOST = os.getenv("MINI_ALEXA_HOST", "127.0.0.1")
PORT = int(os.getenv("MINI_ALEXA_PORT", "8000"))
API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini").strip()
API_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1/responses").strip()


def load_env_file():
    global API_KEY, MODEL, API_URL
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        v = v.strip().strip('"').strip("'")
        if k.strip() == "OPENAI_API_KEY" and v:
            API_KEY = v
        elif k.strip() == "OPENAI_MODEL" and v:
            MODEL = v
        elif k.strip() == "OPENAI_BASE_URL" and v:
            API_URL = v


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _json(self, status, data):
        raw = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        if urlparse(self.path).path == "/api/status":
            return self._json(200, {"ok": True, "ai_enabled": bool(API_KEY), "model": MODEL if API_KEY else None})
        return super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != "/api/chat":
            return self._json(404, {"error": "Endpoint not found"})
        length = int(self.headers.get("Content-Length", "0"))
        if length > 20000:
            return self._json(413, {"error": "Message is too large."})
        try:
            body = json.loads(self.rfile.read(length) or b"{}")
            message = str(body.get("message", "")).strip()
            history = body.get("history", [])
            if not message:
                return self._json(400, {"error": "Please enter a message."})
            if not API_KEY:
                return self._json(200, {"ai_enabled": False, "reply": None})
            # Only send a small, validated conversation history to the model.
            items = []
            if isinstance(history, list):
                for item in history[-8:]:
                    if not isinstance(item, dict):
                        continue
                    role = item.get("role")
                    content = item.get("content")
                    if role in ("user", "assistant") and isinstance(content, str):
                        items.append({"role": role, "content": content[:2000]})
            items.append({"role": "user", "content": message[:4000]})
            payload = {"model": MODEL, "instructions": "You are Mini Alexa, a friendly, concise virtual assistant. Be helpful and safe. For calculations, show reasoning briefly and be clear about uncertainty.", "input": items, "max_output_tokens": 500}
            req = urllib.request.Request(API_URL, data=json.dumps(payload).encode(), headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}, method="POST")
            with urllib.request.urlopen(req, timeout=35) as response:
                data = json.loads(response.read().decode("utf-8"))
            reply = data.get("output_text", "").strip()
            if not reply:
                chunks = []
                for out in data.get("output", []):
                    for part in out.get("content", []):
                        if part.get("type") == "output_text": chunks.append(part.get("text", ""))
                reply = "\n".join(chunks).strip()
            if not reply:
                reply = "I couldn't generate a reply this time. Please try again."
            return self._json(200, {"ai_enabled": True, "reply": reply})
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", "replace")[:500]
            return self._json(502, {"error": f"AI provider returned HTTP {exc.code}. Check your API key, model, and account access.", "detail": detail})
        except Exception as exc:
            return self._json(500, {"error": f"Could not process the request: {exc}"})

    def log_message(self, fmt, *args):
        print("[Mini Alexa] " + (fmt % args))


if __name__ == "__main__":
    load_env_file()
    print("=" * 54)
    print(" MINI ALEXA · LOCAL WEB SERVER")
    print("=" * 54)
    print(f"Website: http://{HOST}:{PORT}/frontend/index.html")
    print("AI chat:", f"enabled ({MODEL})" if API_KEY else "disabled (local commands still work)")
    print("Press Ctrl+C to stop the server.")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
