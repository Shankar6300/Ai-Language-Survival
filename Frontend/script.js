// Rotating quotes functionality
const quotes = [
    "Your intelligent companion for language learning and travel communication",
    "Break language barriers with confidence and ease",
    "Turn words into connections with our translation tools",
    "Speak the world's languages with a simple click",
    "Navigate global conversations like a local",
    "The perfect travel companion for your linguistic adventures",
    "Understand and be understood, no matter where you are",
    "Bridging cultures through better communication",
    "A world of languages in your pocket",
    "From hello to fluent - we're with you every step",
    "Never get lost in translation again",
    "One app, countless conversations across the globe",
    "Learn as you translate - improve your skills naturally",
    "Language is the road map of a culture - Rita Mae Brown",
    "To learn a language is to have one more window from which to look at the world",
    "The limits of my language are the limits of my world",
    "Language is the dress of thought",
    "Speak a new language so that the world will be a new world",
    "A different language is a different vision of life",
    "Language shapes the way we think and determines what we can think about",
    "He who knows no foreign language does not know his own",
    "Translation is not a matter of words only; it is a matter of making intelligible a whole culture",
    "Language is the archives of history"
];

// Global variables for translation interface elements
let userInput;
let translationResult;
let fromLanguageSelect;
let toLanguageSelect;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Initialize quote rotation on the home page
    if (document.getElementById('rotating-quote')) {
        console.log('Found rotating quote element, initializing rotation');
        initializeQuoteRotation();
    } else {
        console.log('No rotating quote element found');
    }
    
    // Check if we're on the translation page
    const isTranslatePage = document.getElementById('translate-btn') !== null;
    
    if (isTranslatePage) {
        initializeTranslationInterface();
    }
    
    // Check if we're on the profile page
    const isProfilePage = document.querySelector('.profile-card') !== null;
    
    if (isProfilePage) {
        console.log('Loading profile page data');
        initializeProfilePage();
    }
    
    // Handle login form submission
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
        console.log('Login form found, adding event listener');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            console.log('Login form submitted with username:', username);
            
            // For demo purposes, accept any login
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
    
    // Check if user is logged in
    // This is just a placeholder - in a real application, you'd check session status
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const username = localStorage.getItem('username') || 'Guest';
    
    console.log('Auth check - User logged in:', userLoggedIn, 'Username:', username);
    
    // Handle authentication UI elements
    const userGreeting = document.getElementById('user-greeting');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (userGreeting) {
        userGreeting.textContent = `Hello, ${username}`;
    }
    
    if (userLoggedIn) {
        console.log('User is logged in, updating UI');
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        console.log('User is not logged in, showing login button');
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
    
    // Handle logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logout clicked');
            
            // Clear authentication data
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userPicture');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
    
    // Initialize other functionality
});

// Initialize all translation interface components
function initializeTranslationInterface() {
    // DOM elements
    userInput = document.getElementById('user-input');
    translationResult = document.getElementById('translation-result');
    fromLanguageSelect = document.getElementById('from-language');
    toLanguageSelect = document.getElementById('to-language');
    const translateBtn = document.getElementById('translate-btn');
    const swapBtn = document.getElementById('swap-btn');
    const clearInputBtn = document.getElementById('clear-input-btn');
    const copyOutputBtn = document.getElementById('copy-output-btn');
    const listenOutputBtn = document.getElementById('listen-output-btn');
    const inputListenBtn = document.getElementById('input-listen-btn');
    const voiceInputBtn = document.getElementById('voice-input-btn');
    const phraseButtons = document.querySelectorAll('.phrase-btn');
    
    console.log('Translation interface initialized');

    // Event listeners for translation interface
    if (translateBtn) {
        translateBtn.addEventListener('click', translateText);
    }
    
    if (swapBtn) {
        swapBtn.addEventListener('click', function() {
            const fromValue = fromLanguageSelect.value;
            const toValue = toLanguageSelect.value;
            
            // Skip if auto-detect is selected to avoid confusion
            if (fromValue === 'auto') return;
            
            fromLanguageSelect.value = toValue;
            toLanguageSelect.value = fromValue;
            
            // Swap text content if there is any
            if (translationResult && userInput) {
                const tempText = userInput.value;
                userInput.value = translationResult.textContent;
                translationResult.textContent = tempText;
            }
        });
    }
    
    if (clearInputBtn && userInput) {
        clearInputBtn.addEventListener('click', function() {
            userInput.value = '';
            userInput.focus();
        });
    }
    
    if (copyOutputBtn && translationResult) {
        copyOutputBtn.addEventListener('click', function() {
            const textToCopy = translationResult.textContent;
            navigator.clipboard.writeText(textToCopy).then(function() {
                showFeedback('Copied to clipboard');
            }, function() {
                showFeedback('Failed to copy text');
            });
        });
    }
    
    if (listenOutputBtn && translationResult) {
        listenOutputBtn.addEventListener('click', function() {
            const textToSpeak = translationResult.textContent;
            if (textToSpeak && textToSpeak.trim() !== '') {
                speakText(textToSpeak, toLanguageSelect.value);
            } else {
                showFeedback('No text to speak');
            }
        });
    }
    
    // Input text-to-speech button
    if (inputListenBtn && userInput) {
        inputListenBtn.addEventListener('click', function() {
            const textToSpeak = userInput.value;
            if (textToSpeak && textToSpeak.trim() !== '') {
                speakText(textToSpeak, fromLanguageSelect.value === 'auto' ? 'en' : fromLanguageSelect.value);
            } else {
                showFeedback('No text to speak');
            }
        });
    }
    
    // Voice input button
    if (voiceInputBtn) {
        initializeSpeechRecognition(voiceInputBtn, userInput, fromLanguageSelect);
    }
    
    // Handle phrase buttons
    if (phraseButtons.length > 0) {
        phraseButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (userInput) {
                    userInput.value = this.textContent;
                    // Auto-translate when a phrase is selected
                    if (translateBtn) {
                        translateBtn.click();
                    }
                }
            });
        });
    }
    
    // Handle phrase category selection
    const phraseCategory = document.getElementById('phrase-category');
    if (phraseCategory) {
        phraseCategory.addEventListener('change', function() {
            const selectedCategory = this.value;
            document.querySelectorAll('.phrase-group').forEach(group => {
                group.style.display = 'none';
            });
            const selectedGroup = document.getElementById(`${selectedCategory}-phrases`);
            if (selectedGroup) {
                selectedGroup.style.display = 'block';
            }
        });
    }
}

function initializeQuoteRotation() {
    const quoteElement = document.getElementById('rotating-quote');
    let currentQuoteIndex = 0;
    
    // Set initial quote
    if (quoteElement) {
        quoteElement.textContent = quotes[currentQuoteIndex];
        
        // Set up the rotation with a fixed interval of 10 seconds
        setInterval(() => {
            // Change to the next quote
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            
            // Fade out
            quoteElement.style.opacity = 0;
            
            // Wait for fade out, then change text and fade back in
            setTimeout(() => {
                quoteElement.textContent = quotes[currentQuoteIndex];
                quoteElement.style.opacity = 1;
            }, 500);
            
        }, 10000); // Change every 10 seconds
    }
}

// Google Sign-In Callback Functions
function handleGoogleSignIn(response) {
    // Decode the JWT token to extract profile information
    const responsePayload = decodeJwtResponse(response.credential);
    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    // Store user info in localStorage (for demo purposes)
    // In a real app, you would send this to your server for verification
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('username', responsePayload.name);
    localStorage.setItem('userEmail', responsePayload.email);
    localStorage.setItem('userPicture', responsePayload.picture);
    
    // Redirect to home page
    window.location.href = 'index.html';
}

function handleGoogleSignUp(response) {
    // For the demo, we'll use the same handler for both sign-in and sign-up
    handleGoogleSignIn(response);
}

