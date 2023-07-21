const Image = require("@11ty/eleventy-img");
const gallery = require('./src/_data/gallery.json');

module.exports = function(eleventyConfig) {
	eleventyConfig.addCollection("processedGallery", async function() {
		const processedGallery = [];

		for (const country in gallery) {
			const data = gallery[country];

			for (const image of data.images) {
				let src = `src/images/${country}/${image.filename}.png`;
				let metadata = await Image(src, {
					widths: [600, 960, 1200, 2140],
					formats: ["webp", "jpg"],
					outputDir: "./dist/images/",
					urlPath: "/images/"
				});

				let filteredMetadata = { ...metadata };

				// Удалите из метаданных изображения большие размеры
				for (let format in filteredMetadata) {
					filteredMetadata[format] = filteredMetadata[format].filter(image => image.width < 1200);
				}

				processedGallery.push({
					...image,
					country: country,
					html: Image.generateHTML(filteredMetadata, {
						alt: image.alt,
						sizes: "(min-width: 1024px) 1024px, 100vw",
						loading: "lazy",
						decoding: "async"
					}),
					// Сохраните ссылку на самую большую версию изображения для Fancybox
					url: metadata.webp[metadata.webp.length - 1].url
				});
			}
		}

		return processedGallery;
	});


	eleventyConfig.addNunjucksFilter("sortAlpha", function(array) {
	return array.sort();
	});

	eleventyConfig.addNunjucksFilter("sortNumeric", function(array) {
	return array.sort((a, b) => a - b);
	});


	  eleventyConfig.addCollection("gallery", function() {
      return gallery;
    });

    eleventyConfig.addPassthroughCopy({
      "src/public/": "/",
    });

    return {
      dir: {
        input: "src",
		output: "dist"
      }
    }

  };
