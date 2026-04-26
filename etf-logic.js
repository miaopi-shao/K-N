// 核心計算與 Row 生成
function addRow(data = {name: '0056', div: 866, price: 37, months: [1,4,7,10]}) {
    const tbody = document.querySelector("#etfTable tbody");
    const tr = document.createElement("tr");
    
    tr.innerHTML = `
        <td><input type="text" value="${data.name}" class="form-input" oninput="calculate()"></td>
        <td><input type="number" value="${data.div}" class="form-input" oninput="calculate()"></td>
        <td><input type="number" value="${data.price}" class="form-input" oninput="calculate()"></td>
        <td>
            <div class="month-selector">
                ${[1,2,3,4,5,6,7,8,9,10,11,12].map(m => 
                    `<div class="m-bit ${data.months.includes(m) ? 'active' : ''}" onclick="toggleM(this)">${m}</div>`
                ).join('')}
            </div>
        </td>
        <td class="res-shares">0</td>
        <td class="res-cost">0</td>
        <td><button class="btn btn-danger" onclick="this.closest('tr').remove();calculate();" data-i18n="etf-delete">刪除</button></td>
    `;
    tbody.appendChild(tr);
    // 確保新增後立即翻譯按鈕
    if (window.translatePage) translatePage();
    calculate();
}

function toggleM(el) {
    el.classList.toggle('active');
    calculate();
}

function calculate() {
    const target = parseFloat(document.getElementById("targetIncome").value) || 0;
    const rows = document.querySelectorAll("#etfTable tbody tr");
    let monthlyPot = new Array(12).fill(0);
    let totalCap = 0;

    rows.forEach(row => {
        const div = parseFloat(row.querySelectorAll("input")[1].value) || 0;
        const price = parseFloat(row.querySelectorAll("input")[2].value) || 0;
        const activeMs = Array.from(row.querySelectorAll(".m-bit.active")).map(m => parseInt(m.innerText));
        
        if (div > 0) {
            // 1.4 版邏輯：目標 / 配息 = 張數
            const shares = (target / div).toFixed(1);
            const cost = ((shares * price) / 10000).toFixed(1);
            
            row.querySelector(".res-shares").innerText = shares + " 張";
            row.querySelector(".res-cost").innerText = cost + " 萬";
            
            totalCap += parseFloat(cost);
            activeMs.forEach(m => { monthlyPot[m-1] += (shares * div); });
        }
    });

    document.getElementById("totalCapital").innerText = totalCap.toFixed(1);
    const avg = monthlyPot.reduce((a, b) => a + b, 0) / 12;
    document.getElementById("avgMonthly").innerText = Math.round(avg).toLocaleString();

    // 更新下方總覽格
    const grid = document.getElementById("monthGrid");
    grid.innerHTML = monthlyPot.map((amt, i) => `
        <div class="m-card ${amt >= (target * 0.95) ? 'reach' : ''}">
            <div class="m-title">${i+1}月</div>
            <div class="m-val">${Math.round(amt).toLocaleString()}</div>
        </div>
    `).join('');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector("#etfTable tbody")) addRow();
});
