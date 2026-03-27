// 主題切換功能
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

// ========== 數據保存/恢復功能 ==========

function saveData() {
    const target = document.getElementById("targetIncome").value;
    const rows = Array.from(document.querySelectorAll("#etfTable tbody tr")).map(row => {
        const name = row.querySelector(".name").value;
        const dividend = row.querySelector(".dividend").value;
        const price = row.querySelector(".price").value;
        const activeMonths = Array.from(row.querySelectorAll(".month-item.active")).map(el => el.innerText);
        
        return { name, dividend, price, activeMonths };
    });
    
    const data = { target, rows, timestamp: new Date().toLocaleString("zh-TW") };
    localStorage.setItem('etfData', JSON.stringify(data));
    console.log('數據已自動保存');
    return data;
}

function loadData() {
    const savedData = localStorage.getItem('etfData');
    if (!savedData) return null;
    
    try {
        const data = JSON.parse(savedData);
        
        // 恢復目標金額
        document.getElementById("targetIncome").value = data.target;
        
        // 清空並恢復表格
        const tbody = document.querySelector("#etfTable tbody");
        tbody.innerHTML = '';
        
        data.rows.forEach(rowData => {
            const row = document.createElement("tr");
            const monthItems = [1,2,3,4,5,6,7,8,9,10,11,12].map(m => 
                `<div class="month-item${rowData.activeMonths.includes(String(m)) ? ' active' : ''}" onclick="toggleMonth(this)">${m}</div>`
            ).join('');
            
            row.innerHTML = `
                <td><input type="text" value="${rowData.name}" class="name"></td>
                <td><input type="number" value="${rowData.dividend}" class="dividend" oninput="autoSaveAndCalculate()"></td>
                <td><input type="number" value="${rowData.price}" class="price" oninput="autoSaveAndCalculate()"></td>
                <td><div class="month-box">${monthItems}</div></td>
                <td class="shares">0</td>
                <td class="cost">0</td>
                <td><button class="btn btn-del" onclick="deleteRow(this)">刪除</button></td>
            `;
            tbody.appendChild(row);
        });
        
        console.log('數據已恢復');
        return data;
    } catch (e) {
        console.error('讀取保存數據失敗:', e);
        return null;
    }
}

function saveBackup(backupName) {
    const data = saveData();
    const backups = JSON.parse(localStorage.getItem('etfBackups') || '{}');
    
    const name = backupName || `備份_${new Date().toLocaleString("zh-TW").replace(/[\/\s:]/g, '-')}`;
    backups[name] = data;
    
    localStorage.setItem('etfBackups', JSON.stringify(backups));
    console.log(`備份已保存: ${name}`);
    updateBackupList();
    
    return name;
}

function loadBackup(backupName) {
    const backups = JSON.parse(localStorage.getItem('etfBackups') || '{}');
    const backupData = backups[backupName];
    
    if (!backupData) {
        alert('找不到該備份');
        return;
    }
    
    // 恢復備份數據
    document.getElementById("targetIncome").value = backupData.target;
    
    const tbody = document.querySelector("#etfTable tbody");
    tbody.innerHTML = '';
    
    backupData.rows.forEach(rowData => {
        const row = document.createElement("tr");
        const monthItems = [1,2,3,4,5,6,7,8,9,10,11,12].map(m => 
            `<div class="month-item${rowData.activeMonths.includes(String(m)) ? ' active' : ''}" onclick="toggleMonth(this)">${m}</div>`
        ).join('');
        
        row.innerHTML = `
            <td><input type="text" value="${rowData.name}" class="name"></td>
            <td><input type="number" value="${rowData.dividend}" class="dividend" oninput="autoSaveAndCalculate()"></td>
            <td><input type="number" value="${rowData.price}" class="price" oninput="autoSaveAndCalculate()"></td>
            <td><div class="month-box">${monthItems}</div></td>
            <td class="shares">0</td>
            <td class="cost">0</td>
            <td><button class="btn btn-del" onclick="deleteRow(this)">刪除</button></td>
        `;
        tbody.appendChild(row);
    });
    
    calculate();
    alert(`已恢復備份: ${backupName}`);
}

function deleteBackup(backupName) {
    if (!confirm(`確定要刪除備份 "${backupName}" 嗎？`)) return;
    
    const backups = JSON.parse(localStorage.getItem('etfBackups') || '{}');
    delete backups[backupName];
    localStorage.setItem('etfBackups', JSON.stringify(backups));
    
    updateBackupList();
    alert('備份已刪除');
}

