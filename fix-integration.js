// 直接的CRM集成修复
(function() {
    console.log('CRM集成修复脚本加载');
    
    // 等待页面完全加载
    document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) {
            console.log('未找到咨询表单');
            return;
        }
        
        console.log('找到咨询表单，添加CRM集成处理');
        
        // 移除原表单处理（避免冲突）
        contactForm.onsubmit = null;
        
        // 添加新的表单处理
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 收集表单数据
            const formData = {
                name: document.querySelector('#name').value,
                company: document.querySelector('#company').value,
                phone: document.querySelector('#phone').value,
                message: document.querySelector('#message').value,
                source: 'website_consultation',
                submittedAt: new Date().toISOString(),
                status: 'new_lead'
            };
            
            console.log('表单数据:', formData);
            
            // 验证数据
            if (!formData.name || !formData.company || !formData.phone || !formData.message) {
                alert('请填写完整的联系信息！');
                return;
            }
            
            // 保存到CRM系统
            const saved = saveToCRM(formData);
            
            if (saved) {
                // 显示扩展的成功消息
                const message = `✅ 感谢${formData.name}的咨询！\n\n` +
                               `您的信息已成功同步到CRM销售管理系统。\n` +
                               `销售团队将尽快与您联系（电话：${formData.phone}）。\n\n` +
                               `📊 您现在可以：\n` +
                               `1. 访问CRM系统查看您的咨询记录\n` +
                               `2. 或等待我们的销售专员联系您`;
                alert(message);
            } else {
                alert('提交成功，但CRM同步遇到问题。我们会手动处理您的咨询。');
            }
            
            // 清空表单
            contactForm.reset();
        });
        
        function saveToCRM(formData) {
            try {
                // 获取现有客户数据
                const customers = JSON.parse(localStorage.getItem('junshi_crm_customers') || '[]');
                
                // 创建新客户记录
                const newCustomer = {
                    id: Date.now(),
                    name: formData.company,
                    contactPerson: formData.name,
                    phone: formData.phone,
                    email: '',
                    companyAddress: '',
                    source: '网站咨询',
                    status: 'new',
                    notes: `咨询需求：${formData.message}\n提交时间：${new Date().toLocaleString('zh-CN')}`,
                    createdAt: formData.submittedAt,
                    isFromWebsite: true,
                    consultationMessage: formData.message
                };
                
                // 添加到客户列表
                customers.push(newCustomer);
                localStorage.setItem('junshi_crm_customers', JSON.stringify(customers));
                
                console.log('客户保存成功:', newCustomer);
                
                // 创建咨询队列记录
                const queue = JSON.parse(localStorage.getItem('junshi_crm_consultation_queue') || '[]');
                queue.push({
                    ...newCustomer,
                    queueId: Date.now(),
                    processed: false,
                    needsFollowUp: true,
                    priority: 'high'
                });
                localStorage.setItem('junshi_crm_consultation_queue', JSON.stringify(queue));
                
                // 触发storage事件让其他页面知道
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'junshi_crm_consultation_queue',
                    newValue: JSON.stringify(queue)
                }));
                
                // 尝试创建销售商机
                createOpportunity(newCustomer);
                
                return true;
            } catch (error) {
                console.error('保存到CRM失败:', error);
                return false;
            }
        }
        
        function createOpportunity(customer) {
            try {
                const opportunities = JSON.parse(localStorage.getItem('junshi_crm_opportunities') || '[]');
                
                const newOpportunity = {
                    id: Date.now() + 1,
                    customerId: customer.id,
                    customerName: customer.name,
                    name: `网站咨询：${customer.name}`,
                    amount: 0,
                    stage: 1,
                    probability: 30,
                    expectedClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    notes: customer.notes,
                    source: 'website',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                opportunities.push(newOpportunity);
                localStorage.setItem('junshi_crm_opportunities', JSON.stringify(opportunities));
                
                console.log('商机创建成功:', newOpportunity);
                return true;
            } catch (error) {
                console.warn('创建商机失败:', error);
                return false;
            }
        }
    });
})();