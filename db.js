// Fonction pour obtenir l'adresse IP de l'utilisateur
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'IP:', error);
        return null;
    }
}

// Fonction pour charger les données JSON contenant les IP autorisées
async function loadAllowedIPs() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        return data.allowedIPs;
    } catch (error) {
        console.error('Erreur lors du chargement des données JSON:', error);
        return [];
    }
}

// Fonction pour vérifier si l'IP de l'utilisateur est autorisée
async function checkIP() {
    const userIP = await getUserIP();
    const allowedIPs = await loadAllowedIPs();

    const allowedIP = allowedIPs.find(entry => entry.ip === userIP);

    if (allowedIP) {
        window.location.href = 'chat.html'; // Rediriger vers chat.html si IP autorisée
    } else {
        document.getElementById('message').textContent = 'Votre IP n\'est pas autorisée.';
        document.getElementById('loginForm').style.display = 'block';
    }
}

// Fonction pour soumettre le nom d'utilisateur
function submitUsername() {
    const username = document.getElementById('username').value;
    const userIP = getUserIP();

    // Enregistrer le nom d'utilisateur avec l'IP
    fetch('saveUsername.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip: userIP, username: username })
    })
    .then(response => response.text())
    .then(result => {
        console.log('Réponse du serveur:', result);
        if (result === 'success') {
            window.location.href = 'chat.html'; // Rediriger vers chat.html après l'enregistrement
        } else {
            alert('Erreur lors de l\'enregistrement du nom d\'utilisateur.');
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'enregistrement du nom d\'utilisateur:', error);
    });
}

// Vérifier l'IP au chargement de la page
document.addEventListener('DOMContentLoaded', checkIP);