// Helper function to decode the JWT token
function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
}

// Add hardcoded translations for common Telugu phrases with high-quality translations
const TELUGU_TRANSLATIONS = {
    'నీ పేరు ఏమిటి': 'What is your name?',
    'నా పేరు': 'My name is',
    'మీరు ఎలా ఉన్నారు': 'How are you?',
    'నేను బాగున్నాను': 'I am fine',
    'నమస్కారం': 'Hello',
    'ధన్యవాదాలు': 'Thank you',
    'క్షమించండి': 'Sorry',
    'దయచేసి': 'Please',
    'అవును': 'Yes',
    'కాదు': 'No',
    'శుభోదయం': 'Good morning',
    'శుభ సాయంత్రం': 'Good evening',
    'శుభరాత్రి': 'Good night',
    'రేపు కలుద్దాం': 'See you tomorrow',
    'ఇది ఎంత': 'How much is this?',
    'నాకు తెలుగు వచ్చు': 'I know Telugu',
    'నాకు తెలుగు రాదు': 'I don\'t know Telugu',
    'మళ్ళీ చెప్పండి': 'Please say that again',
    'నేను అర్థం చేసుకోలేదు': 'I didn\'t understand',
    'నాకు సహాయం కావాలి': 'I need help',
    'ఎక్కడ': 'Where',
    'ఎప్పుడు': 'When',
    'ఎందుకు': 'Why',
    'ఎలా': 'How',
    'ఎవరు': 'Who',
    'ఏ కోరికా ఎలా ఉన్నావి': 'How are you feeling?',
    'ఏ కోరిక ఎలా ఉన్నావి': 'How are you feeling?',
    'నేను కోరికా ఎలా ఉన్నావు': 'I am fine, how are you',
    'నేను కోరికా ఏలా ఉన్నావి': 'I am fine, how are you',
    'నేను బాగున్నాను, నువ్వు ఎలా ఉన్నావు': 'I am fine, how are you?'
};

// Add debug information display
function showDebugInfo(message) {
    console.log('Debug:', message);
    
    // Create or get the debug element
    let debugElement = document.getElementById('debug-info');
    
    if (!debugElement) {
        debugElement = document.createElement('div');
        debugElement.id = 'debug-info';
        debugElement.style.position = 'fixed';
        debugElement.style.bottom = '10px';
        debugElement.style.right = '10px';
        debugElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
        debugElement.style.color = 'white';
        debugElement.style.padding = '10px';
        debugElement.style.borderRadius = '5px';
        debugElement.style.maxWidth = '300px';
        debugElement.style.fontSize = '12px';
        debugElement.style.zIndex = '9999';
        document.body.appendChild(debugElement);
    }
    
    // Add the message with timestamp
    const timestamp = new Date().toLocaleTimeString();
    const msgElement = document.createElement('div');
    msgElement.textContent = `[${timestamp}] ${message}`;
    debugElement.appendChild(msgElement);
    
    // Keep only the last 5 messages
    while (debugElement.childElementCount > 5) {
        debugElement.removeChild(debugElement.firstChild);
    }
    
    // Auto-hide after 30 seconds
    setTimeout(() => {
        if (debugElement.contains(msgElement)) {
            debugElement.removeChild(msgElement);
        }
        
        // Remove the debug element if it's empty
        if (debugElement.childElementCount === 0 && document.body.contains(debugElement)) {
            document.body.removeChild(debugElement);
        }
    }, 30000);
}

// Update translateText function to show debug info
function translateText() {
    console.log('translateText function called');
    showDebugInfo('Translation requested');
    
    if (!userInput || !userInput.value.trim()) {
        console.log('No input text found or input is empty');
        showDebugInfo('No input text found');
        return;
    }
    
    // Get source and target languages
    const fromLanguage = fromLanguageSelect.value;
    const toLanguage = toLanguageSelect.value;
    console.log(`Translation requested from ${fromLanguage} to ${toLanguage}`);
    showDebugInfo(`Translating: ${fromLanguage} → ${toLanguage}`);
    
    // Show loading
    if (translationResult) {
        translationResult.textContent = "Translating...";
    } else {
        console.error('translationResult element not found');
        showDebugInfo('Error: Translation result element not found');
    }
    
    // Set a timeout to ensure we always get a response, even if APIs hang
    const fallbackTimer = setTimeout(() => {
        if (translationResult && translationResult.textContent === "Translating...") {
            console.log('Translation taking too long, using emergency fallback');
            showDebugInfo('Translation timeout - emergency fallback');
            const fallbackText = getFallbackTranslation(userInput.value, fromLanguage, toLanguage);
            translationResult.textContent = fallbackText + " (Emergency fallback)";
            showFeedback("Translation timeout - used fallback");
        }
    }, 15000); // 15 seconds timeout
    
    if (fromLanguage === 'auto') {
        console.log('Auto detection enabled, detecting language first');
        showDebugInfo('Auto-detecting language');
        // First detect the language
        detectLanguageAPI(userInput.value)
            .then(detectedLang => {
                console.log(`Language detected: ${detectedLang}`);
                showDebugInfo(`Detected: ${getLanguageName(detectedLang)}`);
                showFeedback(`Detected language: ${getLanguageName(detectedLang)}`);
                // Then translate with the detected language
                translateWithAPI(userInput.value, detectedLang, toLanguage);
            })
            .catch(error => {
                console.error('Language detection error:', error);
                showDebugInfo(`Detection error: ${error.message}`);
                if (translationResult) {
                    translationResult.textContent = "Error detecting language. Please try again.";
                }
                showFeedback("Error detecting language");
                
                // Try direct translation without detection
                console.log('Falling back to default language (English) for translation');
                showDebugInfo('Falling back to English as source');
                translateWithAPI(userInput.value, 'en', toLanguage);
            })
            .finally(() => {
                clearTimeout(fallbackTimer);
            });
    } else {
        console.log('Using specified source language, translating directly');
        // Translate directly with the selected source language
        translateWithAPI(userInput.value, fromLanguage, toLanguage)
            .then(result => {
                showDebugInfo('Translation completed successfully');
            })
            .catch(error => {
                console.error('Final translation error:', error);
                showDebugInfo(`Translation error: ${error.message}`);
                if (translationResult) {
                    const fallbackText = getFallbackTranslation(userInput.value, fromLanguage, toLanguage);
                    translationResult.textContent = fallbackText + " (Error fallback)";
                }
            })
            .finally(() => {
                clearTimeout(fallbackTimer);
            });
    }
}

// Add fallback translation for testing
function fallbackTranslation(text, fromLang, toLang) {
    console.log(`Fallback translation called for: "${text}" from ${fromLang} to ${toLang}`);
    
    if (translationResult) {
        // This is just a placeholder to verify translation functionality
        translationResult.textContent = `[Fallback] ${text} (${fromLang} → ${toLang})`;
        showFeedback("Translation completed (fallback)");
        return true;
    }
    return false;
}

// Modified translateWithAPI to return a proper Promise
function translateWithAPI(text, fromLang, toLang) {

    console.log(`translateWithAPI called with text: "${text}", from: ${fromLang}, to: ${toLang}`);

    return new Promise((resolve, reject) => {

        if (fromLang === toLang) {
            if (translationResult) {
                translationResult.textContent = text;
            }
            resolve(text);
            return;
        }

        const apiURL = "https://ai-language-survival.onrender.com/translate";

        fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                source: fromLang,
                target: toLang
            })
        })
        .then(response => {

            console.log("API status:", response.status);

            if (!response.ok) {
                throw new Error("Server error: " + response.status);
            }

            return response.json();
        })
        .then(data => {

            console.log("API response:", data);

            if (!data.translated_text) {
                throw new Error("Invalid response from backend");
            }

            const translatedText = data.translated_text;

            if (translationResult) {
                translationResult.textContent = translatedText;
            }

            showFeedback("Translation complete");
            resolve(translatedText);

        })
        .catch(error => {

            console.error("Translation error:", error);

            if (translationResult) {
                translationResult.textContent = "Translation failed";
            }

            showFeedback("Translation error");
            reject(error);
        });

    });
}

