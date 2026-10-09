// ==========================================================
// 安根創新 AiGenValue — 網站互動
// ==========================================================

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initForms();
    initReveal();
    initCounters();
    initHeroConsole();
});

// ---------- 導航欄 ----------
function isMobileNav() {
    return window.matchMedia('(max-width: 768px)').matches;
}

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
            link.addEventListener('click', (e) => {
                // 手機版：點「產品」只展開子選單，不關閉主選單
                if (link.classList.contains('nav-dropdown-toggle') && isMobileNav()) {
                    e.preventDefault();
                    const item = link.closest('.nav-dropdown');
                    const open = item.classList.toggle('open');
                    link.setAttribute('aria-expanded', String(open));
                    return;
                }
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
            });
        });
    }

    // 桌機版：點擊「產品」切換下拉；點外面或按 Esc 關閉
    const dropdown = document.querySelector('.nav-dropdown');
    if (dropdown) {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        toggle.addEventListener('click', (e) => {
            if (isMobileNav()) return;
            e.preventDefault();
            const open = dropdown.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });
        dropdown.querySelectorAll('.nav-dropdown-menu a').forEach(a => {
            a.addEventListener('click', () => {
                dropdown.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                a.blur();
            });
        });
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') dropdown.classList.remove('open');
        });
    }

    // 平滑滾動（僅處理頁內錨點）
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length < 2 || this.classList.contains('nav-dropdown-toggle')) return;
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
// 本站為 GitHub Pages 靜態網頁，不在線上收集表單資料；
// 聯絡方式改為 mailto 連結，並提供「複製 Email」按鈕。
function initForms() {
    const copyBtn = document.getElementById('copyEmailBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            const email = this.dataset.email;
            const btn = this;
            const done = () => {
                showNotification('已複製 ' + email, 'success');
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = '<i class="far fa-copy"></i>'; }, 1600);
            };
            const fail = () => showNotification('無法自動複製，請手動選取 Email', 'error');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(done).catch(fail);
            } else {
                const range = document.createRange();
                range.selectNodeContents(document.getElementById('contactEmailText'));
                const sel = window.getSelection();
                sel.removeAllRanges(); sel.addRange(range);
                try { document.execCommand('copy') ? done() : fail(); } catch (e) { fail(); }
                sel.removeAllRanges();
            }
        });
    }
}

// ---------- 進場動畫 ----------
function initReveal() {
    const targets = document.querySelectorAll('.product-card, .step, .example-card, .stat, .invoice-copy, .invoice-visual, .security-card, .security-process');
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

// ---------- 工具 ----------
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
