/* ========================================
   NerDism Post Creator - JavaScript
   ======================================== */

// ========================================
// ========================================
// Accordion Logic (Mobile)
// ========================================
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');

        // Close all items (Accordion behavior)
        document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('active');
        });

        // Toggle current
        if (!isActive) {
            item.classList.add('active');

            // Scroll to the active item to ensure visibility
            // slight delay to allow open animation to start
            setTimeout(() => {
                header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    });
});

// ========================================
// DOM Elements
// ========================================
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const categorySelect = document.getElementById('categorySelect');
const aspectRatioSelect = document.getElementById('aspectRatio');
const headlineInput = document.getElementById('headlineInput');
const summaryInput = document.getElementById('summaryInput');
const bulletInput = document.getElementById('bulletInput');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const previewCanvas = document.getElementById('previewCanvas');

// Control Elements
const imageHeightSlider = document.getElementById('imageHeight');
const imageYPosSlider = document.getElementById('imageYPos');
const overlayOpacitySlider = document.getElementById('overlayOpacity');
const textFontSelect = document.getElementById('textFont');
const headlineSizeSlider = document.getElementById('headlineSize');
const summarySizeSlider = document.getElementById('summarySize');
const detailsSizeSlider = document.getElementById('detailsSize');
const textColorPicker = document.getElementById('textColor');
const overlayColorPicker = document.getElementById('overlayColor');
const showFooterCheckbox = document.getElementById('showFooter');

// Effect Elements
const bottomOpacitySlider = document.getElementById('bottomOpacity');
const textGlowSlider = document.getElementById('textGlow');
const lineGlowSlider = document.getElementById('lineGlow');
const gradientTextCheckbox = document.getElementById('gradientText');
const themeBtns = document.querySelectorAll('.theme-btn');

// ========================================
// State
// ========================================
let uploadedImage = null;
let settings = {
    aspectRatio: 'instagram', // instagram, twitter, story, square
    imageHeight: 60,
    imageYPos: 0,
    overlayOpacity: 50,
    bottomOpacity: 95,
    overlayColor: '#0a0a0f',
    textFont: 'Inter',
    headlineSize: 52,
    summarySize: 24,
    detailsSize: 26,
    textColor: '#ffffff',
    textGlow: 0,
    lineGlow: 15,
    gradientText: false,
    showFooter: true,
    theme: 'neon'
};

const themes = {
    neon: { grad: ['#d946a8', '#a855f7', '#6366f1'], bg: ['#0a0a0f', '#12121a'] },
    sunset: { grad: ['#f97316', '#db2777', '#7c3aed'], bg: ['#1a0b06', '#2d1b14'] },
    ocean: { grad: ['#06b6d4', '#3b82f6', '#0ea5e9'], bg: ['#06141a', '#0c1f26'] },
    cyber: { grad: ['#facc15', '#22c55e', '#10b981'], bg: ['#021207', '#061a0f'] },
    fire: { grad: ['#ef4444', '#f97316', '#fbbf24'], bg: ['#1a0f0f', '#261414'] },
    mint: { grad: ['#2dd4bf', '#a7f3d0', '#f0fdf4'], bg: ['#0f1a18', '#142621'] }
};

// ========================================
// Control Listeners
// ========================================

// General Sliders
const sliderMap = {
    'imageHeight': 'imageHeight',
    'imageYPos': 'imageYPos',
    'overlayOpacity': 'overlayOpacity',
    'headlineSize': 'headlineSize',
    'summarySize': 'summarySize',
    'detailsSize': 'detailsSize',
    'bottomOpacity': 'bottomOpacity',
    'textGlow': 'textGlow',
    'lineGlow': 'lineGlow'
};

Object.keys(sliderMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', () => {
            const key = sliderMap[id];
            settings[key] = parseInt(el.value);
            const valSpan = document.getElementById(id + 'Val');
            if (valSpan) {
                const suffix = (key === 'bottomOpacity' || key === 'overlayOpacity' || key === 'imageHeight' || key === 'imageYPos') ? '%'
                    : (key === 'textGlow' || key === 'lineGlow') ? ''
                        : 'px';
                valSpan.textContent = el.value + suffix;
            }
            generatePost();
        });
    }
});

