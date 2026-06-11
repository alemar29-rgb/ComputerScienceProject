const translations = {
  en: {
    selectLanguage: "Select Language:",
    relatedArtists: "Related Artists",
    moodSongs: "Mood Songs",
    relatedSongs: "Related Songs",
    savedStuff: "Saved Stuff",
    artistPlaceholder: "Search for an artist...",
    moodSongTitle: "Mood Song",
    songPlaceholder: "Search for a song...",
    savedSubtitle: "Your collection of bookmarked tracks and artists",
    clearData: "Clear All Data"
  },
  es: {
    selectLanguage: "Seleccionar idioma:",
    relatedArtists: "Artistas Relacionados",
    moodSongs: "Canciones de Ánimo",
    relatedSongs: "Canciones Relacionadas",
    savedStuff: "Cosas Guardadas",
    artistPlaceholder: "Buscar un artista...",
    moodSongTitle: "Canción de Ánimo",
    songPlaceholder: "Buscar una canción...",
    savedSubtitle: "Tu colección de pistas y artistas guardados",
    clearData: "Borrar todos los datos"
  },
  zh: {
    selectLanguage: "选择语言:",
    relatedArtists: "相关艺术家",
    moodSongs: "心情歌曲",
    relatedSongs: "相关歌曲",
    savedStuff: "收藏内容",
    artistPlaceholder: "搜索艺术家...",
    moodSongTitle: "心情歌曲",
    songPlaceholder: "搜索歌曲...",
    savedSubtitle: "您收藏的曲目和艺术家",
    clearData: "清除所有数据"
  },
  ru: {
    selectLanguage: "Выберите язык:",
    relatedArtists: "Похожие исполнители",
    moodSongs: "Песни под настроение",
    relatedSongs: "Похожие песни",
    savedStuff: "Сохраненное",
    artistPlaceholder: "Поиск исполнителя...",
    moodSongTitle: "Песня под настроение",
    songPlaceholder: "Поиск песни...",
    savedSubtitle: "Ваша коллекция сохраненных треков и исполнителей",
    clearData: "Очистить все данные"
  },
  fr: {
    selectLanguage: "Choisir la langue:",
    relatedArtists: "Artistes Associés",
    moodSongs: "Chansons d'Humeur",
    relatedSongs: "Chansons Associées",
    savedStuff: "Contenu Enregistré",
    artistPlaceholder: "Rechercher un artiste...",
    moodSongTitle: "Chanson d'Humeur",
    songPlaceholder: "Rechercher une chanson...",
    savedSubtitle: "Votre collection de pistes et d'artistes favoris",
    clearData: "Effacer toutes les données"
  },
  it: {
    selectLanguage: "Seleziona Lingua:",
    relatedArtists: "Artisti Correlati",
    moodSongs: "Canzoni del Momento",
    relatedSongs: "Canzoni Correlate",
    savedStuff: "Elementi Salvati",
    artistPlaceholder: "Cerca un artista...",
    moodSongTitle: "Canzone del Momento",
    songPlaceholder: "Cerca una canzone...",
    savedSubtitle: "La tua collezione di brani e artisti salvati",
    clearData: "Cancella tutti i dati"
  },
  hi: {
    selectLanguage: "भाषा चुनें:",
    relatedArtists: "संबंधित कलाकार",
    moodSongs: "मूड के गाने",
    relatedSongs: "संबंधित गाने",
    savedStuff: "सहेजी गई चीजें",
    artistPlaceholder: "कलाकार खोजें...",
    moodSongTitle: "मूड गाना",
    songPlaceholder: "गाना खोजें...",
    savedSubtitle: "आपके बुकमार्क किए गए ट्रैक और कलाकारों का संग्रह",
    clearData: "सभी डेटा साफ़ करें"
  },
  tr: {
    selectLanguage: "Dil Seçin:",
    relatedArtists: "İlgili Sanatçılar",
    moodSongs: "Mod Şarkıları",
    relatedSongs: "İlgili Şarkılar",
    savedStuff: "Kaydedilenler",
    artistPlaceholder: "Sanatçı ara...",
    moodSongTitle: "Mod Şarkısı",
    songPlaceholder: "Şarkı ara...",
    savedSubtitle: "Yer imlerine eklediğiniz parça ve sanatçı koleksiyonunuz",
    clearData: "Tüm Verileri Temizle"
  },
  ja: {
    selectLanguage: "言語を選択:",
    relatedArtists: "関連アーティスト",
    moodSongs: "気分の曲",
    relatedSongs: "関連曲",
    savedStuff: "保存済み",
    artistPlaceholder: "アーティストを検索...",
    moodSongTitle: "気分の曲",
    songPlaceholder: "曲を検索...",
    savedSubtitle: "ブックマークしたトラックとアーティストのコレクション",
    clearData: "すべてのデータを消去"
  }
};

function changeLanguage(lang) {
  const data = translations[lang] || translations['en'];

  // Sync dropdown
  document.getElementById('language-select').value = lang;

  // Nav buttons
  document.getElementById('btn-related-artists').textContent = data.relatedArtists;
  document.getElementById('btn-mood-songs').textContent = data.moodSongs;
  document.getElementById('btn-related-songs').textContent = data.relatedSongs;
  document.getElementById('btn-saved-stuff').textContent = data.savedStuff;

  // Section titles — selected by their parent section class
  document.querySelector('.related-artist .title').textContent = data.relatedArtists;
  document.querySelector('.mood-song .title').textContent = data.moodSongTitle;
  document.querySelector('.related-songs .title').textContent = data.relatedSongs;
  document.querySelector('.saved-stuff-section .title').textContent = data.savedStuff;

  // Language label
  document.querySelector('label[for="language-select"]').textContent = data.selectLanguage;

  // Inputs
  document.getElementById('artist-search').placeholder = data.artistPlaceholder;
  document.getElementById('song-search').placeholder = data.songPlaceholder;

  // Saved section subtitle + clear button
  document.querySelector('.section-subtitle').textContent = data.savedSubtitle;
  document.getElementById('clear-storage-btn').textContent = data.clearData;

  // Persist choice
  localStorage.setItem('preferredLanguage', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferredLanguage') || 'en';
  changeLanguage(savedLang);

  document.getElementById('language-select').addEventListener('change', (e) => {
    changeLanguage(e.target.value);
  });
});