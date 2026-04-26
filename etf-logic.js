// 1. 自動存檔與計算
function autoSaveAndCalculate() {
    calculate();
    const rows = [];
    document.querySelectorAll('#etfTable tbody tr').forEach(row => {
        rows.push({
            name: row.querySelector('.etf-name').value,
            price: row.querySelector('.etf-price').value,
            div: row.querySelector('.etf-div').value,
            months: Array.from(row.querySelectorAll('.month-item.active')).map(m => m.textContent)
        });
    });
    localStorage.setItem('etf_data', JSON.stringify(rows));
    localStorage.setItem('etf_target', document.getElementById('targetIncome').value);
}

// 2. 核心計算邏輯 (修正原本不顯示的問題)
function calculate() {
    const target = parseFloat(document.getElementById('targetIncome').value) || 0;
    const rows = document.querySelectorAll('#etfTable tbody tr');
    let totalInvestment = 0;

    rows.forEach(row => {
        const price = parseFloat(row.querySelector('.etf-price').value) || 0;
        const div = parseFloat(row.querySelector('.etf-div').value) || 0;
        const activeMonths = row.querySelectorAll('.month-item.active').length;

        if (price > 0 && div > 0 && activeMonths > 0) {
            // 計算邏輯：目標月薪 / (單次配息 * (12個月 / 配息次數))
            // 這裡採用最穩健的試算：單次配息要領到多少才能支撐目標
            const sharesNeeded = Math.ceil(target / div); 
            const cost = sharesNeeded * price;
            
            row.querySelector('.row-result').innerHTML = 
                `需持有: <b>${sharesNeeded.toLocaleString()}</b> 股<br>` +
                `預估本金: <span style="color:var(--text-accent)">$${cost.toLocaleString()}</span>`;
            totalInvestment += cost;
        } else {
            row.querySelector('.row-result').innerHTML = "等待輸入...";
        }
    });

    const summary = document.getElementById('summaryBar');
    if (summary) {
        summary.innerHTML = `<h3>預估總投入資金：$${totalInvestment.toLocaleString()}</h3>`;
    }
}

// 3. 表格操作 (補完 innerHTML)
function addRow(savedData = null) {
    const table = document.getElementById('etfTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td><input type="text" class="form-input etf-name" value="${savedData?.name || ''}" placeholder="例: 00929" oninput="autoSaveAndCalculate()"></td>
        <td><input type="number" class="form-input etf-price" value="${savedData?.price || ''}" placeholder="現價" oninput="autoSaveAndCalculate()"></td>
        <td><input type="number" class="form-input etf-div" value="${savedData?.div || ''}" placeholder="配息" oninput="autoSaveAndCalculate()"></td>
        <td>
            <div class="month-box">
                ${[1,2,3,4,5,6,7,8,9,10,11,12].map(m => {
                    const isActive = savedData?.months?.includes(m.toString()) ? 'active' : '';
                    return `<div class="month-item ${isActive}" onclick="toggleMonth(this)">${m}</div>`;
                }).join('')}
            </div>
        </td>
        <td class="row-result">---</td>
        <td><button class="btn btn-danger" onclick="deleteRow(this)">🗑️</button></td>
    `;
    calculate();
}

function deleteRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    autoSaveAndCalculate();
}

// 4. 月份切換
function toggleMonth(el) {
    el.classList.toggle('active');
    autoSaveAndCalculate();
}

// 5. 備份功能 (localStorage 實作)
function handleSaveBackup() {
    const name = prompt('請輸入備份名稱:');
    if (name) {
        const data = localStorage.getItem('etf_data');
        localStorage.setItem(`backup_${name}`, data);
        alert("備份成功：" + name);
    }
}

// 6. 初始化載入 (從暫存回復數據)
window.addEventListener('DOMContentLoaded', () => {
    const savedTarget = localStorage.getItem('etf_target');
    if (savedTarget) document.getElementById('targetIncome').value = savedTarget;

    const savedData = JSON.parse(localStorage.getItem('etf_data') || '[]');
    if (savedData.length > 0) {
        savedData.forEach(data => addRow(data));
    } else {
        addRow(); // 若無資料，預設開一行
    }
    console.log("ETF 數據已從 LocalStorage 載入");
});
