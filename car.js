// 核心設定：保養週期 (未來可由 UI 設定)
const MAINTENANCE_INTERVAL = 5000; 

let records = JSON.parse(localStorage.getItem('car_records')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderRecords();
    updateSummary();
});

// 主題切換邏輯
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', targetTheme);
    });
}

// 新增紀錄
function addRecord() {
    const date = document.getElementById('inputDate').value;
    const mileage = parseInt(document.getElementById('inputMileage').value);
    const item = document.getElementById('inputItem').value;
    const cost = parseInt(document.getElementById('inputCost').value) || 0;

    // 核心邏輯檢核
    if (!date || isNaN(mileage)) {
        alert("日期與里程為必填項，請檢查是否有紅叉錯誤 (空值)");
        return;
    }

    const newRecord = {
        id: Date.now(),
        date,
        mileage,
        item,
        cost
    };

    records.unshift(newRecord); // 新的排前面
    localStorage.setItem('car_records', JSON.stringify(records));
    
    // 清空輸入
    document.getElementById('inputMileage').value = '';
    document.getElementById('inputItem').value = '';
    
    renderRecords();
    updateSummary();
}

// 更新總覽數據
function updateSummary() {
    if (records.length === 0) return;

    const latestMileage = records[0].mileage;
    const lastServiceMileage = records[0].mileage; // 簡化邏輯：取最近一次
    const remaining = MAINTENANCE_INTERVAL - (latestMileage % MAINTENANCE_INTERVAL);

    document.getElementById('displayTotalMileage').innerText = `${latestMileage.toLocaleString()} km`;
    document.getElementById('displayRemainingKm').innerText = `${remaining.toLocaleString()} km`;
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthTotal = records
        .filter(r => r.date.startsWith(currentMonth))
        .reduce((sum, r) => sum + r.cost, 0);
    
    document.getElementById('displayMonthCost').innerText = `$${monthTotal.toLocaleString()}`;
}

// 渲染列表
function renderRecords() {
    const list = document.getElementById('recordList');
    list.innerHTML = records.map(r => `
        <div class="record-item ${r.cost > 1000 ? 'expense' : ''}">
            <div class="record-info">
                <b>${r.item || '一般檢查'}</b>
                <small>📅 ${r.date} | 🏎️ ${r.mileage} km</small>
            </div>
            <div style="text-align: right;">
                <div class="amount">$${r.cost}</div>
                <button class="btn btn-danger" onclick="deleteRecord(${r.id})" style="padding: 2px 8px; font-size: 10px;">刪除</button>
            </div>
        </div>
    `).join('');
}

function deleteRecord(id) {
    records = records.filter(r => r.id !== id);
    localStorage.setItem('car_records', JSON.stringify(records));
    renderRecords();
    updateSummary();
}

function showPage(pageId) {
    console.log("切換至:", pageId);
    // 未來可擴充多頁面隱藏/顯示邏輯
}
