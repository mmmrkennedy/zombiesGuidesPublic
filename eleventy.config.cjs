const { generateQuickLinks, classifyLinks, addVersioning } = require('./build_scripts/eleventy-transforms.cjs');

module.exports = function(eleventyConfig) {
  // Add transforms for quick links generation, link classification, and versioning
  eleventyConfig.addTransform("generateQuickLinks", generateQuickLinks);
  eleventyConfig.addTransform("classifyLinks", classifyLinks);
  eleventyConfig.addTransform("addVersioning", addVersioning);

  // Copy static assets to output using object syntax (src/X -> dist/X)
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/font": "font" });
  eleventyConfig.addPassthroughCopy({ "src/favicon": "favicon" });
  eleventyConfig.addPassthroughCopy({ "src/sitemap.xml": "sitemap.xml" });
  eleventyConfig.addPassthroughCopy({ "src/python_utilities": "python_utilities" });
  eleventyConfig.addPassthroughCopy({ "src/easter_egg_help": "easter_egg_help" });

  // Copy React solver builds
  eleventyConfig.addPassthroughCopy({ "src/react-solvers/dist": "react-solvers/dist" });

  // Watch for changes in these directories during development
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  // Preserve .html file extensions instead of using directory index
  eleventyConfig.addGlobalData("permalink", () => {
    return (data) => {
      // Keep the exact file path with .html extension
      if (data.page.inputPath.includes('.html')) {
        return data.page.filePathStem + '.html';
      }
      return data.page.url;
    };
  });

  // Add a filter to format dates
  eleventyConfig.addFilter("dateFormat", function(date) {
    return new Date(date).toLocaleDateString();
  });

  // Add a shortcode for the current year (useful for copyright)
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",              // Source files
      output: "dist",            // Output directory (matches current build)
      includes: "_includes",     // Layout templates
      data: "_data"             // Data files
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",    // Use Nunjucks for HTML
    markdownTemplateEngine: "njk"
  };
};
