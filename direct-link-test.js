// 直接测试导航链接
console.log('=== 直接测试导航链接 ===');

// 等待页面加载
setTimeout(function() {
    console.log('开始测试导航链接...');
    
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('nav a');
    console.log(`找到 ${navLinks.length} 个导航链接`);
    
    // 检查每个链接
    navLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const text = link.textContent || link.innerText;
        const id = link.id || '无ID';
        const classes = link.className || '无类名';
        
        console.log(`\n链接 ${index + 1}: ${text}`);
        console.log(`  href: ${href}`);
        console.log(`  id: ${id}`);
        console.log(`  class: ${classes}`);
        
        // 检查事件监听器
        const listeners = getEventListeners ? getEventListeners(link) : null;
        if (listeners && listeners.click) {
            console.log(`  点击事件监听器: ${listeners.click.length} 个`);
        } else {
            console.log(`  点击事件监听器: 未知（需在浏览器控制台查看）`);
        }
        
        // 检查链接类型
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            console.log(`  锚点目标: ${target ? '找到' : '未找到'}`);
        } else if (href && href.includes('.html')) {
            console.log(`  页面链接: ${href}`);
            
            // 检查文件是否存在
            fetch(href, { method: 'HEAD' })
                .then(response => {
                    console.log(`  页面状态: ${response.ok ? '存在' : '不存在'} (${response.status})`);
                })
                .catch(error => {
                    console.log(`  检查页面失败: ${error.message}`);
                });
        }
    });
    
    // 检查fix-smooth-scroll.js是否加载
    console.log('\n=== 检查脚本加载 ===');
    
    // 检查所有script标签
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script, index) => {
        const src = script.getAttribute('src');
        if (src) {
            console.log(`脚本 ${index + 1}: ${src}`);
        }
    });
    
    console.log('\n=== 问题诊断 ===');
    console.log('如果链接仍不工作，可能原因：');
    console.log('1. 脚本未正确加载 - 检查控制台错误');
    console.log('2. 事件监听器冲突 - 其他脚本可能覆盖了点击事件');
    console.log('3. 缓存问题 - 强制刷新页面 (Ctrl+Shift+R)');
    console.log('4. 链接目标问题 - 检查目标页面是否存在');
    
    console.log('\n=== 立即修复建议 ===');
    console.log('1. 打开浏览器开发者工具 (F12)');
    console.log('2. 检查控制台是否有JavaScript错误');
    console.log('3. 在Elements面板检查链接元素');
    console.log('4. 在Console面板运行 direct-link-test.js 检查');
    
}, 2000);

console.log('直接测试脚本已加载，2秒后开始测试...');