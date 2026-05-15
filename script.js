const songs = [
    { title: "Jinguchaa", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829541/Jinguchaa.mp3_lzkqfj.mp3", cover: "assets/cover1.png" },
    { title: "Dheema", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829541/Dheema.mp3_nds6jl.mp4", cover: "assets/cover2.png" },
    { title: "The One", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829536/The_One.mp3_pt2x0u.mp3", cover: "assets/cover3.png" },
    { title: "Pookattum", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829535/Pookattum.mp3_mm3blg.mp4", cover: "assets/cover4.png" },
    { title: "O Maara", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829534/O_Maara.mp3_exr9p1.mp3", cover: "assets/cover1.png" },
    { title: "Neelothi", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829533/Neelothi.mp3_ax60tz.mp4", cover: "assets/cover2.png" },
    { title: "Kannadi Poove", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829533/Kannadi_Poove.mp3_qfhnaq.mp3", cover: "assets/cover3.png" },
    { title: "Naanga Naalu Peru", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829532/Naanga_Naalu_Peru.mp3_liybmv.mp3", cover: "assets/cover4.png" },
    { title: "Muththa Mazhai", artist: "Chinmayi", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829531/Muththa_Mazhai_Chinmayi_Version.mp3_xgzbvk.mp3", cover: "assets/cover1.png" },
    { title: "Kalloorum", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829531/Kalloorum.mp3_fea9zi.mp3", cover: "assets/cover2.png" },
    { title: "Kanimaa", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829530/Kanimaa.mp3_ryixfm.mp3", cover: "assets/cover3.png" },
    { title: "Edharkaga Marubadi", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829530/Edharkaga_Marubadi.mp3_fnasx6.mp3", cover: "assets/cover4.png" },
    { title: "Adaavadi", artist: "Unknown", src: "https://res.cloudinary.com/dac7x8zy0/video/upload/v1778829528/Adaavadi.mp3_f4pa1x.mp3", cover: "assets/cover1.png" }
];

let currentSongIndex = 0;
let isPlaying = false;
let favourites = JSON.parse(localStorage.getItem('spotifyFavourites')) || [];

// DOM Elements
const audio = document.getElementById('audio-element');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeBar = document.getElementById('volume-bar');
const volumeContainer = document.getElementById('volume-container');

// Player UI Elements
const playerImg = document.getElementById('player-img');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerFavBtn = document.getElementById('player-fav-btn');

// View Containers
const topMixesContainer = document.getElementById('top-mixes-container');
const madeForYouContainer = document.getElementById('made-for-you-container');
const searchContainer = document.getElementById('search-container');
const playlistContainer = document.getElementById('playlist-container');
const favouriteContainer = document.getElementById('favourite-container');

// Initialization
function init() {
    renderHome();
    renderSearch();
    renderPlaylist();
    renderFavourites();
    loadSong(currentSongIndex);
    setupNavigation();
}

// Navigation Logic
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked nav item
            item.classList.add('active');

            // Hide all views
            views.forEach(view => view.classList.add('hidden'));
            views.forEach(view => view.classList.remove('active'));

            // Show target view
            const targetViewId = 'view-' + item.getAttribute('data-view');
            const targetView = document.getElementById(targetViewId);
            targetView.classList.remove('hidden');
            targetView.classList.add('active');
            
            if(item.getAttribute('data-view') === 'favourite') {
                renderFavourites();
            }
        });
    });
}

// Render Functions
function createSongCard(song, index) {
    const div = document.createElement('div');
    div.classList.add('song-card');
    div.innerHTML = `
        <img src="${song.cover}" alt="${song.title}">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <button class="play-hover-btn"><i class="ph-fill ph-play"></i></button>
    `;
    div.addEventListener('click', () => {
        loadSong(index);
        playSong();
    });
    return div;
}

function createListRow(song, index) {
    const div = document.createElement('div');
    div.classList.add('list-row');
    const isFav = favourites.includes(index);
    
    div.innerHTML = `
        <div style="text-align: center;">${index + 1}</div>
        <div class="cover-title">
            <img src="${song.cover}" alt="${song.title}">
            <div class="title-info">
                <span class="name">${song.title}</span>
                <span class="artist">${song.artist}</span>
            </div>
        </div>
        <div>Album</div>
        <div>
            <i class="ph-fill ph-heart fav-icon ${isFav ? 'active' : ''}" data-index="${index}"></i>
        </div>
        <div>3:00</div>
    `;
    
    // Play on double click or click
    div.addEventListener('click', (e) => {
        if(!e.target.classList.contains('fav-icon')){
            loadSong(index);
            playSong();
        }
    });

    const favIcon = div.querySelector('.fav-icon');
    favIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavourite(index);
        renderPlaylist();
        renderFavourites();
        if(currentSongIndex === index) {
            updatePlayerFavIcon();
        }
    });

    return div;
}

function renderHome() {
    topMixesContainer.innerHTML = '';
    madeForYouContainer.innerHTML = '';
    
    // Mixes (Cards)
    for(let i=0; i<6; i++) {
        topMixesContainer.appendChild(createSongCard(songs[i], i));
    }
    
    // Made for you
    for(let i=6; i<12; i++) {
        madeForYouContainer.appendChild(createSongCard(songs[i], i));
    }
}

function renderSearch() {
    searchContainer.innerHTML = '';
    songs.forEach((song, index) => {
        searchContainer.appendChild(createSongCard(song, index));
    });
}

function renderPlaylist() {
    playlistContainer.innerHTML = '';
    songs.forEach((song, index) => {
        playlistContainer.appendChild(createListRow(song, index));
    });
}

function renderFavourites() {
    favouriteContainer.innerHTML = '';
    document.getElementById('fav-count').innerText = `${favourites.length} songs`;
    
    if (favourites.length === 0) {
        favouriteContainer.innerHTML = '<div style="padding: 20px; color: var(--text-subdued);">No favourite songs yet.</div>';
        return;
    }

    favourites.forEach((songIndex) => {
        favouriteContainer.appendChild(createListRow(songs[songIndex], songIndex));
    });
}

// Player Logic
function loadSong(index) {
    currentSongIndex = index;
    const song = songs[currentSongIndex];
    
    audio.src = song.src;
    playerTitle.innerText = song.title;
    playerArtist.innerText = song.artist;
    playerImg.src = song.cover;
    playerImg.style.display = 'block';
    
    updatePlayerFavIcon();
}

function playSong() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="ph-fill ph-pause-circle"></i>';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="ph-fill ph-play-circle"></i>';
    audio.pause();
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if(isPlaying) playSong();
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if(isPlaying) playSong();
}

function toggleFavourite(index) {
    const favIndex = favourites.indexOf(index);
    if (favIndex > -1) {
        favourites.splice(favIndex, 1);
    } else {
        favourites.push(index);
    }
    localStorage.setItem('spotifyFavourites', JSON.stringify(favourites));
}

function updatePlayerFavIcon() {
    if(favourites.includes(currentSongIndex)) {
        playerFavBtn.classList.add('active');
        playerFavBtn.innerHTML = '<i class="ph-fill ph-heart"></i>';
    } else {
        playerFavBtn.classList.remove('active');
        playerFavBtn.innerHTML = '<i class="ph ph-heart"></i>';
    }
}

// Event Listeners
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

progressContainer.addEventListener('click', setProgress);
volumeContainer.addEventListener('click', setVolume);

playerFavBtn.addEventListener('click', () => {
    toggleFavourite(currentSongIndex);
    updatePlayerFavIcon();
    renderPlaylist();
    renderFavourites();
});

// Progress Bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    if(isNaN(duration)) return;

    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Calculate display time
    let currentMins = Math.floor(currentTime / 60);
    let currentSecs = Math.floor(currentTime % 60);
    if (currentSecs < 10) currentSecs = `0${currentSecs}`;
    currentTimeEl.innerText = `${currentMins}:${currentSecs}`;

    let durationMins = Math.floor(duration / 60);
    let durationSecs = Math.floor(duration % 60);
    if (durationSecs < 10) durationSecs = `0${durationSecs}`;
    if (durationMins) {
        totalTimeEl.innerText = `${durationMins}:${durationSecs}`;
    }
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;
    audio.volume = volume;
    volumeBar.style.width = `${volume * 100}%`;
}

// Initialize the app
init();
