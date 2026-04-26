// 初始化預設資料
const defaultData = [
    { name: "0056", dividend: 866, price: 37, months: [1, 4, 7, 10] }
];

function init() {
    const saved = localStorage.getItem('etf_backup_current');
    if (saved) {
        renderTable(JSON.parse(saved));
    } else {
        defaultData.forEach(item => addRow(item));
    }
    calculate();
}

function addRow(data = { name: "新標的", dividend: 0, price: 0, months: [] }) {
    const tbody = document.querySelector("#etfTable tbody");
    const tr = document.createElement("tr");
    
    tr.innerHTML = `
        <td><input type="text" value="${data.name}" class="name" oninput="calculate()"></td>
        <td><input type="number" value="${data.dividend}" class="dividend" oninput="calculate()"></td>
        <td><input type="number" value="${data.price}" class="price" oninput="calculate()"></td>
        <td>
            <div class="month-box">
                ${[1,2,3,4,5,6,7,8,9,10,11,12].map(m => 
                    `<div class="month-item ${data.months.includes(m) ? 'active' : ''}" onclick="toggleMonth(this)">${m}</div>`
                ).join('')}
            </div>
        </td>
        <td class="shares">0</td>
        <td class="cost">0</td>
        <td><button class="btn btn-del" onclick="deleteRow(this)">刪除</button></td>
    `;
    tbody.appendChild(tr);
    calculate();
}

function toggleMonth(el) {
    el.classList.toggle('active');
    calculate();
}

function deleteRow(btn) {
    btn.closest('tr').remove();
    calculate();
}

function calculate() {
    const target = parseFloat(document.getElementById("targetIncome").value) || 0;
    const rows = document.querySelectorAll("#etfTable tbody tr");
    let monthlyIncomes = new Array(12).fill(0);
    let totalCapital = 0;

    rows.forEach(row => {
        const div = parseFloat(row.querySelector(".dividend").value) || 0;
        const price = parseFloat(row.querySelector(".price").value) || 0;
        const activeMonths = Array.from(row.querySelectorAll(".month-item.active")).map(m => parseInt(m.innerText));
        
        if (div > 0 && activeMonths.length > 0) {
            // 以「單次配息月份」去撐住目標
            const sharesNeeded = (target / div).toFixed(2);
            const cost = ((sharesNeeded * price) / 10000).toFixed(2);
            
            row.querySelector(".shares").innerText = sharesNeeded + " 張";
            row.querySelector(".cost").innerText = cost + " 萬";
            
            totalCapital += parseFloat(cost);
            activeMonths.forEach(m => {
                monthlyIncomes[m-1] += (sharesNeeded * div);
            });
        }
    });

    updateUI(monthlyIncomes, totalCapital);
    localStorage.setItem('etf_backup_current', JSON.stringify(getTableData()));
}

function updateUI(monthlyIncomes, totalCapital) {
    document.getElementById("totalCapital").innerText = totalCapital.toFixed(2);
    const avg = monthlyIncomes.reduce((a, b) => a + b, 0) / 12;
    document.getElementById("avgMonthly").innerText = avg.toLocaleString(undefined, {maximumFractionDigits: 0});

    const grid = document.getElementById("monthGrid");
    grid.innerHTML = monthlyIncomes.map((amt, i) => `
        <div class="month-card">
            <div class="m-title">${i+1}月</div>
            <div class="m-value ${amt >= (parseFloat(document.getElementById("targetIncome").value)*0.95) ? 'reach' : ''}">
                ${amt.toLocaleString(undefined, {maximumFractionDigits:0})}
            </div>
        </div>
    `).join('');
}

// 備份邏輯 (保持 1.4 版習慣)
function getTableData() {
    return Array.from(document.querySelectorAll("#etfTable tbody tr")).map(row => ({
        name: row.querySelector(".name").value,
        dividend: row.querySelector(".dividend").value,
        price: row.querySelector(".price").value,
        months: Array.from(row.querySelectorAll(".month-item.active")).map(m => parseInt(m.innerText))
    }));
}

function saveBackupPrompt() {
    const name = prompt("請輸入備份名稱:");
    if (name) {
        const backups = JSON.parse(localStorage.getItem('etf_backups') || '{}');
        backups[name] = { target: document.getElementById("targetIncome").value, data: getTableData() };
        localStorage.setItem('etf_backups', JSON.stringify(backups));
        renderBackupList();
    }
}

window.onload = init;
