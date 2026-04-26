/**
 * ETF 月月配試算邏輯 - 1.4 視覺還原版
 */

// 1. 新增 ETF 標的行
function addRow(data = {name: '0056', div: 866, price: 37, months: [1,4,7,10]}) {
    const tbody = document.querySelector("#etfTable tbody");
    if (!tbody) return;
    
    const tr = document.createElement("tr");
    
    // 這裡的 HTML 結構對齊你的 CSS 命名
    tr.innerHTML = `
        <td><input type="text" value="${data.name}" oninput="calculate()"></td>
        <td><input type="number" value="${data.div}" oninput="calculate()"></td>
        <td><input type="number" value="${data.price}" oninput="calculate()"></td>
        <td>
            <div class="month-box">
                ${[1,2,3,4,5,6,7,8,9,10,11,12].map(m => 
                    `<div class="month-item ${data.months.includes(m) ? 'active' : ''}" onclick="toggleM(this)">${m}</div>`
                ).join('')}
            </div>
        </td>
        <td class="res-shares">0 張</td>
        <td class="res-cost">0 萬元</td>
        <td><button class="btn btn-danger" onclick="this.closest('tr').remove();calculate();">刪除</button></td>
    `;
    tbody.appendChild(tr);
    calculate();
}

// 2. 切換月份點選狀態
function toggleM(el) {
    el.classList.toggle('active');
    calculate();
}

// 3. 核心計算邏輯
function calculate() {
    // 讀取目標金額
    const target = parseFloat(document.getElementById("targetIncome").value) || 0;
    const rows = document.querySelectorAll("#etfTable tbody tr");
    let monthlyIncome = new Array(12).fill(0);
    let totalInvestment = 0;

    rows.forEach(row => {
        const inputs = row.querySelectorAll("input");
        const div = parseFloat(inputs[1].value) || 0; // 單次配息
        const price = parseFloat(inputs[2].value) || 0; // 參考股價
        const activeMs = Array.from(row.querySelectorAll(".month-item.active")).map(el => parseInt(el.innerText));

        if (div > 0) {
            // 公式：張數 = 目標金額 / 單次配息
            const shares = (target / div).toFixed(1);
            // 投入本金 = 張數 * 股價 * 1000 / 10000 (換算萬元)
            const cost = (shares * price * 0.1).toFixed(1); 
            
            // 回填表格
            row.querySelector(".res-shares").innerText = shares + " 張";
            row.querySelector(".res-cost").innerText = cost + " 萬元";
            
            totalInvestment += parseFloat(cost);
            // 將配息累加到對應月份
            activeMs.forEach(m => {
                monthlyIncome[m-1] += (shares * div);
            });
        }
    });

    // 4. 更新 12 個月總覽格 (對齊 CSS 的 .month-card 與 .reach)
    const grid = document.getElementById("monthGrid");
    if (grid) {
        grid.innerHTML = monthlyIncome.map((amt, i) => {
            const isReach = amt >= (target * 0.99); // 判定是否達標
            return `
                <div class="month-card ${isReach ? 'reach' : ''}">
                    <div style="color: #666; font-size: 0.9rem;">${i+1} 月</div>
                    <div class="amt">${Math.round(amt).toLocaleString()}</div>
                    <div style="font-size: 0.7rem; opacity: 0.8;">${isReach ? '已達標' : '未達標'}</div>
                </div>
            `;
        }).join('');
    }

    // 5. 更新底部總覽條
    const totalCapEl = document.getElementById("totalCapital");
    const avgMonthlyEl = document.getElementById("avgMonthly");
    
    if (totalCapEl) totalCapEl.innerHTML = `<span class="highlight-wan">${totalInvestment.toFixed(1)}</span>`;
    
    const avg = monthlyIncome.reduce((a, b) => a + b, 0) / 12;
    if (avgMonthlyEl) avgMonthlyEl.innerHTML = `<span class="highlight-avg">${Math.round(avg).toLocaleString()}</span>`;
}

// 初始化執行
document.addEventListener('DOMContentLoaded', () => {
    // 如果表格內沒內容，預設幫 user 加一行
    const tbody = document.querySelector("#etfTable tbody");
    if (tbody && tbody.children.length === 0) {
        addRow(); 
    } else {
        calculate();
    }
});
