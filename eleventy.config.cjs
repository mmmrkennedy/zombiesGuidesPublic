const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// ========================================
// TRANSFORM FUNCTIONS
// ========================================

/**
 * Eleventy transform to auto-generate quick links navigation
 * Scans page content and builds table of contents in .content-container-top
 */
function generateQuickLinks(content, outputPath) {
  if (!outputPath || !outputPath.endsWith('.html')) return content;

  try {
    const dom = new JSDOM(content);
    const document = dom.window.document;

    let container = document.querySelector('.content-container-top');
    if (!container) {
      // Create the container and insert it before the first .content-container
      container = document.createElement('div');
      container.className = 'content-container-top';
      const firstSection = document.querySelector('.content-container');
      if (!firstSection) return content;
      firstSection.parentNode.insertBefore(container, firstSection);
    }

    // Clear existing manual content
    container.innerHTML = '';

    // Build navigation from page structure
    const navStructure = buildNavStructure(document);
    renderNavigation(container, navStructure);

    return dom.serialize();
  } catch (error) {
    console.error(`Error generating quick links for ${outputPath}:`, error.message);
    return content;
  }
}

/**
 * Builds navigation structure from page content
 * Groups items by section header
 */
function buildNavStructure(document) {
  const sections = [];
  const containers = document.querySelectorAll('div.content-container');
  let currentSection = null;

  for (const container of containers) {
    if (shouldExcludeFromNav(container)) continue;

    // Check if this container starts a new section
    if (container.dataset.sectionInd) {
      const sectionLevel = container.dataset.sectionHeaderLevel || '0';

      // Create new section
      currentSection = {
        sectionTitle: container.dataset.sectionInd,
        sectionLevel,
        items: []
      };
      sections.push(currentSection);
    }

    // If no section exists yet, create a default one
    if (!currentSection) {
      currentSection = {
        sectionTitle: null,
        sectionLevel: '0',
        items: []
      };
      sections.push(currentSection);
    }

    // Add main container link to current section
    currentSection.items.push({
      element: container,
      indent: 0,
      isMain: true
    });

    // Find sub-items within this container
    const subItems = container.querySelectorAll('p.step-group-title, p.upgrade-title, p.sub-sub-step');

    for (const [index, subItem] of subItems.entries()) {
      if (shouldExcludeFromNav(subItem)) continue;

      // Calculate indent level
      let indent = 1;
      if (subItem.classList.contains('sub-sub-step') && index !== 0) {
        indent = 2;
      }
      if (subItem.dataset.customIndent) {
        indent = parseInt(subItem.dataset.customIndent, 10);
      }

      // Handle multiple links for same element
      if (subItem.dataset.customQuickLink) {
        const names = subItem.dataset.customQuickLink.split(';');
        if (!subItem.id) subItem.id = names[0]; // Set ID from first name

        for (const name of names) {
          currentSection.items.push({
            element: subItem,
            indent,
            customName: name
          });
        }
      } else {
        currentSection.items.push({
          element: subItem,
          indent
        });
      }
    }
  }

  return sections;
}

/**
 * Renders navigation structure to DOM
 */
function renderNavigation(container, structure) {
  const document = container.ownerDocument;

  for (const section of structure) {
    // Add section header
    if (section.sectionTitle) {
      const header = document.createElement(section.sectionLevel === '0' ? 'h2' : 'h4');
      if (section.sectionLevel !== '0') {
        header.className = 'sub-header';
      }
      header.textContent = section.sectionTitle;
      container.appendChild(header);
    }

    // Create ONE list for this entire section
    const rootList = document.createElement('ul');
    container.appendChild(rootList);

    // Process all items in this section
    let currentIndent = 0;
    let listStack = [rootList];

    for (const item of section.items) {
      const link = createNavLink(document, item.element, item.customName);
      if (!link) continue;

      // Adjust nesting level based on indent
      while (currentIndent < item.indent) {
        const nestedList = document.createElement('ul');
        const lastItem = listStack[listStack.length - 1].lastElementChild;

        if (lastItem) {
          lastItem.appendChild(nestedList);
        } else {
          // No parent item, create dummy
          const dummyItem = document.createElement('li');
          dummyItem.style.display = 'none';
          listStack[listStack.length - 1].appendChild(dummyItem);
          dummyItem.appendChild(nestedList);
        }

        listStack.push(nestedList);
        currentIndent++;
      }

      while (currentIndent > item.indent && listStack.length > 1) {
        listStack.pop();
        currentIndent--;
      }

      listStack[listStack.length - 1].appendChild(link);
    }
  }
}

