// car-script.js - 車輛保養專業邏輯 (已對接核心框架)

// 1. 常數與資料庫初始化
const SERVICE_INTERVAL = 5000; // 每 5000km 保養一次
let records = JSON.parse(localStorage.getItem('car_maintenance_db')) || [];

// 2. 資料持久化
function saveData() {
    localStorage.setItem('car_maintenance_db', JSON.stringify(records));
}

// 3. 新增紀錄
function addRecord() {
    const dateInput = document.getElementById('inputDate');
    const mileageInput = document.getElementById('inputMileage');
    const itemInput = document.getElementById('inputItem');
    const costInput = document.getElementById('inputCost');

    const date = dateInput.value;
    const mileage = parseInt(mileageInput.value);
    const item = itemInput.value || '例行維護';
    const cost = parseInt(costInput.value) || 0;

    // 💡 提示：這裡之後可以改用 i18n 的翻譯文字來噴 Alert
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
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    saveData();
    
    // 清空輸入欄位
    itemInput.value = '';
    mileageInput.value = '';
    costInput.value = '';
    
    render();
}

// 4. 刪除紀錄
function deleteRecord(id) {
    if (confirm('確定要刪除這筆紀錄嗎？')) {
        records = records.filter(r => r.id !== id);
        saveData();
        render();
    }
}

// 5. 渲染紀錄列表 (修正：確保樣式與全站一致)
function render() {
    const list = document.getElementById('recordList');
    
    if (records.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:30px; color:var(--text-secondary);" data-i18n="car-no-records">
                還沒有保養紀錄
            </div>`;
    } else {
        list.innerHTML = records.map(r => `
            <div class="record-item">
                <div class="record-info">
                    <b style="color: var(--text-primary);">${r.item}</b>
                    <small style="display:block; color: var(--text-secondary); margin-top:4px;">
                        📅 ${r.date} | 🏎️ ${r.mileage.toLocaleString()} km
                    </small>
                </div>
                <div style="text-align:right;">
                    <div class="amount" style="color: var(--text-accent); font-weight:bold; margin-bottom:8px;">
                        NT$${r.cost.toLocaleString()}
                    </div>
                    <button class="btn btn-danger" onclick="deleteRecord(${r.id})" style="padding: 4px 8px; font-size: 0.8rem;">
                        刪除
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 💡 關鍵：動態內容產生後，手動呼叫一次翻譯官
    if (typeof applyTranslations === 'function') applyTranslations();
    
    updateDashboard();
}

// 6. 更新儀表板
function updateDashboard() {
    const totalMileageEl = document.getElementById('displayTotalMileage');
    const remainingKmEl = document.getElementById('displayRemainingKm');
    const monthCostEl = document.getElementById('displayMonthCost');

    if (records.length === 0) {
        totalMileageEl.innerText = '0 km';
        remainingKmEl.innerText = '-- km';
        monthCostEl.innerText = '$0';
        return;
    }

    const maxMileage = Math.max(...records.map(r => r.mileage));
    const nextService = SERVICE_INTERVAL - (maxMileage % SERVICE_INTERVAL);
    
    totalMileageEl.innerText = `${maxMileage.toLocaleString()} km`;
    remainingKmEl.innerText = `${nextService.toLocaleString()} km`;

    // 倒數變色邏輯 (小於 500km 變紅)
    remainingKmEl.style.color = nextService < 500 ? 'var(--expense-text)' : 'var(--text-accent)';

    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyTotal = records
        .filter(r => r.date.startsWith(currentMonthStr))
        .reduce((sum, r) => sum + r.cost, 0);

    monthCostEl.innerText = `NT$${monthlyTotal.toLocaleString()}`;
}

// 7. 專屬初始化
function initCarSystem() {
    const dateInput = document.getElementById('inputDate');
    if (dateInput) dateInput.valueAsDate = new Date();
    render();
}

// 監聽全站載入完成
window.addEventListener('DOMContentLoaded', initCarSystem);
