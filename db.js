// db.js

// Fonction pour obtenir l'adresse IP
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

// Fonction de redirection
function redirection() {
    window.location.href = "chat.html";
}

// Charger les données du fichier JSON depuis le stockage local
function loadDatabase() {
    const defaultDB = { users: {} };
    const db = JSON.parse(localStorage.getItem('db')) || defaultDB;
    localStorage.setItem('db', JSON.stringify(db)); // Assurez-vous que la base de données est toujours présente
    return db;
}

// Vérifier si l'adresse IP est dans la liste des utilisateurs
async function isIPRegistered() {
    try {
        const ip = await getUserIP();
        const db = loadDatabase();
        return db.users.hasOwnProperty(ip);
    } catch (error) {
        console.error("Error retrieving IP:", error);
        return false;
    }
}

// Ajouter une nouvelle entrée pour une IP et un utilisateur
async function addUser(username) {
    try {
        const ip = await getUserIP();
        const db = loadDatabase();
        db.users[ip] = username;
        localStorage.setItem('db', JSON.stringify(db));
    } catch (error) {
        console.error("Error adding user:", error);
    }
}

// Gérer la vérification de l'IP et afficher le formulaire si nécessaire
async function handleIPCheck() {
    try {
        const registered = await isIPRegistered();
        if (registered) {
            redirection();
        } else {
            document.getElementById('form').style.display = 'block';
            document.getElementById('message').textContent = 'Votre adresse IP n\'est pas reconnue. Veuillez entrer un nom d\'utilisateur.';
        }
    } catch (error) {
        console.error("Error in IP check:", error);
    }
}

// Soumettre le nom d'utilisateur
async function submitUsername() {
    try {
        const username = document.getElementById('username').value.trim();
        if (username) {
            await addUser(username);
            redirection();
        } else {
            alert('Veuillez entrer un nom d\'utilisateur.');
        }
    } catch (error) {
        console.error("Error submitting username:", error);
    }
}

// Appeler la fonction de vérification au chargement de la page
window.onload = handleIPCheck;
