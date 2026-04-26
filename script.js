// script.js - 全站核心控管 (主題 + 側邊欄 + 設定 + 字體)

// 1. 初始化與啟動 (確保載入時沒紅叉)
document.addEventListener('DOMContentLoaded', () => {
    initTheme();       // 載入亮暗色
    initFontSize();    // 載入字體大小
    loadCoreModules(); // 載入側邊欄與設定彈窗
});

// 2. 主題控管 (亮色/暗色切換)
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

// 3. 字體大小控管 (設定功能)
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

// 4. 模組加載 (側邊欄 + 設定彈窗的外部載入)
function loadCoreModules() {
    // 🏠 側邊欄載入區
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

    // ⚙️ 設定彈窗注入區 (防止其他頁面漏掉)
    if (!document.getElementById('settingsModal')) {
        fetch('settings-modal.html')
            .then(res => res.text())
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
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
    window.location.href = 'index.html'; 
}

// 8. 設定頁面內的高亮邏輯 (確保按鈕顯示正確狀態)
function updateSettingsButtonStates() {
    const currentSize = localStorage.getItem('userFontSize') || 'normal';
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

// 10. 頁面選中提示 (Sidebar 連結高亮)
function markActivePage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if (link.getAttribute('href') === page) link.classList.add('active');
    });
}
