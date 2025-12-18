// ===== SEO Toolkit - All Tools Logic =====

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initMetaTags();
    initOpenGraph();
    initSchema();
    initRobots();
    initSitemap();
    initSlug();
    initSocialPreview();
});

// ===== Tab Navigation =====
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.tool-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const toolId = tab.dataset.tool;
            sections.forEach(s => s.classList.add('hidden'));
            document.getElementById(`tool-${toolId}`).classList.remove('hidden');
        });
    });
}

// ===== 1. Meta Tags Generator =====
function initMetaTags() {
    const fields = ['metaTitle', 'metaDesc', 'metaKeywords', 'metaAuthor', 'metaCanonical'];
    fields.forEach(id => {
        document.getElementById(id).addEventListener('input', generateMetaTags);
    });
    
    document.getElementById('metaCopy').addEventListener('click', () => {
        copyToClipboard(document.getElementById('metaCode').textContent);
    });
    
    // Character counters
    document.getElementById('metaTitle').addEventListener('input', (e) => {
        document.getElementById('metaTitleCount').textContent = `${e.target.value.length}/60`;
    });
    document.getElementById('metaDesc').addEventListener('input', (e) => {
        document.getElementById('metaDescCount').textContent = `${e.target.value.length}/160`;
    });
    
    generateMetaTags();
}

