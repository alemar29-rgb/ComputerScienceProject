
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

  // DROPDOWN MENU / Doesnot work yet

  // 1. Target the button and the menu
const dropdownBtn = document.getElementById('dropdownMenuButton')
const dropdownMenu = document.querySelector('.dropdownMenu')

// 2. Toggle the menu when the button is clicked
dropdownBtn.addEventListener('click', (e) => {
    dropdownMenu.classList.toggle('show-menu')
})

