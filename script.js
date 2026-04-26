// script.js - 全站核心控管 (主題 + 側邊欄 + 設定 + 字體)

// 1. 初始化與啟動
document.addEventListener('DOMContentLoaded', () => {
    initTheme();       // 載入亮暗色
    initFontSize();    // 載入字體大小
    loadCoreModules(); // 載入側邊欄與設定彈窗
});

// 2. 主題控管
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = target === 'light' ? '🌙' : '☀️';
}

// 3. 字體大小控管
function initFontSize() {
    const savedSize = localStorage.getItem('userFontSize') || 'normal';
    setFontSize(savedSize);
}

function setFontSize(size) {
    const root = document.documentElement;
    let pixelSize = '16px';
    switch(size) {
        case 'small': pixelSize = '14px'; break;
        case 'normal': pixelSize = '16px'; break;
        case 'large': pixelSize = '18px'; break;
        case 'xlarge': pixelSize = '20px'; break;
    }
    root.style.setProperty('--base-font-size', pixelSize);
    localStorage.setItem('userFontSize', size);
    updateSettingsButtonStates(); 
}

// 4. 模組加載 (側邊欄 + 設定彈窗)
function loadCoreModules() {
    // A. 載入側邊欄
    const sidebarContainer = document.getElementById('sidebarContainer');
    if (sidebarContainer) {
        fetch('sidebar.html')
            .then(res => res.text())
            .then(html => {
                sidebarContainer.innerHTML = html;
                syncSidebarState();
                markActivePage();
            });
    }

    // B. 載入設定彈窗 (核心保命符：自動注入 HTML)
    if (!document.getElementById('settingsModal')) {
        fetch('settings-modal.html')
            .then(res => res.text())
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
            });
    }
}

// 5. 側邊欄邏輯
function syncSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const sidebar = document.getElementById('sidebar');
    if (isCollapsed && sidebar) {
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const isCollapsed = sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

function markActivePage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if (link.getAttribute('href') === page) link.classList.add('active');
    });
}

// 6. 設定彈窗交互
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('active');
        updateSettingsButtonStates();
    }
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('active');
}

// 更新設定按鈕的高亮狀態 (修正文字判斷的紅叉)
function updateSettingsButtonStates() {
    const currentSize = localStorage.getItem('userFontSize') || 'normal';
    // 透過 onclick 屬性包含的字串來比對，更準確
    document.querySelectorAll('.settings-btn').forEach(btn => {
        btn.classList.remove('active');
        const clickAttr = btn.getAttribute('onclick') || '';
        if (clickAttr.includes(`'${currentSize}'`)) {
            btn.classList.add('active');
        }
    });
}

// 點擊彈窗外部關閉
window.addEventListener('click', (e) => {
    const modal = document.getElementById('settingsModal');
    if (e.target === modal) closeSettings();
});

// 回首頁功能
function goHome() {
    window.location.href = 'index.html';
}
