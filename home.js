// 主題切換
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.title = theme === 'light' ? '切換到暗色主題' : '切換到亮色主題';
}

// 側邊欄載入
function loadSidebar() {
    fetch('sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebarContainer').innerHTML = html;
            
            setTimeout(() => {
                const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
                if (isSidebarCollapsed) {
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) {
                        sidebar.classList.add('collapsed');
                        document.body.classList.add('sidebar-collapsed');
                    }
                }

                const currentPage = 'home.html';
                document.querySelectorAll('.sidebar-link').forEach(link => {
                    if (link.getAttribute('href') === currentPage) {
                        link.classList.add('active');
                    }
                });
            }, 100);
        })
        .catch(err => console.log('側邊欄載入失敗:', err));
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadSidebar();
});