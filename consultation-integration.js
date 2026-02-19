// 网站咨询表单与CRM系统集成脚本
// 当客户填写咨询信息时，自动同步到CRM系统

class ConsultationCRMIntegrator {
    constructor() {
        this.crmStorageKey = 'junshi_crm_customers';
        this.consultationQueueKey = 'junshi_crm_consultation_queue';
        this.initializeIntegration();
    }
    
    initializeIntegration() {
        // 监听表单提交事件
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleConsultationSubmit(e));
        }
        
        // 检查是否有未处理的咨询
        this.checkPendingConsultations();
    }
    
    handleConsultationSubmit(event) {
        event.preventDefault();
        
        // 获取表单数据
        const formData = {
            name: document.getElementById('name').value,
            company: document.getElementById('company').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
            source: 'website_consultation',
            submittedAt: new Date().toISOString(),
            status: 'new_lead'
        };
        
        // 验证数据
        if (!this.validateFormData(formData)) {
            alert('请填写完整的联系信息！');
            return;
        }
        
        // 保存到CRM系统
        this.saveToCRM(formData);
        
        // 显示成功消息
        this.showSuccessMessage(formData);
        
        // 清空表单
        this.clearForm();
    }
    
    validateFormData(data) {
        return data.name && data.company && data.phone && data.message;
    }
    
    saveToCRM(formData) {
        // 添加到CRM客户数据库
        const customers = this.getCustomers();
        const newCustomer = {
            id: Date.now(),
            name: formData.company,
            contactPerson: formData.name,
            phone: formData.phone,
            email: '',
            companyAddress: '',
            source: '网站咨询',
            status: 'new',
            notes: `咨询需求：${formData.message}\n提交时间：${new Date(formData.submittedAt).toLocaleString('zh-CN')}`,
            createdAt: formData.submittedAt,
            isFromWebsite: true,
            consultationMessage: formData.message
        };
        
        customers.push(newCustomer);
        localStorage.setItem(this.crmStorageKey, JSON.stringify(customers));
        
        // 同时保存到咨询队列，用于创建销售管道
        this.addToConsultationQueue(newCustomer);
        
        console.log('客户咨询已同步到CRM系统：', newCustomer);
        return newCustomer;
    }
    
    getCustomers() {
        const data = localStorage.getItem(this.crmStorageKey);
        return data ? JSON.parse(data) : [];
    }
    
    addToConsultationQueue(customer) {
        const queue = this.getConsultationQueue();
        const queueItem = {
            ...customer,
            queueId: Date.now(),
            processed: false,
            needsFollowUp: true,
            followUpPriority: 'high',
            suggestedActions: [
                '电话回访确认需求',
                '发送公司介绍资料',
                '预约详细咨询时间'
            ]
        };
        
        queue.push(queueItem);
        localStorage.setItem(this.consultationQueueKey, JSON.stringify(queue));
        
        // 如果有销售管道页面，自动创建商机
        this.createOpportunityFromConsultation(customer);
    }
    
    getConsultationQueue() {
        const data = localStorage.getItem(this.consultationQueueKey);
        return data ? JSON.parse(data) : [];
    }
    
    createOpportunityFromConsultation(customer) {
        try {
            // 尝试获取商机数据
            const opportunities = JSON.parse(localStorage.getItem('junshi_crm_opportunities') || '[]');
            
            const newOpportunity = {
                id: Date.now() + 1, // 避免与客户ID重复
                customerId: customer.id,
                customerName: customer.name,
                name: `网站咨询：${customer.name} - ${customer.consultationMessage?.substring(0, 20) || '新商机'}`,
                amount: 0, // 需要后续评估
                stage: 1, // 线索阶段
                probability: 30, // 初步概率
                expectedClose: this.getDefaultCloseDate(),
                notes: `来自网站咨询：${customer.notes}\n联系人：${customer.contactPerson} ${customer.phone}`,
                source: 'website',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            opportunities.push(newOpportunity);
            localStorage.setItem('junshi_crm_opportunities', JSON.stringify(opportunities));
            
            console.log('已自动创建销售商机：', newOpportunity);
            return newOpportunity;
        } catch (error) {
            console.warn('创建商机失败，销售管道模块可能未初始化：', error);
            return null;
        }
    }
    
    getDefaultCloseDate() {
        const date = new Date();
        date.setDate(date.getDate() + 30); // 默认30天后
        return date.toISOString().split('T')[0];
    }
    
    showSuccessMessage(formData) {
        const message = `✅ 感谢${formData.name}的咨询！\n\n` +
                       `您的信息已成功提交，并已自动同步到CRM系统。\n` +
                       `我们的销售顾问将在24小时内与您联系（电话：${formData.phone}）。\n\n` +
                       `📊 您也可以直接访问我们的CRM系统查看咨询状态：\n` +
                       `https://xingfei8888.github.io/junshi-consulting/crm.html\n` +
                       `（使用同一台电脑访问，可以看到您的咨询记录）`;
        
        alert(message);
        
        // 同时显示页面提示
        this.displayPageNotification();
    }
    
    displayPageNotification() {
        // 在页面底部添加通知
        const notification = document.createElement('div');
        notification.id = 'consultation-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.5s ease;
        `;
        
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">✅ 咨询已提交成功！</div>
            <div style="font-size: 14px; opacity: 0.9;">已自动同步到CRM系统，销售团队将尽快跟进。</div>
            <div style="margin-top: 10px;">
                <a href="crm.html" target="_blank" style="color: white; text-decoration: underline; font-size: 13px;">查看CRM系统</a>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 5秒后自动隐藏
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    clearForm() {
        document.getElementById('name').value = '';
        document.getElementById('company').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('message').value = '';
    }
    
    checkPendingConsultations() {
        const queue = this.getConsultationQueue();
        const pending = queue.filter(item => !item.processed);
        
        if (pending.length > 0) {
            console.log(`有${pending.length}个未处理的网站咨询需要跟进：`, pending);
            // 可以在CRM仪表板显示提醒
            this.updateCRMNotification(pending.length);
        }
    }
    
    updateCRMNotification(pendingCount) {
        // 如果当前在CRM页面，更新通知
        if (window.location.pathname.includes('crm.html') || 
            window.location.pathname.includes('customers.html')) {
            this.showCRMNotification(pendingCount);
        }
    }
    
    showCRMNotification(count) {
        const existingNotification = document.getElementById('crm-consultation-alert');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        if (count > 0) {
            const notification = document.createElement('div');
            notification.id = 'crm-consultation-alert';
            notification.style.cssText = `
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 3px 10px rgba(231, 76, 60, 0.3);
            `;
            
            notification.innerHTML = `
                <div>
                    <span style="font-weight: bold;">🎯 ${count}个新咨询需要跟进！</span>
                    <div style="font-size: 14px; opacity: 0.9; margin-top: 3px;">来自网站咨询表单，请及时联系客户。</div>
                </div>
                <button onclick="window.location.href='customers.html'" style="
                    background: white;
                    color: #e74c3c;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 13px;
                ">查看详情</button>
            `;
            
            // 插入到页面顶部
            const container = document.querySelector('.crm-content') || document.querySelector('.container');
            if (container) {
                container.insertBefore(notification, container.firstChild);
            }
        }
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ConsultationCRMIntegrator();
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    });
} else {
    new ConsultationCRMIntegrator();
}

// 导出函数供其他脚本使用
window.ConsultationCRM = {
    integrator: ConsultationCRMIntegrator,
    getPendingConsultations: function() {
        const data = localStorage.getItem('junshi_crm_consultation_queue');
        return data ? JSON.parse(data).filter(item => !item.processed) : [];
    },
    markAsProcessed: function(customerId) {
        const queue = JSON.parse(localStorage.getItem('junshi_crm_consultation_queue') || '[]');
        const updatedQueue = queue.map(item => {
            if (item.id === customerId) {
                return { ...item, processed: true, processedAt: new Date().toISOString() };
            }
            return item;
        });
        localStorage.setItem('junshi_crm_consultation_queue', JSON.stringify(updatedQueue));
    }
};