/**
 * Creates a navigation link element
 */
function createNavLink(document, element, customName = null) {
  if (!element.id) {
    console.warn(`Quick link element missing ID: ${element.textContent?.substring(0, 50)}`);
    return null;
  }

  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = `#${element.id}`;

  // Determine link text
  if (customName) {
    a.textContent = customName;
  } else if (element.dataset.customTitle) {
    a.textContent = element.dataset.customTitle;
  } else if (element.children.length > 0) {
    a.textContent = element.children[0].textContent;
  } else {
    a.textContent = element.textContent;
  }

  li.appendChild(a);
  return li;
}

/**
 * Checks if element should be excluded from navigation
 */
function shouldExcludeFromNav(element) {
  const excludedClasses = [
    'solver-container', 'stats', 'weapon-desc', 'warning',
    'solver-output', 'solver-symbol-select', 'aligned-buttons', 'aligned-label'
  ];

  // Check element and all ancestors for excluded classes
  let current = element;
  while (current) {
    if (current.classList) {
      for (const className of excludedClasses) {
        if (current.classList.contains(className)) return true;
      }
    }
    current = current.parentElement;
  }

  return element.dataset?.boolQuickLink === 'false';
}

/**
 * Eleventy transform to classify links and add appropriate CSS classes
 * Runs on all HTML output files
 */
function classifyLinks(content, outputPath) {
  // Only process HTML files
  if (!outputPath || !outputPath.endsWith('.html')) {
    return content;
  }

  try {
    const dom = new JSDOM(content);
    const document = dom.window.document;

    // Skip links inside .content-container-top
    const links = document.querySelectorAll('a:not(.content-container-top a)');
    let modified = false;

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Classify anchor links (internal page links)
      if (href.includes('#')) {
        if (!link.classList.contains('link-to-page')) {
          link.classList.add('link-to-page');
          modified = true;
        }
      }

      // Classify external links
      const isExternal = href.includes('youtu.be') ||
                        href.includes('youtube') ||
                        href.includes('discord.com') ||
                        href.startsWith('http://') ||
                        href.startsWith('https://') ||
                        (href.includes('.com') && !href.startsWith('/'));

      if (isExternal && !link.classList.contains('external-link')) {
        link.classList.add('external-link');
        modified = true;
      }

      // Validate internal links (not anchors, not external)
      if (!href.startsWith('#') && !href.startsWith('http')) {
        // Check for incomplete paths
        if (href.endsWith('/') && !link.classList.contains('incomplete-path')) {
          link.classList.add('incomplete-path');
          modified = true;
          console.warn(`Incomplete path in ${outputPath}: ${href}`);
        }

        // Check for valid file extensions
        const validExtensions = ['.webp', '.html', '.webm', '.gif', '.jpg', '.jpeg', '.png', '.mp4'];
        const hasValidExtension = validExtensions.some(ext => href.toLowerCase().includes(ext));

        if (!hasValidExtension && !href.endsWith('/') && !link.classList.contains('wrong_file_type')) {
          link.classList.add('wrong_file_type');
          modified = true;
          console.warn(`Invalid file type in ${outputPath}: ${href}`);
        }
      }
    });

    return modified ? dom.serialize() : content;
  } catch (error) {
    console.error(`Error classifying links in ${outputPath}:`, error.message);
    return content;
  }
}

/**
 * Eleventy transform to add version parameters to CSS and JS links
 * and add version display component
 */
