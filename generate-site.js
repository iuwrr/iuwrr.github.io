#!/usr/bin/env node
/**
 * 精选账号商城 · Apple 风格静态站生成器
 * 设计理念：极简 · 大留白 · 系统字体 · 柔和阴影 · 优雅动画
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DIST_DIR = path.join(__dirname, 'dist');

function loadJSON(name) {
    const fp = path.join(DATA_DIR, name);
    if (!fs.existsSync(fp)) return null;
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
}
function loadRootJSON(name) {
    const fp = path.join(__dirname, name);
    if (!fs.existsSync(fp)) return null;
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
}
function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fixImg(url, base) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return base + url;
    return url;
}

const SEO = loadRootJSON('seo.json') || {};
const SITE_TITLE = SEO.title || '精选账号商城';
const SEO_TITLE_SUFFIX = SEO.titleSuffix || '';
const SEO_DESC = SEO.description || '';
const SEO_KEYWORDS = SEO.keywords || '';
const SEO_AUTHOR = SEO.author || SITE_TITLE;
const SEO_ROBOTS = SEO.robots || 'index, follow';
const SEO_CANONICAL = SEO.canonical || '';
const SEO_OG = SEO.og || {};
const SEO_TWITTER = SEO.twitter || {};
const SEO_JSON_LD = SEO.jsonLd || {};
const SEO_FAVICON = SEO.favicon || '';

// ── Apple 风格 CSS ──
const CSS = `
:root {
  --bg: #ffffff;
  --bg-subtle: #f5f5f7;
  --bg-card: #ffffff;
  --text-primary: #1d1d1f;
  --text-secondary: #6e6e73;
  --text-tertiary: #86868b;
  --accent: #0071e3;
  --accent-hover: #0077ed;
  --accent-light: rgba(0,113,227,0.08);
  --border: #d2d2d7;
  --border-light: #e8e8ed;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.04), 0 0 1px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1);
  --shadow-xl: 0 12px 60px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.12);
  --radius: 18px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --max-w: 1080px;
  --max-w-wide: 1240px;
  --font: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'PingFang SC', 'Noto Sans SC', sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --transition: 0.3s var(--ease);
  --color-green: #34c759;
  --color-orange: #ff9500;
  --color-purple: #af52de;
  --color-pink: #ff2d55;
  --color-teal: #5ac8fa;
  --color-indigo: #5856d6;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text-primary);
  line-height: 1.5385;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a { color: var(--accent); text-decoration: none; transition: color var(--transition); }
a:hover { color: var(--accent-hover); }
img { max-width: 100%; height: auto; display: block; }

.container { max-width: var(--max-w); margin: 0 auto; padding: 0 24px; }
.container-wide { max-width: var(--max-w-wide); margin: 0 auto; padding: 0 24px; }

/* ── Navigation ── */
.nav {
  position: sticky; top: 0; z-index: 1000;
  height: 52px;
  background: rgba(255,255,255,0.72);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--border-light);
}
.nav-inner {
  max-width: var(--max-w-wide); margin: 0 auto; padding: 0 24px;
  height: 100%; display: flex; align-items: center; justify-content: space-between;
}
.nav-brand { display: flex; align-items: center; gap: 12px; }
.nav-logo-link { display: flex; flex-shrink: 0; }
.nav-logo {
  height: 40px; width: auto; border-radius: 8px;
  object-fit: contain; flex-shrink: 0;
}
.nav-brand-text { display: flex; flex-direction: column; gap: 1px; }
.nav-name {
  font-size: 1.05rem; font-weight: 600; letter-spacing: -0.01em;
  color: var(--text-primary); line-height: 1.3;
}
.nav-sub { font-size: 0.68rem; color: var(--text-tertiary); letter-spacing: 0.01em; }
.nav-sub a { color: var(--text-tertiary); }
.nav-sub a:hover { color: var(--text-secondary); }
.nav-links { display: flex; align-items: center; gap: 28px; }
.nav-link {
  font-size: 0.82rem; font-weight: 400; color: var(--text-secondary);
  transition: color var(--transition);
}
.nav-link:hover { color: var(--text-primary); }
.nav-cta {
  padding: 7px 18px; border-radius: 980px; font-size: 0.82rem; font-weight: 500;
  background: var(--accent); color: #fff;
  transition: all var(--transition);
}
.nav-cta:hover { background: var(--accent-hover); color: #fff; transform: none; box-shadow: none; }

/* ── Hero ── */
.hero {
  position: relative;
  padding: 80px 24px 60px;
  text-align: center;
  background: var(--bg-subtle);
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,113,227,0.06), transparent);
  pointer-events: none;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-radius: 980px;
  background: var(--accent-light); color: var(--accent);
  font-size: 0.78rem; font-weight: 500; letter-spacing: 0.01em;
  margin-bottom: 20px;
}
.hero-eyebrow .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--color-green);
  box-shadow: 0 0 6px rgba(52,199,89,0.4);
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
.hero h1 {
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  font-weight: 700; letter-spacing: -0.025em; line-height: 1.08;
  margin-bottom: 16px;
  color: var(--text-primary);
}
.hero h1 .highlight {
  background: linear-gradient(135deg, var(--accent) 0%, #5856d6 50%, #af52de 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: 1.15rem; color: var(--text-secondary);
  max-width: 500px; margin: 0 auto 40px;
  font-weight: 400; line-height: 1.5;
}
.hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 12px 28px; border-radius: 980px;
  background: var(--accent); color: #fff;
  font-size: 0.92rem; font-weight: 500;
  transition: all var(--transition);
}
.btn-primary:hover { background: var(--accent-hover); color: #fff; }
.btn-secondary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 12px 28px; border-radius: 980px;
  background: transparent; color: var(--accent);
  font-size: 0.92rem; font-weight: 500;
  border: 1.5px solid var(--accent);
  transition: all var(--transition);
}
.btn-secondary:hover { background: var(--accent-light); }

