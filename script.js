// ==========================================================
// 安根創新 AiGenValue — 網站互動
// ==========================================================

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initForms();
    initReveal();
    initCounters();
    initHeroConsole();
    initBlog();
});

// ---------- 導航欄 ----------
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            const open = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', String(open));
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 平滑滾動（僅處理頁內錨點）
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 滾動狀態與進度條
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    const onScroll = () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 8);
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = docHeight > 0 ? (window.scrollY / docHeight) * 100 + '%' : '0%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ---------- 表單 ----------
// 聯絡表單透過 Google Apps Script 寄信
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxSt991pMmi-rMp4sD2ubERpLPgsIl9-fTbaEpPEIw1uoz6pqmwMaXntDD_qMqhMMrIeg/exec';

function initForms() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = this.querySelector('#name, input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();

            if (!name || !email || !message) {
                showNotification('請填寫所有必填欄位', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                showNotification('請輸入有效的電子郵件地址', 'error');
                return;
            }
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = '送出中...';
            btn.disabled = true;

            const data = {
                name,
                email,
                company: (this.querySelector('[name="company"]') || {}).value || '',
                message
            };

            fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(() => {
                    showNotification('需求已送出，我們會盡快與您聯絡。', 'success');
                    this.reset();
                })
                .catch(() => {
                    showNotification('送出失敗，請直接寄信至 teralionai@gmail.com', 'error');
                })
                .finally(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                });
        });
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            if (!isValidEmail(email)) {
                showNotification('請輸入有效的電子郵件地址', 'error');
                return;
            }
            showNotification('訂閱成功，感謝您的關注。', 'success');
            this.reset();
        });
    }
}

// ---------- 進場動畫 ----------
function initReveal() {
    const targets = document.querySelectorAll('.product-card, .step, .example-card, .stat, .blog-card');
    if (!targets.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity .5s ease ${(i % 4) * 60}ms, transform .5s ease ${(i % 4) * 60}ms`;
        observer.observe(el);
    });
}

// ---------- 數字動畫 ----------
function initCounters() {
    const stats = document.querySelectorAll('.stat h3[data-count]');
    if (!stats.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const end = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            animateNumber(el, 0, end, 1500, suffix);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration, suffix) {
    const startTime = performance.now();
    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        element.textContent = Math.floor(start + (end - start) * eased) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ---------- Hero 指令示範 ----------
function initHeroConsole() {
    const promptEl = document.getElementById('promptText');
    const logItems = document.querySelectorAll('#consoleLog li');
    if (!promptEl) return;

    const prompts = [
        '建一個公司官網，有產品介紹、最新消息和聯絡表單',
        '建立客戶管理系統，業務登錄拜訪紀錄，主管看週報',
        '建置客服助理，讀取產品手冊回答問題，後台可看對話與工單'
    ];

    let index = 0;
    let timer = null;
    let cycleTimer = null;

    function typePrompt(text, done) {
        clearTimeout(timer);
        promptEl.textContent = '';
        logItems.forEach(li => li.classList.remove('show'));
        let i = 0;
        function step() {
            promptEl.textContent = text.slice(0, i++);
            if (i <= text.length) {
                timer = setTimeout(step, 45);
            } else {
                logItems.forEach((li, n) => {
                    setTimeout(() => li.classList.add('show'), 400 + n * 450);
                });
                if (done) done();
            }
        }
        step();
    }

    function cycle() {
        typePrompt(prompts[index], () => {
            clearTimeout(cycleTimer);
            cycleTimer = setTimeout(() => {
                index = (index + 1) % prompts.length;
                cycle();
            }, 5200);
        });
    }

    cycle();

    // 指令範例卡片：點擊後帶入示範
    document.querySelectorAll('.example-card[data-prompt]').forEach(card => {
        card.addEventListener('click', function () {
            clearTimeout(cycleTimer);
            typePrompt(this.dataset.prompt, () => {
                cycleTimer = setTimeout(() => {
                    index = (index + 1) % prompts.length;
                    cycle();
                }, 8000);
            });
            const hero = document.getElementById('home');
            if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ---------- 技術文章頁 ----------
function initBlog() {
    const blogCards = document.querySelectorAll('.blog-card');
    const filterTabs = document.querySelectorAll('.filter-tab');

    function applyFilter(category) {
        blogCards.forEach(card => {
            const match = category === 'all' || card.dataset.category === category;
            card.style.display = match ? '' : 'none';
        });
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            applyFilter(this.dataset.category);
        });
    });

    document.querySelectorAll('.tag[data-category]').forEach(tag => {
        tag.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            filterTabs.forEach(t => t.classList.toggle('active', t.dataset.category === category));
            applyFilter(category);
        });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const term = this.value.toLowerCase();
            blogCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.querySelector('p').textContent.toLowerCase();
                card.style.display = (title.includes(term) || content.includes(term)) ? '' : 'none';
            });
        });
    }

    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ---------- 工具 ----------
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    requestAnimationFrame(() => notification.classList.add('show'));

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
