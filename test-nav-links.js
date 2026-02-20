// 导航链接测试
console.log('=== 导航链接功能测试开始 ===');

// 测试链接配置
const navLinks = [
    { text: '服务项目', href: 'services.html', type: 'page' },
    { text: '在线咨询', href: '#consultation', type: 'anchor' },
    { text: '关于我们', href: 'about.html', type: 'page' },
    { text: 'CRM系统', href: 'crm-login.html', type: 'page' }
];

// 测试结果
let testResults = [];

// 测试页面链接
async function testPageLink(link) {
    try {
        const response = await fetch(link.href, { method: 'HEAD' });
        return {
            ...link,
            success: response.ok,
            status: response.status,
            error: response.ok ? null : `HTTP ${response.status}`
        };
    } catch (error) {
        return {
            ...link,
            success: false,
            status: 'ERROR',
            error: error.message
        };
    }
}

// 测试锚点链接
function testAnchorLink(link) {
    const element = document.querySelector(link.href);
    return {
        ...link,
        success: !!element,
        status: element ? 'FOUND' : 'NOT_FOUND',
        error: element ? null : `锚点元素不存在: ${link.href}`
    };
}

// 运行所有测试
async function runTests() {
    console.log('开始测试导航链接...');
    
    for (const link of navLinks) {
        console.log(`测试: ${link.text} -> ${link.href}`);
        
        if (link.type === 'page') {
            const result = await testPageLink(link);
            testResults.push(result);
            console.log(`  ${result.success ? '✅' : '❌'} ${result.text}: ${result.success ? '正常' : result.error}`);
        } else if (link.type === 'anchor') {
            const result = testAnchorLink(link);
            testResults.push(result);
            console.log(`  ${result.success ? '✅' : '❌'} ${result.text}: ${result.success ? '找到锚点' : result.error}`);
        }
    }
    
    showResults();
}

// 显示结果
function showResults() {
    console.log('\n=== 测试结果汇总 ===');
    const total = testResults.length;
    const passed = testResults.filter(r => r.success).length;
    const failed = testResults.filter(r => !r.success).length;
    
    console.log(`总计: ${total} 个链接`);
    console.log(`通过: ${passed} 个`);
    console.log(`失败: ${failed} 个`);
    
    if (failed > 0) {
        console.log('\n失败链接:');
        testResults.filter(r => !r.success).forEach(r => {
            console.log(`  ❌ ${r.text} (${r.href}): ${r.error}`);
        });
        
        // 提供修复建议
        console.log('\n🔧 修复建议:');
        testResults.filter(r => !r.success).forEach(r => {
            if (r.type === 'page') {
                console.log(`  ${r.text}: 检查文件 ${r.href} 是否存在，或重新创建该页面`);
            } else if (r.type === 'anchor') {
                console.log(`  ${r.text}: 在页面中添加 id="consultation" 的元素`);
            }
        });
    } else {
        console.log('🎉 所有导航链接功能正常！');
    }
    
    // 添加到页面显示
    addResultsToPage();
}

// 添加到页面
function addResultsToPage() {
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'nav-test-results';
    resultsDiv.style.cssText = 'position:fixed;top:10px;right:10px;background:white;padding:15px;border:2px solid #333;border-radius:8px;z-index:9999;max-width:350px;max-height:200px;overflow:auto;font-family:monospace;font-size:12px;box-shadow:0 5px 15px rgba(0,0,0,0.3);';
    
    let html = '<h4 style="margin:0 0 10px 0;color:#1a237e;">导航链接测试</h4>';
    
    testResults.forEach(result => {
        const color = result.success ? '#4CAF50' : '#f44336';
        const icon = result.success ? '✅' : '❌';
        html += `<div style="margin:3px 0;color:${color};">${icon} ${result.text}: ${result.href}</div>`;
    });
    
    html += '<button onclick="this.parentNode.remove()" style="margin-top:10px;padding:3px 8px;background:#f44336;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;">关闭</button>';
    
    resultsDiv.innerHTML = html;
    document.body.appendChild(resultsDiv);
}

// 开始测试
document.addEventListener('DOMContentLoaded', runTests);

console.log('导航链接测试工具已加载');