// Modify tryAlternateGoogleEndpoint to return a promise
function tryAlternateGoogleEndpoint(text, fromLang, toLang, forceTranslate = false) {
    console.log('Trying alternate Google Translate endpoint');
    
    return new Promise((resolve, reject) => {
        // Alternative endpoints with different parameters
        let altGoogleUrl;
        
        if (forceTranslate && fromLang === 'te') {
            // Special case for Telugu - try the official translate.google.com endpoint
            // with more parameters to force actual translation
            altGoogleUrl = `https://translate.googleapis.com/translate_a/t?client=gtx&sl=${fromLang}&tl=${toLang}&hl=en&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=bh&ssel=0&tsel=0&kc=1&q=${encodeURIComponent(text)}`;
        } else {
            altGoogleUrl = `https://translate.google.com/translate_a/single?client=at&dt=t&sl=${fromLang}&tl=${toLang}&q=${encodeURIComponent(text)}`;
        }
        
        fetch(altGoogleUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Alternate Google endpoint failed');
                }
                return response.json();
            })
           .then(data => {

    console.log("Backend response:", data);

    if (data.translated_text) {

        const translatedText = data.translated_text;

        if (translationResult) {
            translationResult.textContent = translatedText;
        }

        showFeedback("Translation complete");
        resolve(translatedText);

    } else {
        throw new Error("Invalid response from backend");
    }

})
                    
                    if (translationResult) {
                        translationResult.textContent = translatedText;
                        showFeedback("Translation complete (alternate API)");
                    }
                    resolve(translatedText);
                } else {
                    throw new Error('Invalid response from alternate endpoint');
                }
            })
            .catch(error => {
                console.error('Alternate endpoint error:', error);
                
                // Try MyMemory API as another fallback
                translateWithMyMemory(text, fromLang, toLang)
                    .then(resolve)
                    .catch(reject);
            });
    });
}

// Language detection with improved multi-API approach
function detectLanguageAPI(text) {
    // Show loading state
    showFeedback("Detecting language...");
    
    // Do quick script analysis for languages with distinctive scripts
    if (text && text.length > 2) {
        // Check for script-specific characters
        if (/[\u0C00-\u0C7F]/.test(text)) return Promise.resolve('te'); // Telugu
        if (/[\u0900-\u097F]/.test(text)) return Promise.resolve('hi'); // Hindi
        if (/[\u0600-\u06FF]/.test(text)) return Promise.resolve('ar'); // Arabic
        if (/[\u0400-\u04FF]/.test(text)) return Promise.resolve('ru'); // Cyrillic (Russian)
        if (/[\u3040-\u309F]/.test(text)) return Promise.resolve('ja'); // Hiragana
        if (/[\u30A0-\u30FF]/.test(text)) return Promise.resolve('ja'); // Katakana
        if (/[\u4E00-\u9FFF]/.test(text)) {
            // Chinese characters are used in multiple languages
            // This is a simplified approach - in reality would need more analysis
            return Promise.resolve('zh');
        }
        if (/[\uAC00-\uD7AF]/.test(text)) return Promise.resolve('ko'); // Korean
    }
    
    // Try Google Translate for language detection
    const googleApiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=auto&tl=en&q=${encodeURIComponent(text)}`;
    
    return fetch(googleApiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Google API network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data && data[2]) {
                const detectedLang = data[2];
                console.log('Google API detected language:', detectedLang);
                return detectedLang;
            } else {
                throw new Error('Could not detect language with Google API');
            }
        })
        .catch(error => {
            console.error('Google language detection error:', error);
            return detectWithMyMemory(text);
        });
}

// Fallback language detection with MyMemory
function detectWithMyMemory(text) {
    console.log('Falling back to MyMemory for language detection');
    // Use MyMemory API for language detection
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`;
    
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // The detected language will be in the response data
            if (data && data.responseData && data.responseData.detectedLanguage) {
                const detectedLang = data.responseData.detectedLanguage.match(/^([a-z]{2})/i)?.[1]?.toLowerCase() || 'en';
                console.log('MyMemory detected language:', detectedLang);
                return detectedLang;
            } else {
                console.error('Language detection failed, defaulting to English');
                return 'en'; // Default to English if detection fails
            }
        })
        .catch(error => {
            console.error('MyMemory language detection error:', error);
            return 'en'; // Default to English on error
        });
}

// Language name mapping
function getLanguageName(code) {
    const languages = {
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
        'te': 'Telugu',
        // Additional languages
        'bn': 'Bengali',
        'uk': 'Ukrainian',
        'pl': 'Polish',
        'vi': 'Vietnamese',
        'th': 'Thai',
        'id': 'Indonesian',
        'ms': 'Malay',
        'ta': 'Tamil',
        'ur': 'Urdu',
        'fa': 'Persian',
        'he': 'Hebrew',
        'el': 'Greek',
        'fi': 'Finnish',
        'da': 'Danish',
        'no': 'Norwegian',
        'hu': 'Hungarian',
        'cs': 'Czech',
        'ro': 'Romanian',
        'bg': 'Bulgarian',
        'hr': 'Croatian',
        'sk': 'Slovak',
        'sl': 'Slovenian',
        'lt': 'Lithuanian',
        'lv': 'Latvian',
        'et': 'Estonian',
        'is': 'Icelandic',
        'ga': 'Irish',
        'mt': 'Maltese',
        'cy': 'Welsh',
        'ka': 'Georgian',
        'hy': 'Armenian',
        'kk': 'Kazakh',
        'uz': 'Uzbek',
        'az': 'Azerbaijani',
        'be': 'Belarusian',
        'mk': 'Macedonian',
        'mn': 'Mongolian',
        'ne': 'Nepali',
        'si': 'Sinhala',
        'km': 'Khmer',
        'lo': 'Lao',
        'my': 'Burmese',
        'jv': 'Javanese'
    };
    
    return languages[code] || code;
}

// Helper function to detect Telugu text
function isTeluguText(text) {
    // Telugu Unicode range: 0C00-0C7F
    const teluguPattern = /[\u0C00-\u0C7F]/;
    return teluguPattern.test(text);
}