/* ── Stats ── */
.stats-strip {
  display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;
  padding: 40px 24px;
}
.stat-item { text-align: center; }
.stat-value {
  font-size: 2rem; font-weight: 700; letter-spacing: -0.02em;
  color: var(--text-primary); line-height: 1.2;
}
.stat-value .unit { font-size: 1rem; font-weight: 500; color: var(--text-tertiary); }
.stat-label {
  font-size: 0.78rem; color: var(--text-tertiary); font-weight: 400;
  margin-top: 4px; text-transform: uppercase; letter-spacing: 0.06em;
}

/* ── Section Headers ── */
.section-header {
  text-align: center; padding: 80px 24px 40px;
}
.section-header .section-eyebrow {
  font-size: 0.78rem; font-weight: 600; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--accent);
  margin-bottom: 8px;
}
.section-header h2 {
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  font-weight: 700; letter-spacing: -0.02em; line-height: 1.12;
  color: var(--text-primary);
}
.section-header p {
  font-size: 1rem; color: var(--text-secondary);
  max-width: 480px; margin: 12px auto 0; line-height: 1.5;
}

/* ── Category Label ── */
.cat-label {
  padding: 60px 24px 24px;
}
.cat-label-inner {
  max-width: var(--max-w-wide); margin: 0 auto;
  display: flex; align-items: center; gap: 12px;
}
.cat-label-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
  background: var(--bg-subtle); border: 1px solid var(--border-light);
}
.cat-label-text h3 {
  font-size: 1.15rem; font-weight: 600; letter-spacing: -0.01em;
  color: var(--text-primary);
}
.cat-label-text span {
  font-size: 0.82rem; color: var(--text-tertiary);
}

