// Board background'ına göre text rengini belirleyen fonksiyon
export const getTextColorByBackground = (background, theme) => {
  // Koyu background'lar için beyaz text, açık background'lar için siyah text
  const darkBackgrounds = ['00', '01', '02', '03', '04', '05', '07', '08', '09', '10', '11', '12', '13', '14'];
  const lightBackgrounds = ['06']; // Sadece 06 açık background
  
  // Background boş ise tema rengine göre
  if (!background || background === '') {
    if (theme === 'dark') {
      return '#ffffff';
    } else if (theme === 'light') {
      return '#000000';
    } else { // violet
      return '#000000';
    }
  }
  
  // Background'a göre text rengi
  if (darkBackgrounds.includes(background)) {
    return '#ffffff'; // Koyu background'da beyaz text
  } else if (lightBackgrounds.includes(background)) {
    return '#000000'; // Açık background'da siyah text
  }
  
  // Default olarak tema rengine göre
  if (theme === 'dark') {
    return '#ffffff';
  } else {
    return '#000000';
  }
};
