// 1. Grab all the buttons and all the content sections
const buttons = document.querySelectorAll('.navBar button');
const sections = [
    document.querySelector('.related-artist'),
    document.querySelector('.mood-song'),
    document.querySelector('.related-songs'),
    document.querySelector('.song-search-section'), // Added to align with your extra buttons below
    document.querySelector('.saved-stuff-section')  // Added to align with your extra buttons below
];

// Helper function to show a specific section and hide others
function showSection(targetSection) {
    sections.forEach(section => {
        if (section) section.classList.add('hidden');
    });
    if (targetSection) targetSection.classList.remove('hidden');
}

// 2. Loop through the navigation buttons
buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        // Show only the section that matches the button index
        if (sections[index]) {
            showSection(sections[index]);
        }
    });
});

// --- DROPDOWN MENU ---

// 1. Target the button and the menu
const dropdownBtn = document.getElementById('dropdownMenuButton');
const dropdownMenu = document.querySelector('.dropdownMenu');

// 2. Toggle the menu when the button is clicked
if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents instant closing
        dropdownMenu.classList.toggle('show-menu');
    });

    // Close dropdown if clicking anywhere else on the screen
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show-menu');
    });
}

// Change the "Select Mood" text when an item is clicked
const moodItems = document.querySelectorAll('.dropDown-item');

moodItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault(); 
        if (dropdownBtn && dropdownMenu) {
            dropdownBtn.innerText = item.innerText;
            dropdownMenu.classList.remove('show-menu');
        }
        
        // Future hook to trigger a song search based on mood
        console.log("User feels: " + item.innerText);
    });
});

// --- ARTIST SEARCH ---
const artistInput = document.getElementById('artist-search');
const artistHolder = document.getElementById('artistHolder');

if (artistInput && artistHolder) {
    artistInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const query = artistInput.value.trim();
            if (!query) return;

            artistHolder.innerHTML = "Searching...";
            // Updated function name to match the API logic from File 1
            const results = await getSimilarArtists(query); 
            artistHolder.innerHTML = ""; 

            if (results.length === 0) {
                artistHolder.innerHTML = "<p>No similar artists found.</p>";
                return;
            }

            results.forEach(artist => {
                const card = document.createElement('div');
                card.className = 'artist-card';
                card.innerHTML = `
                    <img src="${artist.image}" alt="${artist.name}" class="artist-card-img">
                    <p>${artist.name}</p>
                `;
                artistHolder.appendChild(card);
            });
        }
    });
}

// --- RELATED SONGS SEARCH ---
const songInput = document.getElementById('song-search');
const songCardContainer = document.getElementById('songCard-container');

if (songInput && songCardContainer) {
    songInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const query = songInput.value.trim();
            if (!query) return;

            songCardContainer.innerHTML = "Searching...";
            // Note: Ensure searchRelatedSongs(query) is defined in your project!
            if (typeof searchRelatedSongs === 'function') {
                const results = await searchRelatedSongs(query);
                songCardContainer.innerHTML = "";
                // Render loop logic can be placed here once implemented
            } else {
                songCardContainer.innerHTML = "<p>Song search function not found.</p>";
            }
        }
    });
}

// --- DIRECT SONG INPUT ---
const directSongInput = document.getElementById('direct-song-input');
const directSongHolder = document.getElementById('directSongHolder');

if (directSongInput && directSongHolder) {
    directSongInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const query = directSongInput.value.trim();
            if (!query) return;

            directSongHolder.innerHTML = "Searching...";
            // Note: Ensure searchDirectSongs(query) is defined in your project!
            if (typeof searchDirectSongs === 'function') {
                const results = await searchDirectSongs(query);
                directSongHolder.innerHTML = ""; 

                if (results.length === 0) {
                    directSongHolder.innerHTML = "<p>No songs found.</p>";
                    return;
                }

                results.forEach(song => {
                    const card = document.createElement('div');
                    card.className = 'song-card';
                    card.innerHTML = `
                        <img src="${song.image}" alt="${song.name}" class="song-card-img">
                        <p><strong>${song.name}</strong></p>
                        <p class="song-card-artist">${song.artist}</p>
                    `;
                    directSongHolder.appendChild(card);
                });
            } else {
                directSongHolder.innerHTML = "<p>Direct song search function not found.</p>";
            }
        }
    });
}

// --- ADDITIONAL NAV ACTIONS ---
const btnSongSearch = document.getElementById('btn-song-search');
const btnSavedStuff = document.getElementById('btn-saved-stuff');
const sectionSongSearch = document.querySelector('.song-search-section');
const sectionSavedStuff = document.querySelector('.saved-stuff-section');

btnSongSearch?.addEventListener('click', () => {
    showSection(sectionSongSearch);
});

btnSavedStuff?.addEventListener('click', () => {
    showSection(sectionSavedStuff);
});