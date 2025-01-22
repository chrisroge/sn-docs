const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');

async function processMarkdownFiles() {
    // Create docs directory if it doesn't exist
    await fs.mkdir('docs', { recursive: true });
    
    // Get all markdown files
    const files = await fs.readdir('.');
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    // Process each markdown file
    const pages = [];
    for (const file of mdFiles) {
        const content = await fs.readFile(file, 'utf8');
        const html = marked.parse(content);
        
        // Create HTML file name
        const htmlFileName = path.basename(file, '.md') + '.html';
        const title = path.basename(file, '.md')
            .replace(/-/g, ' ')
            .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
            .trim();
            
        // Add to pages array for index
        pages.push({
            title,
            path: htmlFileName,
            originalFile: file
        });
        
        // Generate page HTML with navigation
        const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ServiceNow Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen;
            line-height: 1.6;
            color: #24292e;
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
        }
        nav {
            background: #f6f8fa;
            padding: 1rem;
            margin-bottom: 2rem;
            border-radius: 6px;
        }
        nav a {
            color: #0366d6;
            text-decoration: none;
            margin-right: 1rem;
        }
        nav a:hover {
            text-decoration: underline;
        }
        h1, h2, h3 { color: #24292e; }
        pre {
            background: #f6f8fa;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
        }
        code {
            font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
            font-size: 85%;
        }
    </style>
</head>
<body>
    <nav>
        <a href="../index.html">← Back to Index</a>
    </nav>
    <article>
        ${html}
    </article>
</body>
</html>`;
        
        await fs.writeFile(path.join('docs', htmlFileName), pageHtml);
    }
    
    // Sort pages by title
    pages.sort((a, b) => a.title.localeCompare(b.title));
    
    // Generate main index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ServiceNow Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen;
            line-height: 1.6;
            color: #24292e;
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
        }
        .toc {
            background: #fff;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            padding: 2rem;
        }
        .toc h1 {
            margin-top: 0;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #eaecef;
        }
        .toc-list {
            list-style: none;
            padding: 0;
        }
        .toc-list li {
            margin: 0.75rem 0;
        }
        .toc-list a {
            color: #0366d6;
            text-decoration: none;
            font-size: 1.1rem;
            display: block;
            padding: 0.5rem;
            border-radius: 3px;
        }
        .toc-list a:hover {
            background: #f6f8fa;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="toc">
        <h1>ServiceNow Documentation</h1>
        <ul class="toc-list">
            ${pages.map(page => 
                `<li><a href="docs/${page.path}">${page.title}</a></li>`
            ).join('\n            ')}
        </ul>
    </div>
</body>
</html>`;
    
    await fs.writeFile('index.html', indexHtml);
}

processMarkdownFiles().catch(console.error);