// Other Inputs
textFontSelect?.addEventListener('change', () => { settings.textFont = textFontSelect.value; generatePost(); });
textColorPicker?.addEventListener('input', () => { settings.textColor = textColorPicker.value; generatePost(); });
overlayColorPicker?.addEventListener('input', () => { settings.overlayColor = overlayColorPicker.value; generatePost(); });
showFooterCheckbox?.addEventListener('change', () => { settings.showFooter = showFooterCheckbox.checked; generatePost(); });
gradientTextCheckbox?.addEventListener('change', () => { settings.gradientText = gradientTextCheckbox.checked; generatePost(); });
aspectRatioSelect?.addEventListener('change', () => { settings.aspectRatio = aspectRatioSelect.value; resizeCanvas(); generatePost(); });

// Theme Switching
themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.theme = btn.dataset.theme;
        generatePost();
    });
});

// Text Inputs
['headlineInput', 'summaryInput', 'bulletInput'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', generatePost);
});
categorySelect?.addEventListener('change', generatePost);

// ========================================
// Image Upload
// ========================================
uploadArea?.addEventListener('click', () => imageInput?.click());

imageInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) loadImageFromFile(file);
});

uploadArea?.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea?.addEventListener('dragleave', () => { uploadArea.classList.remove('dragover'); });
uploadArea?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files[0]) loadImageFromFile(e.dataTransfer.files[0]);
});

function loadImageFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            uploadArea.classList.add('has-image');
            uploadArea.innerHTML = '<span class="upload-icon">✅</span><span>Image loaded</span>';
            generatePost();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ========================================
// Canvas Rendering
// ========================================
function getDimensions() {
    switch (settings.aspectRatio) {
        case 'twitter': return { w: 1200, h: 675 };
        case 'story': return { w: 1080, h: 1920 };
        case 'square': return { w: 1080, h: 1080 };
        case 'instagram': default: return { w: 1080, h: 1350 };
    }
}

function resizeCanvas() {
    const { w, h } = getDimensions();
    previewCanvas.width = w;
    previewCanvas.height = h;
}

function generatePost() {
    const ctx = previewCanvas.getContext('2d');
    const { w, h } = getDimensions();
    const currentTheme = themes[settings.theme];

    // Clear and draw background
    ctx.clearRect(0, 0, w, h);

    // Background Gradient based on Theme
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, currentTheme.bg[0]);
    bgGrad.addColorStop(1, currentTheme.bg[1]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Calculate image height
    const imageH = h * (settings.imageHeight / 100);

    drawImage(ctx, w, imageH);
    drawOverlay(ctx, w, h, imageH, currentTheme);
    drawAccentLine(ctx, w, imageH, currentTheme);
    drawLogo(ctx, w, currentTheme);
    drawCategory(ctx, w, currentTheme);
    drawHeadline(ctx, w, h, imageH, currentTheme);
    drawSummary(ctx, w, h, imageH, currentTheme);
    if (settings.showFooter) drawFooter(ctx, w, h, currentTheme);
}

function drawImage(ctx, w, imageH) {
    if (!uploadedImage) {
        ctx.fillStyle = '#1a1a25';
        ctx.fillRect(0, 0, w, imageH);
        ctx.fillStyle = '#333';
        ctx.font = '40px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('📷 Upload Image', w / 2, imageH / 2);
        ctx.textAlign = 'left';
        return;
    }

    const img = uploadedImage;
    const scale = Math.max(w / img.width, imageH / img.height);
    const newW = img.width * scale;
    const newH = img.height * scale;
    const x = (w - newW) / 2;
    // Y-Pos calculation
    const extraH = newH - imageH;
    const yOffset = (settings.imageYPos / 100) * extraH;
    const y = (imageH - newH) / 2 + yOffset;

    ctx.drawImage(img, x, y, newW, newH);
}

function drawOverlay(ctx, w, h, imageH, theme) {
    const opacity = settings.overlayOpacity / 100;
    const bottomAlpha = settings.bottomOpacity / 100;
    const color = settings.overlayColor;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Top Image Overlay
    const topGrad = ctx.createLinearGradient(0, 0, 0, imageH);
    topGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`);
    topGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacity})`);
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, w, imageH);

    // Bottom Content Area (affected by Bottom Transparency)
    const bottomGrad = ctx.createLinearGradient(0, imageH, 0, h);
    bottomGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${bottomAlpha})`);
    bottomGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${Math.min(1, bottomAlpha + 0.05)})`); // Slightly darker at very bottom
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, imageH, w, h - imageH);
}