// Translation with MyMemory API (fallback)
function translateWithMyMemory(text, fromLang, toLang) {
    console.log('Falling back to MyMemory API for translation');
    
    return new Promise((resolve, reject) => {
        // Use MyMemory API for translation
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
        
        console.log('Fetching translation from MyMemory API URL:', apiUrl);
        
        fetch(apiUrl)
            .then(response => {
                console.log('MyMemory API response status:', response.status);
                if (!response.ok) {
                    throw new Error('MyMemory Translation API response was not ok: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('MyMemory Translation API response data:', data);
                
                if (data && data.responseData && data.responseData.translatedText) {
                    const translatedText = data.responseData.translatedText;
                    console.log('Extracted translated text from MyMemory:', translatedText);
                    
                    if (translationResult) {
                        translationResult.textContent = translatedText;
                    } else {
                        console.error('Translation result element not found');
                    }
                    
                    showFeedback("Translation complete (MyMemory API)");
                    resolve(translatedText);
                } else {
                    throw new Error('Invalid MyMemory translation response format');
                }
            })
            .catch(error => {
                console.error('MyMemory Translation error:', error);
                
                // Final fallback to our simulation if all APIs fail
                if (translationResult) {
                    translationResult.textContent = "API error. Falling back to simulated translation...";
                    
                    setTimeout(() => {
                        const fallbackTranslation = getFallbackTranslation(text, fromLang, toLang);
                        translationResult.textContent = fallbackTranslation;
                        console.log('Using fallback translation:', fallbackTranslation);
                        resolve(fallbackTranslation); // Resolve the promise with the fallback translation
                    }, 500);
                } else {
                    reject(error);
                }
                
                showFeedback("Translation API error. Using fallback method.");
            });
    });
}

// Keep the original function as a fallback
function getFallbackTranslation(userMessage, fromLang, toLang) {
    // If source and target are the same, return the original
    if (fromLang === toLang) {
        return userMessage;
    }
    
    // Special handling for Telugu to English
    if (fromLang === 'te' && toLang === 'en' && isTeluguText(userMessage)) {
        // Try to find a match using our expanded dictionary function
        const teluguMatch = findTeluguMatch(userMessage);
        if (teluguMatch) {
            console.log(`Fallback found Telugu match: "${userMessage}" → "${teluguMatch}"`);
            return teluguMatch;
        }
        
        // If we didn't find a match, provide a more helpful message
        return "Telugu text: \"" + userMessage + "\"";
    }
    
    // Common translations for demonstration
    const translations = {
        'en-es': {
            'Hello, how are you?': '¡Hola! ¿Cómo estás?',
            'Good morning': 'Buenos días',
            'Nice to meet you': 'Encantado de conocerte',
            "How's your day going?": '¿Cómo va tu día?',
            'Goodbye': 'Adiós',
            'Where is the train station?': '¿Dónde está la estación de tren?',
            'How much is a ticket to...?': '¿Cuánto cuesta un boleto para...?',
            'Can you call me a taxi?': '¿Puede llamarme un taxi?',
            'Is this the right way to...?': '¿Es este el camino correcto para...?',
            'What time does the bus arrive?': '¿A qué hora llega el autobús?',
            'A table for two, please': 'Una mesa para dos, por favor',
            'Can I see the menu?': '¿Puedo ver el menú?',
            "I'm vegetarian": 'Soy vegetariano',
            'The check, please': 'La cuenta, por favor',
            'This is delicious!': '¡Esto está delicioso!',
            'I need help!': '¡Necesito ayuda!',
            'Call a doctor, please': 'Llame a un médico, por favor',
            'Where is the nearest hospital?': '¿Dónde está el hospital más cercano?',
            "I'm lost": 'Estoy perdido',
            "I've lost my passport": 'He perdido mi pasaporte',
            'How much does this cost?': '¿Cuánto cuesta esto?',
            'Do you have this in another size?': '¿Tiene esto en otra talla?',
            "I'm just looking, thanks": 'Solo estoy mirando, gracias',
            'Do you accept credit cards?': '¿Aceptan tarjetas de crédito?',
            "That's too expensive": 'Eso es demasiado caro'
        },
        'en-fr': {
            'Hello, how are you?': 'Bonjour, comment allez-vous?',
            'Good morning': 'Bonjour',
            'Nice to meet you': 'Enchanté de faire votre connaissance',
            "How's your day going?": 'Comment se passe votre journée?',
            'Goodbye': 'Au revoir',
            'Where is the train station?': 'Où est la gare?',
            'How much is a ticket to...?': 'Combien coûte un billet pour...?',
            'Can you call me a taxi?': 'Pouvez-vous m\'appeler un taxi?',
            'Is this the right way to...?': 'Est-ce le bon chemin pour...?',
            'What time does the bus arrive?': 'À quelle heure arrive le bus?',
            'I need help!': "J'ai besoin d'aide!",
            'Thank you': 'Merci'
        },
        'en-te': {
            'Hello, how are you?': 'నమస్కారం, మీరు ఎలా ఉన్నారు?',
            'Good morning': 'శుభోదయం',
            'Nice to meet you': 'మిమ్మల్ని కలవడం చాలా సంతోషంగా ఉంది',
            "How's your day going?": 'మీ రోజు ఎలా గడుస్తుంది?',
            'Goodbye': 'వీడ్కోలు',
            'Where is the train station?': 'రైలు స్టేషన్ ఎక్కడ ఉంది?',
            'How much is a ticket to...?': '...కి టికెట్ ఎంత?',
            'Can you call me a taxi?': 'నాకు టాక్సీ పిలవగలరా?',
            'Is this the right way to...?': 'ఇది...కి సరైన మార్గమా?',
            'What time does the bus arrive?': 'బస్సు ఎప్పుడు చేరుకుంటుంది?',
            'A table for two, please': 'దయచేసి ఇద్దరికి ఒక టేబుల్',
            'Can I see the menu?': 'నేను మెనూ చూడవచ్చా?',
            "I'm vegetarian": 'నేను శాకాహారి',
            'I need help!': 'నాకు సహాయం కావాలి!',
            'Thank you': 'ధన్యవాదాలు'
        },
        'te-en': {
            'నమస్కారం': 'Hello',
            'నీ పేరు ఏమిటి': 'What is your name',
            'నా పేరు': 'My name is',
            'మీరు ఎలా ఉన్నారు': 'How are you',
            'నేను బాగున్నాను': 'I am fine',
            'ధన్యవాదాలు': 'Thank you',
            'క్షమించండి': 'Sorry',
            'దయచేసి': 'Please',
            'అవును': 'Yes',
            'కాదు': 'No',
            'శుభోదయం': 'Good morning',
            'శుభ సాయంత్రం': 'Good evening',
            'శుభరాత్రి': 'Good night',
            'నేను కోరికా ఎలా ఉన్నావు': 'I am fine, how are you'
        }
    };
    
    // For Telugu translations, augment the standard dictionary with our expanded phrases
    if (fromLang === 'te' && toLang === 'en') {
        translations['te-en'] = {...translations['te-en'], ...EXPANDED_TELUGU_PHRASES};
    }
    
    // Try to find a direct translation
    const translationKey = `${fromLang}-${toLang}`;
    if (translations[translationKey] && translations[translationKey][userMessage]) {
        return translations[translationKey][userMessage];
    }
    
    // For messages we don't have translations for, generate a plausible response
    let responsePrefix = "";
    switch (toLang) {
        case 'es': 
            responsePrefix = "En español: ";
            break;
        case 'fr':
            responsePrefix = "En français: ";
            break;
        case 'de':
            responsePrefix = "Auf Deutsch: ";
            break;
        case 'it':
            responsePrefix = "In italiano: ";
            break;
        case 'ja':
            responsePrefix = "日本語で: ";
            break;
        case 'zh':
            responsePrefix = "用中文: ";
            break;
        case 'te':
            responsePrefix = "తెలుగులో: ";
            break;
        default:
            responsePrefix = ``;
    }
    
    // Simulate a translation by adding some characteristics of the target language
    let simulatedTranslation = userMessage;
    
    // Add language-specific modifications to simulate translation
    switch (toLang) {
        case 'es':
            simulatedTranslation = simulatedTranslation.replace(/Hello|Hi/gi, '¡Hola!')
                .replace(/thank you/gi, 'gracias')
                .replace(/please/gi, 'por favor')
                .replace(/good/gi, 'bueno')
                .replace(/the /gi, 'el ');
            break;
        case 'fr':
            simulatedTranslation = simulatedTranslation.replace(/Hello|Hi/gi, 'Bonjour')
                .replace(/thank you/gi, 'merci')
                .replace(/please/gi, 's\'il vous plaît')
                .replace(/good/gi, 'bon')
                .replace(/the /gi, 'le ');
            break;
        case 'te':
            simulatedTranslation = simulatedTranslation.replace(/Hello|Hi/gi, 'నమస్కారం')
                .replace(/thank you/gi, 'ధన్యవాదాలు')
                .replace(/please/gi, 'దయచేసి')
                .replace(/good/gi, 'మంచి')
                .replace(/the /gi, 'ది ');
            break;
        // Add more languages as needed
    }
    
    return simulatedTranslation !== userMessage ? 
        simulatedTranslation : 
        (responsePrefix + userMessage);
}

function speakText(text, languageCode) {
    if (!('speechSynthesis' in window)) {
        showFeedback('Text-to-speech not supported in this browser');
        return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language code to BCP 47 language tag
    const langMap = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'it': 'it-IT',
        'ja': 'ja-JP',
        'zh': 'zh-CN',
        'ru': 'ru-RU',
        'pt': 'pt-BR',
        'ar': 'ar-SA',
        'hi': 'hi-IN',
        'ko': 'ko-KR',
        'nl': 'nl-NL',
        'sv': 'sv-SE',
        'tr': 'tr-TR',
        'te': 'te-IN',
        // Additional languages
        'bn': 'bn-IN',
        'uk': 'uk-UA',
        'pl': 'pl-PL',
        'vi': 'vi-VN',
        'th': 'th-TH',
        'id': 'id-ID',
        'ms': 'ms-MY',
        'ta': 'ta-IN',
        'ur': 'ur-PK',
        'fa': 'fa-IR',
        'he': 'he-IL',
        'el': 'el-GR',
        'fi': 'fi-FI',
        'da': 'da-DK',
        'no': 'no-NO',
        'hu': 'hu-HU',
        'cs': 'cs-CZ',
        'ro': 'ro-RO',
        'bg': 'bg-BG',
        'hr': 'hr-HR',
        'sk': 'sk-SK',
        'sl': 'sl-SI',
        'lt': 'lt-LT',
        'lv': 'lv-LV',
        'et': 'et-EE'
    };
    
    utterance.lang = langMap[languageCode] || 'en-US';
    
    // Get the button that triggered the speech
    const speakButton = event && event.target ? 
        (event.target.closest('button') || document.querySelector('#listen-output-btn') || document.querySelector('#input-listen-btn')) 
        : document.querySelector('#listen-output-btn');
    
    // Add speaking class to show animation
    if (speakButton) {
        speakButton.classList.add('speaking');
    }
    
    // Attempt to get the best voice for this language
    setTimeout(() => {
        try {
            // Get all available voices
            const voices = window.speechSynthesis.getVoices();
            
            if (voices.length > 0) {
                console.log(`Found ${voices.length} voices available`);
                
                // Try to find a voice that matches the language code
                const voice = voices.find(v => v.lang.startsWith(langMap[languageCode])) || 
                             voices.find(v => v.lang.startsWith(languageCode)) ||
                             voices.find(v => !v.lang.startsWith('en')); // Fallback to any non-English voice
                
                if (voice) {
                    console.log(`Using voice: ${voice.name} (${voice.lang})`);
                    utterance.voice = voice;
                }
            }
            
            // Add event listeners for when speech starts/ends
            utterance.onstart = function() {
                showFeedback('Playing audio...');
            };
            
            utterance.onend = function() {
                showFeedback('Audio complete');
                // Remove speaking class when done
                if (speakButton) {
                    speakButton.classList.remove('speaking');
                }
            };
            
            utterance.onerror = function() {
                showFeedback('Error playing audio');
                // Remove speaking class on error
                if (speakButton) {
                    speakButton.classList.remove('speaking');
                }
            };
            
            // Speak the text
            window.speechSynthesis.speak(utterance);
            showFeedback('Playing audio...');
        } catch (e) {
            console.error('Error setting voice:', e);
            // Still try to speak with default voice
            window.speechSynthesis.speak(utterance);
            showFeedback('Playing audio (default voice)...');
        }
    }, 100); // Short delay to ensure voices are loaded
}

function showFeedback(message) {
    console.log('Feedback:', message);
    if (window.feedbackElement) {
        window.feedbackElement.textContent = message;
        window.feedbackElement.classList.add('active');
        
        // Hide the feedback after 3 seconds
        setTimeout(() => {
            window.feedbackElement.classList.remove('active');
        }, 3000);
    } else {
        console.error('Feedback element not found');
    }
}

// Add a transliteration function to convert romanized text to native script
function transliterateToNativeScript(text, langCode) {
    // Only process if we have text and it's not English
    if (!text || !langCode || langCode === 'en') return text;
    
    // Skip transliteration if text already contains native script characters
    if (isInNativeScript(text, langCode)) {
        console.log(`Text already in ${langCode} script, skipping transliteration`);
        return text;
    }
    
    console.log(`Attempting to transliterate "${text}" to ${langCode} script`);
    
    // Specialized transliteration for supported languages
    switch (langCode) {
        case 'te':
            return transliterateToTelugu(text);
        case 'hi':
            return transliterateToHindi(text);
        case 'ru':
            return transliterateToRussian(text);
        case 'ar':
            return transliterateToArabic(text);
        default:
            console.log(`No specialized transliteration available for ${langCode}`);
            return text;
    }
}

// Check if text is already in the native script for the given language
function isInNativeScript(text, langCode) {
    if (!text || text.length === 0) return false;
    
    // Define Unicode ranges for different scripts
    const scriptRanges = {
        'te': /[\u0C00-\u0C7F]/,   // Telugu
        'hi': /[\u0900-\u097F]/,   // Hindi/Devanagari
        'ru': /[\u0400-\u04FF]/,   // Cyrillic
        'ar': /[\u0600-\u06FF]/,   // Arabic
        'ja': /[\u3040-\u30FF]/,   // Japanese (Hiragana & Katakana)
        'zh': /[\u4E00-\u9FFF]/,   // Chinese
        'ko': /[\uAC00-\uD7AF]/    // Korean
    };
    
    // If we have a range for this language, check if at least some characters fall in it
    if (scriptRanges[langCode]) {
        return scriptRanges[langCode].test(text);
    }
    
    // Default for unsupported languages - assume Latin script
    return false;
}

// Telugu-specific transliteration
function transliterateToTelugu(text) {
    // Map of common Telugu transliterations
    const teluguMap = {
        'a': 'అ', 'aa': 'ఆ', 'i': 'ఇ', 'ee': 'ఈ', 'u': 'ఉ', 'oo': 'ఊ',
        'e': 'ఎ', 'ae': 'ఏ', 'ai': 'ఐ', 'o': 'ఒ', 'oa': 'ఓ', 'au': 'ఔ',
        'am': 'అం', 'aha': 'అః',
        'ka': 'క', 'kha': 'ఖ', 'ga': 'గ', 'gha': 'ఘ', 'nga': 'ఙ',
        'ca': 'చ', 'cha': 'ఛ', 'ja': 'జ', 'jha': 'ఝ', 'nya': 'ఞ',
        'ta': 'ట', 'tha': 'ఠ', 'da': 'డ', 'dha': 'ఢ', 'na': 'న',
        'tha': 'త', 'thha': 'థ', 'dha': 'ద', 'dhha': 'ధ', 'na': 'న',
        'pa': 'ప', 'pha': 'ఫ', 'ba': 'బ', 'bha': 'భ', 'ma': 'మ',
        'ya': 'య', 'ra': 'ర', 'la': 'ల', 'va': 'వ', 'sa': 'స', 'sha': 'శ', 'sha': 'ష', 'ha': 'హ',
        // Common Telugu words
        'nee': 'నీ', 'peru': 'పేరు', 'emiti': 'ఏమిటి',
        'namaskaram': 'నమస్కారం', 'dhanyavadalu': 'ధన్యవాదాలు',
        'ela': 'ఎలా', 'unnaru': 'ఉన్నారు',
        'meeru': 'మీరు', 'nenu': 'నేను', 'emi': 'ఏమి',
        'naaku': 'నాకు', 'kaavali': 'కావాలి',
        'manchidi': 'మంచిది', 'bagunnara': 'బాగున్నారా',
        'telugu': 'తెలుగు', 'bhasha': 'భాష'
    };
    
    // Process the text for Telugu transliteration
    // First try to match common phrases/words
    let processedText = text.toLowerCase();
    
    // Try to match full words first
    const words = processedText.split(/\s+/);
    const transliteratedWords = words.map(word => {
        // Check if we have this exact word in our map
        if (teluguMap[word]) {
            return teluguMap[word];
        }
        return word;
    });
    
    // If we have translated at least some words, return the result
    if (transliteratedWords.some(word => /[\u0C00-\u0C7F]/.test(word))) {
        return transliteratedWords.join(' ');
    }
    
    // For recognized transliterations from voice input
    if (text.includes('Nee Peru emiti')) {
        return 'నీ పేరు ఏమిటి';
    }
    if (text.includes('Mere Ela unnaru')) {
        return 'మీరు ఎలా ఉన్నారు';
    }
    
    // Return original if no transliteration was possible
    console.log('Could not transliterate text to Telugu script');
    return text;
}

// Hindi transliteration
function transliterateToHindi(text) {
    // Map of common Hindi transliterations
    const hindiMap = {
        'namaste': 'नमस्ते', 'namaskar': 'नमस्कार',
        'dhanyavaad': 'धन्यवाद', 'shukriya': 'शुक्रिया',
        'kya': 'क्या', 'hai': 'है', 'aap': 'आप', 'tum': 'तुम',
        'kaise': 'कैसे', 'ho': 'हो', 'main': 'मैं', 'hoon': 'हूँ',
        'accha': 'अच्छा', 'theek': 'ठीक',
        'haan': 'हाँ', 'nahi': 'नहीं',
        'naam': 'नाम', 'kya hai': 'क्या है',
        'khana': 'खाना', 'pani': 'पानी', 'chai': 'चाय',
        'subh': 'शुभ', 'prabhat': 'प्रभात', 'ratri': 'रात्रि',
        'shubh': 'शुभ', 'din': 'दिन', 'raat': 'रात'
    };
    
    // Try to match full words first
    const words = text.toLowerCase().split(/\s+/);
    const transliteratedWords = words.map(word => {
        if (hindiMap[word]) {
            return hindiMap[word];
        }
        
        // Try common phrases
        for (let i = 0; i < words.length - 1; i++) {
            const phrase = words.slice(i, i + 2).join(' ');
            if (hindiMap[phrase]) {
                return hindiMap[phrase];
            }
        }
        
        return word;
    });
    
    // If we have translated at least some words, return the result
    if (transliteratedWords.some(word => /[\u0900-\u097F]/.test(word))) {
        return transliteratedWords.join(' ');
    }
    
    // For recognized specific phrases
    if (text.includes('Aap kaise hain')) {
        return 'आप कैसे हैं';
    }
    if (text.includes('Mera naam')) {
        return text.replace('Mera naam', 'मेरा नाम');
    }
    
    return text;
}

// Russian transliteration
function transliterateToRussian(text) {
    const russianMap = {
        'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'yo': 'ё',
        'zh': 'ж', 'z': 'з', 'i': 'и', 'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м',
        'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
        'f': 'ф', 'kh': 'х', 'ts': 'ц', 'ch': 'ч', 'sh': 'ш', 'shch': 'щ',
        'ie': 'ъ', 'y': 'ы', 'soft': 'ь', 'e': 'э', 'yu': 'ю', 'ya': 'я',
        // Common Russian words
        'privet': 'привет', 'zdravstvuyte': 'здравствуйте',
        'spasibo': 'спасибо', 'pozhaluysta': 'пожалуйста', 
        'da': 'да', 'net': 'нет', 'khorosho': 'хорошо',
        'kak dela': 'как дела', 'menya zovut': 'меня зовут'
    };
    
    // Simple word-level transliteration
    const words = text.toLowerCase().split(/\s+/);
    const transliteratedWords = words.map(word => {
        if (russianMap[word]) {
            return russianMap[word];
        }
        return word;
    });
    
    // Process multi-word phrases
    if (text.includes('kak dela')) {
        return text.replace('kak dela', 'как дела');
    }
    if (text.includes('menya zovut')) {
        return text.replace('menya zovut', 'меня зовут');
    }
    
    // If we have translated at least some words, return the result
    if (transliteratedWords.some(word => /[\u0400-\u04FF]/.test(word))) {
        return transliteratedWords.join(' ');
    }
    
    return text;
}

// Arabic transliteration
function transliterateToArabic(text) {
    const arabicMap = {
        'salam': 'سلام', 'marhaba': 'مرحبا',
        'shukran': 'شكرا', 'afwan': 'عفوا',
        'na\'am': 'نعم', 'la': 'لا',
        'kaifa haluka': 'كيف حالك', 'ana': 'أنا',
        'ismi': 'اسمي', 'ma ismuka': 'ما اسمك',
        'sabah': 'صباح', 'al-khair': 'الخير',
        'masa': 'مساء', 'al-noor': 'النور'
    };
    
    // Simple word-level transliteration
    const words = text.toLowerCase().split(/\s+/);
    const transliteratedWords = words.map(word => {
        if (arabicMap[word]) {
            return arabicMap[word];
        }
        return word;
    });
    
    // Process common phrases
    if (text.toLowerCase().includes('as-salamu alaykum')) {
        return 'السلام عليكم';
    }
    if (text.toLowerCase().includes('ma ismuka')) {
        return 'ما اسمك';
    }
    
    // If we have translated at least some words, return the result
    if (transliteratedWords.some(word => /[\u0600-\u06FF]/.test(word))) {
        return transliteratedWords.join(' ');
    }
    
    return text;
}

// Initialize speech recognition for voice input
function initializeSpeechRecognition(voiceBtn, userInput, fromLanguageSelect) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser');
        voiceBtn.style.display = 'none';
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; // Default language
    recognition.interimResults = true; // Get interim results
    recognition.maxAlternatives = 1;
    
    // Update recognition language based on from-language selection
    if (fromLanguageSelect) {
        fromLanguageSelect.addEventListener('change', function() {
            // Map language code to appropriate speech recognition locale
            const langMap = {
                'en': 'en-US',
                'es': 'es-ES',
                'fr': 'fr-FR',
                'de': 'de-DE',
                'it': 'it-IT',
                'ja': 'ja-JP',
                'zh': 'zh-CN',
                'ru': 'ru-RU',
                'pt': 'pt-BR',
                'ar': 'ar-SA',
                'hi': 'hi-IN',
                'ko': 'ko-KR',
                'nl': 'nl-NL',
                'sv': 'sv-SE',
                'tr': 'tr-TR',
                'te': 'te-IN',
                // Additional languages
                'bn': 'bn-IN',
                'uk': 'uk-UA',
                'pl': 'pl-PL',
                'vi': 'vi-VN',
                'th': 'th-TH',
                'id': 'id-ID',
                'ms': 'ms-MY',
                'ta': 'ta-IN',
                'ur': 'ur-PK',
                'fa': 'fa-IR',
                'he': 'he-IL',
                'el': 'el-GR',
                'fi': 'fi-FI',
                'da': 'da-DK',
                'no': 'no-NO',
                'hu': 'hu-HU',
                'cs': 'cs-CZ',
                'ro': 'ro-RO',
                'bg': 'bg-BG',
                'hr': 'hr-HR',
                'sk': 'sk-SK',
                'sl': 'sl-SI',
                'lt': 'lt-LT',
                'lv': 'lv-LV',
                'et': 'et-EE'
            };
            
            // Always set a specific language for recognition, even for auto-detect
            // This is important for proper script rendering
            const selectedLang = this.value === 'auto' ? 'en-US' : (langMap[this.value] || 'en-US');
            recognition.lang = selectedLang;
            
            console.log(`Speech recognition language set to: ${recognition.lang}`);
            
            // Set appropriate input method and text direction
            if (userInput) {
                // For languages with non-Latin scripts, set appropriate input mode
                const nonLatinScripts = ['te', 'hi', 'ar', 'zh', 'ja', 'ko', 'ru', 'bn', 'ta', 'ur', 'fa', 'he', 'el', 'th', 'ka', 'hy', 'kk', 'mk', 'mn', 'ne', 'si', 'km', 'lo', 'my'];
                
                if (nonLatinScripts.includes(this.value)) {
                    userInput.setAttribute('lang', this.value);
                    
                    // For RTL languages
                    const rtlLanguages = ['ar', 'he', 'ur', 'fa'];
                    if (rtlLanguages.includes(this.value)) {
                        userInput.style.direction = 'rtl';
                    } else {
                        userInput.style.direction = 'ltr';
                    }
                } else {
                    // Reset for Latin script languages
                    userInput.removeAttribute('lang');
                    userInput.style.direction = 'ltr';
                }
            }
        });
    }
    
    // Trigger initial language setting
    if (fromLanguageSelect) {
        const event = new Event('change');
        fromLanguageSelect.dispatchEvent(event);
    }
    
    // Voice button click handler
    voiceBtn.addEventListener('click', function() {
        if (voiceBtn.classList.contains('listening')) {
            // Stop listening
            recognition.stop();
            voiceBtn.classList.remove('listening');
            showFeedback('Voice input stopped');
        } else {
            // Start listening
            recognition.start();
            voiceBtn.classList.add('listening');
            const fromLanguage = fromLanguageSelect ? fromLanguageSelect.value : 'auto';
            showFeedback(`Listening for ${getLanguageName(fromLanguage)}...`);
        }
    });
    
    // Handle speech recognition results
    recognition.onresult = function(event) {
        const result = event.results[0];
        const transcript = result[0].transcript;
        
        // Get the current language
        const fromLanguage = fromLanguageSelect ? fromLanguageSelect.value : 'auto';
        
        // Check if this is a final result
        if (result.isFinal) {
            // Try to transliterate the text to native script if appropriate
            const transliteratedText = transliterateToNativeScript(transcript, fromLanguage);
            userInput.value = transliteratedText;
            voiceBtn.classList.remove('listening');
            
            showFeedback(`Transcribed ${getLanguageName(fromLanguage)} text`);
            
            // Auto-translate after short delay for better UX
            setTimeout(() => {
                const translateBtn = document.getElementById('translate-btn');
                if (translateBtn) translateBtn.click();
            }, 1000);
        } else {
            // Update input with interim result
            userInput.value = transcript;
        }
    };
    
    // Handle speech recognition errors
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        voiceBtn.classList.remove('listening');
        showFeedback(`Error: ${event.error}`);
    };
    
    // Handle speech recognition end
    recognition.onend = function() {
        voiceBtn.classList.remove('listening');
    };
}

