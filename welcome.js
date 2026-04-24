// 創建粒子效果
function createParticles() {
    const container = document.getElementById('particleContainer');
    const particleCount = Math.min(50, window.innerWidth / 10);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.background = 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.2) + ')';
        particle.style.borderRadius = '50%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        
        container.appendChild(particle);
    }
    
    // 添加浮動動畫樣式
    if (!document.querySelector('style[data-particles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-particles', '');
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(0px) translateX(0px);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-${window.innerHeight}px) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 進入主頁
function enterMain() {
    const container = document.querySelector('.welcome-container');
    container.classList.add('entering');
    
    // 延遲進入以顯示動畫
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

// 監聽事件：滑鼠點擊、鍵盤按下、觸摸
document.addEventListener('click', enterMain);
document.addEventListener('keydown', enterMain);
document.addEventListener('touchstart', enterMain);

// 只執行一次
let entered = false;
const originalEnterMain = enterMain;
window.enterMain = function() {
    if (!entered) {
        entered = true;
        originalEnterMain();
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', createParticles);
window.addEventListener('resize', createParticles);
