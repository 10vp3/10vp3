// Fonction pour obtenir l'adresse IP de l'utilisateur
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

// Fonction pour vérifier si l'IP est dans le stockage local
function checkIP(ip) {
    const storedData = JSON.parse(localStorage.getItem('ipData')) || [];
    return storedData.some(entry => entry.ip === ip);
}

// Fonction pour ajouter une nouvelle IP au stockage local
function addIP(ip, username) {
    const storedData = JSON.parse(localStorage.getItem('ipData')) || [];
    storedData.push({ ip, username });
    localStorage.setItem('ipData', JSON.stringify(storedData));
}

// Fonction pour gérer la vérification et l'affichage du formulaire
function handleIPCheck() {
    const ip = getUserIP();
    if (checkIP(ip)) {
        // L'utilisateur a accès à la page chat.html
        window.location.href = 'chat.html';
    } else {
        // Afficher le formulaire pour entrer un nom d'utilisateur
        document.getElementById('form').style.display = 'block';
        document.getElementById('message').textContent = 'Votre adresse IP n\'est pas reconnue. Veuillez entrer un nom d\'utilisateur.';
    }
}

// Fonction pour soumettre le nom d'utilisateur
function submitUsername() {
    const username = document.getElementById('username').value.trim();
    const ip = getUserIP();
    
    if (username) {
        addIP(ip, username);
        // Rediriger l'utilisateur vers la page chat.html après l'ajout
        window.location.href = 'chat.html';
    } else {
        alert('Veuillez entrer un nom d\'utilisateur.');
    }
}

// Appeler la fonction de vérification au chargement de la page
window.onload = handleIPCheck;
