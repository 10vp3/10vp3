// Fonction pour obtenir une adresse IP simulée de l'utilisateur
function getUserIP() {
    // Remplacer cette ligne par une méthode réelle d'obtention de l'IP si disponible.
    // Pour l'exemple, nous générons une IP fictive.
    return '192.168.0.3'; // Remplacez ceci par la méthode d'obtention de l'IP si vous avez un serveur
}

// Charger les données du fichier JSON depuis le stockage local
function loadDatabase() {
    // Simulation d'une base de données en localStorage
    const defaultDB = {
        allowedIPs: ["192.168.0.1", "192.168.0.2"],
        users: []
    };
    
    const db = JSON.parse(localStorage.getItem('db')) || defaultDB;
    localStorage.setItem('db', JSON.stringify(db));
    return db;
}

// Vérifier si l'adresse IP est dans la liste des IP autorisées
function isIPAllowed(ip) {
    const db = loadDatabase();
    return db.allowedIPs.includes(ip);
}

// Ajouter une nouvelle entrée pour une IP et un utilisateur
function addUser(ip, username) {
    const db = loadDatabase();
    db.users.push({ ip, username });
    localStorage.setItem('db', JSON.stringify(db));
}

// Gérer la vérification de l'IP et afficher le formulaire si nécessaire
function handleIPCheck() {
    const ip = getUserIP();
    if (isIPAllowed(ip)) {
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
