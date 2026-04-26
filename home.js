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

// 側邊欄整合
function loadSidebar() {
    fetch('sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebarContainer').innerHTML = html;
            // 執行側邊欄的初始化代碼
            const script = document.createElement('script');
            script.textContent = `
                window.addEventListener('DOMContentLoaded', () => {
                    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
                    if (isSidebarCollapsed) {
                        document.getElementById('sidebar').classList.add('collapsed');
                        document.body.classList.add('sidebar-collapsed');
                    }

                    const currentPage = window.location.pathname.split('/').pop() || 'accounting.html';
                    document.querySelectorAll('.sidebar-link').forEach(link => {
                        if (link.getAttribute('href') === currentPage) {
                            link.classList.add('active');
                        }
                    });
                });

                function toggleSidebar() {
                    const sidebar = document.getElementById('sidebar');
                    sidebar.classList.toggle('collapsed');
                    document.body.classList.toggle('sidebar-collapsed');
                    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
                }

                function goHome() {
                    window.location.href = 'welcome.html';
                }
            `;
            document.body.appendChild(script);
        })
        .catch(err => console.log('側邊欄載入失敗:', err));
}
// 初始化
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadSidebar();
});
