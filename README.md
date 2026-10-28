# Mini Alexa — Virtual AI Assistant (v2.0)

A beginner-friendly virtual assistant project with a premium responsive website, browser voice input, spoken replies, useful local commands, and optional AI chat. The Python console assistant remains available.

## Features

- **Premium dashboard:** dark glass-style UI, animated AI orb, responsive layout, theme toggle, chat history area, calculator, entertainment cards, number game, and AI concepts demo.
- **Voice input:** microphone button using the browser's Web Speech Recognition API (best support in current Google Chrome / Microsoft Edge; microphone permission required).
- **Spoken replies:** browser text-to-speech with Speak replies and Stop voice controls.
- **Local commands:** greetings, date/time, calculator, quotes, jokes, facts, activity suggestions, guessing game, and perceptron explainer.
- **Optional AI chat:** connect your own API key through a local Python server. The key is never placed in frontend JavaScript.
- **No required third-party Python packages:** server and console use Python's standard library.
- **Tests:** existing unit tests for core assistant features.

## Requirements

- Python 3.10+ (your Python 3.14 should be fine for this standard-library project)
- Current Chrome or Edge recommended for voice input
- Internet access and your own API provider account/key only if you want AI model responses

## Open the project in VS Code

1. Extract `Mini_Alexa_Complete_Project.zip`.
2. In VS Code, select **File → Open Folder**.
3. Open the inner `virtual-ai-assistant` folder — the folder that contains `main.py` and `server.py`.
4. Select **Terminal → New Terminal**.

## Run the Python console assistant

```powershell
py main.py
```

Type `help` to see supported commands. Type `exit` to leave the assistant.

## Run the website with voice support

Use the local server (recommended instead of opening the HTML file directly):

```powershell
py server.py
```

Open this address in Chrome or Edge:

`http://127.0.0.1:8000/frontend/index.html`

Allow microphone access when the browser asks. Click the microphone icon, speak, and the transcript will be sent as a chat message. Turn **Speak replies** on to hear responses; use **Stop voice** to cancel speech. Voice recognition support depends on your browser and language settings.

To stop the web server, focus the terminal and press **Ctrl+C**.

## Enable optional AI chat

The site works without an API key using local commands. To add AI-powered open-ended responses:

1. In the VS Code terminal at the project root, create a private environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

2. In VS Code Explorer, open `.env` and enter your own key on the `OPENAI_API_KEY=` line. Example format only:

   `OPENAI_API_KEY=your_key_goes_here`

3. Optionally change `OPENAI_MODEL` to a model available to your account. The default is `gpt-4.1-mini`.
4. Save `.env` and restart `py server.py`.
5. Refresh the browser page. The status chip should show **AI CONNECTED**.

**Security and cost:** Never share your API key, commit `.env` to GitHub, or paste it into `frontend/js/app.js`. `.env` is excluded by `.gitignore`. API usage may cost money under your provider's pricing. Keep the key private and set provider usage limits if available. If no key is configured, the local assistant continues to work.

## Test the project

```powershell
py -m unittest discover -s tests -v
```

## Project structure

```text
virtual-ai-assistant/
├── main.py                    # Python console assistant
├── server.py                  # Local website server + optional AI bridge
├── greetings.py
├── datetime_utils.py
├── calculator.py
├── content.py
├── game.py
├── ai_concepts.py
├── help_menu.py
├── .env.example               # Optional AI configuration template
├── requirements.txt           # No third-party packages required
├── tests/
│   └── test_assistant.py
└── frontend/
    ├── index.html
    ├── assistant.html
    ├── concepts.html
    ├── css/
    │   ├── style.css
    │   ├── animations.css
    │   └── responsive.css
    └── js/
        └── app.js
```

## Troubleshooting

- **`main.py` not found:** make sure the terminal path ends with `...\Mini_Alexa_Complete_Project\virtual-ai-assistant`.
- **Website won't connect:** leave `py server.py` running and visit `http://127.0.0.1:8000/frontend/index.html`.
- **Microphone button is disabled:** use current Chrome or Edge, serve the page using `py server.py`, and check browser microphone permissions.
- **No voice is heard:** ensure Speak replies is checked, system volume is on, and browser audio is not muted.
- **AI status says LOCAL MODE:** this is expected until `.env` contains a valid API key and the server is restarted.
- **AI request fails:** verify your key, model access, internet connection, and provider billing/usage settings. The key is read by the local Python server only.

## Architecture note

The Python console app and browser UI are separate entry points. `main.py` runs the console assistant. `server.py` serves the frontend and optionally relays AI requests to the provider; it does not run the console assistant. Voice recognition and text-to-speech are browser features and may not work in every browser.
