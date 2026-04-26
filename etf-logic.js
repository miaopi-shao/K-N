/**
 * ETF 月月配核心邏輯 (繼承自 1.4 版本)
 */

function addRow(data = {name: '0056', div: 866, price: 37, months: [1,4,7,10]}) {
    const tbody = document.querySelector("#etfTable tbody");
    const tr = document.createElement("tr");
    
    tr.innerHTML = `
        <td><input type="text" value="${data.name}" class="name" oninput="calculate()"></td>
        <td><input type="number" value="${data.div}" class="dividend" oninput="calculate()"></td>
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
        <td><button class="btn btn-del" onclick="this.closest('tr').remove();calculate();">刪除</button></td>
    `;
    tbody.appendChild(tr);
    calculate();
}

function toggleMonth(el) {
    el.classList.toggle('active');
    calculate();
}

function calculate() {
    const target = parseFloat(document.getElementById("targetIncome").value) || 0;
    const rows = document.querySelectorAll("#etfTable tbody tr");
    let monthlyIncome = new Array(12).fill(0);
    let totalCapital = 0;

    rows.forEach(row => {
        const div = parseFloat(row.querySelector(".dividend").value) || 0;
        const price = parseFloat(row.querySelector(".price").value) || 0;
        const activeMonths = Array.from(row.querySelectorAll(".month-item.active")).map(m => parseInt(m.innerText));
        
        if (div > 0) {
            // 核心公式：每月目標 / 單季配息 = 需持有張數 (1.4 版邏輯)
            const sharesNeeded = (target / div).toFixed(1);
            const cost = ((sharesNeeded * price) / 10000).toFixed(1);
            
            row.querySelector(".shares").innerText = sharesNeeded + " 張";
            row.querySelector(".cost").innerText = cost + " 萬";
            
            totalCapital += parseFloat(cost);
            activeMonths.forEach(m => {
                monthlyIncome[m-1] += (sharesNeeded * div);
            });
        }
    });

    // 更新總覽介面
    document.getElementById("totalCapital").innerText = totalCapital.toFixed(1);
    const avg = monthlyIncome.reduce((a, b) => a + b, 0) / 12;
    document.getElementById("avgMonthly").innerText = Math.round(avg).toLocaleString();

    const grid = document.getElementById("monthGrid");
    grid.innerHTML = monthlyIncome.map((amt, i) => `
        <div class="month-card ${amt >= (target * 0.9) ? 'reach' : ''}">
            <div class="m-title">${i+1}月</div>
            <div class="m-value">${Math.round(amt).toLocaleString()}</div>
        </div>
    `).join('');
}

// 備份功能 (1.4 版格式)
function saveBackupPrompt() {
    const name = prompt("請輸入備份名稱:");
    if (!name) return;
    const data = {
        target: document.getElementById("targetIncome").value,
        items: Array.from(document.querySelectorAll("#etfTable tbody tr")).map(row => ({
            name: row.querySelector(".name").value,
            div: row.querySelector(".dividend").value,
            price: row.querySelector(".price").value,
            months: Array.from(row.querySelectorAll(".month-item.active")).map(m => parseInt(m.innerText))
        }))
    };
    const backups = JSON.parse(localStorage.getItem('etf_backups') || '{}');
    backups[name] = data;
    localStorage.setItem('etf_backups', JSON.stringify(backups));
    renderBackupList();
}

// 初始化
window.onload = () => {
    addRow(); 
    // 若 script.js 裡有其他初始化邏輯，會在這裡一併執行
};
