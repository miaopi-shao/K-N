const SERVICE_INTERVAL = 5000; // 每 5000km 保養一次
let records = JSON.parse(localStorage.getItem('car_maintenance_db')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // 初始化日期為今日
    document.getElementById('inputDate').valueAsDate = new Date();
    render();
});

// 新增紀錄邏輯
function addRecord() {
    const date = document.getElementById('inputDate').value;
    const mileage = parseInt(document.getElementById('inputMileage').value);
    const item = document.getElementById('inputItem').value || "例行維護";
    const cost = parseInt(document.getElementById('inputCost').value) || 0;

    if (!date || isNaN(mileage)) {
        alert("請輸入完整的日期與里程！");
        return;
    }

    const newRecord = { id: Date.now(), date, mileage, item, cost };
    records.push(newRecord);
    
    // 排序：確保里程由高到低（最新排最前）
    records.sort((a, b) => new Date(b.date) - new Date(a.date) || b.mileage - a.mileage);
    
    save();
}

function save() {
    localStorage.setItem('car_maintenance_db', JSON.stringify(records));
    render();
}

function render() {
    const list = document.getElementById('recordList');
    list.innerHTML = records.map(r => `
        <div class="record-item ${r.cost > 2000 ? 'expense' : ''}">
            <div class="record-info">
                <b>${r.item}</b>
                <small>📅 ${r.date} | 🏎️ ${r.mileage.toLocaleString()} km</small>
            </div>
            <div style="text-align:right">
                <div class="amount">$${r.cost.toLocaleString()}</div>
                <button class="btn btn-danger" onclick="deleteRecord(${r.id})" style="padding:2px 8px; font-size:10px; margin-top:5px;">刪除</button>
            </div>
        </div>
    `).join('');

    updateDashboard();
}

function updateDashboard() {
    if (records.length === 0) return;

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

    document.getElementById('displayMonthCost').innerText = `$${monthlyTotal.toLocaleString()}`;
}

function deleteRecord(id) {
    if (confirm("確定要刪除這筆紀錄嗎？")) {
        records = records.filter(r => r.id !== id);
        save();
    }
}

// 主題切換
document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});