function addVersioning(content, outputPath) {
  // Only process HTML files
  if (!outputPath || !outputPath.endsWith('.html')) {
    return content;
  }

  try {
    let modified = content;
    const buildVersion = Date.now().toString();

    // Add ?v= parameter to CSS links without version
    modified = modified.replace(
      /<link([^>]*)href=["']([^"']+\.css)["']([^>]*)>/gi,
      (match, before, href, after) => {
        if (!href.includes('?v=')) {
          return `<link${before}href="${href}?v=${buildVersion}"${after}>`;
        }
        return match;
      }
    );

    // Add ?v= parameter to JS script tags without version
    modified = modified.replace(
      /<script([^>]*)src=["']([^"']+\.js)["']([^>]*)>/gi,
      (match, before, src, after) => {
        if (!src.includes('?v=')) {
          // Also add defer if not present and not a module script
          if (!match.includes('defer') && !match.includes('type="module"')) {
            return `<script${before}src="${src}?v=${buildVersion}"${after} defer>`;
          }
          return `<script${before}src="${src}?v=${buildVersion}"${after}>`;
        }
        return match;
      }
    );

    // Add version display component to index.html and guide pages (but not solvers)
    const fileName = outputPath.split(/[/\\]/).pop();
    const isIndexOrGuide = fileName === 'index.html' || outputPath.includes('games');
    const isSolverOrTemplate = outputPath.includes('solver') || outputPath.includes('_template');

    if (isIndexOrGuide && !isSolverOrTemplate && !modified.includes('version-display')) {
      const versionDisplayComponent = `<!-- Version display component -->
<div class="version-display" data-version="${buildVersion}">
    v.<span id="version-number">${buildVersion}</span>
</div>`;

      // Insert after opening <body> tag
      if (modified.includes('<body>')) {
        modified = modified.replace('<body>', `<body>\n${versionDisplayComponent}\n`);
      }
    }

    return modified;
  } catch (error) {
    console.error(`Error adding versioning to ${outputPath}:`, error.message);
    return content;
  }
}

/**
 * Eleventy transform to inject React bundle references from Vite manifest
 * This replaces the need for post-build scripts to update bundle hashes
 */
function injectReactBundle(content, outputPath) {
  if (!outputPath || !outputPath.endsWith('.html')) return content;

  // Only process files that need React bundle injection
  if (!content.includes('<!-- REACT_BUNDLE_PLACEHOLDER -->') &&
      !content.includes('<!-- REACT_BUNDLE_MODULEPRELOAD -->')) {
    return content;
  }

  try {
    const manifestPath = path.join(__dirname, 'dist/react-solvers/.vite/manifest.json');

    if (!fs.existsSync(manifestPath)) {
      console.warn('⚠️  React manifest not found - skipping bundle injection');
      return content;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Vite manifest structure: { "index.html": { "file": "assets/index-HASH.js", ... } }
    const indexEntry = manifest['index.html'];
    if (!indexEntry || !indexEntry.file) {
      console.error('❌ Could not find index.html entry in Vite manifest');
      return content;
    }

    const bundlePath = `/react-solvers/${indexEntry.file}`;
    let modified = content;

    // Handle modulepreload link
    if (content.includes('<!-- REACT_BUNDLE_MODULEPRELOAD -->')) {
      const link = `<link rel="modulepreload" href="${bundlePath}" />`;
      modified = modified.replace('<!-- REACT_BUNDLE_MODULEPRELOAD -->', link);
    }

    // Handle script tag
    if (content.includes('<!-- REACT_BUNDLE_PLACEHOLDER -->')) {
      const scriptTag = `<script type="module" src="${bundlePath}"></script>`;
      modified = modified.replace('<!-- REACT_BUNDLE_PLACEHOLDER -->', scriptTag);
    }

    return modified;
  } catch (error) {
    console.error(`❌ Error injecting React bundle in ${outputPath}:`, error.message);
    return content;
  }
}

// ========================================
// ELEVENTY CONFIGURATION
// ========================================

module.exports = function(eleventyConfig) {
  // Add transforms for quick links generation, link classification, versioning, and React bundle injection
  eleventyConfig.addTransform("generateQuickLinks", generateQuickLinks);
  eleventyConfig.addTransform("classifyLinks", classifyLinks);
  eleventyConfig.addTransform("addVersioning", addVersioning);
  eleventyConfig.addTransform("injectReactBundle", injectReactBundle);

  // Performance optimization: use passthrough for dev server (faster)
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  // Passthrough copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon");
  eleventyConfig.addPassthroughCopy("src/font");
  eleventyConfig.addPassthroughCopy("src/easter_egg_help");
  eleventyConfig.addPassthroughCopy("src/games/**/*.{webp,png,jpg,jpeg,svg}");
  eleventyConfig.addPassthroughCopy("src/react-solvers");
  eleventyConfig.addPassthroughCopy("src/*.{webp,png,jpg,jpeg,svg,ico,xml,txt}");
  eleventyConfig.addPassthroughCopy("src/_headers");

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
      input: "src",              // Read from src
      output: "dist",            // Output to dist
      includes: "_includes",     // Layout templates
      data: "_data"              // Data files
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",    // Use Nunjucks for HTML
    markdownTemplateEngine: "njk"
  };
};
