// script.js - 全站核心控管 (主題 + 側邊欄 + 設定 + 字體)
// script.js - 全站核心控管 (修正對接版)

document.addEventListener('DOMContentLoaded', () => {
    // 💡 新增：首頁導向邏輯 (解決問題 1)
    const path = window.location.pathname.split('/').pop();
    if ((path === 'index.html' || path === '') && !sessionStorage.getItem('visited')) {
        sessionStorage.setItem('visited', 'true');
        window.location.href = 'welcome.html';
        return; 
    }

    // 💡 1. 優先載入字體與語言 (i18n.js 負責)
    if (typeof initI18n === 'function') initI18n(); 

    initTheme();       // 載入亮暗色主題
    loadCoreModules(); // 載入外部組件 (側邊欄與設定)
});

// 2. 主題控管 (修正：考慮非同步載入按鈕的情況)
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    // 這裡不直接改 icon，改在 loadCoreModules 成功後再改
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
    updateThemeIcon(target);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
}

// 3. 字體大小控管 (⚠️ 報廢，改由呼叫 i18n.js 的方法)
function changeFontSize(size) {
    if (typeof setFontSize === 'function') { // 呼叫 i18n.js 裡的 setFontSize
        setFontSize(size);
        updateSettingsButtonStates(); 
    }
}

// 4. 模組加載 (修正：加入翻譯對接)
function loadCoreModules() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    if (sidebarContainer) {
        fetch('sidebar.html')
            .then(res => res.text())
            .then(html => {
                sidebarContainer.innerHTML = html;
                
                // 💡 關鍵對接：側邊欄出來後立刻做四件事
                if (typeof applyTranslations === 'function') applyTranslations(); // 1. 翻譯
                updateThemeIcon(localStorage.getItem('theme') || 'light');        // 2. 顯示正確主題圖示
                syncSidebarState();                                               // 3. 同步縮放狀態
                markActivePage();                                                 // 4. 高亮當前頁
            });
    }

    if (!document.getElementById('settingsModal')) {
        fetch('settings-modal.html')
            .then(res => res.text())
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
                if (typeof applyTranslations === 'function') applyTranslations(); // 翻譯設定彈窗
            });
    }
}

// 5. 側邊欄控制 (對應 sidebar.html 裡的 ☰ 圖示)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const isCollapsed = sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// ⚠️ 狀態同步：確保換頁後縮放狀態不變
function syncSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const sidebar = document.getElementById('sidebar');
    if (isCollapsed && sidebar) {
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
    }
}

// 6. 系統設定彈窗 (對應 sidebar.html 裡的 ⚙️ 圖示)
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('active');
        updateSettingsButtonStates();
    } else {
        console.warn("提示：設定彈窗 HTML 還在加載，請稍候。");
    }
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('active');
}

// 7. 回到主頁 (對應 sidebar.html 裡的 🏠 圖示)
function goHome() {
    window.location.href = 'welcome.html'; 
}

// 8. 設定按鈕高亮 (修正：對齊 i18n.js 的變數名稱)
function updateSettingsButtonStates() {
    const currentSize = localStorage.getItem('fontSize') || 'normal'; // 注意：i18n.js 用的是 'fontSize'
    document.querySelectorAll('.settings-btn').forEach(btn => {
        btn.classList.remove('active');
        const clickAttr = btn.getAttribute('onclick') || '';
        if (clickAttr.includes(`'${currentSize}'`)) {
            btn.classList.add('active');
        }
    });
}

// 9. 輔助檢查：點擊背景關閉設定
window.addEventListener('click', (e) => {
    const modal = document.getElementById('settingsModal');
    if (e.target === modal) closeSettings();
});

// 10. 頁面選中提示 (修正：ETF 檔案更名)
function markActivePage() {
    let page = window.location.pathname.split('/').pop() || 'index.html';
    // ⚠️ 特殊處理：如果抓到是 index.html，確保它對應側邊欄的連結
    document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === page) link.classList.add('active');
    });
}
