// CRM系统通知模块 - 显示网站咨询提醒
// 当有新的网站咨询时，在CRM系统中显示通知

class CRMNotificationManager {
    constructor() {
        this.consultationQueueKey = 'junshi_crm_consultation_queue';
        this.notificationCheckInterval = 30000; // 30秒检查一次
        this.initializeNotifications();
    }
    
    initializeNotifications() {
        // 立即检查一次
        this.checkAndDisplayNotifications();
        
        // 定期检查
        setInterval(() => {
            this.checkAndDisplayNotifications();
        }, this.notificationCheckInterval);
        
        // 监听存储变化（其他标签页的新咨询）
        window.addEventListener('storage', (e) => {
            if (e.key === this.consultationQueueKey) {
                this.checkAndDisplayNotifications();
            }
        });
    }
    
    checkAndDisplayNotifications() {
        const pendingConsultations = this.getPendingConsultations();
        
        if (pendingConsultations.length > 0) {
            this.displayNotification(pendingConsultations);
        } else {
            this.removeNotification();
        }
    }
    
    getPendingConsultations() {
        try {
            const queue = JSON.parse(localStorage.getItem(this.consultationQueueKey) || '[]');
            return queue.filter(item => !item.processed);
        } catch (error) {
            console.error('获取咨询队列失败：', error);
            return [];
        }
    }
    
    displayNotification(pendingConsultations) {
        // 移除现有通知
        this.removeNotification();
        
        const count = pendingConsultations.length;
        const latest = pendingConsultations[pendingConsultations.length - 1];
        
        const notification = document.createElement('div');
        notification.id = 'crm-website-consultation-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            max-width: 350px;
            animation: slideDown 0.5s ease;
            cursor: pointer;
            border-left: 4px solid #ff9800;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <div style="font-size: 24px;">🎯</div>
                <div style="font-weight: bold; font-size: 16px;">${count}个新网站咨询</div>
            </div>
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 10px;">
                最新：${latest.contactPerson}（${latest.company || latest.name}）
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="window.openCustomersPage()" style="
                    background: white;
                    color: #e74c3c;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 13px;
                    flex: 1;
                ">查看客户</button>
                <button onclick="window.createTaskFromConsultation(${latest.id})" style="
                    background: #ff9800;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 13px;
                    flex: 1;
                ">创建任务</button>
                <button onclick="document.getElementById('crm-website-consultation-notification').remove()" style="
                    background: transparent;
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                ">稍后</button>
            </div>
        `;
        
        // 点击整个通知区域跳转到客户页面
        notification.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                window.openCustomersPage();
            }
        });
        
        document.body.appendChild(notification);
        
        // 添加CSS动画
        this.addNotificationStyles();
    }
    
    removeNotification() {
        const existing = document.getElementById('crm-website-consultation-notification');
        if (existing) {
            existing.remove();
        }
    }
    
    addNotificationStyles() {
        if (!document.getElementById('crm-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'crm-notification-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                #crm-website-consultation-notification:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
                    transition: all 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// 全局函数供按钮使用
window.openCustomersPage = function() {
    if (window.location.pathname.includes('customers.html')) {
        // 已经在客户页面，刷新数据
        if (typeof renderCustomerTable === 'function') {
            renderCustomerTable();
        }
        // 标记最新的咨询为已查看
        markLatestAsViewed();
    } else {
        window.location.href = 'customers.html';
    }
    
    // 移除通知
    const notification = document.getElementById('crm-website-consultation-notification');
    if (notification) notification.remove();
};

window.createTaskFromConsultation = function(customerId) {
    try {
        const customers = JSON.parse(localStorage.getItem('junshi_crm_customers') || '[]');
        const customer = customers.find(c => c.id === customerId);
        
        if (customer) {
            // 创建跟进任务
            const tasks = JSON.parse(localStorage.getItem('junshi_crm_tasks') || '[]');
            const newTask = {
                id: Date.now(),
                title: `电话跟进：${customer.contactPerson}（${customer.name}）`,
                description: `网站咨询跟进：${customer.notes?.split('\n')[0] || '新客户咨询'}`,
                priority: 'high',
                status: 'pending',
                dueDate: new Date().toISOString().split('T')[0], // 今天
                assignee: '销售团队',
                customerId: customer.id,
                customerName: customer.name,
                createdAt: new Date().toISOString(),
                completedAt: null
            };
            
            tasks.push(newTask);
            localStorage.setItem('junshi_crm_tasks', JSON.stringify(tasks));
            
            // 标记咨询为已处理
            const queue = JSON.parse(localStorage.getItem('junshi_crm_consultation_queue') || '[]');
            const updatedQueue = queue.map(item => {
                if (item.id === customerId) {
                    return { 
                        ...item, 
                        processed: true, 
                        processedAt: new Date().toISOString(),
                        taskCreated: true,
                        taskId: newTask.id
                    };
                }
                return item;
            });
            localStorage.setItem('junshi_crm_consultation_queue', JSON.stringify(updatedQueue));
            
            alert(`✅ 已为${customer.contactPerson}创建跟进任务！`);
            
            // 跳转到任务页面
            if (!window.location.pathname.includes('tasks.html')) {
                window.location.href = 'tasks.html';
            }
        }
    } catch (error) {
        console.error('创建任务失败：', error);
        alert('创建任务失败，请手动创建。');
    }
};

function markLatestAsViewed() {
    try {
        const queue = JSON.parse(localStorage.getItem('junshi_crm_consultation_queue') || '[]');
        const pending = queue.filter(item => !item.processed);
        
        if (pending.length > 0) {
            const latest = pending[pending.length - 1];
            const updatedQueue = queue.map(item => {
                if (item.id === latest.id && !item.processed) {
                    return { ...item, viewed: true, viewedAt: new Date().toISOString() };
                }
                return item;
            });
            localStorage.setItem('junshi_crm_consultation_queue', JSON.stringify(updatedQueue));
        }
    } catch (error) {
        console.error('标记已查看失败：', error);
    }
}

// 初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // 只在CRM相关页面初始化
        if (window.location.pathname.includes('crm.html') || 
            window.location.pathname.includes('customers.html') ||
            window.location.pathname.includes('opportunities.html') ||
            window.location.pathname.includes('tasks.html') ||
            window.location.pathname.includes('reports.html')) {
            new CRMNotificationManager();
        }
    });
} else {
    if (window.location.pathname.includes('crm.html') || 
        window.location.pathname.includes('customers.html') ||
        window.location.pathname.includes('opportunities.html') ||
        window.location.pathname.includes('tasks.html') ||
        window.location.pathname.includes('reports.html')) {
        new CRMNotificationManager();
    }
}

// 导出功能
window.CRMNotifications = {
    manager: CRMNotificationManager,
    checkNow: function() {
        const manager = new CRMNotificationManager();
        manager.checkAndDisplayNotifications();
        return manager.getPendingConsultations();
    },
    clearNotification: function() {
        const notification = document.getElementById('crm-website-consultation-notification');
        if (notification) notification.remove();
    }
};