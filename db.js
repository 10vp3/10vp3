function getUserIP() {
    return new Promise((resolve, reject) => {
        const rtc = new RTCPeerConnection({ iceServers: [] });
        rtc.createDataChannel('');
        rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
        rtc.onicecandidate = (event) => {
            if (event.candidate) {
                const ipMatch = /(\d{1,3}\.){3}\d{1,3}/.exec(event.candidate.candidate);
                if (ipMatch) {
                    resolve(ipMatch[0]);
                    rtc.onicecandidate = null;
                }
            }
        };
    });
}

// Charger les données du fichier JSON depuis le stockage local
function loadDatabase() {
    const defaultDB = { users: {} };
    const db = JSON.parse(localStorage.getItem('db')) || defaultDB;
    localStorage.setItem('db', JSON.stringify(db)); // Assurez-vous que la base de données est toujours présente
    return db;
}

// Vérifier si l'adresse IP est dans la liste des utilisateurs
function isIPRegistered(ip) {
    const db = loadDatabase();
    return db.users.hasOwnProperty(ip);
}

// Ajouter une nouvelle entrée pour une IP et un utilisateur
function addUser(ip, username) {
    const db = loadDatabase();
    db.users[ip] = username;
    localStorage.setItem('db', JSON.stringify(db));
}

// Gérer la vérification de l'IP et afficher le formulaire si nécessaire
function handleIPCheck() {
    const ip = getUserIP();
    if (isIPRegistered(ip)) {
        // L'utilisateur a accès à la page chat.html
        window.location.href = 'chat.html';
    } else {
        // Afficher le formulaire pour entrer un nom d'utilisateur
        document.getElementById('form').style.display = 'block';
        document.getElementById('message').textContent = 'Votre adresse IP n\'est pas reconnue. Veuillez entrer un nom d\'utilisateur.';
    }
}

// Soumettre le nom d'utilisateur
function submitUsername() {
    const username = document.getElementById('username').value.trim();
    const ip = getUserIP();
    
    if (username) {
        addUser(ip, username);
        // Rediriger l'utilisateur vers la page chat.html après l'ajout
        window.location.href = 'chat.html';
    } else {
        alert('Veuillez entrer un nom d\'utilisateur.');
    }
}

// Appeler la fonction de vérification au chargement de la page
window.onload = handleIPCheck;
