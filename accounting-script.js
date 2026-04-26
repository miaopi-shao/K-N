// accounting-script.js - 1.5 專業對接版
let records = JSON.parse(localStorage.getItem('my_finances')) || [];

function sync() {
    localStorage.setItem('my_finances', JSON.stringify(records));
}

// 修正後的頁面切換控管
function showPage(p) {
    // 1. 隱藏所有頁面
    document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
    
    // 2. 顯示目標頁面 (確保 HTML id 存在，如 page-year, page-month)
    const targetPage = document.getElementById('page-' + p);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }

    // 3. 根據頁面執行對應渲染邏輯
    if (p === 'year') {
        renderYearly(); // 執行年總覽邏輯
    } else if (p === 'month') {
        render(); // 執行月明細邏輯
    } else if (p === 'template') {
        renderTemplates(); // 執行範本邏輯
    }
}

function render() {
    const list = document.getElementById('monthList');
    const filterInput = document.getElementById('monthFilter');
    if (!list || !filterInput) return;

    const filter = filterInput.value;
    let totalIncome = 0, totalExpense = 0, net = 0;
    list.innerHTML = '';

    const filtered = records
        .filter(r => r.date.startsWith(filter))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:40px; color:#999;">本月暫無記錄</div>`;
    } else {
        filtered.forEach(r => {
            const isInc = r.amount >= 0;
            if (isInc) totalIncome += r.amount;
            else totalExpense += Math.abs(r.amount);
            net += r.amount;

            const div = document.createElement('div');
            div.className = `record-item ${isInc ? 'income' : 'expense'}`;
            div.innerHTML = `
                <div class="record-info">
                    <b class="rec-title">${r.date.slice(5)} ${r.item}</b>
                    <span class="rec-amt">${r.amount.toLocaleString()} | ${r.note || ''}</span>
                </div>
                <button class="mod-btn" onclick="openEdit(${r.id})">修改</button>
            `;
            list.appendChild(div);
        });
    }

    // 對接 1.4 版 HTML 的 ID
    const balDisp = document.getElementById('balanceDisplay');
    if (balDisp) {
        balDisp.textContent = net.toLocaleString();
        balDisp.style.color = net >= 0 ? '#28a745' : '#dc3545';
    }
    document.getElementById('incomeDisplay').textContent = totalIncome.toLocaleString();
    document.getElementById('expenseDisplay').textContent = totalExpense.toLocaleString();
}

function initAccounting() {
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter && !monthFilter.value) {
        monthFilter.value = new Date().toISOString().slice(0, 7);
    }
    render();
}
window.addEventListener('DOMContentLoaded', initAccounting);