/* ── Product Grid ── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* ── Product Card ── */
.product-card {
  display: block; position: relative;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-decoration: none; color: inherit;
  border: 1px solid var(--border-light);
  transition: all 0.4s var(--ease-out);
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: transparent;
}
.card-image {
  position: relative; overflow: hidden;
  aspect-ratio: 16 / 10;
  background: var(--bg-subtle);
}
.card-image img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.6s var(--ease-out);
}
.product-card:hover .card-image img { transform: scale(1.05); }
.card-badge {
  position: absolute; top: 12px; left: 12px; z-index: 2;
  padding: 4px 12px; border-radius: 980px;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.02em;
  background: rgba(255,255,255,0.9); color: var(--text-primary);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.card-info {
  padding: 16px 18px 18px;
}
.card-cat-label {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--accent);
  margin-bottom: 6px;
}
.card-name {
  font-size: 0.88rem; font-weight: 600; line-height: 1.45;
  color: var(--text-primary);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; min-height: 2.6em;
  margin-bottom: 14px;
  letter-spacing: -0.005em;
}
.card-bottom {
  display: flex; align-items: center; justify-content: space-between;
}
.card-price {
  font-size: 1.15rem; font-weight: 700; letter-spacing: -0.01em;
  color: var(--text-primary);
}
.card-price .prefix {
  font-size: 0.7rem; font-weight: 400; color: var(--text-tertiary);
  margin-right: 2px;
}
.card-arrow {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg-subtle);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; color: var(--text-tertiary);
  transition: all var(--transition);
}
.product-card:hover .card-arrow {
  background: var(--accent); color: #fff;
}

/* ── Features ── */
.features {
  background: var(--bg-subtle);
  padding: 80px 24px;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  max-width: var(--max-w-wide); margin: 0 auto;
}
.feature-item {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  border: 1px solid var(--border-light);
  transition: all 0.35s var(--ease);
}
.feature-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.feature-emoji {
  font-size: 1.8rem; margin-bottom: 16px;
  display: block;
}
.feature-item h3 {
  font-size: 0.95rem; font-weight: 600;
  margin-bottom: 6px; color: var(--text-primary);
  letter-spacing: -0.005em;
}
.feature-item p {
  font-size: 0.82rem; color: var(--text-secondary);
  line-height: 1.5;
}

/* ── CTA ── */
.cta {
  text-align: center; padding: 80px 24px;
}
.cta-box {
  max-width: 600px; margin: 0 auto;
  padding: 56px 40px;
  background: var(--bg-subtle);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
}
.cta-box h2 {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 700; letter-spacing: -0.02em;
  margin-bottom: 10px;
}
.cta-box p {
  font-size: 0.95rem; color: var(--text-secondary);
  margin-bottom: 28px;
}

/* ── Footer ── */
.footer {
  text-align: center;
  padding: 40px 24px 36px;
  border-top: 1px solid var(--border-light);
}
.footer-links { margin-bottom: 14px; }
.footer-links a {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 16px; border-radius: 980px;
  font-size: 0.78rem; font-weight: 400;
  color: var(--text-secondary);
  transition: color var(--transition);
}
.footer-links a:hover { color: var(--text-primary); }
.footer p {
  font-size: 0.72rem; color: var(--text-tertiary);
  line-height: 1.7;
}
.footer a.fine { color: var(--text-tertiary); }
.footer a.fine:hover { color: var(--text-secondary); }

/* ── Animations ── */
.reveal {
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
}
.reveal.visible { opacity: 1; transform: translateY(0); }

@keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.anim { opacity: 0; animation: fadeIn 0.6s var(--ease-out) forwards; }
.anim-d1 { animation-delay: 0.06s; }
.anim-d2 { animation-delay: 0.12s; }
.anim-d3 { animation-delay: 0.18s; }
.anim-d4 { animation-delay: 0.24s; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero { padding: 56px 20px 44px; }
  .hero h1 { font-size: 2rem; }
  .hero-subtitle { font-size: 1rem; }
  .stats-strip { gap: 24px; padding: 32px 20px; }
  .stat-value { font-size: 1.5rem; }
  .section-header { padding: 56px 20px 28px; }
  .section-header h2 { font-size: 1.5rem; }
  .cat-label { padding: 40px 20px 16px; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .card-info { padding: 12px 14px 14px; }
  .card-name { font-size: 0.8rem; }
  .card-price { font-size: 1rem; }
  .features { padding: 56px 20px; }
  .features-grid { gap: 12px; }
  .feature-item { padding: 24px 20px; }
  .cta { padding: 56px 20px; }
  .cta-box { padding: 40px 24px; }
  .nav-links { display: none; }
  .container, .container-wide { padding: 0 16px; }
}
@media (max-width: 480px) {
  .hero h1 { font-size: 1.7rem; }
  .hero-subtitle { font-size: 0.92rem; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .card-badge { font-size: 0.6rem; padding: 3px 8px; top: 8px; left: 8px; }
  .card-arrow { width: 26px; height: 26px; font-size: 0.7rem; }
  .features-grid { grid-template-columns: 1fr 1fr; }
  .btn-primary, .btn-secondary { padding: 10px 22px; font-size: 0.85rem; }
}
`;

const JS = `
document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 50);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Nav shrink on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 10 && last <= 10) nav.style.borderBottomColor = 'var(--border)';
      if (y <= 10 && last > 10) nav.style.borderBottomColor = 'var(--border-light)';
      last = y;
    }, { passive: true });
  }
});
`;

function main() {
    const config = loadJSON('config.json') || {};
    const categories = loadJSON('categories.json') || [];
    const products = loadJSON('products.json') || [];
    const meta = loadJSON('meta.json') || {};

    if (!products.length) { console.error('❌ 没有商品数据'); process.exit(1); }

    const siteUrl = meta.siteUrl || process.env.SITE_URL || 'https://hltx.cc.cd';
    const siteName = SITE_TITLE;
    const GITHUB_PAGES_URL = SEO_CANONICAL || 'https://iuwrr.github.io';

    if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

    function shortCatName(name) {
        return name
            .replace(/谷歌美国电话\/?/i, '')
            .replace(/GoogleVoice\s*\/?\s*GV靓号/i, 'GV 靓号')
            .replace(/谷歌邮箱\s*\/?\s*油管\s*\/?\s*Google\s*\/?\s*Gmail/i, '谷歌邮箱')
            .replace(/苹果id\s*\/?\s*Apple\s*id\s*\/?\s*AppStore/i, 'Apple ID')
            .replace(/服务类/i, '增值服务')
            .trim() || name;
    }

    function catEmoji(id) {
        const map = { 1: '📞', 2: '📧', 3: '🍎', 4: '🛠️' };
        return map[id] || '📦';
    }

    function catDesc(id) {
        const map = {
            1: '优质号码，支持自选，稳定可靠',
            2: '老号精选，安全稳定，即买即用',
            3: '多区可选，纯净账号，下载无忧',
            4: '专业部署，一次购买，永久使用'
        };
        return map[id] || '';
    }

    const activeCats = categories
        .filter(c => products.some(p => p.category_id === c.id && p.active !== 0))
        .sort((a, b) => (a.sort || 0) - (b.sort || 0));

    // Build category sections
    const categorySections = activeCats.map(cat => {
        const catProducts = products
            .filter(p => p.category_id === cat.id && p.active !== 0)
            .sort((a, b) => (a.sort || 0) - (b.sort || 0));

        const cards = catProducts.map(p => {
            const img = p.image_url ? fixImg(p.image_url, siteUrl) : '';
            const variants = p.variants || [];
            const minPrice = variants.length ? Math.min(...variants.map(v => v.price)) : 0;
            const tags = (p.tags || '').split(',').map(t => t.trim()).filter(Boolean);
            const cleanTag = t => t.replace(/b[12]#[0-9a-fA-F]{3,6}/g, '').replace(/#[0-9a-fA-F]{3,6}$/g, '').replace(/\s+/g, ' ').trim();
            const badge = cleanTag(tags[0] || '');

            return `
            <a class="product-card reveal" href="${siteUrl}/product?id=${p.id}" target="_blank" rel="noopener">
                <div class="card-image">
                    ${img ? `<img src="${esc(img)}" alt="${esc(p.name)}" loading="lazy">` : ''}
                    ${badge ? `<div class="card-badge">${esc(badge)}</div>` : ''}
                </div>
                <div class="card-info">
                    <div class="card-cat-label">${esc(shortCatName(cat.name))}</div>
                    <div class="card-name">${esc(p.name)}</div>
                    <div class="card-bottom">
                        <div class="card-price"><span class="prefix">¥</span>${minPrice.toFixed(2)}</div>
                        <div class="card-arrow">→</div>
                    </div>
                </div>
            </a>`;
        }).join('\n');

        return `
    <div class="cat-label reveal">
        <div class="cat-label-inner">
            <div class="cat-label-icon">${catEmoji(cat.id)}</div>
            <div class="cat-label-text">
                <h3>${esc(shortCatName(cat.name))}</h3>
                <span>${esc(catDesc(cat.id))}</span>
            </div>
        </div>
    </div>
    <div class="container-wide">
        <div class="products-grid">
            ${cards}
        </div>
    </div>`;
    }).join('\n');

    const totalProducts = products.filter(p => p.active !== 0).length;
    const totalVariants = products.reduce((s, p) => s + (p.variants?.length || 0), 0);
    const ogImage = products[0]?.image_url ? fixImg(products[0].image_url, siteUrl) : '';

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "description": SEO_DESC,
        "url": GITHUB_PAGES_URL,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/product?id={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };
    const itemListLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": products.filter(p => p.active !== 0).map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
                "@type": "Product",
                "name": p.name,
                "url": `${siteUrl}/product?id=${p.id}`,
                "image": p.image_url ? fixImg(p.image_url, siteUrl) : '',
                "offers": {
                    "@type": "Offer",
                    "price": p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : 0,
                    "priceCurrency": "CNY"
                }
            }
        }))
    };

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(siteName)}${SEO_TITLE_SUFFIX ? ' – ' + esc(SEO_TITLE_SUFFIX) : ''}</title>
    <meta name="description" content="${esc(SEO_DESC)}">
    <meta name="keywords" content="${esc(SEO_KEYWORDS)}">
    <meta name="author" content="${esc(SEO_AUTHOR)}">
    <meta name="robots" content="${esc(SEO_ROBOTS)}">
    <meta name="googlebot" content="${esc(SEO_ROBOTS)}">
    ${SEO_CANONICAL ? `<link rel="canonical" href="${esc(SEO_CANONICAL)}">` : ''}
    <meta property="og:type" content="${esc(SEO_OG.type || 'website')}">
    <meta property="og:url" content="${esc(SEO_OG.url || GITHUB_PAGES_URL)}">
    <meta property="og:title" content="${esc(siteName)}">
    <meta property="og:description" content="${esc(SEO_DESC)}">
    ${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
    <meta property="og:locale" content="${esc(SEO_OG.locale || 'zh_CN')}">
    <meta property="og:site_name" content="${esc(SEO_OG.siteName || siteName)}">
    <meta name="twitter:card" content="${esc(SEO_TWITTER.card || 'summary_large_image')}">
    <meta name="twitter:title" content="${esc(siteName)}">
    <meta name="twitter:description" content="${esc(SEO_DESC)}">
    ${ogImage ? `<meta name="twitter:image" content="${esc(ogImage)}">` : ''}
    <script type="application/ld+json">${JSON.stringify({...SEO_JSON_LD, ...jsonLd})}</script>
    <script type="application/ld+json">${JSON.stringify(itemListLd)}</script>
    ${SEO_FAVICON ? `<link rel="icon" href="${esc(SEO_FAVICON)}">` : ''}
    <style>${CSS}</style>
</head>
<body>

<nav class="nav">
    <div class="nav-inner">
        <div class="nav-brand">
            <a class="nav-logo-link" href="${siteUrl}" target="_blank" rel="noopener">
                <img class="nav-logo" src="${esc(fixImg(meta.siteLogo || '', siteUrl))}" alt="${esc(siteName)}">
            </a>
            <div class="nav-brand-text">
                <span class="nav-name">${esc(siteName)}</span>
                <span class="nav-sub">新商城网址：<a href="${siteUrl}" target="_blank" rel="noopener">${esc(siteUrl)}</a></span>
            </div>
        </div>
        <div class="nav-links">
            <a href="${siteUrl}" target="_blank" rel="noopener" class="nav-link">全部商品</a>
            <a href="${siteUrl}" target="_blank" rel="noopener" class="nav-link">帮助中心</a>
            <a href="${siteUrl}" target="_blank" rel="noopener" class="nav-cta">进入商城</a>
        </div>
    </div>
</nav>

<section class="hero">
    <div class="container">
        <div class="hero-eyebrow anim"><span class="dot"></span> 全自动发货 · 即买即用</div>
        <h1 class="anim anim-d1">精选优质<br><span class="highlight">数字账号资源</span></h1>
        <p class="hero-subtitle anim anim-d2">高品质 Google Voice 靓号、Gmail 邮箱、Apple ID 等数字账号，稳定可靠，值得信赖。</p>
        <div class="hero-actions anim anim-d3">
            <a href="${siteUrl}" target="_blank" rel="noopener" class="btn-primary">浏览全部商品 →</a>
            <a href="#features" class="btn-secondary">了解更多</a>
        </div>
    </div>
</section>

<div class="stats-strip">
    <div class="stat-item anim"><div class="stat-value">${activeCats.length}</div><div class="stat-label">商品分类</div></div>
    <div class="stat-item anim anim-d1"><div class="stat-value">${totalProducts}</div><div class="stat-label">在售商品</div></div>
    <div class="stat-item anim anim-d2"><div class="stat-value">${totalVariants}<span class="unit">+</span></div><div class="stat-label">可选规格</div></div>
    <div class="stat-item anim anim-d3"><div class="stat-value">24<span class="unit">h</span></div><div class="stat-label">自动发货</div></div>
</div>

${categorySections}

<section class="features" id="features">
    <div class="container-wide">
        <div class="features-grid">
            <div class="feature-item reveal">
                <span class="feature-emoji">⚡</span>
                <h3>即时自动发货</h3>
                <p>付款后系统自动发送账号信息，无需等待人工处理，24 小时不间断。</p>
            </div>
            <div class="feature-item reveal">
                <span class="feature-emoji">🛡️</span>
                <h3>品质保证</h3>
                <p>所有账号均经过严格验证，质保期内首次登录遇到问题可免费更换。</p>
            </div>
            <div class="feature-item reveal">
                <span class="feature-emoji">💎</span>
                <h3>源头直供</h3>
                <p>一手资源直接供应，无中间商差价，以最优价格获取优质账号。</p>
            </div>
            <div class="feature-item reveal">
                <span class="feature-emoji">🎯</span>
                <h3>靓号可选</h3>
                <p>支持按需挑选心仪号码，精准匹配您的使用场景与个人偏好。</p>
            </div>
        </div>
    </div>
</section>

<section class="cta">
    <div class="container">
        <div class="cta-box reveal">
            <h2>找到你需要的了吗？</h2>
            <p>全场自动发货，安全可靠，品质有保障</p>
            <a href="${siteUrl}" target="_blank" rel="noopener" class="btn-primary">立即前往商城 →</a>
        </div>
    </div>
</section>

<footer class="footer">
    <div class="container">
        <div class="footer-links">
            <a href="${siteUrl}" target="_blank" rel="noopener">🏪 进入商城</a>
        </div>
        <p style="margin-bottom:4px">© ${new Date().getFullYear()} ${esc(siteName)} · 所有商品均为虚拟数字商品</p>
        <p>商城地址：<a class="fine" href="${siteUrl}" target="_blank" rel="noopener">${esc(siteUrl)}</a></p>
    </div>
</footer>

<script>${JS}</script>
</body>
</html>`;

    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
    console.log(`✅ dist/index.html (${(Buffer.byteLength(html)/1024).toFixed(1)}KB)`);
    console.log(`   商品: ${totalProducts} 个`);
    console.log(`   分类: ${activeCats.length} 个`);
    console.log(`   风格: Apple 极简 · 白色主题 · 系统字体`);
}

main();
