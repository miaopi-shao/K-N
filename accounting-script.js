// accounting-script.js - 記帳系統核心邏輯 (已對接核心框架)

// 1. 數據初始化
let records = JSON.parse(localStorage.getItem('my_finances')) || [];
let templates = JSON.parse(localStorage.getItem('my_templates')) || [];

function sync() {
    localStorage.setItem('my_finances', JSON.stringify(records));
}

// 2. 頁面切換控管
function showPage(p) {
    document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
    const targetPage = document.getElementById('page-' + p);
    if (targetPage) targetPage.classList.remove('hidden');

    // 切換頁面時重新觸發對應的渲染
    if (p === 'year') renderYearly();
    else if (p === 'month') render();
    else if (p === 'template') renderTemplates();
    else if (p === 'day') {
        const dateInput = document.getElementById('dateInput');
        if (dateInput) dateInput.valueAsDate = new Date();
    }
}

// 3. 渲染月明細 (核心更新：對接翻譯官)
function render() {
    const list = document.getElementById('monthList');
    const filterInput = document.getElementById('monthFilter');
    if (!list || !filterInput) return;

    const filter = filterInput.value;
    let totalIncome = 0;
    let totalExpense = 0;
    let net = 0;

    list.innerHTML = '';

    const filtered = records
        .filter(r => r.date.startsWith(filter))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-secondary);" data-i18n="acc-no-records">本月暫無記錄</div>`;
    } else {
        filtered.forEach(r => {
            net += r.amount;
            if (r.amount > 0) totalIncome += r.amount;
            else totalExpense += Math.abs(r.amount);

            const div = document.createElement('div');
            div.className = `record-item ${r.amount >= 0 ? 'income' : 'expense'}`;
            div.innerHTML = `
                <div class="record-info">
                    <b style="color:var(--text-primary);">${r.date.slice(5)} · ${r.item}</b>
                    <small style="display:block; color:var(--text-secondary);">${r.amount > 0 ? '+' : ''}${r.amount.toLocaleString()} | ${r.note}</small>
                </div>
                <button class="btn btn-primary" onclick="openEdit(${r.id})" style="width:auto; padding:8px 15px;" data-i18n="acc-edit">編輯</button>
            `;
            list.appendChild(div);
        });
    }

    // 更新儀表板數據
    const balanceDisplay = document.getElementById('balanceDisplay');
    balanceDisplay.textContent = net.toLocaleString();
    balanceDisplay.style.color = net >= 0 ? 'var(--income-text)' : 'var(--expense-text)';
    
    document.getElementById('incomeDisplay').textContent = totalIncome.toLocaleString();
    document.getElementById('expenseDisplay').textContent = totalExpense.toLocaleString();

    // 💡 關鍵：動態內容生成後手動翻譯一次
    if (typeof applyTranslations === 'function') applyTranslations();
}

// 4. 範本與自動生成 (保留你的核心算法)
function generateFromTemplate() {
    const monthVal = document.getElementById('monthFilter').value;
    const month = monthVal.split('-')[1];

    if (confirm('確定要生成本月的範本帳務嗎？')) {
        let count = 0;
        templates.forEach(t => {
            const tMonth = t.month || 'all';
            if (tMonth === 'all' || tMonth === month) {
                const dateStr = `${monthVal}-${String(t.day || 1).padStart(2, '0')}`;
                const exists = records.some(r => r.date === dateStr && r.item === t.item);
                if (!exists) {
                    records.push({
                        id: Date.now() + Math.random(),
                        date: dateStr,
                        item: t.item,
                        amount: t.amount,
                        type: t.type,
                        note: t.note
                    });
                    count++;
                }
            }
        });
        sync();
        render();
        alert(`成功生成 ${count} 筆帳務！`);
    }
}

// 5. 初始化系統
function initAccounting() {
    // 設置預設日期與篩選器
    const today = new Date();
    const dateInput = document.getElementById('dateInput');
    if (dateInput) dateInput.valueAsDate = today;

    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter) monthFilter.value = today.toISOString().slice(0, 7);

    render();
}

// 6.  
function calculate() {
    const target = parseFloat(document.getElementById("targetIncome").value) || 0;
    const rows = document.querySelectorAll("#etfTable tbody tr");
    let monthlyIncome = new Array(12).fill(0);
    let totalCapital = 0;

    rows.forEach(row => {
        const div = parseFloat(row.querySelector(".dividend")?.value || row.querySelector("input[type='number']")?.value) || 0;
        const price = parseFloat(row.querySelectorAll("input[type='number']")[1]?.value) || 0;
        const activeMonths = Array.from(row.querySelectorAll(".month-item.active")).map(el => parseInt(el.innerText));

        if (activeMonths.length === 0 || div === 0) {
            row.querySelector(".shares").innerText = "0 張";
            row.querySelector(".cost").innerText = "0 萬元";
            return;
        }

        // 核心邏輯：張數 = 目標 / 單次配息
        let shares = (target / div).toFixed(1);
        let costInWan = (shares * price * 1000) / 10000;

        row.querySelector(".shares").innerText = shares + " 張";
        row.querySelector(".cost").innerText = costInWan.toFixed(1) + " 萬元";
        totalCapital += costInWan;

        activeMonths.forEach(m => {
            monthlyIncome[m-1] += (shares * div);
        });
    });

    // 渲染月份卡片 (含達標判斷)
    const grid = document.getElementById("monthGrid");
    grid.innerHTML = monthlyIncome.map((amt, i) => {
        const isLow = amt < target * 0.95; // 稍微放寬 5% 判定
        return `
            <div class="month-card ${isLow ? 'low-income' : ''}">
                <h4>${i+1} 月</h4>
                <div class="amt">${Math.round(amt).toLocaleString()}</div>
                <div style="font-size:0.7em; opacity:0.7;">${isLow ? '未達標' : '已達標'}</div>
            </div>
        `;
    }).join('');

    document.getElementById("totalCapital").innerText = totalCapital.toFixed(1);
    const avg = monthlyIncome.reduce((a,b) => a+b, 0) / 12;
    document.getElementById("avgMonthly").innerText = Math.round(avg).toLocaleString();
}

// 監聽全站載入完畢後啟動
window.addEventListener('DOMContentLoaded', initAccounting);

/* 編輯、更新、刪除、範本渲染等剩餘邏輯請保留，但建議在 renderTemplates 結尾也補上 applyTranslations() */
