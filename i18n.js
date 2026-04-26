// 多語言管理系統
const translations = {
    'zh-TW': {
        // Welcome
        'welcome-title': '妙哉 AI協作 生活網',
        'welcome-subtitle': '點擊、按鍵盤或觸摸進入',
        'welcome-arrow': '祝您使用愉快',
        
        // Settings
        'settings-title': '⚙️ 系統設定',
        'settings-language': '語言',
        'settings-font-size': '字體大小',
        'settings-theme': '主題',
        'settings-light': '亮色',
        'settings-dark': '暗色',
        'settings-close': '關閉',
        'font-small': '小',
        'font-normal': '正常',
        'font-large': '大',
        'font-xlarge': '超大',
        
        // Sidebar
        'sidebar-internal': '🔧 內部功能',
        'sidebar-etf': '📊 ETF 月月配試算',
        'sidebar-accounting': '💰 記帳系統',
        'sidebar-car': '🚗 車輛管理',
        'sidebar-projects': '📁 其他專案',
        'sidebar-websites': '🌟 好網站',
        'sidebar-footer': '©2026 妙奇少 AI協作生活網',
        
        // Home
        'home-welcome': '歡迎來到我的生活助手',
        'home-ai-version': 'AI 協助製作版',
        'home-intro-title': '👋 自我介紹',
        'home-intro-1': '您好！我是妙奇少，一位致力於將生活變得更加便利和有條理的開發者。',
        'home-intro-2': '這個網站是一個個人生活助手平台，由 AI 技術協助製作，用來整合我日常生活中的各種記錄和管理需求。',
        'home-features': '📚 功能介紹',
        'home-etf-title': 'ETF 月月配試算',
        'home-etf-desc': '幫助規劃月月配 ETF 組合，計算最佳配息配置',
        'home-accounting-title': '記帳系統',
        'home-accounting-desc': '完整的個人財務記錄與分析工具，追蹤收支細節',
        'home-car-title': '車輛管理',
        'home-car-desc': '記錄車輛保養維修，提醒下次保養時程',
        'home-tech': '🛠️ 技術說明',
        'home-tech-1': '前端技術：HTML、CSS、JavaScript（原生）',
        'home-tech-2': '數據存儲：本地瀏覽器 LocalStorage（無需後端）',
        'home-tech-3': '開發協助：利用 AI 技術提升開發效率',
        'home-tech-4': '設計理念：簡潔、高效、易於維護和自訂修改',
        'home-contact': '📞 聯絡方式',
        'home-github': 'GitHub',
        'home-feedback': '如有任何建議或反饋，歡迎告訴我！',
        'enter': '進入 →',
        
        // ETF Page
        'etf-title': 'ETF 月月配組合領息試算',
        'etf-target-income': '每月目標領息金額：',
        'etf-target-note': '(目標是讓 1~12 月每個月都盡量達到此金額)',
        'etf-add': '+ 新增 ETF 標的',
        'etf-backup': '💾 保存備份',
        'etf-my-backup': '📋 我的備份 (點擊展開)',
        'etf-name': 'ETF 名稱',
        'etf-dividend': '單次配息(元/張)',
        'etf-price': '參考股價(元)',
        'etf-months': '配息月份 (點選切換)',
        'etf-shares': '需持有張數',
        'etf-cost': '投入本金',
        'etf-operation': '操作',
        'etf-delete': '刪除',
        'etf-summary': '每月領息總覽',
        'etf-total-capital': '預估總投入本金：',
        'etf-avg-monthly': '平均月領金額：',
        
        // Accounting Page
        'accounting-title': '💰 記帳系統',
        'accounting-month': '📅 月明細',
        'accounting-add': '📝 新增記錄',
        'accounting-year': '📊 年統計',
        'accounting-template': '🎯 範本設定',
        'accounting-balance': '本期盈餘',
        'accounting-income': '收入',
        'accounting-expense': '支出',
        'accounting-edit': '修改帳務',
        'accounting-save': '儲存修改',
        'accounting-delete': '刪除此筆',
        'accounting-cancel': '取消',
        'accounting-generate': '🚀 一鍵生成本月帳務',
        'accounting-date': '日期：',
        'accounting-item': '項目：',
        'accounting-amount': '金額：',
        'accounting-note': '備註：',
        'accounting-records': '新增紀錄',
        'accounting-add-record': '新增',
        'accounting-year-stats': '年度統計',
        'accounting-month-stats': '月份統計',
        'accounting-template-mgmt': '範本管理',
        'accounting-add-template': '新增範本',
        
        // Car Page
        'car-title': '🚗 車輛保養紀錄',
        'car-total-mileage': '目前總里程',
        'car-remaining': '下次保養倒數',
        'car-month-cost': '本月保養支出',
        'car-add-title': '📝 新增保養項目',
        'car-date': '保養日期：',
        'car-mileage': '儀表里程 (km)：',
        'car-mileage-placeholder': '輸入目前里程數',
        'car-item': '維修項目：',
        'car-item-placeholder': '如：換機油、齒輪油',
        'car-fee': '費用 (NTD)：',
        'car-fee-placeholder': '輸入支出金額',
        'car-save': '✓ 儲存紀錄',
        'car-records': '📋 保養紀錄',
    },
    'en': {
        // Welcome
        'welcome-title': 'Miao Life AI Assistant',
        'welcome-subtitle': 'Click, press key or touch to enter',
        'welcome-arrow': 'Enjoy using',
        
        // Settings
        'settings-title': '⚙️ System Settings',
        'settings-language': 'Language',
        'settings-font-size': 'Font Size',
        'settings-theme': 'Theme',
        'settings-light': 'Light',
        'settings-dark': 'Dark',
        'settings-close': 'Close',
        'font-small': 'Small',
        'font-normal': 'Normal',
        'font-large': 'Large',
        'font-xlarge': 'Extra Large',
        
        // Sidebar
        'sidebar-internal': '🔧 Tools',
        'sidebar-etf': '📊 ETF Calculator',
        'sidebar-accounting': '💰 Accounting',
        'sidebar-car': '🚗 Car Management',
        'sidebar-projects': '📁 Projects',
        'sidebar-websites': '🌟 Websites',
        'sidebar-footer': '©2026 Miao Life AI Assistant',
        
        // Home
        'home-welcome': 'Welcome to My Life Assistant',
        'home-ai-version': 'AI-Assisted Version',
        'home-intro-title': '👋 About Me',
        'home-intro-1': 'Hello! I\'m Miao Qishao, a developer dedicated to making life more convenient and organized.',
        'home-intro-2': 'This website is a personal life assistant platform, made with AI assistance, to integrate various records and management needs in my daily life.',
        'home-features': '📚 Features',
        'home-etf-title': 'ETF Monthly Distribution Calculator',
        'home-etf-desc': 'Help plan monthly ETF portfolio and calculate optimal dividend allocation',
        'home-accounting-title': 'Accounting System',
        'home-accounting-desc': 'Complete personal financial records and analysis tools to track income and expenses',
        'home-car-title': 'Car Management',
        'home-car-desc': 'Record vehicle maintenance and get reminders for next service',
        'home-tech': '🛠️ Technical Info',
        'home-tech-1': 'Frontend: HTML, CSS, JavaScript (Vanilla)',
        'home-tech-2': 'Storage: LocalStorage (No Backend Required)',
        'home-tech-3': 'Development: AI-Assisted for Efficiency',
        'home-tech-4': 'Design: Clean, Efficient, Easy to Maintain',
        'home-contact': '📞 Contact',
        'home-github': 'GitHub',
        'home-feedback': 'Feedback is welcome!',
        'enter': 'Enter →',
        
        // ETF Page
        'etf-title': 'ETF Monthly Distribution Calculator',
        'etf-target-income': 'Monthly Target Income:',
        'etf-target-note': '(Target to reach this amount each month)',
        'etf-add': '+ Add ETF',
        'etf-backup': '💾 Save Backup',
        'etf-my-backup': '📋 My Backups',
        'etf-name': 'ETF Name',
        'etf-dividend': 'Dividend (NTD/share)',
        'etf-price': 'Stock Price (NTD)',
        'etf-months': 'Distribution Months',
        'etf-shares': 'Shares Needed',
        'etf-cost': 'Investment Cost',
        'etf-operation': 'Action',
        'etf-delete': 'Delete',
        'etf-summary': 'Monthly Overview',
        'etf-total-capital': 'Total Investment:',
        'etf-avg-monthly': 'Average Monthly Income:',
        
        // Accounting Page
        'accounting-title': '💰 Accounting',
        'accounting-month': '📅 Monthly',
        'accounting-add': '📝 Add',
        'accounting-year': '📊 Yearly',
        'accounting-template': '🎯 Template',
        'accounting-balance': 'Balance',
        'accounting-income': 'Income',
        'accounting-expense': 'Expense',
        'accounting-edit': 'Edit',
        'accounting-save': 'Save',
        'accounting-delete': 'Delete',
        'accounting-cancel': 'Cancel',
        'accounting-generate': '🚀 Generate',
        'accounting-date': 'Date:',
        'accounting-item': 'Item:',
        'accounting-amount': 'Amount:',
        'accounting-note': 'Note:',
        'accounting-records': 'Add Record',
        'accounting-add-record': 'Add',
        'accounting-year-stats': 'Yearly Stats',
        'accounting-month-stats': 'Monthly Stats',
        'accounting-template-mgmt': 'Template',
        'accounting-add-template': 'Add Template',
        
        // Car Page
        'car-title': '🚗 Car Maintenance',
        'car-total-mileage': 'Total Mileage',
        'car-remaining': 'Next Service',
        'car-month-cost': 'Monthly Cost',
        'car-add-title': '📝 Add Record',
        'car-date': 'Date:',
        'car-mileage': 'Mileage (km):',
        'car-mileage-placeholder': 'Enter current mileage',
        'car-item': 'Service:',
        'car-item-placeholder': 'e.g., Oil change',
        'car-fee': 'Cost (NTD):',
        'car-fee-placeholder': 'Enter cost',
        'car-save': '✓ Save',
        'car-records': '📋 Records',
    },
    'ja': {
        // Welcome
        'welcome-title': 'ミャオライフ AI アシスタント',
        'welcome-subtitle': 'クリック、キー入力またはタッチで入場',
        'welcome-arrow': 'ご利用ありがとうございます',
        
        // Settings
        'settings-title': '⚙️ システム設定',
        'settings-language': '言語',
        'settings-font-size': 'フォントサイズ',
        'settings-theme': 'テーマ',
        'settings-light': 'ライト',
        'settings-dark': 'ダーク',
        'settings-close': '閉じる',
        'font-small': '小',
        'font-normal': '標準',
        'font-large': '大',
        'font-xlarge': '特大',
        
        // Sidebar
        'sidebar-internal': '🔧 ツール',
        'sidebar-etf': '📊 ETF計算機',
        'sidebar-accounting': '💰 家計簿',
        'sidebar-car': '🚗 車管理',
        'sidebar-projects': '📁 プロジェクト',
        'sidebar-websites': '🌟 ウェブサイト',
        'sidebar-footer': '©2026 ミャオライフ AI アシスタント',
        
        // Home
        'home-welcome': '私の生活アシスタントへようこそ',
        'home-ai-version': 'AI支援版',
        'home-intro-title': '👋 自己紹介',
        'home-intro-1': 'こんにちは！私はミャオ·チースハオで、生活をより便利で整理整頓することに尽力する開発者です。',
        'home-intro-2': 'このウェブサイトはAI技術を支援したパーソナルライフアシスタントプラットフォームで、日常生活のさまざまな記録と管理ニーズを統合しています。',
        'home-features': '📚 機能紹介',
        'home-etf-title': 'ETF月配当計算機',
        'home-etf-desc': '月間配当ETFポートフォリオの計画を支援し、最適な配当配置を計算',
        'home-accounting-title': '家計簿',
        'home-accounting-desc': '完全な個人財務記録と分析ツール、収支詳細を追跡',
        'home-car-title': '車管理',
        'home-car-desc': '車のメンテナンス記録と次回のサービスリマインダー',
        'home-tech': '🛠️ 技術情報',
        'home-tech-1': 'フロントエンド: HTML、CSS、JavaScript(ネイティブ)',
        'home-tech-2': 'ストレージ: LocalStorage(バックエンド不要)',
        'home-tech-3': '開発: AI支援効率',
        'home-tech-4': 'デザイン: シンプル、効率的、保守が容易',
        'home-contact': '📞 お問い合わせ',
        'home-github': 'GitHub',
        'home-feedback': 'ご意見やご感想をお聞かせください！',
        'enter': '入場 →',
        
        // ETF Page
        'etf-title': 'ETF月配当計算機',
        'etf-target-income': '月目標配当額:',
        'etf-target-note': '(毎月この金額に達することを目指す)',
        'etf-add': '+ ETF追加',
        'etf-backup': '💾 バックアップ保存',
        'etf-my-backup': '📋 私のバックアップ',
        'etf-name': 'ETF名',
        'etf-dividend': '配当金(円/株)',
        'etf-price': '株価(円)',
        'etf-months': '配当月',
        'etf-shares': '必要株数',
        'etf-cost': '投資額',
        'etf-operation': 'アクション',
        'etf-delete': '削除',
        'etf-summary': '月別概要',
        'etf-total-capital': '合計投資額:',
        'etf-avg-monthly': '月平均収入:',
        
        // Accounting Page
        'accounting-title': '💰 家計簿',
        'accounting-month': '📅 月別',
        'accounting-add': '📝 追加',
        'accounting-year': '📊 年間',
        'accounting-template': '🎯 テンプレート',
        'accounting-balance': '残高',
        'accounting-income': '収入',
        'accounting-expense': '支出',
        'accounting-edit': '編集',
        'accounting-save': '保存',
        'accounting-delete': '削除',
        'accounting-cancel': 'キャンセル',
        'accounting-generate': '🚀 生成',
        'accounting-date': '日付:',
        'accounting-item': '項目:',
        'accounting-amount': '金額:',
        'accounting-note': 'メモ:',
        'accounting-records': '記録追加',
        'accounting-add-record': '追加',
        'accounting-year-stats': '年間統計',
        'accounting-month-stats': '月別統計',
        'accounting-template-mgmt': 'テンプレート',
        'accounting-add-template': 'テンプレート追加',
        
        // Car Page
        'car-title': '🚗 車メンテナンス',
        'car-total-mileage': '総走行距離',
        'car-remaining': '次回サービス',
        'car-month-cost': '月コスト',
        'car-add-title': '📝 記録追加',
        'car-date': '日付:',
        'car-mileage': '走行距離 (km):',
        'car-mileage-placeholder': '現在の走行距離を入力',
        'car-item': 'サービス:',
        'car-item-placeholder': 'オイル交換など',
        'car-fee': 'コスト (円):',
        'car-fee-placeholder': 'コストを入力',
        'car-save': '✓ 保存',
        'car-records': '📋 記録',
    },
    'ko': {
        // Welcome
        'welcome-title': '미애 생활 AI 어시스턴트',
        'welcome-subtitle': '클릭, 키 입력 또는 터치하여 입장',
        'welcome-arrow': '즐겁게 사용하세요',
        
        // Settings
        'settings-title': '⚙️ 시스템 설정',
        'settings-language': '언어',
        'settings-font-size': '글꼴 크기',
        'settings-theme': '테마',
        'settings-light': '밝음',
        'settings-dark': '어두움',
        'settings-close': '닫기',
        'font-small': '작음',
        'font-normal': '보통',
        'font-large': '큼',
        'font-xlarge': '매우 큼',
        
        // Sidebar
        'sidebar-internal': '🔧 도구',
        'sidebar-etf': '📊 ETF 계산기',
        'sidebar-accounting': '💰 가계부',
        'sidebar-car': '🚗 차량 관리',
        'sidebar-projects': '📁 프로젝트',
        'sidebar-websites': '🌟 웹사이트',
        'sidebar-footer': '©2026 미애 생활 AI 어시스턴트',
        
        // Home
        'home-welcome': '제 생활 어시스턴트에 오신 것을 환영합니다',
        'home-ai-version': 'AI 지원 버전',
        'home-intro-title': '👋 자기소개',
        'home-intro-1': '안녕하세요! 저는 미애 치샤오이며, 삶을 더욱 편리하고 정돈되게 만드는 데 전념하는 개발자입니다.',
        'home-intro-2': '이 웹사이트는 AI 기술의 지원을 받아 만든 개인 생활 어시스턴트 플랫폼으로, 일상생활의 다양한 기록과 관리 필요를 통합합니다.',
        'home-features': '📚 기능 소개',
        'home-etf-title': 'ETF 월배당 계산기',
        'home-etf-desc': '월배당 ETF 포트폴리오 계획을 지원하고 최적 배당 할당 계산',
        'home-accounting-title': '가계부',
        'home-accounting-desc': '완전한 개인 재무 기록 및 분석 도구, 수입과 지출 추적',
        'home-car-title': '차량 관리',
        'home-car-desc': '차량 유지보수 기록 및 다음 서비스 알림',
        'home-tech': '🛠️ 기술 정보',
        'home-tech-1': '프론트엔드: HTML, CSS, JavaScript(네이티브)',
        'home-tech-2': '스토리지: LocalStorage(백엔드 불필요)',
        'home-tech-3': '개발: AI 지원 효율',
        'home-tech-4': '디자인: 간단함, 효율성, 유지보수 용이',
        'home-contact': '📞 연락처',
        'home-github': 'GitHub',
        'home-feedback': '피드백을 환영합니다!',
        'enter': '입장 →',
        
        // ETF Page
        'etf-title': 'ETF 월배당 계산기',
        'etf-target-income': '월 목표 배당금:',
        'etf-target-note': '(매월 이 금액에 도달하는 것을 목표)',
        'etf-add': '+ ETF 추가',
        'etf-backup': '💾 백업 저장',
        'etf-my-backup': '📋 내 백업',
        'etf-name': 'ETF 이름',
        'etf-dividend': '배당금(원/주)',
        'etf-price': '주가(원)',
        'etf-months': '배당월',
        'etf-shares': '필요 주식 수',
        'etf-cost': '투자 금액',
        'etf-operation': '작업',
        'etf-delete': '삭제',
        'etf-summary': '월별 개요',
        'etf-total-capital': '총 투자금:',
        'etf-avg-monthly': '월 평균 수입:',
        
        // Accounting Page
        'accounting-title': '💰 가계부',
        'accounting-month': '📅 월별',
        'accounting-add': '📝 추가',
        'accounting-year': '📊 연간',
        'accounting-template': '🎯 템플릿',
        'accounting-balance': '잔액',
        'accounting-income': '수입',
        'accounting-expense': '지출',
        'accounting-edit': '편집',
        'accounting-save': '저장',
        'accounting-delete': '삭제',
        'accounting-cancel': '취소',
        'accounting-generate': '🚀 생성',
        'accounting-date': '날짜:',
        'accounting-item': '항목:',
        'accounting-amount': '금액:',
        'accounting-note': '메모:',
        'accounting-records': '기록 추가',
        'accounting-add-record': '추가',
        'accounting-year-stats': '연간 통계',
        'accounting-month-stats': '월별 통계',
        'accounting-template-mgmt': '템플릿',
        'accounting-add-template': '템플릿 추가',
        
        // Car Page
        'car-title': '🚗 차량 유지보수',
        'car-total-mileage': '총 주행거리',
        'car-remaining': '다음 서비스',
        'car-month-cost': '월 비용',
        'car-add-title': '📝 기록 추가',
        'car-date': '날짜:',
        'car-mileage': '주행거리 (km):',
        'car-mileage-placeholder': '현재 주행거리 입력',
        'car-item': '서비스:',
        'car-item-placeholder': '오일 교환 등',
        'car-fee': '비용 (원):',
        'car-fee-placeholder': '비용 입력',
        'car-save': '✓ 저장',
        'car-records': '📋 기록',
    }
};

