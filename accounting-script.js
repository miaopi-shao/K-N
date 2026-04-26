// accounting-script.js - 記帳系統核心邏輯 (修正：移除冗餘 ETF 邏輯)

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

    if (p === 'year') renderYearly();
    else if (p === 'month') render();
    else if (p === 'template') renderTemplates();
}

// 3. 渲染月明細
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
        list.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-secondary);">本月暫無記錄</div>`;
    } else {
        filtered.forEach(r => {
            net += r.amount;
            if (r.amount > 0) totalIncome += r.amount;
            else totalExpense += Math.abs(r.amount);

            // 渲染明細項目
            const div = document.createElement('div');
            div.className = `record-item ${r.amount >= 0 ? 'income' : 'expense'}`;
            div.innerHTML = `
                <div class="record-info">
                    <b style="color:var(--text-primary);">${r.date.slice(5)} · ${r.item}</b>
                    <small style="display:block; color:var(--text-secondary);">${r.amount > 0 ? '+' : ''}${r.amount.toLocaleString()} | ${r.note}</small>
                </div>
                <button class="btn btn-primary" onclick="openEdit(${r.id})" style="width:auto; padding:8px 15px;">編輯</button>
            `;
            list.appendChild(div);
        });
    }

    // 更新儀表板數據 (對接卡片數字)
    const balanceDisplay = document.getElementById('balanceDisplay');
    if (balanceDisplay) {
        balanceDisplay.textContent = net.toLocaleString();
        balanceDisplay.style.color = net >= 0 ? 'var(--text-success)' : 'var(--text-error)';
    }
    
    const incDisp = document.getElementById('incomeDisplay');
    const expDisp = document.getElementById('expenseDisplay');
    if (incDisp) incDisp.textContent = totalIncome.toLocaleString();
    if (expDisp) expDisp.textContent = totalExpense.toLocaleString();
}

// 4. 範本與自動生成 (保持你的核心算法)
function generateFromTemplate() {
    const monthVal = document.getElementById('monthFilter').value; // 取得如 "2026-04"
    if (!monthVal) return;
    
    const month = monthVal.split('-')[1]; // 取得 "04"

    if (confirm('確定要生成本月的範本帳務嗎？')) {
        let count = 0;
        templates.forEach(t => {
            // 判斷該範本是否適用於本月
            const tMonth = t.month || 'all'; 
            if (tMonth === 'all' || tMonth === month) {
                // 組合日期字串 (預設為該月 1 號，或範本指定的日期)
                const dateStr = `${monthVal}-${String(t.day || 1).padStart(2, '0')}`;
                
                // ❌ 防重複檢查：如果在 records 裡已經有這筆了，就不重複生成
                const exists = records.some(r => r.date === dateStr && r.item === t.item);
                
                if (!exists) {
                    records.push({
                        id: Date.now() + Math.random(), // 生成唯一 ID
                        date: dateStr,
                        item: t.item,
                        amount: t.amount,
                        type: t.type,
                        note: t.note || '自動生成'
                    });
                    count++;
                }
            }
        });

        if (count > 0) {
            sync();   // 儲存到 LocalStorage
            render(); // 重新渲染畫面
            alert(`成功生成 ${count} 筆帳務！`);
        } else {
            alert('本月範本已全部生成，無須重複操作。');
        }
    }
}

/**
 * 渲染範本列表 (用於管理介面)
 */
function renderTemplates() {
    const tList = document.getElementById('templateList');
    if (!tList) return;

    tList.innerHTML = templates.map((t, idx) => `
        <div class="record-item">
            <div class="record-info">
                <b>${t.item} (${t.month === 'all' ? '每月' : t.month + '月'})</b>
                <small>${t.amount.toLocaleString()} | 預設 ${t.day || 1} 號</small>
            </div>
            <button class="btn btn-danger" onclick="deleteTemplate(${idx})" style="width:auto; padding:5px 10px;">刪除</button>
        </div>
    `).join('');
}

// 5. 初始化系統
function initAccounting() {
    const today = new Date();
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter) monthFilter.value = today.toISOString().slice(0, 7);
    render();
}

// ❌ 原本第 6 點的 calculate() (ETF 邏輯) 已刪除，請移動到 etf-logic.js

window.addEventListener('DOMContentLoaded', initAccounting);
