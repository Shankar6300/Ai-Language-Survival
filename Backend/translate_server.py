from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['GET'])
def home():
    """Return a simple welcome page"""
    return """
    <html>
        <head>
            <title>Translation API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #4a6fa5; }
                .endpoint { margin-bottom: 30px; }
                pre { background-color: #f5f5f5; padding: 10px; }
            </style>
        </head>
        <body>
            <h1>Translation API</h1>
            <p>Welcome to the Translation API. The following endpoints are available:</p>
            
            <div class="endpoint">
                <h2>Detect Language</h2>
                <p><strong>Endpoint:</strong> /api/detect</p>
                <p><strong>Method:</strong> POST</p>
                <p><strong>Example:</strong></p>
                <pre>
curl -X POST http://localhost:5000/api/detect \\
    -H "Content-Type: application/json" \\
    -d '{"q": "Hello, how are you?"}'
                </pre>
            </div>
            
            <div class="endpoint">
                <h2>Translate Text</h2>
                <p><strong>Endpoint:</strong> /api/translate</p>
                <p><strong>Method:</strong> POST</p>
                <p><strong>Example:</strong></p>
                <pre>
curl -X POST http://localhost:5000/api/translate \\
    -H "Content-Type: application/json" \\
    -d '{"q": "Hello, how are you?", "source": "en", "target": "es"}'
                </pre>
            </div>
            
            <div class="endpoint">
                <h2>Get Supported Languages</h2>
                <p><strong>Endpoint:</strong> /api/languages</p>
                <p><strong>Method:</strong> GET</p>
            </div>
        </body>
    </html>
    """

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # Use 0.0.0.0 to make the server externally visible
    app.run(host='0.0.0.0', port=port, debug=True) 