// Profile page functionality
function initializeProfilePage() {
    const user = getCurrentUser();
    
    // Update profile information
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-email').textContent = user.email;
    
    // Set date joined
    const memberSinceElem = document.querySelector('.info-group:nth-child(3) span');
    if (memberSinceElem) {
        memberSinceElem.textContent = user.memberSince;
    }
    
    // Set primary language
    const primaryLanguageSelect = document.getElementById('primary-language');
    if (primaryLanguageSelect) {
        primaryLanguageSelect.value = user.primaryLanguage;
    }
    
    // Create learning languages tags
    updateLearningLanguagesTags(user.learningLanguages);
    
    // Update stats
    updateStatCard('Chat Sessions', user.stats.chatSessions);
    updateStatCard('Saved Phrases', user.stats.savedPhrases);
    updateStatCard('Languages', user.stats.languages);
    updateStatCard('Accuracy', user.stats.accuracy);
    
    // Set toggle switches based on user settings
    setToggleSwitch('notification-toggle', user.settings.notifications);
    setToggleSwitch('dark-mode-toggle', user.settings.darkMode);
    setToggleSwitch('history-toggle', user.settings.saveHistory);
    
    // Apply dark mode if enabled
    if (user.settings.darkMode) {
        applyDarkMode(true);
    }
    
    // Add event listener to save changes button
    const saveButton = document.querySelector('.profile-actions .btn-primary');
    if (saveButton) {
        saveButton.addEventListener('click', saveProfileChanges);
    }
    
    // Add toggle change listeners
    addToggleSwitchListeners();
    
    // Add language button functionality
    const addLangBtn = document.getElementById('add-lang-btn');
    if (addLangBtn) {
        addLangBtn.addEventListener('click', addNewLanguage);
    }
}

