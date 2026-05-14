
  // 1. Grab all the buttons and all the content sections
  const buttons = document.querySelectorAll('.navBar button');
  const sections = [
    document.querySelector('.related-artist'),
    document.querySelector('.mood-song'),
    document.querySelector('.related-songs')
  ];

  // 2. Loop through the buttons
  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      
      
      // 3. When a button is clicked, hide ALL sections first
      sections.forEach(section => {
        section.classList.add('hidden');
      });

      // 4. Show only the section that matches the button you clicked
        sections[index].classList.remove('hidden');
        
    });
  });

  // DROPDOWN MENU 

  // 1. Target the button and the menu
const dropdownBtn = document.getElementById('dropdownMenuButton')
const dropdownMenu = document.querySelector('.dropdownMenu')

// 2. Toggle the menu when the button is clicked
dropdownBtn.addEventListener('click', (e) => {
    dropdownMenu.classList.toggle('show-menu')
})
// Change the "Select Mood" text when an item is clicked
const moodItems = document.querySelectorAll('.dropDown-item');

moodItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault(); 
        dropdownBtn.innerText = item.innerText
        dropdownMenu.classList.remove('show-menu')
        
        // Here we will eventually trigger a song search based on the mood!
        console.log("User feels: " + item.innerText)
    })
})
// ----------------------------------------------------------------------------
const artistInput = document.getElementById('artist-search')
const artistHolder = document.getElementById('artistHolder')

// Listen for when the user presses 'Enter' in the search box
artistInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const query = artistInput.value
        artistHolder.innerHTML = "Searching..."
        const results = await searchSpotify(query, 'artist')
        artistHolder.innerHTML = ""; // Clear the "Searching..." text
        results.forEach(artist => {
            const card = document.createElement('div')
            card.className = 'artist-card'
            card.innerHTML = `<img src="${artist.image}" alt="${artist.name}" style="width:100px"><p>${artist.name}</p>`
            artistHolder.appendChild(card)
        })
    }
})