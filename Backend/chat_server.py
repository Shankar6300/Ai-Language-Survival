from flask import Flask, request, jsonify, render_template
import requests
from flask_cors import CORS
import os
import json
import time
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create a templates folder for HTML templates
os.makedirs(os.path.join(os.path.dirname(__file__), 'templates'), exist_ok=True)

# Create a static folder for CSS and JS
os.makedirs(os.path.join(os.path.dirname(__file__), 'static'), exist_ok=True)

# Dictionary of pre-defined responses for different languages
CHAT_RESPONSES = {
    'en': [
        "I understand. Can you tell me more?",
        "That's interesting. What else would you like to discuss?",
        "I see. How can I help you with that?",
        "Thanks for sharing. Do you have any questions?",
        "I'm here to assist you. What would you like to know?",
        "Could you provide more details?",
        "Let me think about that for a moment.",
        "That's a good point. Have you considered alternatives?",
        "I'm processing your request. One moment please.",
        "I'd like to learn more about your perspective on this."
    ],
    'es': [
        "Entiendo. ¿Puedes contarme más?",
        "Eso es interesante. ¿De qué más te gustaría hablar?",
        "Ya veo. ¿Cómo puedo ayudarte con eso?",
        "Gracias por compartir. ¿Tienes alguna pregunta?",
        "Estoy aquí para ayudarte. ¿Qué te gustaría saber?",
        "¿Podrías proporcionar más detalles?",
        "Déjame pensar en eso por un momento.",
        "Es un buen punto. ¿Has considerado alternativas?",
        "Estoy procesando tu solicitud. Un momento por favor.",
        "Me gustaría saber más sobre tu perspectiva sobre esto."
    ],
    'fr': [
        "Je comprends. Pouvez-vous m'en dire plus?",
        "C'est intéressant. De quoi d'autre aimeriez-vous discuter?",
        "Je vois. Comment puis-je vous aider avec cela?",
        "Merci d'avoir partagé. Avez-vous des questions?",
        "Je suis là pour vous aider. Que voulez-vous savoir?",
        "Pourriez-vous fournir plus de détails?",
        "Laissez-moi réfléchir à cela un instant.",
        "C'est un bon point. Avez-vous envisagé des alternatives?",
        "Je traite votre demande. Un moment s'il vous plaît.",
        "J'aimerais en savoir plus sur votre point de vue à ce sujet."
    ],
    'de': [
        "Ich verstehe. Können Sie mir mehr erzählen?",
        "Das ist interessant. Worüber möchten Sie sonst noch sprechen?",
        "Ich sehe. Wie kann ich Ihnen dabei helfen?",
        "Danke fürs Teilen. Haben Sie irgendwelche Fragen?",
        "Ich bin hier, um Ihnen zu helfen. Was möchten Sie wissen?",
        "Könnten Sie mehr Details angeben?",
        "Lassen Sie mich einen Moment darüber nachdenken.",
        "Das ist ein guter Punkt. Haben Sie Alternativen in Betracht gezogen?",
        "Ich bearbeite Ihre Anfrage. Einen Moment bitte.",
        "Ich würde gerne mehr über Ihre Perspektive dazu erfahren."
    ],
    'te': [
        "నేను అర్థం చేసుకున్నాను. మీరు మరింత చెప్పగలరా?",
        "అది ఆసక్తికరంగా ఉంది. మరేమి గురించి మాట్లాడాలనుకుంటున్నారు?",
        "నేను చూస్తున్నాను. నేను మీకు ఎలా సహాయం చేయగలను?",
        "పంచుకున్నందుకు ధన్యవాదాలు. మీకు ఏవైనా ప్రశ్నలు ఉన్నాయా?",
        "నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
        "మీరు మరిన్ని వివరాలు అందించగలరా?",
        "దాని గురించి ఒక క్షణం ఆలోచిస్తాను.",
        "అది మంచి పాయింట్. మీరు ప్రత్యామ్నాయాలను పరిగణించారా?",
        "నేను మీ అభ్యర్థనను ప్రాసెస్ చేస్తున్నాను. ఒక క్షణం దయచేసి.",
        "దీనిపై మీ దృక్కోణం గురించి మరింత తెలుసుకోవాలనుకుంటున్నాను."
    ]
}

# Track conversation history for each session
CONVERSATIONS = {}

@app.route('/')
def home():
    """Render the chat interface"""
    return render_template('index.html')

