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

// 記帳系統數據
let records = JSON.parse(localStorage.getItem('my_finances')) || [];
let templates = JSON.parse(localStorage.getItem('my_templates')) || [];

function sync() {
    localStorage.setItem('my_finances', JSON.stringify(records));
}

// 顯示/隱藏頁面
function showPage(p) {
    document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
    document.getElementById('page-' + p).classList.remove('hidden');

    if (p === 'year') renderYearly();
    else if (p === 'month') render();
    else if (p === 'template') renderTemplates();
    else if (p === 'day') {
        document.getElementById('dateInput').valueAsDate = new Date();
    }
}

// 保存記錄
function saveRecord() {
    const date = document.getElementById('dateInput').value;
    const item = document.getElementById('itemInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value) || 0;
    const type = document.getElementById('typeInput').value;
    const note = document.getElementById('noteInput').value;

    if (!date || !item || amount === 0) {
        alert('請填寫完整的日期、項目和金額');
        return;
    }

    const record = {
        id: Date.now(),
        date: date,
        item: item,
        amount: amount,
        type: type,
        note: note
    };

    records.push(record);
    sync();
    
    // 清空表單
    document.getElementById('itemInput').value = '';
    document.getElementById('amountInput').value = '';
    document.getElementById('typeInput').value = '臨時新增';
    document.getElementById('noteInput').value = '';

    alert('記錄已加入！');
    showPage('month');
}

// 開啟編輯
function openEdit(id) {
    const r = records.find(item => item.id === id);
    if (!r) return;

    document.getElementById('editId').value = r.id;
    document.getElementById('editDate').value = r.date;
    document.getElementById('editItem').value = r.item;
    document.getElementById('editAmount').value = r.amount;
    document.getElementById('editNote').value = r.note;
    document.getElementById('editModal').style.display = 'flex';
}

// 關閉編輯窗
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// 更新記錄
function updateRecord() {
    const id = parseFloat(document.getElementById('editId').value);
    const idx = records.findIndex(r => r.id === id);

    if (idx === -1) return;

    records[idx].date = document.getElementById('editDate').value;
    records[idx].item = document.getElementById('editItem').value;
    records[idx].amount = parseFloat(document.getElementById('editAmount').value);
    records[idx].note = document.getElementById('editNote').value;

    sync();
    closeModal();
    render();
    alert('記錄已更新！');
}

// 刪除記錄
function deleteCurrentRecord() {
    if (confirm('確定要刪除這筆記錄嗎？')) {
        const id = parseFloat(document.getElementById('editId').value);
        records = records.filter(r => r.id !== id);
        sync();
        closeModal();
        render();
        alert('記錄已刪除！');
    }
}

// 渲染月明細
function render() {
    const list = document.getElementById('monthList');
    const filter = document.getElementById('monthFilter').value;
    
    let totalIncome = 0;
    let totalExpense = 0;
    let net = 0;

    list.innerHTML = '';

    const filtered = records
        .filter(r => r.date.startsWith(filter))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-secondary);">本月暫無記錄</div>';
    } else {
        filtered.forEach(r => {
            net += r.amount;
            if (r.amount > 0) {
                totalIncome += r.amount;
            } else {
                totalExpense += Math.abs(r.amount);
            }

            const div = document.createElement('div');
            div.className = `record-item ${r.amount >= 0 ? 'income' : 'expense'}`;
            div.innerHTML = `
                <div class="record-info">
                    <b>${r.date.slice(5)} · ${r.item}</b>
                    <small>${r.amount > 0 ? '+' : ''}${r.amount.toLocaleString()} | ${r.note}</small>
                </div>
                <button class="btn btn-primary" onclick="openEdit(${r.id})" style="width:auto; padding:8px 15px;">編輯</button>
            `;
            list.appendChild(div);
        });
    }

    // 更新摘要
    document.getElementById('balanceDisplay').textContent = net.toLocaleString();
    document.getElementById('balanceDisplay').style.color = net >= 0 ? 'var(--text-success)' : 'var(--text-error)';
    document.getElementById('incomeDisplay').textContent = totalIncome.toLocaleString();
    document.getElementById('expenseDisplay').textContent = totalExpense.toLocaleString();
}