// Simulated user data (this would come from a backend in a real app)
function getCurrentUser() {
    // Handle default values if nothing is saved yet
    if (!localStorage.getItem('username')) {
        // Set some default values for a new user
        initializeNewUser();
    }
    
    return {
        username: localStorage.getItem('username') || 'Guest',
        email: localStorage.getItem('userEmail') || 'guest@example.com',
        memberSince: localStorage.getItem('memberSince') || 'April 2024',
        primaryLanguage: localStorage.getItem('primaryLanguage') || 'en',
        learningLanguages: JSON.parse(localStorage.getItem('learningLanguages')) || ['Spanish', 'French', 'Telugu'],
        stats: {
            chatSessions: localStorage.getItem('chatSessions') || 0,
            savedPhrases: localStorage.getItem('savedPhrases') || 0,
            languages: localStorage.getItem('languages') || 0,
            accuracy: localStorage.getItem('accuracy') || '0%'
        },
        settings: {
            notifications: localStorage.getItem('notifications') === 'true',
            darkMode: localStorage.getItem('darkMode') === 'true',
            saveHistory: localStorage.getItem('saveHistory') === 'true'
        }
    };
}

// Initialize new user with default values
function initializeNewUser() {
    // Default settings
    localStorage.setItem('username', 'Guest');
    localStorage.setItem('userEmail', 'guest@example.com');
    localStorage.setItem('memberSince', 'April 2024');
    localStorage.setItem('primaryLanguage', 'en');
    localStorage.setItem('learningLanguages', JSON.stringify(['Spanish', 'French', 'Telugu']));
    localStorage.setItem('chatSessions', '0');
    localStorage.setItem('savedPhrases', '0');
    localStorage.setItem('languages', '0');
    localStorage.setItem('accuracy', '0%');
    localStorage.setItem('notifications', 'true');
    localStorage.setItem('darkMode', 'false');
    localStorage.setItem('saveHistory', 'true');
}

