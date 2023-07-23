const Image = require("@11ty/eleventy-img");
const gallery = require('./src/_data/gallery.json');
const htmlnano = require("htmlnano");

module.exports = function(eleventyConfig) {

    eleventyConfig.addCollection("processedGallery", async function() {
        const processedGallery = [];

        for (const country in gallery) {
            const data = gallery[country];

            for (const image of data.images) {
                let src = `src/images/${country}/${image.filename}.webp`;

                let metadata = await Image(src, {
                    widths: [12, 300, 600, 960, 1200, 2140],
                    formats: ["webp", "jpeg"],
                    outputDir: "./dist/images/",
                    urlPath: "/images/"
                });

                let lowestSrc = metadata["jpeg"][0];
                let filteredMetadata = { ...metadata };

                // Удалите из метаданных изображения большие размеры
                for (let format in filteredMetadata) {
                    filteredMetadata[format] = filteredMetadata[format].filter(image => image.width <= 600);
                }

                                // Создание srcset
                const srcsetWebp = filteredMetadata["webp"].map(
                    item => `${item.url} ${item.width}w`).join(", ");

                const srcsetJpeg = filteredMetadata["jpeg"].map(
                    item => `${item.url} ${item.width}w`).join(", ");

                processedGallery.push({
                    ...image,
                    country: country,
                    html: `
                    <picture>
                        <source type="image/webp" data-srcset="${srcsetWebp}" sizes="(min-width: 1024px) 1024px, 100vw">
                        <img 
                             class="lazyload blur-up"
                             src="${lowestSrc.url}" 
                             data-src="${lowestSrc.url}" 
                             sizes="(min-width: 1024px) 1024px, 100vw"
                             data-srcset="${srcsetJpeg}" 
                             alt="${image.alt}">
                    </picture>`,
                    url: metadata.webp[metadata.webp.length - 1].url
                });
            }
        }

        return processedGallery;
    });

      eleventyConfig.addNunjucksFilter('declOfNum', function(number) {
        const cases = [2, 0, 1, 1, 1, 2];
        let titles = ['марка', 'марки', 'марок'];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
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
		"src/public/": "/"
	});
    
      eleventyConfig.addTransform("htmlnano", async function(content, outputPath) {
    if( outputPath && outputPath.endsWith(".html") ) {
      const options = {
        collapseWhitespace: "conservative"
      };

      const result = await htmlnano.process(content, options);
      return result.html;
    }
    return content;
  });

	return {
		dir: {
			input: "src",
			output: "dist"
		}
	}

};
