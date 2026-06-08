// Retrieve items from localStorage or default to an empty array
function getSavedItems() {
    const saved = localStorage.getItem('soundScout_saved');
    return saved ? JSON.parse(saved) : [];
}

// Add an item (song or artist) to localStorage
function saveItem(item) {
    let savedItems = getSavedItems();
    
    // Check if item is already saved based on its name and artist/type
    const exists = savedItems.some(i => i.name === item.name && i.artist === item.artist);
    
    if (!exists) {
        savedItems.push(item);
        localStorage.setItem('soundScout_saved', JSON.stringify(savedItems));
        // Instantly refresh the "Saved Stuff" panel if it's currently being viewed
        renderSavedItems();
    }
}

// Delete an item from localStorage
function deleteItem(name, artist) {
    let savedItems = getSavedItems();
    savedItems = savedItems.filter(item => !(item.name === name && item.artist === artist));
    localStorage.setItem('soundScout_saved', JSON.stringify(savedItems));
    renderSavedItems();
}

// Renders saved items cleanly into the "Saved Stuff" grid
function renderSavedItems() {
    const container = document.getElementById('savedItemsHolder');
    if (!container) return;

    const savedItems = getSavedItems();
    container.innerHTML = '';

    if (savedItems.length === 0) {
        container.innerHTML = `<p class="no-saves">You haven't bookmarked anything yet!</p>`;
        return;
    }

    savedItems.forEach(item => {
        const card = document.createElement('div');
        // Apply appropriate visual class structures depending on what was saved
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

// Ensure local storage renders data immediately when the file executes
document.addEventListener('DOMContentLoaded', renderSavedItems);