function updateBackupList() {
    const backups = JSON.parse(localStorage.getItem('etfBackups') || '{}');
    const listContainer = document.getElementById('backupList');
    
    if (!listContainer) return;
    
    const backupNames = Object.keys(backups);
    
    if (backupNames.length === 0) {
        listContainer.innerHTML = '<div style="padding: 10px; color: var(--text-secondary); font-size: 0.9em;">還沒有備份</div>';
        return;
    }
    
    let html = '<div style="max-height: 300px; overflow-y: auto;">';
    backupNames.forEach(name => {
        const backup = backups[name];
        html += `
            <div style="padding: 10px; border-bottom: 1px solid var(--border-primary); display: flex; justify-content: space-between; align-items: center; font-size: 0.9em;">
                <div>
                    <div style="font-weight: bold;">${name}</div>
                    <div style="color: var(--text-secondary); font-size: 0.8em;">保存於: ${backup.timestamp}</div>
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="btn" style="padding: 6px 12px; font-size: 0.85em; background-color: var(--btn-primary);" onclick="loadBackup('${name.replace(/'/g, "\\'")}')">還原</button>
                    <button class="btn" style="padding: 6px 12px; font-size: 0.85em; background-color: var(--btn-danger);" onclick="deleteBackup('${name.replace(/'/g, "\\'")}')">刪除</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    listContainer.innerHTML = html;
}

function autoSaveAndCalculate() {
    calculate();
    saveData();
}

function toggleMonth(el) {
    el.classList.toggle('active');
    autoSaveAndCalculate();
}

function addRow() {
    const tbody = document.querySelector("#etfTable tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" value="新標的" class="name"></td>
        <td><input type="number" value="500" class="dividend" oninput="autoSaveAndCalculate()"></td>
        <td><input type="number" value="20" class="price" oninput="autoSaveAndCalculate()"></td>
        <td>
            <div class="month-box">
                ${[1,2,3,4,5,6,7,8,9,10,11,12].map(m => `<div class="month-item" onclick="toggleMonth(this)">${m}</div>`).join('')}
            </div>
        </td>
        <td class="shares">0</td>
        <td class="cost">0</td>
        <td><button class="btn btn-del" onclick="deleteRow(this)">刪除</button></td>
    `;
    tbody.appendChild(row);
    autoSaveAndCalculate();
}

function deleteRow(btn) {
    btn.closest("tr").remove();
    autoSaveAndCalculate();
}

function calculate() {
    const target = parseFloat(document.getElementById("targetIncome").value) || 0;
    const rows = document.querySelectorAll("#etfTable tbody tr");
    let monthlyIncome = new Array(12).fill(0);
    let totalCapital = 0;

    rows.forEach(row => {
        const div = parseFloat(row.querySelector(".dividend").value) || 0;
        const price = parseFloat(row.querySelector(".price").value) || 0;
        const activeMonths = Array.from(row.querySelectorAll(".month-item.active")).map(el => parseInt(el.innerText));

        if (activeMonths.length === 0 || div === 0) {
            row.querySelector(".shares").innerText = "0 張";
            row.querySelector(".cost").innerText = "0 萬元";
            return;
        }

        // 核心邏輯：為了讓「有配息的月份」都能達到 target，張數 = 目標 / 單次配息
        let shares = (target / div).toFixed(1);
        let costInWan = (shares * price * 1000) / 10000;

        row.querySelector(".shares").innerText = shares + " 張";
        row.querySelector(".cost").innerText = costInWan.toFixed(1) + " 萬元";
        totalCapital += costInWan;

        // 累加到月份總覽
        activeMonths.forEach(m => {
            monthlyIncome[m-1] += (shares * div);
        });
    });

    // 更新月份卡片
    const grid = document.getElementById("monthGrid");
    grid.innerHTML = "";
    monthlyIncome.forEach((amt, i) => {
        const isLow = amt < target * 0.9;
        grid.innerHTML += `
            <div class="month-card ${isLow ? 'low-income' : ''}">
                <h4>${i+1} 月</h4>
                <div class="amt">${Math.round(amt).toLocaleString()}</div>
                <div style="font-size:0.7em; color:#888;">${isLow ? '未達標' : '已達標'}</div>
            </div>
        `;
    });

    document.getElementById("totalCapital").innerText = totalCapital.toFixed(1);
    const avg = monthlyIncome.reduce((a,b) => a+b, 0) / 12;
    document.getElementById("avgMonthly").innerText = Math.round(avg).toLocaleString();
}

// 初始化
window.onload = function() {
    initTheme();
    
    // 嘗試載入已保存的數據
    const loaded = loadData();
    
    // 更新備份列表
    updateBackupList();
    
    calculate();
};