function drawAccentLine(ctx, w, imageH, theme) {
    const grad = ctx.createLinearGradient(40, 0, w - 40, 0);
    grad.addColorStop(0, theme.grad[0]);
    grad.addColorStop(0.5, theme.grad[1]);
    grad.addColorStop(1, theme.grad[2]);

    ctx.fillStyle = grad;
    if (settings.lineGlow > 0) {
        ctx.shadowColor = theme.grad[0];
        ctx.shadowBlur = settings.lineGlow;
    }
    ctx.fillRect(40, imageH - 2, w - 80, 4);
    ctx.shadowBlur = 0;
}

function drawLogo(ctx, w, theme) {
    ctx.save();
    const logoX = 40;
    const logoY = 40;

    ctx.font = `bold 44px "${settings.textFont}", sans-serif`;
    const nerW = ctx.measureText('Ner').width;
    const dismW = ctx.measureText('Dism').width;
    const totalW = nerW + dismW + 36;

    // Logo Background
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(10, 10, 15, 0.85)';
    ctx.beginPath();
    ctx.roundRect(logoX, logoY, totalW, 64, 32);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Stroke
    const strokeGrad = ctx.createLinearGradient(logoX, 0, logoX + totalW, 0);
    strokeGrad.addColorStop(0, theme.grad[0]);
    strokeGrad.addColorStop(1, theme.grad[2]);
    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Ner', logoX + 18, logoY + 45);

    const textGrad = ctx.createLinearGradient(logoX + 18 + nerW, 0, logoX + 18 + nerW + dismW, 0);
    textGrad.addColorStop(0, theme.grad[0]);
    textGrad.addColorStop(1, theme.grad[1]);
    ctx.fillStyle = textGrad;
    ctx.fillText('Dism', logoX + 18 + nerW, logoY + 45);

    ctx.restore();
}

function drawCategory(ctx, w, theme) {
    const category = categorySelect?.value || 'GENERAL';
    if (category === 'NONE') return;

    const categoryIcons = {
        'GENERAL': '🌐', 'BOOKS': '📚', 'GAMING': '🎮', 'ANIME': '🎬', 'TECH': '💻', 'MOVIES': '🎥', 'NEWS': '📰'
    };

    ctx.save();
    // Use title case for display if desired, otherwise uppercase is fine.
    // Let's capitalize first letter for better look, or keep uppercase as is. 
    // Keeping uppercase as it matches existing style.
    const text = `${categoryIcons[category] || '🌐'} ${category}`;
    ctx.font = `bold 24px "${settings.textFont}", sans-serif`;
    const textW = ctx.measureText(text).width;
    const x = w - textW - 60;
    const y = 55;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(x - 15, y - 25, textW + 30, 40, 20);
    ctx.fill();

    ctx.strokeStyle = theme.grad[0];
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = theme.grad[0];
    ctx.fillText(text, x, y);
    ctx.restore();
}

function drawHeadline(ctx, w, h, imageH, theme) {
    const headline = headlineInput?.value || '';
    if (!headline) return;

    const fontSize = settings.headlineSize;
    const maxWidth = w - 80;

    ctx.save();
    ctx.font = `bold ${fontSize}px "${settings.textFont}", sans-serif`;
    ctx.textBaseline = 'bottom';

    // Text Gradient & Glow
    if (settings.gradientText) {
        const grad = ctx.createLinearGradient(0, imageH - 200, 0, imageH);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(1, theme.grad[1]);
        ctx.fillStyle = grad;
    } else {
        ctx.fillStyle = settings.textColor;
    }

    if (settings.textGlow > 0) {
        ctx.shadowColor = theme.grad[0];
        ctx.shadowBlur = settings.textGlow;
    } else {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
    }

    // Word Wrap
    const words = headline.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine);
    if (lines.length > 3) lines = lines.slice(0, 3);

    const lineHeight = fontSize * 1.15;
    const startY = imageH - 40;

    lines.forEach((line, i) => {
        const y = startY - (lines.length - 1 - i) * lineHeight;
        ctx.fillText(line, 40, y);
    });

    ctx.restore();
}

