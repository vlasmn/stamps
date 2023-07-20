const fs = require('fs');
const path = require('path');

module.exports = async function() {
  // Путь к вашему файлу JSON
  const filePath = path.join(__dirname, 'gallery.json');

  // Чтение данных из файла JSON
  const rawData = fs.readFileSync(filePath);
  const collections = JSON.parse(rawData);

  // для категорий и стран
  let uniqueCategory = [];
  let uniqueCountries = [];

  for (let country in collections.gallery) {
    let data = collections.gallery[country];

    for (let image of data.images) {
      // для категорий
      if (image.category) {
        for (let tag of image.category) {
          if (!uniqueCategory.includes(tag)) {
            uniqueCategory.push(tag);
          }
        }
      }
    }

    // для стран
    if (!uniqueCountries.includes(country)) {
      uniqueCountries.push(country);
    }
  }

  uniqueCategory.sort();
  uniqueCountries.sort();

  // для годов
  let uniqueYears = [];

  for (let country in collections.gallery) {
    let data = collections.gallery[country];

    for (let image of data.images) {
      if (image.year && !uniqueYears.includes(image.year)) {
        uniqueYears.push(image.year);
      }
    }
  }

  uniqueYears.sort((a, b) => a - b);

  return {
    gallery: collections.gallery,
    uniqueCategory,
    uniqueCountries,
    uniqueYears
  };
};
