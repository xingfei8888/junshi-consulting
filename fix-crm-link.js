// CRM链接修复脚本
(function() {
    console.log('CRM链接修复脚本加载');
    
    document.addEventListener('DOMContentLoaded', function() {
        // 修复所有CRM链接
        const crmLinks = document.querySelectorAll('.crm-link, a[href="crm-proper.html"], a[href*="crm"]');
        
        crmLinks.forEach(link => {
            console.log('找到CRM链接:', link.href);
            
            // 移除原有点击事件
            link.onclick = null;
            
            // 添加新的点击处理
            link.addEventListener('click', function(e) {
                // 检查是否新窗口打开
                if (link.target === '_blank') {
                    // 新窗口直接打开
                    return;
                }
                
                e.preventDefault();
                
                console.log('点击CRM链接，目标:', this.href);
                
                // 检查是否已登录
                const isLoggedIn = localStorage.getItem('junshi_crm_logged_in') === 'true';
                const username = localStorage.getItem('junshi_crm_username');
                
                if (isLoggedIn && username) {
                    console.log('用户已登录，跳转到CRM:', username);
                    // 直接跳转到CRM系统
                    window.location.href = 'crm-proper.html';
                } else {
                    console.log('用户未登录，跳转到登录页');
                    // 跳转到登录页面
                    window.location.href = 'crm-login.html';
                }
            });
        });
        
        // 特殊处理：确保顶部的CRM链接正常工作
        const headerCRMLink = document.querySelector('nav a[href="crm-proper.html"]');
        if (headerCRMLink) {
            console.log('修复顶部CRM链接');
            headerCRMLink.href = 'crm-login.html';
            headerCRMLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                const isLoggedIn = localStorage.getItem('junshi_crm_logged_in') === 'true';
                const username = localStorage.getItem('junshi_crm_username');
                
                if (isLoggedIn && username) {
                    // 已登录，直接进入CRM
                    window.location.href = 'crm-proper.html';
                } else {
                    // 未登录，去登录页
                    window.location.href = 'crm-login.html';
                }
            });
        }
        
        // 在页面底部添加CRM状态提示
        setTimeout(function() {
            addCRMStatusIndicator();
        }, 1000);
    });
    
    // 添加CRM状态指示器
    function addCRMStatusIndicator() {
        const isLoggedIn = localStorage.getItem('junshi_crm_logged_in') === 'true';
        const username = localStorage.getItem('junshi_crm_username');
        
        const indicator = document.createElement('div');
        indicator.id = 'crm-status-indicator';
        indicator.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#4fc3f7;color:white;padding:10px 15px;border-radius:20px;font-size:12px;z-index:9999;display:none;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,0.2);';
        
        if (isLoggedIn && username) {
            indicator.textContent = `🟢 CRM登录中：${username}`;
            indicator.style.background = '#4CAF50';
            indicator.style.display = 'block';
            
            indicator.addEventListener('click', function() {
                window.open('crm-proper.html', '_blank');
            });
        } else {
            indicator.textContent = '🔴 CRM未登录'; 
            indicator.style.background = '#f44336';
            indicator.style.display = 'block';
            
            indicator.addEventListener('click', function() {
                window.location.href = 'crm-login.html';
            });
        }
        
        document.body.appendChild(indicator);
        
        // 5秒后自动隐藏
        setTimeout(function() {
            indicator.style.opacity = '0.5';
        }, 5000);
        
        // 鼠标移入显示
        indicator.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
        });
        
        indicator.addEventListener('mouseleave', function() {
            this.style.opacity = '0.5';
        });
    }
    
    // 监听登录状态变化
    window.addEventListener('storage', function(e) {
        if (e.key === 'junshi_crm_logged_in' || e.key === 'junshi_crm_username') {
            console.log('CRM登录状态变化，刷新指示器');
            const oldIndicator = document.getElementById('crm-status-indicator');
            if (oldIndicator) {
                oldIndicator.remove();
            }
            setTimeout(addCRMStatusIndicator, 500);
        }
    });
})();