// Update the learning languages tags in the UI
function updateLearningLanguagesTags(languages) {
    const learningLangsContainer = document.querySelector('.learning-langs');
    if (learningLangsContainer) {
        // Clear existing language tags
        learningLangsContainer.innerHTML = '';
        
        // Add the language tags
        languages.forEach(lang => {
            const langTag = document.createElement('div');
            langTag.className = 'lang-tag';
            langTag.innerHTML = `${lang} <span class="remove-lang">×</span>`;
            
            // Add remove functionality
            langTag.querySelector('.remove-lang').addEventListener('click', function() {
                removeLanguage(lang);
                langTag.remove();
            });
            
            learningLangsContainer.appendChild(langTag);
        });
        
        // Add the "Add Language" button
        const addLangBtn = document.createElement('button');
        addLangBtn.id = 'add-lang-btn';
        addLangBtn.innerHTML = '<i class="fas fa-plus"></i> Add Language';
        addLangBtn.addEventListener('click', addNewLanguage);
        
        learningLangsContainer.appendChild(addLangBtn);
    }
}

// Update a stat card with the correct value
function updateStatCard(labelText, value) {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const label = card.querySelector('.stat-label').textContent;
        if (label.includes(labelText)) {
            card.querySelector('.stat-number').textContent = value;
        }
    });
}

// Set toggle switch state
function setToggleSwitch(id, isChecked) {
    const toggle = document.getElementById(id);
    if (toggle) {
        toggle.checked = isChecked;
    }
}

