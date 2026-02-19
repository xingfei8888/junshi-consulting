// CRM导航自我测试
console.log('=== CRM导航自我测试开始 ===');

// 测试所有导航链接
const testLinks = [
    { name: '客户管理', url: 'customers.html', expected: true },
    { name: '销售管道', url: 'opportunities.html', expected: true },
    { name: '任务管理', url: 'tasks.html', expected: true },
    { name: '报表分析', url: 'reports.html', expected: true },
    { name: '公司官网', url: 'index.html', expected: true }
];

// 检查导航DOM元素
const navLinks = document.querySelectorAll('.nav-menu a');
console.log(`找到 ${navLinks.length} 个导航链接`);

navLinks.forEach((link, index) => {
    console.log(`链接 ${index + 1}:`, {
        text: link.textContent.trim(),
        href: link.href,
        target: link.target,
        onclick: link.onclick
    });
    
    // 模拟点击测试
    link.addEventListener('click', function(e) {
        console.log(`点击事件触发: ${this.textContent.trim()} -> ${this.href}`);
        // 不阻止默认行为
    });
});

// 验证链接可用性
console.log('\n验证链接可用性:');
testLinks.forEach(link => {
    const element = document.querySelector(`a[href*="${link.url}"]`);
    if (element) {
        console.log(`✅ ${link.name}: 找到元素，href=${element.href}`);
        
        // 检查是否有点击事件阻止
        let hasClickHandler = false;
        let clickHandler = null;
        
        // 检查onclick属性
        if (element.onclick) {
            hasClickHandler = true;
            clickHandler = 'onclick属性';
        }
        
        // 检查事件监听器（简化检查）
        if (element.hasAttribute('data-listener')) {
            hasClickHandler = true;
            clickHandler = '事件监听器';
        }
        
        if (hasClickHandler) {
            console.log(`  警告: 有${clickHandler}可能阻止导航`);
        } else {
            console.log(`  良好: 无阻止导航的事件处理`);
        }
        
    } else {
        console.log(`❌ ${link.name}: 未找到元素`);
    }
});

console.log('=== CRM导航自我测试完成 ===');

// 输出建议
console.log('\n测试建议:');
console.log('1. 点击每个导航链接，应正常跳转页面');
console.log('2. 检查浏览器控制台是否有错误');
console.log('3. 检查页面跳转后URL是否正确');