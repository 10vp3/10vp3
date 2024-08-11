function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
// Fonction pour récupérer le nom d'utilisateur depuis localStorage
function getUsername() {
    const username = getCookie("username");
    if (username) {
        return username;
    } else {
        // Si aucun username n'est trouvé, vous pouvez demander à l'utilisateur de le saisir
        storeUsername(); // Demander à l'utilisateur de saisir son username
        return localStorage.getItem('username'); // Récupérer le username après l'avoir stocké
    }
}

// Fonction pour stocker le nom d'utilisateur dans localStorage
function storeUsername() {
    const username = prompt('Enter your username:');
    if (username) {
        localStorage.setItem('username', username);
    }
}

// Fonction pour charger les messages depuis localStorage et les afficher
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

// Fonction pour ajouter un message au stockage local et à l'affichage
function addMessage(username, text) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push({ username, text });
    localStorage.setItem('messages', JSON.stringify(messages));
    loadMessages();
}

// Fonction pour envoyer un message
function sendMessage() {
    const username = getUsername(); // Récupérer le nom d'utilisateur depuis localStorage
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value.trim(); // Utiliser la propriété .value pour obtenir le texte

    if (username && text) {
        addMessage(username, text);
        messageInput.value = ''; // Clear the input field
    } else {
        alert('Username and message cannot be empty!');
    }
}

// Ajouter des écouteurs d'événements
document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Charger les messages lors du chargement de la page
loadMessages();
