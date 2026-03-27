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

function toggleMonth(el) {
    el.classList.toggle('active');
    calculate();
}

function addRow() {
    const tbody = document.querySelector("#etfTable tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" value="新標的" class="name"></td>
        <td><input type="number" value="500" class="dividend" oninput="calculate()"></td>
        <td><input type="number" value="20" class="price" oninput="calculate()"></td>
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
    calculate();
}

function deleteRow(btn) {
    btn.closest("tr").remove();
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
    calculate();
};