// 保存範本
function saveTemplate() {
    const month = document.getElementById('tplMonth').value;
    const day = parseInt(document.getElementById('tplDay').value) || 1;
    const item = document.getElementById('tplItem').value;
    const amount = parseFloat(document.getElementById('tplAmount').value) || 0;
    const type = document.getElementById('tplType').value;
    const note = document.getElementById('tplNote').value;

    if (!item || amount === 0) {
        alert('請填寫項目和金額');
        return;
    }

    const tpl = {
        id: Date.now(),
        month: month,
        day: day,
        item: item,
        amount: amount,
        type: type,
        note: note
    };

    templates.push(tpl);
    localStorage.setItem('my_templates', JSON.stringify(templates));
    
    // 清空表單
    document.getElementById('tplItem').value = '';
    document.getElementById('tplAmount').value = '';
    document.getElementById('tplNote').value = '';
    document.getElementById('tplDay').value = '1';
    document.getElementById('tplMonth').value = 'all';

    renderTemplates();
    alert('範本已加入！');
}

// 刪除範本
function deleteTemplate(id) {
    if (confirm('確定要刪除這個範本嗎？')) {
        templates = templates.filter(t => t.id !== id);
        localStorage.setItem('my_templates', JSON.stringify(templates));
        renderTemplates();
    }
}

// 渲染範本列表
function renderTemplates() {
    const list = document.getElementById('templateList');
    
    if (templates.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:var(--text-secondary);">還沒有範本</p>';
        return;
    }

    list.innerHTML = '<h4 style="margin-bottom:15px;">📋 範本清單</h4>';
    templates.forEach(t => {
        const mText = (t.month === 'all' || !t.month) ? '每月' : `${parseInt(t.month)}月`;
        const dText = t.day || '1';
        list.innerHTML += `
            <div class="template-item">
                <span><b>${mText}${dText}號</b> · ${t.item} (${t.amount > 0 ? '+' : ''}${t.amount}元)</span>
                <button class="btn btn-danger" onclick="deleteTemplate(${t.id})">刪除</button>
            </div>
        `;
    });
}

// 一鍵生成本月帳務
function generateFromTemplate() {
    const monthVal = document.getElementById('monthFilter').value;
    const month = monthVal.split('-')[1];

    if (confirm('確定要生成本月的範本帳務嗎？')) {
        let count = 0;
        templates.forEach(t => {
            const tMonth = t.month || 'all';
            if (tMonth === 'all' || tMonth === month) {
                const dateStr = `${monthVal}-${String(t.day || 1).padStart(2, '0')}`;
                
                // 檢查是否已存在相同日期的記錄
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

// 年度統計
function renderYearly() {
    const tbody = document.getElementById('yearTableBody');
    const yearFilter = document.getElementById('yearFilter');

    tbody.innerHTML = '';

    const years = [...new Set(records.map(r => r.date.slice(0, 4)))].sort().reverse();

    if (yearFilter.innerHTML === '') {
        years.forEach(y => {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y + ' 年';
            yearFilter.appendChild(option);
        });
    }

    const selYear = yearFilter.value || new Date().getFullYear();

    for (let i = 12; i >= 1; i--) {
        const m = selYear + "-" + String(i).padStart(2, '0');
        const mData = records.filter(r => r.date.startsWith(m));

        if (mData.length === 0) continue;

        const inc = mData.filter(r => r.amount > 0).reduce((a, b) => a + b.amount, 0);
        const exp = mData.filter(r => r.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);
        const net = inc - exp;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i}月</td>
            <td style="color:var(--text-success);">${inc.toLocaleString()}</td>
            <td style="color:var(--text-error);">${exp.toLocaleString()}</td>
            <td><b style="color:${net >= 0 ? 'var(--text-success)' : 'var(--text-error)'}">${net.toLocaleString()}</b></td>
        `;
        tbody.appendChild(tr);
    }
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadSidebar();
    
    // 設置今日日期
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('dateInput');
    if (dateInput) dateInput.value = today;

    // 設置本月篩選
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter) monthFilter.value = new Date().toISOString().slice(0, 7);

    // 初始渲染
    render();
});