// 获取当前语言
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'zh-TW';
}

// 設置語言
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    applyTranslations();
}

// 獲取翻譯
function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || translations['zh-TW'][key] || key;
}

// 應用翻譯
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        if (element.tagName === 'INPUT' && element.type === 'text') {
            element.placeholder = translation;
        } else if (element.tagName === 'INPUT' && element.type === 'number') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // 更新 HTML 標題
    const htmlLang = getCurrentLanguage();
    document.documentElement.lang = htmlLang;
}

// 獲取字體大小
function getFontSize() {
    return localStorage.getItem('fontSize') || 'normal';
}

// 設置字體大小
function setFontSize(size) {
    localStorage.setItem('fontSize', size);
    applyFontSize();
}

// 應用字體大小
function applyFontSize() {
    const size = getFontSize();
    const root = document.documentElement;
    const sizes = {
        'small': '14px',
        'normal': '16px',
        'large': '18px',
        'xlarge': '20px'
    };
    root.style.fontSize = sizes[size] || '16px';
}

// 封裝成一個對外窗口，讓 script.js 呼叫
function initI18n() {
    applyTranslations();
    applyFontSize();
}

// 雖然 script.js 會呼叫，但為了保險（萬一某頁沒用 script.js），
// 我們還是留一個初始化，但確保它只在 script.js 不存在時才自跑。
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}
