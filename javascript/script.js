// --- NAVIGATION ---
// Grab all nav buttons
const buttons = document.querySelectorAll('.navBar button');

// Explicitly match the sections to the buttons in your HTML order
const sections = [
    document.querySelector('.related-artist'),      // Button 1: Related Artists
    document.querySelector('.mood-song'),           // Button 2: Mood Songs
    document.querySelector('.related-songs'),       // Button 3: Related Songs
    document.querySelector('.saved-stuff-section')  // Button 4: Saved Stuff
];

// Hides all sections, then reveals only the target one
function showSection(targetSection) {
    sections.forEach(section => {
        if (section) section.classList.add('hidden');
    });
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Force the local storage storage layout to print fresh data when opened
        if (targetSection.classList.contains('saved-stuff-section')) {
            renderSavedItems();
        }
    }
}

// Each nav button shows the section at the same index
buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (sections[index]) showSection(sections[index]);
    });
});

// --- DROPDOWN MENU ---

const dropdownBtn = document.getElementById('dropdownMenuButton');
const dropdownMenu = document.querySelector('.dropdownMenu');

if (dropdownBtn && dropdownMenu) {
    // Toggle menu open/closed on button click
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents the document click below from closing it immediately
        dropdownMenu.classList.toggle('show-menu');
    });

    // Close the menu when clicking anywhere outside of it
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show-menu');
    });
}

// Update button label and close menu when a mood is selected
const moodItems = document.querySelectorAll('.dropDown-item');

const moodSongHolder = document.getElementById('moodSongHolder')

moodItems.forEach(item => {
    item.addEventListener('click', async (e) => {
        e.preventDefault()
        if (dropdownBtn && dropdownMenu) {
            dropdownBtn.innerText = item.innerText
            dropdownMenu.classList.remove('show-menu')
        }

        if (!moodSongHolder) return
        moodSongHolder.innerHTML = 'Loading songs...'

        const results = await getSongsByMood(item.innerText)
        moodSongHolder.innerHTML = ''

        if (results.length === 0) {
            moodSongHolder.innerHTML = '<p>No songs found for this mood.</p>'
            return
        }

        results.forEach(song => {
            const card = document.createElement('div')
            card.className = 'song-card'
            card.innerHTML = `
                <img src="${song.image}" alt="${song.name}" class="song-card-img">
                <p><strong>${song.name}</strong></p>
                <p class="song-card-artist">${song.artist}</p>
                <button class="save-btn">🔖 Save</button>
            `
            card.querySelector('.save-btn').addEventListener('click', () => {
                saveItem({ name: song.name, artist: song.artist, image: song.image, type: 'song' })
                card.querySelector('.save-btn').innerText = '✅ Saved'
            })
            moodSongHolder.appendChild(card)
        })
    })
})

// --- ARTIST SEARCH ---

const artistInput = document.getElementById('artist-search');
const artistHolder = document.getElementById('artistHolder');

if (artistInput && artistHolder) {
    artistInput.addEventListener('keypress', async (e) => {
        if (e.key !== 'Enter') return;

        const query = artistInput.value.trim();
        if (!query) return;

        artistHolder.innerHTML = "Searching...";
        const results = await getSimilarArtists(query);
        artistHolder.innerHTML = "";

        if (results.length === 0) {
            artistHolder.innerHTML = "<p>No similar artists found.</p>";
            return;
        }

        // Render a card for each artist result
        results.forEach(artist => {
            const card = document.createElement('div');
            card.className = 'artist-card';
            card.innerHTML = `
                <img src="${artist.image}" alt="${artist.name}" class="artist-card-img">
                <p>${artist.name}</p>
            `;
            artistHolder.appendChild(card);
        });
    });
}


// --- RELATED SONGS SEARCH ---

const songInput = document.getElementById('song-search');
const songCardContainer = document.getElementById('songCard-container');

if (songInput && songCardContainer) {
    songInput.addEventListener('keypress', async (e) => {
        if (e.key !== 'Enter') return;

        const query = songInput.value.trim();
        if (!query) return;

        songCardContainer.innerHTML = "Searching...";

        if (typeof searchRelatedSongs !== 'function') {
            songCardContainer.innerHTML = "<p>Song search function not found.</p>";
            return;
        }

        const results = await searchRelatedSongs(query);
        songCardContainer.innerHTML = "";

        if (results.length === 0) {
            songCardContainer.innerHTML = "<p>No related songs found.</p>";
            return;
        }

        // Render a card for each related song result
        results.forEach(song => {
            const card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML = `
                <img src="${song.image}" alt="${song.name}" class="song-card-img">
                <p><strong>${song.name}</strong></p>
                <p class="song-card-artist">${song.artist}</p>
            `;
            songCardContainer.appendChild(card);
        });
    });
}


// --- DIRECT SONG SEARCH ---

const directSongInput = document.getElementById('direct-song-input');
const directSongHolder = document.getElementById('directSongHolder');

if (directSongInput && directSongHolder) {
    directSongInput.addEventListener('keypress', async (e) => {
        if (e.key !== 'Enter') return;

        const query = directSongInput.value.trim();
        if (!query) return;

        directSongHolder.innerHTML = "Searching...";

        if (typeof searchDirectSongs !== 'function') {
            directSongHolder.innerHTML = "<p>Direct song search function not found.</p>";
            return;
        }

        const results = await searchDirectSongs(query);
        directSongHolder.innerHTML = "";

        if (results.length === 0) {
            directSongHolder.innerHTML = "<p>No songs found.</p>";
            return;
        }

        // Render a card for each direct song result
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
    });
}