// 核心邏輯：專注於里程驅動與日期檢核
const MaintenanceLogic = {
    // 計算保養剩餘里程
    calculateRemaining: (currentKm, lastServiceKm, intervalKm) => {
        return (lastServiceKm + intervalKm) - currentKm;
    },

    // 判斷是否需要保養
    needsAttention: (remainingKm) => {
        return remainingKm <= 500; // 剩餘 500km 時提醒
    },

    // 驗證日期，確保不是預設的 1 號或空值
    isValidDate: (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }
};

export default MaintenanceLogic;
