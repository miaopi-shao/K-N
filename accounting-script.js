// accounting-script.js - 記帳系統核心邏輯 1.5版
let records = JSON.parse(localStorage.getItem('my_finances')) || [];
let templates = JSON.parse(localStorage.getItem('my_templates')) || [];

function sync() {
    localStorage.setItem('my_finances', JSON.stringify(records));
}

function showPage(p) {
    document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
    const targetPage = document.getElementById('page-' + p);
    if (targetPage) targetPage.classList.remove('hidden');
    // 渲染特定頁面邏輯
    if (p === 'month') render();
    else if (p === 'template') renderTemplates();
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
        list.innerHTML = `<div style="text-align:center; padding:50px; color:#888; font-weight:bold;">本月暫無記錄</div>`;
    } else {
        filtered.forEach(r => {
            if (r.amount > 0) totalIncome += r.amount;
            else totalExpense += Math.abs(r.amount);
            net += r.amount;

            const div = document.createElement('div');
            // 對接截圖中的條狀樣式
            div.className = `record-item ${r.amount >= 0 ? 'income' : 'expense'}`;
            div.innerHTML = `
                <div class="record-info">
                    <b class="record-title">${r.date.slice(5)} ${r.item}</b>
                    <span class="record-amount">${r.amount.toLocaleString()} | ${r.note || ''}</span>
                </div>
                <button class="edit-btn" onclick="openEdit(${r.id})">修改</button>
            `;
            list.appendChild(div);
        });
    }

    // 更新看板數據 (對接 HTML id)
    const balDisp = document.getElementById('balanceDisplay');
    const incDisp = document.getElementById('incomeDisplay');
    const expDisp = document.getElementById('expenseDisplay');

    if (balDisp) {
        balDisp.textContent = net.toLocaleString();
        balDisp.style.color = net >= 0 ? '#4ade80' : '#fb7185'; // 盈餘配色
    }
    if (incDisp) incDisp.textContent = totalIncome.toLocaleString();
    if (expDisp) expDisp.textContent = totalExpense.toLocaleString();
}

// 初始化
function initAccounting() {
    const today = new Date();
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter) monthFilter.value = today.toISOString().slice(0, 7);
    render();
}

window.addEventListener('DOMContentLoaded', initAccounting);