// Add event listeners to toggle switches
function addToggleSwitchListeners() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            // If dark mode toggle is changed, apply dark mode immediately
            if (this.id === 'dark-mode-toggle') {
                applyDarkMode(this.checked);
            }
        });
    });
}

// Apply dark mode to the page
function applyDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Remove a language from the learning languages list
function removeLanguage(language) {
    const user = getCurrentUser();
    const updatedLanguages = user.learningLanguages.filter(lang => lang !== language);
    localStorage.setItem('learningLanguages', JSON.stringify(updatedLanguages));
    
    // Update language count in stats
    localStorage.setItem('languages', updatedLanguages.length);
    updateStatCard('Languages', updatedLanguages.length);
}

// Add a new language to the learning languages list
function addNewLanguage() {
    // Available languages for learning
    const languages = [
        'Arabic', 'Chinese', 'Dutch', 'English', 'French', 'German', 
        'Hindi', 'Italian', 'Japanese', 'Korean', 'Portuguese', 
        'Russian', 'Spanish', 'Swedish', 'Telugu', 'Turkish'
    ];
    
    // Get current user's languages
    const user = getCurrentUser();
    const currentLanguages = user.learningLanguages;
    
    // Filter out already selected languages
    const availableLanguages = languages.filter(lang => !currentLanguages.includes(lang));
    
    // Create a modal for language selection
    const modal = document.createElement('div');
    modal.className = 'modal language-selection-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Language</h3>
                <button class="modal-close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <select id="new-language-select">
                    <option value="">Select a language</option>
                    ${availableLanguages.map(lang => `<option value="${lang}">${lang}</option>`).join('')}
                </select>
            </div>
            <div class="modal-footer">
                <button id="add-selected-language" class="btn-primary">
                    <i class="fas fa-plus"></i> Add Language
                </button>
            </div>
        </div>
    `;
    
    // Add the modal to the page
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    // Add event listeners
    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.querySelector('#add-selected-language').addEventListener('click', () => {
        const select = document.getElementById('new-language-select');
        const selectedLanguage = select.value;
        
        if (selectedLanguage) {
            // Add to user's languages
            const updatedLanguages = [...currentLanguages, selectedLanguage];
            localStorage.setItem('learningLanguages', JSON.stringify(updatedLanguages));
            
            // Update UI
            updateLearningLanguagesTags(updatedLanguages);
            
            // Update stats
            localStorage.setItem('languages', updatedLanguages.length);
            updateStatCard('Languages', updatedLanguages.length);
            
            // Show success notification
            showNotification(`Added ${selectedLanguage} to your learning languages!`);
        }
        
        // Close the modal
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// Save profile changes
function saveProfileChanges() {
    // Get updated values
    const primaryLanguage = document.getElementById('primary-language').value;
    
    // Get toggle states
    const notificationsEnabled = document.getElementById('notification-toggle').checked;
    const darkModeEnabled = document.getElementById('dark-mode-toggle').checked;
    const saveHistoryEnabled = document.getElementById('history-toggle').checked;
    
    // Save to localStorage
    localStorage.setItem('primaryLanguage', primaryLanguage);
    localStorage.setItem('notifications', notificationsEnabled);
    localStorage.setItem('darkMode', darkModeEnabled);
    localStorage.setItem('saveHistory', saveHistoryEnabled);
    
    // Show success message
    showNotification('Profile updated successfully!');
}

// Show a notification message
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content success">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add an expanded set of Telugu translations for common phrases
const EXPANDED_TELUGU_PHRASES = {
    'ఏ కోరికా ఎలా ఉన్నావి': 'How are you',
    'ఏ కోరిక ఎలా ఉన్నావి': 'How are you',
    'ఏ కోరిక': 'How are you',
    'నా పేరు': 'My name is',
    'నీ పేరు ఏమిటి': 'What is your name',
    'మీ పేరు ఏమిటి': 'What is your name (formal)',
    'నా ఇల్లు': 'My house',
    'నేను కోరికా ఏలా ఉన్నావి': 'I want',
    'నాకు కావాలి': 'I need',
    'ఎక్కడ ఉంది': 'Where is it',
    'ఎలా ఉన్నావు': 'How are you',
    'మీరు ఎలా ఉన్నారు': 'How are you (formal)',
    'నేను తెలుగు నేర్చుకుంటున్నాను': 'I am learning Telugu',
    'నేను కోరికా ఏలా ఉన్నావి': 'I am fine, how are you',
    'నేను కోరికా ఎలా ఉన్నావు': 'I am fine, how are you',
    'ఇది ఏమిటి': 'What is this',
    'అది ఏమిటి': 'What is that',
    'నీకు తెలుసా': 'Do you know',
    'నేను బాగున్నాను': 'I am fine',
    'ధన్యవాదాలు': 'Thank you',
    'నేను పోతున్నాను': 'I am going',
    'మీరు ఎక్కడికి వెళుతున్నారు': 'Where are you going',
    'నాకు అర్థం కాలేదు': 'I don\'t understand',
    'నేను జర్మనీ నుండి': 'I am from Germany',
    'నేను అమెరికా నుండి': 'I am from America',
    'నేను ఇంగ్లాండు నుండి': 'I am from England',
    'నేను ఫ్రాన్స్ నుండి': 'I am from France',
    'నేను పనికి వెళుతున్నాను': 'I am going to work',
    'నేను ఊరికి వెళుతున్నాను': 'I am going to town',
    'నేను ఇంటికి వెళుతున్నాను': 'I am going home',
    'నేను నిన్ను ప్రేమిస్తున్నాను': 'I love you',
    'నాకు తెలిదు': 'I don\'t know',
    'నాకు కావాలి': 'I want it',
    'ఎంత సేపు': 'How long',
    'ఎంత దూరం': 'How far',
    'ఎంత డబ్బు': 'How much money',
    'నీ వయసు ఎంత': 'How old are you',
    'ఏ కోరికా ఎలా ఉన్నావు': 'How are you doing',
    'ఎందుకు': 'Why',
    'ఎప్పుడు': 'When',
    'ఎవరు': 'Who',
    'ఏమిటి': 'What',
    'ఎక్కడ': 'Where',
    'ఎలా': 'How',
    'ఏ రోజు ఇది': 'What day is it',
    'నీ రోజు ఎలా ఉంది': 'How was your day',
    'భోజనం రుచిగా ఉంది': 'The food is delicious',
    'నాకు భోజనం చేయాలి': 'I need to eat',
    'ఒక నిమిషం ఉండండి': 'Please wait a moment',
    'నాకు తెలుగు రాదు': 'I don\'t know Telugu'
};

// Add this function to find Telugu phrase matches
function findTeluguMatch(text) {
    // Check for exact matches first
    if (EXPANDED_TELUGU_PHRASES[text]) {
        return EXPANDED_TELUGU_PHRASES[text];
    }
    
    // Check the original Telugu translations dictionary
    if (TELUGU_TRANSLATIONS[text]) {
        return TELUGU_TRANSLATIONS[text];
    }
    
    // Check for partial matches in Telugu phrases
    for (const [key, value] of Object.entries(EXPANDED_TELUGU_PHRASES)) {
        // If the text contains this phrase or vice versa
        if (text.includes(key) || key.includes(text)) {
            return value;
        }
    }
    
    // Check for partial matches in original Telugu translations
    for (const [key, value] of Object.entries(TELUGU_TRANSLATIONS)) {
        if (text.includes(key) || key.includes(text)) {
            return value;
        }
    }
    
    // No match found
    return null;
}

// Update isTeluguText to be more accurate
function isTeluguText(text) {
    // Telugu Unicode range: 0C00-0C7F
    const teluguPattern = /[\u0C00-\u0C7F]/;
    return teluguPattern.test(text);
} 
