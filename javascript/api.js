// --- LOCAL STORAGE ENGINE ---
function getSavedItems() {
    const saved = localStorage.getItem('soundScout_saved');
    return saved ? JSON.parse(saved) : [];
}

function saveItem(item) {
    let savedItems = getSavedItems();
    const exists = savedItems.some(i => i.name === item.name && (i.artist === item.artist || i.type === 'artist'));
    
    if (!exists) {
        savedItems.push(item);
        localStorage.setItem('soundScout_saved', JSON.stringify(savedItems));
        renderSavedItems();
    }
}

function deleteItem(name, artist) {
    let savedItems = getSavedItems();
    savedItems = savedItems.filter(item => !(item.name === name && item.artist === artist));
    localStorage.setItem('soundScout_saved', JSON.stringify(savedItems));
    renderSavedItems();
}

function renderSavedItems() {
    const container = document.getElementById('savedItemsHolder');
    if (!container) return;

    const savedItems = getSavedItems();
    container.innerHTML = '';

    if (savedItems.length === 0) {
        container.innerHTML = `<p class="no-saves">Your collection is empty. Start saving some music!</p>`;
        return;
    }

    savedItems.forEach(item => {
        const card = document.createElement('div');
        card.className = item.type === 'artist' ? 'artist-card' : 'song-card';
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="${item.type === 'artist' ? 'artist-card-img' : 'song-card-img'}">
            <p><strong>${item.name}</strong></p>
            ${item.artist ? `<p class="song-card-artist">${item.artist}</p>` : ''}
            <button class="delete-btn">🗑️ Remove</button>
        `;

        card.querySelector('.delete-btn').addEventListener('click', () => {
            deleteItem(item.name, item.artist);
        });

        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', renderSavedItems);
const LASTFM_API_KEY = 'ad9c9901882e2f3ed3c0b99ffa648944';

// --- ARTIST SEARCH ---

// Fetches a list of artists similar to the queried artist using Last.fm,
// then grabs an image for each one from TheAudioDB
async function getSimilarArtists(query) {
    try {
        console.log(`Searching Last.fm for artists similar to: ${query}`);

        // Request similar artists from Last.fm
        const lastFmUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json&limit=6`;

        const response = await fetch(lastFmUrl);
        if (!response.ok) throw new Error(`Last.fm API error: ${response.status}`);

        const data = await response.json();

        // Bail out early if no similar artists were found
        if (!data.similarartists || !Array.isArray(data.similarartists.artist)) {
            console.warn("No similar artists found.");
            return [];
        }

        const rawArtists = data.similarartists.artist;

        // For each artist, try to fetch a thumbnail from TheAudioDB
        const artistPromises = rawArtists.map(async (artist) => {
            const artistName = artist.name;
            let imageUrl = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'; // Fallback image

            try {
                // TheAudioDB free-tier API key is '2'
                const audioDbUrl = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistName)}`;
                const dbResponse = await fetch(audioDbUrl);

                if (dbResponse.ok) {
                    const dbData = await dbResponse.json();
                    if (dbData.artists && dbData.artists[0] && dbData.artists[0].strArtistThumb) {
                        imageUrl = dbData.artists[0].strArtistThumb;
                    }
                }
            } catch (imageError) {
                console.error(`Could not fetch image for ${artistName}:`, imageError);
            }

            return {
                name: artistName,
                image: imageUrl
            };
        });

        // Wait for all image requests to finish before returning
        return await Promise.all(artistPromises);

    } catch (error) {
        console.error("Error fetching similar artists:", error);
        return [];
    }
}
async function searchDirectSongs(query) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json&limit=12`

    const response = await fetch(url)
    const data = await response.json()

    const tracks = data.results?.trackmatches?.track
    if (!tracks || tracks.length === 0) return []

    return tracks.map(track => {
        const imgArr = track.image
        const img = imgArr && imgArr.find(i => i.size === 'large')
        return {
            name: track.name,
            artist: track.artist,
            image: img && img['#text'] ? img['#text'] : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'
        }
    })
}

async function getSongsByMood(mood) {
    const moodTags = {
        'Happy': 'happy',
        'Sad': 'sad',
        'Energetic': 'energetic',
        'Depressed': 'melancholy',
        'Angry': 'angry',
        'Anxious': 'dark',
        'Relaxed': 'chill'
    }

    const tag = moodTags[mood] || mood.toLowerCase()
    const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${encodeURIComponent(tag)}&api_key=${LASTFM_API_KEY}&format=json&limit=12`

    const response = await fetch(url)
    const data = await response.json()

    if (!data.tracks || !data.tracks.track) return []

    return data.tracks.track.map(track => {
        const imgArr = track.image
        const img = imgArr && imgArr.find(i => i.size === 'large')
        return {
            name: track.name,
            artist: track.artist.name,
            image: img && img['#text'] ? img['#text'] : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'
        }
    })
}
async function searchRelatedSongs(query) {
    const searchUrl = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json&limit=1`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()

    const tracks = searchData.results?.trackmatches?.track
    if (!tracks || tracks.length === 0) return []

    const first = tracks[0]

    const similarUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodeURIComponent(first.artist)}&track=${encodeURIComponent(first.name)}&api_key=${LASTFM_API_KEY}&format=json&limit=12`

    const simRes = await fetch(similarUrl)
    const simData = await simRes.json()

    if (!simData.similartracks || !simData.similartracks.track) return []

    return simData.similartracks.track.map(track => {
        const imgArr = track.image
        const img = imgArr && imgArr.find(i => i.size === 'large')
        return {
            name: track.name,
            artist: track.artist.name,
            image: img && img['#text'] ? img['#text'] : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'
        }
    })
}

// Run an observer to automatically inject the buttons into newly created cards
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return; // Only element nodes
            
            // Check if it's an artist card and doesn't have a button yet
            if (node.classList.contains('artist-card') && !node.querySelector('.save-artist-btn')) {
                const btn = document.createElement('button');
                btn.className = 'save-artist-btn';
                btn.style.marginTop = '10px';
                btn.innerText = '🔖 Save Artist';
                node.appendChild(btn);
            }
            
            // Check if it's a related song card and doesn't have a button yet
            if (node.classList.contains('song-card') && !node.closest('#moodSongHolder') && !node.querySelector('.save-song-btn')) {
                const btn = document.createElement('button');
                btn.className = 'save-song-btn';
                btn.style.marginTop = '10px';
                btn.innerText = '🔖 Save Song';
                node.appendChild(btn);
            }
        });
    });
});

// Start watching the page containers for dynamic updates
const config = { childList: true, subtree: true };
if (document.getElementById('artistHolder')) observer.observe(document.getElementById('artistHolder'), config);
if (document.getElementById('songCard-container')) observer.observe(document.getElementById('songCard-container'), config);

// Handle the background clicks for any dynamically injected buttons
document.addEventListener('click', (e) => {
    // 1. Handle Artist Saves
    if (e.target.classList.contains('save-artist-btn')) {
        const card = e.target.closest('.artist-card');
        const name = card.querySelector('p').innerText.trim();
        const image = card.querySelector('img').src;

        saveItem({
            name: name,
            artist: "",
            image: image,
            type: 'artist'
        });

        e.target.innerText = '✅ Saved';
    }

    // 2. Handle Related Song Saves
    if (e.target.classList.contains('save-song-btn')) {
        const card = e.target.closest('.song-card');
        const name = card.querySelector('p strong').innerText.trim();
        const artist = card.querySelector('.song-card-artist').innerText.trim();
        const image = card.querySelector('img').src;

        saveItem({
            name: name,
            artist: artist,
            image: image,
            type: 'song'
        });

        e.target.innerText = '✅ Saved';
    }
});