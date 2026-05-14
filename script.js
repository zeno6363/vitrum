// --- Configuration & Variables ---
const backgrounds = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg'];
let currentBg = 0;
let totalFiles = 0; 
let filesRemaining = 0;
let isPlaying = false;

// --- Background Slider (Optimized with Preloading) ---
function changeBackground() {
    const bgContainer = document.getElementById('background-container');
    currentBg = (currentBg + 1) % backgrounds.length;
    
    const imgPreload = new Image();
    imgPreload.src = backgrounds[currentBg];
    
    imgPreload.onload = () => {
        bgContainer.style.opacity = '0';
        setTimeout(() => {
            bgContainer.style.backgroundImage = `url('${backgrounds[currentBg]}')`;
            bgContainer.style.opacity = '1';
        }, 800);
    };
}

setInterval(changeBackground, 8000);

// --- Real-Time Clock ---
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('real-time').innerText = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- Local Audio Logic ---
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const musicText = document.getElementById('music-text');

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        musicBtn.classList.add('muted');
        musicText.innerText = 'MUTED';
    } else {
        audio.play().catch(e => console.log("Autoplay blocked"));
        musicBtn.classList.remove('muted');
        musicText.innerText = 'PLAYING';
    }
    isPlaying = !isPlaying;
}

document.body.addEventListener('click', () => {
    if (!isPlaying) toggleMusic();
}, { once: true });

// --- GMod Loading Screen API ---
function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    document.getElementById('server-name').innerText = servername || "VITRUM ROLEPLAY";
}

function SetStatusChanged(status) {
    document.getElementById('loading-status').innerText = status;
}

function SetFilesNeeded(needed) { 
    totalFiles = Math.max(totalFiles, needed); 
    refreshProgress(); 
}

function SetFilesRemaining(remaining) { 
    filesRemaining = Math.max(0, remaining); 
    // Ajustement dynamique du total pour éviter les pourcentages négatifs
    if (filesRemaining > totalFiles) {
        totalFiles = filesRemaining;
    }
    refreshProgress(); 
}

function DownloadingFile(fileName) { 
    document.getElementById('current-file').innerText = "Téléchargement : " + fileName; 
}

function refreshProgress() {
    if (totalFiles <= 0) return;
    let progress = Math.round(((totalFiles - filesRemaining) / totalFiles) * 100);
    
    // Sécurité absolue entre 0 et 100
    progress = Math.max(0, Math.min(100, progress));
    
    document.getElementById('progress-bar').style.width = progress + "%";
    document.getElementById('percentage').innerText = progress + "%";
}

function SetPlayerName(name) {
    if (name) document.getElementById('player-name').innerText = name.toUpperCase();
}

// Simulation pour le test navigateur
if (!window.gmod && !navigator.userAgent.includes("GMod")) {
    let simProgress = 0;
    setInterval(() => {
        if (simProgress < 100) simProgress += 0.2;
        SetFilesNeeded(100);
        SetFilesRemaining(100 - simProgress);
    }, 100);
}
