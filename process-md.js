const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Read the HTML template
const template = fs.readFileSync('template.html', 'utf8');

// Get all MD files in the directory
const mdFiles = fs.readdirSync('.')
    .filter(file => file.endsWith('.md'));

// Create docs directory if it doesn't exist
if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs');
}

// Generate navigation HTML
function generateNavigation(currentFile = null) {
    const links = mdFiles.map(file => {
        const fileName = path.basename(file, '.md');
        const htmlFile = `${fileName}.html`;
        const isCurrentPage = currentFile === htmlFile;
        const className = isCurrentPage ? 'class="current-page"' : '';
        return `<li><a href="${htmlFile}" ${className}>${fileName}</a></li>`;
    });
    return `<ul>${links.join('\n')}</ul>`;
}

// Process each MD file
mdFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const htmlContent = marked.parse(content);
    const fileName = path.basename(file, '.md');
    const htmlFile = `${fileName}.html`;
    
    // Replace placeholders in template
    let pageHtml = template
        .replace('{{title}}', fileName)
        .replace('{{navigation}}', generateNavigation(htmlFile))
        .replace('{{content}}', htmlContent);
    
    // Write individual HTML file
    fs.writeFileSync(path.join('docs', htmlFile), pageHtml);
});

// Create index.html that redirects to the first document
const firstDoc = mdFiles[0] ? path.basename(mdFiles[0], '.md') + '.html' : '';
const indexHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=docs/${firstDoc}">
    <title>Documentation</title>
</head>
<body>
    <p>Redirecting to <a href="docs/${firstDoc}">documentation</a>...</p>
</body>
</html>`;

fs.writeFileSync('index.html', indexHtml);
