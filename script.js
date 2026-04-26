// script.js - 全站核心 (側邊欄 + 主題)

// 1. 初始化主題
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    // 更新切換按鈕圖示 (如果有按鈕的話)
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
}

// 2. 切換主題
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = target === 'light' ? '🌙' : '☀️';
}

// 3. 載入側邊欄 (核心保命符)
function loadSidebar() {
    const container = document.getElementById('sidebarContainer');
    if (!container) return; // 防錯：如果頁面沒這個 div 就不執行

    fetch('sidebar.html')
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;
            // 同步側邊欄狀態
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed) {
                document.getElementById('sidebar').classList.add('collapsed');
                document.body.classList.add('sidebar-collapsed');
            }
            // 標記當前頁面 Active 狀態
            const page = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.sidebar-link').forEach(link => {
                if (link.getAttribute('href') === page) link.classList.add('active');
            });
        });
}

// 4. 側邊欄縮放切換 (讓全站頁面都能呼叫)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

// 初始化啟動
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadSidebar();
});
