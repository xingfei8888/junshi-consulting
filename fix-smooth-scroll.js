// 修复平滑滚动 - 只拦截锚点链接
(function() {
    console.log('修复平滑滚动脚本加载');
    
    document.addEventListener('DOMContentLoaded', function() {
        // 获取所有导航链接
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            // 移除旧的点击事件
            link.onclick = null;
            
            // 添加新的点击处理
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // 只处理锚点链接（以#开头）
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                    
                    // 更新URL（不刷新页面）
                    window.history.pushState(null, null, href);
                }
                
                // 对于页面链接（如services.html, about.html等），让浏览器正常处理
                // 不要阻止默认行为
            });
        });
        
        console.log('平滑滚动修复完成：只有锚点链接使用平滑滚动');
    });
})();