@app.route('/api/detect', methods=['POST'])
def detect_language():
    """
    Detect the language of the provided text
    """
    try:
        data = request.get_json()
        text = data.get('q', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Use MyMemory API for language detection
        api_url = f"https://api.mymemory.translated.net/get?q={text}&langpair=auto|en"
        
        response = requests.get(api_url)
        response.raise_for_status()
        
        # Parse the response
        result = response.json()
        
        # Extract detected language
        if result and 'responseData' in result and 'detectedLanguage' in result['responseData']:
            detected_lang = result['responseData']['detectedLanguage']
            # Extract language code (first 2 characters)
            lang_code = detected_lang.split('|')[0].strip()[:2].lower()
            return jsonify({'language': lang_code})
        else:
            # Default to English if detection fails
            return jsonify({'language': 'en', 'note': 'Detection failed, defaulting to English'})
    
    except Exception as e:
        print(f"Error detecting language: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/translate', methods=['POST'])
def translate_text():
    """
    Translate text from source language to target language
    """
    try:
        data = request.get_json()
        text = data.get('q', '')
        source_lang = data.get('source', 'auto')
        target_lang = data.get('target', 'en')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Use MyMemory API for translation
        api_url = f"https://api.mymemory.translated.net/get?q={text}&langpair={source_lang}|{target_lang}"
        
        response = requests.get(api_url)
        response.raise_for_status()
        
        # Parse the response
        result = response.json()
        
        # Extract translated text
        if result and 'responseData' in result and 'translatedText' in result['responseData']:
            translated_text = result['responseData']['translatedText']
            return jsonify({
                'translatedText': translated_text,
                'source': source_lang,
                'target': target_lang
            })
        else:
            return jsonify({'error': 'Translation failed'}), 500
    
    except Exception as e:
        print(f"Error translating text: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/languages', methods=['GET'])
def get_languages():
    """
    Return a list of supported languages
    """
    languages = {
        'auto': 'Auto Detect',
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'ja': 'Japanese',
        'zh': 'Chinese',
        'ru': 'Russian',
        'pt': 'Portuguese',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'ko': 'Korean',
        'nl': 'Dutch',
        'sv': 'Swedish',
        'tr': 'Turkish',
        'te': 'Telugu'
    }
    
    return jsonify({'languages': languages})

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Process a chat message and return a response
    """
    try:
        data = request.get_json()
        message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        lang = data.get('language', 'en')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Initialize conversation history if it doesn't exist
        if session_id not in CONVERSATIONS:
            CONVERSATIONS[session_id] = []
        
        # Add the user message to the conversation history
        CONVERSATIONS[session_id].append({
            'role': 'user',
            'content': message,
            'timestamp': time.time()
        })
        
        # Generate a response
        response_text = get_chat_response(message, lang, CONVERSATIONS[session_id])
        
        # Add the bot response to the conversation history
        CONVERSATIONS[session_id].append({
            'role': 'bot',
            'content': response_text,
            'timestamp': time.time()
        })
        
        # Keep only the last 10 messages to limit memory usage
        if len(CONVERSATIONS[session_id]) > 20:
            CONVERSATIONS[session_id] = CONVERSATIONS[session_id][-20:]
        
        # Simulate thinking time
        time.sleep(random.uniform(0.5, 1.5))
        
        return jsonify({
            'response': response_text,
            'session_id': session_id
        })
    
    except Exception as e:
        print(f"Error processing chat: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_chat_response(message, lang, conversation_history):
    """
    Generate a response to the user's message
    """
    # If the language isn't supported, default to English
    if lang not in CHAT_RESPONSES:
        lang = 'en'
    
    # For now, just return a random response from our predefined list
    # In a real implementation, this would be where you'd call a language model
    return random.choice(CHAT_RESPONSES[lang])

# Create a simple HTML template for the chat interface
@app.route('/api/create_template', methods=['GET'])
def create_template():
    """
    Create the HTML template for the chat interface
    """
    template_path = os.path.join(os.path.dirname(__file__), 'templates', 'index.html')
    
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Language Chat</title>
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h1>AI Language Assistant</h1>
            <div class="language-selector">
                <label for="chat-language">Chat Language:</label>
                <select id="chat-language">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="te">Telugu</option>
                </select>
            </div>
        </div>
        <div class="chat-messages" id="chat-messages">
            <div class="message bot-message">
                <div class="message-content">Hello! How can I help you today?</div>
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="user-message" placeholder="Type your message...">
            <button id="send-btn">Send</button>
        </div>
        <div class="translation-option">
            <label>
                <input type="checkbox" id="auto-translate"> Auto-translate responses to my language
            </label>
        </div>
    </div>
    
    <script src="/static/chat.js"></script>
</body>
</html>
    """
    
    # Create the template file
    with open(template_path, 'w') as f:
        f.write(html_content)
    
    # Create CSS file
    css_path = os.path.join(os.path.dirname(__file__), 'static', 'style.css')
    css_content = """
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

body {
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.chat-container {
    width: 80%;
    max-width: 800px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 80vh;
}

.chat-header {
    background-color: #4a6fa5;
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header h1 {
    font-size: 1.5rem;
}

.language-selector {
    display: flex;
    align-items: center;
}

.language-selector label {
    margin-right: 10px;
    font-size: 0.9rem;
}

.language-selector select {
    padding: 5px;
    border-radius: 5px;
    border: none;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.message {
    max-width: 70%;
    margin-bottom: 15px;
    padding: 10px 15px;
    border-radius: 15px;
    word-wrap: break-word;
}

.user-message {
    align-self: flex-end;
    background-color: #4a6fa5;
    color: white;
    border-bottom-right-radius: 5px;
}

.bot-message {
    align-self: flex-start;
    background-color: #e9e9eb;
    color: #333;
    border-bottom-left-radius: 5px;
}

.message-content {
    font-size: 1rem;
}

.chat-input-area {
    display: flex;
    padding: 15px;
    border-top: 1px solid #e9e9eb;
}

#user-message {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 30px;
    font-size: 1rem;
    outline: none;
}

#send-btn {
    margin-left: 10px;
    padding: 10px 20px;
    background-color: #4a6fa5;
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

#send-btn:hover {
    background-color: #3a5a8c;
}

.translation-option {
    padding: 10px 15px;
    border-top: 1px solid #e9e9eb;
    font-size: 0.9rem;
    color: #666;
}

/* Add typing indicator */
.typing-indicator {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background-color: #e9e9eb;
    border-radius: 15px;
    border-bottom-left-radius: 5px;
    align-self: flex-start;
    margin-bottom: 15px;
}

.typing-indicator span {
    height: 8px;
    width: 8px;
    background-color: #666;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
    margin-right: 0;
}

@keyframes typing {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
    100% {
        transform: translateY(0);
    }
}
    """
    
    with open(css_path, 'w') as f:
        f.write(css_content)
    
    # Create JavaScript file
    js_path = os.path.join(os.path.dirname(__file__), 'static', 'chat.js')
    js_content = """
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendBtn = document.getElementById('send-btn');
    const languageSelector = document.getElementById('chat-language');
    const autoTranslateCheckbox = document.getElementById('auto-translate');
    
    // Generate a unique session ID
    const sessionId = 'session_' + Date.now();
    
    // Function to add a message to the chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            indicator.appendChild(dot);
        }
        
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to hide typing indicator
    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Function to send a message to the server
    function sendMessage() {
        const message = userMessageInput.value.trim();
        if (!message) return;
        
        // Add the user's message to the chat
        addMessage(message, true);
        
        // Clear the input field
        userMessageInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get the selected language
        const language = languageSelector.value;
        
        // Send the message to the server
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                session_id: sessionId,
                language: language
            })
        })
        .then(response => response.json())
        .then(data => {
            // Hide typing indicator
            hideTypingIndicator();
            
            if (data.error) {
                console.error('Error:', data.error);
                addMessage('Sorry, there was an error processing your message.');
                return;
            }
            
            let responseText = data.response;
            
            // If auto-translate is enabled and the language is not English,
            // translate the response to the selected language
            if (autoTranslateCheckbox.checked && language !== 'en') {
                // Show typing indicator again for translation
                showTypingIndicator();
                
                fetch('/api/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        q: responseText,
                        source: 'en',
                        target: language
                    })
                })
                .then(response => response.json())
                .then(translationData => {
                    hideTypingIndicator();
                    if (translationData.translatedText) {
                        addMessage(translationData.translatedText);
                    } else {
                        addMessage(responseText);
                    }
                })
                .catch(error => {
                    hideTypingIndicator();
                    console.error('Translation error:', error);
                    addMessage(responseText);
                });
            } else {
                addMessage(responseText);
            }
        })
        .catch(error => {
            hideTypingIndicator();
            console.error('Error:', error);
            addMessage('Sorry, there was an error communicating with the server.');
        });
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Update language when selector changes
    languageSelector.addEventListener('change', function() {
        // Maybe update something based on language change
    });
});
    """
    
    with open(js_path, 'w') as f:
        f.write(js_content)
    
    return jsonify({'message': 'Template files created successfully'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    
    # Create template files if they don't exist
    if not os.path.exists(os.path.join(os.path.dirname(__file__), 'templates', 'index.html')):
        create_template()
    
    # Use 0.0.0.0 to make the server externally visible
    app.run(host='0.0.0.0', port=port, debug=True) 