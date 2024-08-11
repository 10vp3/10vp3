// chat.js

// Charger les messages stockés dans localStorage
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = ''; // Clear existing messages

    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.username}: ${message.text}`;
        messagesContainer.appendChild(messageElement);
    });

    // Scroll to the bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Ajouter un message au stockage local et à l'affichage
function addMessage(username, text) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push({ username, text });
    localStorage.setItem('messages', JSON.stringify(messages));
    loadMessages();
}

// Envoyer un message
function sendMessage() {
    const username = prompt('Enter your username:');
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value.trim();

    if (username && text) {
        addMessage(username, text);
        messageInput.value = ''; // Clear the input field
    } else {
        alert('Username and message cannot be empty!');
    }
}

// Event listeners
document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Load messages on page load
loadMessages();
