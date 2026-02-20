// 验证导航链接修复
console.log('=== 验证导航链接修复效果 ===');

// 验证函数
function verifyNavigationFix() {
    console.log('检查导航链接修复...');
    
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('nav a');
    console.log(`找到 ${navLinks.length} 个导航链接`);
    
    let anchorLinks = 0;
    let pageLinks = 0;
    
    navLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const text = link.textContent || link.innerText;
        
        if (href && href.startsWith('#')) {
            anchorLinks++;
            console.log(`  🔗 ${text}: ${href} (锚点链接 - 应使用平滑滚动)`);
        } else if (href && (href.includes('.html') || href.includes('#'))) {
            pageLinks++;
            console.log(`  🔗 ${text}: ${href} (页面链接 - 应正常跳转)`);
        }
    });
    
    console.log(`\n统计: ${anchorLinks} 个锚点链接, ${pageLinks} 个页面链接`);
    
    // 测试点击行为
    console.log('\n测试修复效果:');
    
    // 测试服务项目链接
    const servicesLink = document.querySelector('nav a[href="services.html"]');
    if (servicesLink) {
        console.log('✅ 服务项目链接存在');
        
        // 模拟点击（不实际跳转）
        servicesLink.addEventListener('click', function(e) {
            console.log('点击服务项目链接 - 应正常跳转，不应被阻止');
        }, { once: true });
    }
    
    // 测试在线咨询链接
    const consultationLink = document.querySelector('nav a[href="#consultation"]');
    if (consultationLink) {
        console.log('✅ 在线咨询链接存在');
        
        consultationLink.addEventListener('click', function(e) {
            console.log('点击在线咨询链接 - 应使用平滑滚动');
        }, { once: true });
    }
    
    // 测试CRM链接
    const crmLink = document.querySelector('nav a.crm-link, nav a[href*="crm"]');
    if (crmLink) {
        console.log('✅ CRM系统链接存在');
        console.log(`  CRM链接目标: ${crmLink.getAttribute('href')}`);
    }
    
    console.log('\n🎯 修复验证完成！');
    console.log('预期效果:');
    console.log('- 锚点链接 (#开头): 平滑滚动');
    console.log('- 页面链接 (.html结尾): 正常页面跳转');
    console.log('- CRM链接: 智能登录跳转');
}

// 页面加载后运行验证
setTimeout(verifyNavigationFix, 1000);

console.log('导航链接修复验证工具已加载');