// 1. 初始化資料
let records = JSON.parse(localStorage.getItem('my_finances')) || [];

function sync() {
    localStorage.setItem('my_finances', JSON.stringify(records));
}

// 2. 頁面切換控制
function showPage(p) {
    document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById('page-' + p);
    if (target) target.classList.remove('hidden');

    if (p === 'year') renderYearly();
    else if (p === 'month') render();
}

// 3. 修改功能 (修復按鍵無作用)
function openEdit(id) {
    const r = records.find(x => x.id === id);
    if (!r) return;
    
    document.getElementById('editId').value = r.id;
    document.getElementById('editDate').value = r.date;
    document.getElementById('editItem').value = r.item;
    document.getElementById('editAmount').value = r.amount;
    document.getElementById('editNote').value = r.note || '';
    
    document.getElementById('editModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('editModal').classList.add('hidden');
}

function updateRecord() {
    const id = parseInt(document.getElementById('editId').value);
    const idx = records.findIndex(x => x.id === id);
    if (idx !== -1) {
        records[idx].date = document.getElementById('editDate').value;
        records[idx].item = document.getElementById('editItem').value;
        records[idx].amount = parseFloat(document.getElementById('editAmount').value);
        records[idx].note = document.getElementById('editNote').value;
        sync();
        closeModal();
        render();
    }
}

function deleteCurrentRecord() {
    const id = parseInt(document.getElementById('editId').value);
    records = records.filter(x => x.id !== id);
    sync();
    closeModal();
    render();
}

// 4. 年統計功能 (修復不出現問題)
function renderYearly() {
    const yearSelect = document.getElementById('yearFilter');
    if (!yearSelect) return;
    const year = yearSelect.value;
    const body = document.getElementById('yearTableBody');
    if (!body) return;
    
    body.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        const mStr = `${year}-${String(i).padStart(2, '0')}`;
        const mRecs = records.filter(r => r.date.startsWith(mStr));
        
        let inc = 0, exp = 0;
        mRecs.forEach(r => {
            const a = parseFloat(r.amount);
            if (a > 0) inc += a; else exp += Math.abs(a);
        });
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i}月</td>
            <td style="color:#22c55e">${inc.toLocaleString()}</td>
            <td style="color:#ef4444">${exp.toLocaleString()}</td>
            <td style="font-weight:bold; color:${(inc-exp)>=0 ? '#22c55e':'#ef4444'}">${(inc-exp).toLocaleString()}</td>
        `;
        body.appendChild(tr);
    }
}

// 5. 月列表與盈餘渲染
function render() {
    const list = document.getElementById('monthList');
    const filterInput = document.getElementById('monthFilter');
    if (!list || !filterInput) return;

    const filter = filterInput.value;
    let totalInc = 0, totalExp = 0;
    list.innerHTML = '';

    const filtered = records
        .filter(r => r.date.startsWith(filter))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:40px; color:#999;">本月暫無記錄</div>`;
    } else {
        filtered.forEach(r => {
            const val = parseFloat(r.amount);
            if (val >= 0) totalInc += val; else totalExp += Math.abs(val);

            const div = document.createElement('div');
            div.className = `record-item ${val >= 0 ? 'income' : 'expense'}`;
            div.innerHTML = `
                <div>
                    <b style="font-size:1.1em; display:block;">${r.date.slice(5)} ${r.item}</b>
                    <small style="color:#666;">${val.toLocaleString()} | ${r.note || ''}</small>
                </div>
                <button class="mod-btn" onclick="openEdit(${r.id})">修改</button>
            `;
            list.appendChild(div);
        });
    }

    document.getElementById('balanceDisplay').textContent = (totalInc - totalExp).toLocaleString();
    document.getElementById('balanceDisplay').style.color = (totalInc - totalExp) >= 0 ? '#22c55e' : '#ef4444';
    document.getElementById('incomeDisplay').textContent = totalInc.toLocaleString();
    document.getElementById('expenseDisplay').textContent = totalExp.toLocaleString();
}

// 6. 初始化
window.addEventListener('DOMContentLoaded', () => {
    // 年份選單初始化
    const yF = document.getElementById('yearFilter');
    if (yF) {
        const curY = new Date().getFullYear();
        for (let y = curY - 2; y <= curY + 2; y++) {
            const opt = document.createElement('option');
            opt.value = y; opt.textContent = y + '年';
            if (y === curY) opt.selected = true;
            yF.appendChild(opt);
        }
    }
    
    // 月份篩選器預設
    const mF = document.getElementById('monthFilter');
    if (mF && !mF.value) mF.value = new Date().toISOString().slice(0, 7);
    
    render();
});