function drawSummary(ctx, w, h, imageH, theme) {
    const shortSummary = summaryInput?.value || '';
    const bulletsText = bulletInput?.value || '';

    ctx.save();
    let currentY = imageH + 35;

    // Quote Box
    if (shortSummary.trim()) {
        ctx.font = `bold 20px "${settings.textFont}", sans-serif`;
        ctx.fillStyle = theme.grad[0];
        ctx.fillText('💬 SUMMARY', 55, currentY);
        currentY += 15;
        currentY = drawQuoteBox(ctx, w, currentY, shortSummary, theme);
        currentY += 30;
    }

    // Bullet Points
    if (bulletsText.trim()) {
        ctx.font = `bold 20px "${settings.textFont}", sans-serif`;
        ctx.fillStyle = theme.grad[2];
        ctx.fillText('📌 KEY POINTS', 55, currentY);
        currentY += 20;
        drawColorfulBullets(ctx, w, h, currentY, bulletsText, theme);
    }
    ctx.restore();
}

function drawQuoteBox(ctx, w, startY, text, theme) {
    const maxWidth = w - 140;
    const quoteFontSize = settings.summarySize;

    ctx.font = `600 italic ${quoteFontSize}px "${settings.textFont}", sans-serif`;
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine);
    // REMOVED line truncation limit
    // if (lines.length > 2) { ... }

    const lineHeight = quoteFontSize * 1.3;
    const boxHeight = lines.length * lineHeight + 36;

    // Box Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(50, startY, w - 100, boxHeight, 14);
    ctx.fill();

    // Accent Bar
    const grad = ctx.createLinearGradient(0, startY, 0, startY + boxHeight);
    grad.addColorStop(0, theme.grad[0]);
    grad.addColorStop(1, theme.grad[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(50, startY, 5, boxHeight);

    // Text
    ctx.font = `600 italic ${quoteFontSize}px "${settings.textFont}", sans-serif`;
    ctx.fillStyle = settings.textColor;
    ctx.textBaseline = 'top';

    lines.forEach((line, i) => {
        ctx.fillText(line, 85, startY + 18 + i * lineHeight);
    });

    return startY + boxHeight;
}

function drawColorfulBullets(ctx, w, h, startY, bulletsText, theme) {
    const bullets = bulletsText.split('\n')
        .map(b => b.trim().replace(/^[•\-\*]\s*/, ''))
        .filter(b => b.length > 0);

    if (bullets.length === 0) return;

    const maxWidth = w - 150;
    const bulletFontSize = settings.detailsSize;
    const lineHeight = bulletFontSize * 1.6;
    let currentY = startY + 5;

    // Theme based bullet colors
    const bulletColors = [
        theme.grad[0], theme.grad[1], theme.grad[2]
    ];

    bullets.forEach((bullet, idx) => {
        if (currentY > h - 70) return;

        const color = bulletColors[idx % 3];

        // Dot
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(70, currentY + bulletFontSize / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Text
        ctx.font = `500 ${bulletFontSize}px "${settings.textFont}", sans-serif`;
        ctx.fillStyle = settings.textColor;
        ctx.textBaseline = 'top';

        const words = bullet.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            if (ctx.measureText(testLine).width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine);

        lines.forEach((line, lineIdx) => {
            if (currentY > h - 70) return;
            ctx.fillText(line, 95, currentY);
            if (lineIdx < lines.length - 1) {
                currentY += bulletFontSize * 1.15;
            }
        });

        currentY += lineHeight;
    });
}

function drawFooter(ctx, w, h, theme) {
    ctx.save();
    ctx.font = `bold 28px "${settings.textFont}", sans-serif`;
    const grad = ctx.createLinearGradient(w / 2 - 100, 0, w / 2 + 100, 0);
    grad.addColorStop(0, theme.grad[0]);
    grad.addColorStop(1, theme.grad[2]);
    ctx.fillStyle = grad;
    ctx.textAlign = 'center';
    ctx.fillText('ner-dism.vercel.app', w / 2, h - 35);
    ctx.restore();
}

// ========================================
// Download
// ========================================
downloadBtn?.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `nerdism-post-${Date.now()}.png`;
    link.href = previewCanvas.toDataURL('image/png');
    link.click();
    generateBtn.textContent = '✅ Saved!';
    setTimeout(() => generateBtn.textContent = '✨ Generate', 2000);
});

// ========================================
// Initialize
// ========================================
generateBtn?.addEventListener('click', generatePost);
generatePost();
