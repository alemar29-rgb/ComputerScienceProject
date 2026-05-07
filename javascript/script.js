
  // 1. Grab all the buttons and all the content sections
  const buttons = document.querySelectorAll('.navBar button');
  const sections = [
    document.querySelector('.related_artist'),
    document.querySelector('.mood_song'),
    document.querySelector('.related_songs')
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
