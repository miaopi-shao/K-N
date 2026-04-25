// 主題切換
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // 設置初始主題
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // 綁定切換事件
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

// 車輛保養紀錄
const SERVICE_INTERVAL = 5000; // 每 5000km 保養一次
let records = JSON.parse(localStorage.getItem('car_maintenance_db')) || [];

function saveData() {
    localStorage.setItem('car_maintenance_db', JSON.stringify(records));
}

// 新增紀錄
function addRecord() {
    const date = document.getElementById('inputDate').value;
    const mileage = parseInt(document.getElementById('inputMileage').value);
    const item = document.getElementById('inputItem').value || '例行維護';
    const cost = parseInt(document.getElementById('inputCost').value) || 0;

    if (!date || isNaN(mileage)) {
        alert('請輸入完整的日期與里程！');
        return;
    }

    const newRecord = { 
        id: Date.now(), 
        date, 
        mileage, 
        item, 
        cost 
    };
    
    records.push(newRecord);
    
    // 按日期排序（最新排最前）
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    saveData();
    
    // 清空表單
    document.getElementById('inputItem').value = '';
    document.getElementById('inputMileage').value = '';
    document.getElementById('inputCost').value = '';
    
    alert('紀錄已儲存！');
    render();
}

// 刪除紀錄
function deleteRecord(id) {
    if (confirm('確定要刪除這筆紀錄嗎？')) {
        records = records.filter(r => r.id !== id);
        saveData();
        render();
    }
}

// 渲染紀錄列表
function render() {
    const list = document.getElementById('recordList');
    
    if (records.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-secondary);">還沒有保養紀錄</div>';
    } else {
        list.innerHTML = records.map(r => `
            <div class="record-item ${r.cost > 2000 ? 'expense' : ''}">
                <div class="record-info">
                    <b>${r.item}</b>
                    <small>📅 ${r.date} | 🏎️ ${r.mileage.toLocaleString()} km</small>
                </div>
                <div style="text-align:right;">
                    <div class="amount" style="margin-bottom:8px;">NT$${r.cost.toLocaleString()}</div>
                    <button class="btn btn-danger" onclick="deleteRecord(${r.id})">刪除</button>
                </div>
            </div>
        `).join('');
    }

    updateDashboard();
}

// 更新儀表板
function updateDashboard() {
    if (records.length === 0) {
        document.getElementById('displayTotalMileage').innerText = '0 km';
        document.getElementById('displayRemainingKm').innerText = '-- km';
        document.getElementById('displayMonthCost').innerText = '$0';
        return;
    }

    // 找到最高里程數
    const maxMileage = Math.max(...records.map(r => r.mileage));
    const nextService = SERVICE_INTERVAL - (maxMileage % SERVICE_INTERVAL);
    
    document.getElementById('displayTotalMileage').innerText = `${maxMileage.toLocaleString()} km`;
    document.getElementById('displayRemainingKm').innerText = `${nextService.toLocaleString()} km`;

    // 本月支出統計
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyTotal = records
        .filter(r => r.date.startsWith(currentMonthStr))
        .reduce((sum, r) => sum + r.cost, 0);

    document.getElementById('displayMonthCost').innerText = `NT$${monthlyTotal.toLocaleString()}`;
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // 初始化日期為今日
    document.getElementById('inputDate').valueAsDate = new Date();
    
    render();
});