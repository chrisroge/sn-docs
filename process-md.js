const fs = require('fs');
const path = require('path');
const marked = require('marked');

async function processMarkdownFiles() {
    // Get all markdown files
    const mdFiles = fs.readdirSync('.').filter(file => file.endsWith('.md'));
    
    // Create docs directory if it doesn't exist
    if (!fs.existsSync('docs')) {
        fs.mkdirSync('docs');
    }

    // Process each markdown file
    const pages = [];
    mdFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const htmlContent = marked.parse(content);
        const fileName = path.basename(file, '.md');
        const title = fileName.replace(/-/g, ' ');
        
        pages.push({
            title,
            path: `docs/${fileName}.html`
        });

        // Generate individual doc page with semantic HTML structure
        const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Documentation</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <div class="documentation-page">
        <header class="site-header">
            <nav aria-label="Main navigation">
                <a href="../index.html">← Back to Documentation Index</a>
            </nav>
        </header>
        <main id="main-content">
            <article class="documentation-content">
                <h1>${title}</h1>
                ${htmlContent}
            </article>
            <nav class="page-navigation" aria-label="Documentation navigation">
                <ul>
                    ${pages.map(page => 
                        `<li><a href="${page.path}">${page.title}</a></li>`
                    ).join('\n                    ')}
                </ul>
            </nav>
        </main>
    </div>
</body>
</html>`;

        fs.writeFileSync(path.join('docs', `${fileName}.html`), pageHtml);
    });

    // Generate index.html with proper semantic structure
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="documentation-index">
        <header class="site-header">
            <h1>Documentation</h1>
        </header>
        <main id="main-content">
            <nav class="documentation-nav" aria-label="Documentation pages">
                <ul>
                    ${pages.map(page => 
                        `<li><a href="${page.path}">${page.title}</a></li>`
                    ).join('\n                    ')}
                </ul>
            </nav>
        </main>
    </div>
</body>
</html>`;

    fs.writeFileSync('index.html', indexHtml);

    // Generate basic CSS
    const css = `
        body { 
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .documentation-nav ul {
            list-style: none;
            padding: 0;
        }
        .documentation-nav a {
            display: block;
            padding: 0.5rem 0;
            color: #0366d6;
            text-decoration: none;
        }
        .documentation-nav a:hover {
            text-decoration: underline;
        }
    `;

    fs.writeFileSync('styles.css', css);
}

processMarkdownFiles().catch(console.error);