function generateMetaTags() {
    const title = document.getElementById('metaTitle').value;
    const desc = document.getElementById('metaDesc').value;
    const keywords = document.getElementById('metaKeywords').value;
    const author = document.getElementById('metaAuthor').value;
    const canonical = document.getElementById('metaCanonical').value;
    
    let code = '';
    if (title) code += `<title>${escapeHtml(title)}</title>\n`;
    if (desc) code += `<meta name="description" content="${escapeHtml(desc)}">\n`;
    if (keywords) code += `<meta name="keywords" content="${escapeHtml(keywords)}">\n`;
    if (author) code += `<meta name="author" content="${escapeHtml(author)}">\n`;
    if (canonical) code += `<link rel="canonical" href="${escapeHtml(canonical)}">\n`;
    
    // Extra SEO tags
    code += `<meta name="robots" content="index, follow">\n`;
    code += `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
    
    document.getElementById('metaCode').textContent = code || '<!-- Fill in the fields to generate meta tags -->';
}

// ===== 2. Open Graph Generator =====
function initOpenGraph() {
    const fields = ['ogType', 'ogTitle', 'ogDesc', 'ogUrl', 'ogImage', 'ogSiteName'];
    fields.forEach(id => {
        document.getElementById(id).addEventListener('input', generateOG);
        document.getElementById(id).addEventListener('change', generateOG);
    });
    
    document.getElementById('ogCopy').addEventListener('click', () => {
        copyToClipboard(document.getElementById('ogCode').textContent);
    });
    
    generateOG();
}

function generateOG() {
    const type = document.getElementById('ogType').value;
    const title = document.getElementById('ogTitle').value;
    const desc = document.getElementById('ogDesc').value;
    const url = document.getElementById('ogUrl').value;
    const image = document.getElementById('ogImage').value;
    const siteName = document.getElementById('ogSiteName').value;
    
    let code = '<!-- Open Graph / Facebook -->\n';
    code += `<meta property="og:type" content="${type}">\n`;
    if (title) code += `<meta property="og:title" content="${escapeHtml(title)}">\n`;
    if (desc) code += `<meta property="og:description" content="${escapeHtml(desc)}">\n`;
    if (url) code += `<meta property="og:url" content="${escapeHtml(url)}">\n`;
    if (image) code += `<meta property="og:image" content="${escapeHtml(image)}">\n`;
    if (siteName) code += `<meta property="og:site_name" content="${escapeHtml(siteName)}">\n`;
    
    code += '\n<!-- Twitter -->\n';
    code += `<meta name="twitter:card" content="summary_large_image">\n`;
    if (title) code += `<meta name="twitter:title" content="${escapeHtml(title)}">\n`;
    if (desc) code += `<meta name="twitter:description" content="${escapeHtml(desc)}">\n`;
    if (image) code += `<meta name="twitter:image" content="${escapeHtml(image)}">`;
    
    document.getElementById('ogCode').textContent = code;
}

// ===== 3. Schema.org Generator =====
function initSchema() {
    const typeSelect = document.getElementById('schemaType');
    typeSelect.addEventListener('change', updateSchemaFields);
    
    document.getElementById('schemaCopy').addEventListener('click', () => {
        copyToClipboard(document.getElementById('schemaCode').textContent);
    });
    
    updateSchemaFields();
}

function updateSchemaFields() {
    const type = document.getElementById('schemaType').value;
    const container = document.getElementById('schemaFields');
    
    const schemas = {
        Organization: [
            { id: 'schemaName', label: 'Name', placeholder: 'Company Name' },
            { id: 'schemaUrl', label: 'URL', placeholder: 'https://example.com' },
            { id: 'schemaLogo', label: 'Logo URL', placeholder: 'https://example.com/logo.png' },
            { id: 'schemaEmail', label: 'Email', placeholder: 'contact@example.com' },
            { id: 'schemaPhone', label: 'Phone', placeholder: '+1-234-567-8900' }
        ],
        LocalBusiness: [
            { id: 'schemaName', label: 'Business Name', placeholder: 'My Business' },
            { id: 'schemaUrl', label: 'URL', placeholder: 'https://example.com' },
            { id: 'schemaAddress', label: 'Address', placeholder: '123 Main St, City, Country' },
            { id: 'schemaPhone', label: 'Phone', placeholder: '+1-234-567-8900' },
            { id: 'schemaHours', label: 'Opening Hours', placeholder: 'Mo-Fr 09:00-17:00' }
        ],
        Article: [
            { id: 'schemaHeadline', label: 'Headline', placeholder: 'Article title' },
            { id: 'schemaAuthor', label: 'Author', placeholder: 'John Doe' },
            { id: 'schemaDate', label: 'Publish Date', placeholder: '2024-01-01', type: 'date' },
            { id: 'schemaImage', label: 'Image URL', placeholder: 'https://example.com/image.jpg' },
            { id: 'schemaPublisher', label: 'Publisher', placeholder: 'Publisher Name' }
        ],
        Product: [
            { id: 'schemaName', label: 'Product Name', placeholder: 'Awesome Product' },
            { id: 'schemaDesc', label: 'Description', placeholder: 'Product description' },
            { id: 'schemaImage', label: 'Image URL', placeholder: 'https://example.com/product.jpg' },
            { id: 'schemaPrice', label: 'Price', placeholder: '99.99' },
            { id: 'schemaCurrency', label: 'Currency', placeholder: 'USD' }
        ],
        FAQPage: [
            { id: 'schemaQ1', label: 'Question 1', placeholder: 'What is...?' },
            { id: 'schemaA1', label: 'Answer 1', placeholder: 'Answer to question 1' },
            { id: 'schemaQ2', label: 'Question 2', placeholder: 'How to...?' },
            { id: 'schemaA2', label: 'Answer 2', placeholder: 'Answer to question 2' }
        ],
        Person: [
            { id: 'schemaName', label: 'Name', placeholder: 'John Doe' },
            { id: 'schemaJobTitle', label: 'Job Title', placeholder: 'Software Engineer' },
            { id: 'schemaUrl', label: 'Website', placeholder: 'https://johndoe.com' },
            { id: 'schemaImage', label: 'Photo URL', placeholder: 'https://example.com/photo.jpg' },
            { id: 'schemaSameAs', label: 'Social Links (comma)', placeholder: 'https://twitter.com/john, https://linkedin.com/in/john' }
        ]
    };
    
    const fields = schemas[type] || [];
    container.innerHTML = fields.map(f => `
        <div class="mb-4">
            <label class="text-xs text-slate-400 mb-2 block">${f.label}</label>
            <input type="${f.type || 'text'}" id="${f.id}" placeholder="${f.placeholder}" 
                   class="w-full px-4 py-3 bg-dark-input border border-white/10 rounded-lg text-white text-sm">
        </div>
    `).join('');
    
    // Add listeners
    fields.forEach(f => {
        document.getElementById(f.id).addEventListener('input', generateSchema);
    });
    
    generateSchema();
}

function generateSchema() {
    const type = document.getElementById('schemaType').value;
    let schema = { '@context': 'https://schema.org', '@type': type };
    
    const getValue = (id) => document.getElementById(id)?.value || '';
    
    switch(type) {
        case 'Organization':
            schema.name = getValue('schemaName');
            schema.url = getValue('schemaUrl');
            if (getValue('schemaLogo')) schema.logo = getValue('schemaLogo');
            if (getValue('schemaEmail')) schema.email = getValue('schemaEmail');
            if (getValue('schemaPhone')) schema.telephone = getValue('schemaPhone');
            break;
        case 'LocalBusiness':
            schema.name = getValue('schemaName');
            schema.url = getValue('schemaUrl');
            if (getValue('schemaAddress')) schema.address = { '@type': 'PostalAddress', 'streetAddress': getValue('schemaAddress') };
            if (getValue('schemaPhone')) schema.telephone = getValue('schemaPhone');
            if (getValue('schemaHours')) schema.openingHours = getValue('schemaHours');
            break;
        case 'Article':
            schema.headline = getValue('schemaHeadline');
            schema.author = { '@type': 'Person', 'name': getValue('schemaAuthor') };
            if (getValue('schemaDate')) schema.datePublished = getValue('schemaDate');
            if (getValue('schemaImage')) schema.image = getValue('schemaImage');
            if (getValue('schemaPublisher')) schema.publisher = { '@type': 'Organization', 'name': getValue('schemaPublisher') };
            break;
        case 'Product':
            schema.name = getValue('schemaName');
            schema.description = getValue('schemaDesc');
            if (getValue('schemaImage')) schema.image = getValue('schemaImage');
            if (getValue('schemaPrice')) {
                schema.offers = {
                    '@type': 'Offer',
                    'price': getValue('schemaPrice'),
                    'priceCurrency': getValue('schemaCurrency') || 'USD'
                };
            }
            break;
        case 'FAQPage':
            schema.mainEntity = [];
            if (getValue('schemaQ1') && getValue('schemaA1')) {
                schema.mainEntity.push({
                    '@type': 'Question',
                    'name': getValue('schemaQ1'),
                    'acceptedAnswer': { '@type': 'Answer', 'text': getValue('schemaA1') }
                });
            }
            if (getValue('schemaQ2') && getValue('schemaA2')) {
                schema.mainEntity.push({
                    '@type': 'Question',
                    'name': getValue('schemaQ2'),
                    'acceptedAnswer': { '@type': 'Answer', 'text': getValue('schemaA2') }
                });
            }
            break;
        case 'Person':
            schema.name = getValue('schemaName');
            if (getValue('schemaJobTitle')) schema.jobTitle = getValue('schemaJobTitle');
            if (getValue('schemaUrl')) schema.url = getValue('schemaUrl');
            if (getValue('schemaImage')) schema.image = getValue('schemaImage');
            if (getValue('schemaSameAs')) schema.sameAs = getValue('schemaSameAs').split(',').map(s => s.trim());
            break;
    }
    
    const code = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    document.getElementById('schemaCode').textContent = code;
}

// ===== 4. Robots.txt Generator =====
function initRobots() {
    const fields = ['robotsAgent', 'robotsDisallow', 'robotsAllow', 'robotsSitemap', 'robotsDelay'];
    fields.forEach(id => {
        document.getElementById(id).addEventListener('input', generateRobots);
        document.getElementById(id).addEventListener('change', generateRobots);
    });
    
    document.getElementById('robotsCopy').addEventListener('click', () => {
        copyToClipboard(document.getElementById('robotsCode').textContent);
    });
    
    generateRobots();
}

function generateRobots() {
    const agent = document.getElementById('robotsAgent').value;
    const disallow = document.getElementById('robotsDisallow').value.trim();
    const allow = document.getElementById('robotsAllow').value.trim();
    const sitemap = document.getElementById('robotsSitemap').value.trim();
    const delay = document.getElementById('robotsDelay').value;
    
    let code = `User-agent: ${agent}\n`;
    
    if (disallow) {
        disallow.split('\n').forEach(path => {
            if (path.trim()) code += `Disallow: ${path.trim()}\n`;
        });
    }
    
    if (allow) {
        allow.split('\n').forEach(path => {
            if (path.trim()) code += `Allow: ${path.trim()}\n`;
        });
    }
    
    if (delay) code += `Crawl-delay: ${delay}\n`;
    if (sitemap) code += `\nSitemap: ${sitemap}`;
    
    document.getElementById('robotsCode').textContent = code || 'User-agent: *\nAllow: /';
}

// ===== 5. Sitemap Generator =====
function initSitemap() {
    const fields = ['sitemapUrls', 'sitemapFreq', 'sitemapPriority'];
    fields.forEach(id => {
        document.getElementById(id).addEventListener('input', generateSitemap);
        document.getElementById(id).addEventListener('change', generateSitemap);
    });
    
    document.getElementById('sitemapCopy').addEventListener('click', () => {
        copyToClipboard(document.getElementById('sitemapCode').textContent);
    });
    
    generateSitemap();
}

function generateSitemap() {
    const urls = document.getElementById('sitemapUrls').value.trim();
    const freq = document.getElementById('sitemapFreq').value;
    const priority = document.getElementById('sitemapPriority').value;
    
    const today = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    if (urls) {
        urls.split('\n').forEach(url => {
            if (url.trim()) {
                xml += `  <url>\n`;
                xml += `    <loc>${escapeHtml(url.trim())}</loc>\n`;
                xml += `    <lastmod>${today}</lastmod>\n`;
                xml += `    <changefreq>${freq}</changefreq>\n`;
                xml += `    <priority>${priority}</priority>\n`;
                xml += `  </url>\n`;
            }
        });
    }
    
    xml += `</urlset>`;
    
    document.getElementById('sitemapCode').textContent = xml;
}

// ===== 6. URL Slug Generator =====
function initSlug() {
    const fields = ['slugInput', 'slugSeparator', 'slugMaxLen', 'slugLowercase', 'slugBase'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', generateSlug);
        el.addEventListener('change', generateSlug);
    });
    
    document.getElementById('slugCopy').addEventListener('click', () => {
        copyToClipboard(document.getElementById('slugOutput').textContent);
    });
    
    generateSlug();
}

function generateSlug() {
    let text = document.getElementById('slugInput').value;
    const separator = document.getElementById('slugSeparator').value;
    const maxLen = parseInt(document.getElementById('slugMaxLen').value) || 60;
    const lowercase = document.getElementById('slugLowercase').checked;
    const baseUrl = document.getElementById('slugBase').value;
    
    // Transliterate common characters
    const charMap = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ñ': 'n', 'ç': 'c', 'ß': 'ss'
    };
    
    let slug = text;
    
    // Replace accented chars
    Object.keys(charMap).forEach(char => {
        slug = slug.replace(new RegExp(char, 'g'), charMap[char]);
    });
    
    // Remove Arabic and special characters, keep alphanumeric
    slug = slug.replace(/[^\w\s-]/g, '');
    
    // Replace spaces with separator
    slug = slug.replace(/\s+/g, separator);
    
    // Remove consecutive separators
    slug = slug.replace(new RegExp(`${separator}+`, 'g'), separator);
    
    // Trim separators from ends
    slug = slug.replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
    
    // Lowercase if enabled
    if (lowercase) slug = slug.toLowerCase();
    
    // Max length
    if (slug.length > maxLen) {
        slug = slug.substring(0, maxLen);
        // Don't cut in middle of word
        const lastSep = slug.lastIndexOf(separator);
        if (lastSep > maxLen * 0.7) slug = slug.substring(0, lastSep);
    }
    
    document.getElementById('slugOutput').textContent = slug || 'your-url-slug';
    document.getElementById('slugFullUrl').textContent = baseUrl + (slug || 'your-url-slug');
}

// ===== 7. Social Preview =====
function initSocialPreview() {
    const fields = ['socialUrl', 'socialTitle', 'socialDesc', 'socialImage'];
    fields.forEach(id => {
        document.getElementById(id).addEventListener('input', updateSocialPreview);
    });
    
    updateSocialPreview();
}

function updateSocialPreview() {
    const url = document.getElementById('socialUrl').value;
    const title = document.getElementById('socialTitle').value || 'Your Page Title';
    const desc = document.getElementById('socialDesc').value || 'Your page description will appear here...';
    const image = document.getElementById('socialImage').value;
    
    // Extract domain
    let domain = 'example.com';
    try {
        if (url) domain = new URL(url).hostname;
    } catch(e) {}
    
    // Facebook preview
    document.getElementById('fbTitle').textContent = title;
    document.getElementById('fbDesc').textContent = desc;
    document.getElementById('fbDomain').textContent = domain.toUpperCase();
    const fbImg = document.getElementById('fbImage');
    if (image) {
        fbImg.innerHTML = `<img src="${image}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='Image failed to load'">`;
    } else {
        fbImg.innerHTML = 'No image';
    }
    
    // Twitter preview
    document.getElementById('twTitle').textContent = title;
    document.getElementById('twDesc').textContent = desc;
    document.getElementById('twDomain').innerHTML = `<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg> ${domain}`;
    const twImg = document.getElementById('twImage');
    if (image) {
        twImg.innerHTML = `<img src="${image}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='Image failed to load'">`;
    } else {
        twImg.innerHTML = 'No image';
    }
}

// ===== Utility Functions =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copied to clipboard!');
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}
