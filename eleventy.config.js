const Image = require("@11ty/eleventy-img");
const gallery = require('./src/gallery.json');

module.exports = function(eleventyConfig) {
	eleventyConfig.addCollection("processedGallery", async function() {
		const processedGallery = [];

		for (const country in gallery) {
		  const data = gallery[country];

		  for (const image of data.images) {
			let src = `src/images/${country}/${image.filename}.png`;
			let metadata = await Image(src, {
			  widths: [320, 640, 960, 1200, 1800, 2140],
			  formats: ["webp", "avif", "png"],
			  outputDir: "./dist/images/",
			  urlPath: "/images/"
			});

			processedGallery.push({
			  ...image,
			  country: country,
			  html: Image.generateHTML(metadata, {
				alt: image.alt,
				sizes: "(min-width: 1024px) 1024px, 100vw",
				loading: "lazy",
				decoding: "async"
			  }),
			  url: metadata.png[metadata.png.length - 1].url
			});
		  }
		}

		return processedGallery;
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
        includes: "_includes",
        output: "dist"
      }
    }

  };
