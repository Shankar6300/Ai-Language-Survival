
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
    