const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Read the HTML template
const template = fs.readFileSync('template.html', 'utf8');

// Get all MD files in the directory
const mdFiles = fs.readdirSync('.')
    .filter(file => file.endsWith('.md'));

// Process each MD file and combine content
const processedContent = mdFiles.map(file => {
    const content = fs.readFileSync(file, 'utf8');
    const htmlContent = marked.parse(content);
    const fileName = path.basename(file, '.md');
    
    return `
        <div class="document">
            <h2 class="document-title">${fileName}</h2>
            ${htmlContent}
        </div>
    `;
}).join('\n');

// Replace placeholder in template with content
const finalHtml = template.replace('<!-- CONTENT_PLACEHOLDER -->', processedContent);

// Write the final HTML file
fs.writeFileSync('index.html', finalHtml);
