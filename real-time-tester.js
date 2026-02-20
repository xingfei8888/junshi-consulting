// 实时网站功能测试工具
console.log('=== 实时网站测试开始 ===');

// 测试配置
const testConfig = {
    baseUrl: 'https://xingfei8888.github.io/junshi-consulting/',
    tests: [
        { name: '首页加载', url: 'index.html', method: 'GET' },
        { name: '服务项目页面', url: 'services.html', method: 'GET' },
        { name: '关于我们页面', url: 'about.html', method: 'GET' },
        { name: 'CRM登录页面', url: 'crm-login.html', method: 'GET' },
        { name: 'CRM系统页面', url: 'crm-proper.html', method: 'GET' },
        { name: '人才管理页面', url: 'talent-management.html', method: 'GET' },
        { name: '组织架构页面', url: 'organization-structure.html', method: 'GET' },
        { name: '流程优化页面', url: 'process-optimization.html', method: 'GET' }
    ]
};

// 测试结果存储
let testResults = [];
let passedTests = 0;
let failedTests = 0;

// 执行单个测试
async function runTest(test) {
    const startTime = Date.now();
    
    try {
        const response = await fetch(test.url, { 
            method: test.method,
            mode: 'cors',
            cache: 'no-cache'
        });
        
        const duration = Date.now() - startTime;
        
        if (response.ok) {
            return {
                name: test.name,
                url: test.url,
                status: response.status,
                duration: duration,
                success: true,
                error: null
            };
        } else {
            return {
                name: test.name,
                url: test.url,
                status: response.status,
                duration: duration,
                success: false,
                error: `HTTP ${response.status}`
            };
        }
    } catch (error) {
        const duration = Date.now() - startTime;
        return {
            name: test.name,
            url: test.url,
            status: 'ERROR',
            duration: duration,
            success: false,
            error: error.message
        };
    }
}

// 执行所有测试
async function runAllTests() {
    console.log(`开始执行 ${testConfig.tests.length} 个测试...`);
    
    for (const test of testConfig.tests) {
        console.log(`正在测试: ${test.name} (${test.url})`);
        const result = await runTest(test);
        testResults.push(result);
        
        if (result.success) {
            console.log(`  ✅ ${result.name}: 成功 (${result.status}, ${result.duration}ms)`);
            passedTests++;
        } else {
            console.log(`  ❌ ${result.name}: 失败 - ${result.error}`);
            failedTests++;
        }
    }
    
    // 显示结果
    showResults();
}

// 显示结果
function showResults() {
    console.log('\n=== 测试结果汇总 ===');
    console.log(`总计: ${testResults.length} 个测试`);
    console.log(`通过: ${passedTests} 个`);
    console.log(`失败: ${failedTests} 个`);
    
    if (failedTests > 0) {
        console.log('\n失败测试详情:');
        testResults.filter(r => !r.success).forEach(r => {
            console.log(`  ❌ ${r.name}: ${r.url} - ${r.error}`);
        });
        
        // 创建修复建议
        createFixSuggestions();
    } else {
        console.log('🎉 所有测试通过！网站功能正常。');
        
        // 检查特定功能
        setTimeout(checkSpecificFunctions, 1000);
    }
}

// 创建修复建议
function createFixSuggestions() {
    console.log('\n🔧 修复建议:');
    
    testResults.filter(r => !r.success).forEach(r => {
        console.log(`  ${r.name}修复方案:`);
        
        if (r.error.includes('404')) {
            console.log('    • 检查文件是否存在');
            console.log('    • 确认GitHub部署完成');
            console.log('    • 检查文件名大小写');
        } else if (r.error.includes('CORS') || r.error.includes('Network')) {
            console.log('    • 检查网络连接');
            console.log('    • 确认GitHub Pages服务正常');
            console.log('    • 等待几分钟后重试');
        } else {
            console.log('    • 查看浏览器控制台获取详细错误');
            console.log('    • 检查JavaScript错误');
        }
        console.log('');
    });
}

// 检查特定功能
function checkSpecificFunctions() {
    console.log('\n🔍 特定功能检查:');
    
    // 检查表单
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('  ✅ 咨询表单存在');
        
        // 检查必要字段
        const requiredFields = ['name', 'company', 'phone', 'message'];
        let allFieldsExist = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input) {
                console.log(`  ❌ 表单字段缺失: ${field}`);
                allFieldsExist = false;
            }
        });
        
        if (allFieldsExist) {
            console.log('  ✅ 所有必要表单字段都存在');
        }
    } else {
        console.log('  ❌ 咨询表单不存在');
    }
    
    // 检查CRM链接
    const crmLinks = document.querySelectorAll('.crm-link, a[href*="crm"]');
    if (crmLinks.length > 0) {
        console.log(`  ✅ 找到 ${crmLinks.length} 个CRM链接`);
    } else {
        console.log('  ❌ 未找到CRM链接');
    }
    
    // 检查导航链接
    const navLinks = document.querySelectorAll('nav a');
    console.log(`  ✅ 找到 ${navLinks.length} 个导航链接`);
}

// 添加结果到页面
function addResultsToPage() {
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'realtime-test-results';
    resultsDiv.style.cssText = 'position:fixed;top:10px;left:10px;background:white;padding:15px;border:2px solid #333;border-radius:8px;z-index:9999;max-width:400px;max-height:300px;overflow:auto;font-family:monospace;font-size:12px;box-shadow:0 5px 15px rgba(0,0,0,0.3);';
    
    let html = '<h3 style="margin:0 0 10px 0;color:#1a237e;">实时测试结果</h3>';
    html += `<div>测试: ${testResults.length} | 通过: <span style="color:#4CAF50">${passedTests}</span> | 失败: <span style="color:#f44336">${failedTests}</span></div>`;
    
    if (failedTests > 0) {
        html += '<div style="margin-top:10px;color:#f44336;font-weight:bold;">发现以下问题:</div>';
        testResults.filter(r => !r.success).forEach(r => {
            html += `<div style="margin:5px 0;padding:3px;background:#ffebee;">❌ ${r.name}: ${r.error}</div>`;
        });
    } else {
        html += '<div style="margin-top:10px;color:#4CAF50;font-weight:bold;">✅ 所有功能正常！</div>';
    }
    
    html += '<button onclick="this.parentNode.remove()" style="margin-top:10px;padding:5px 10px;background:#f44336;color:white;border:none;border-radius:3px;cursor:pointer;">关闭</button>';
    
    resultsDiv.innerHTML = html;
    document.body.appendChild(resultsDiv);
}

// 开始测试
setTimeout(function() {
    runAllTests().then(() => {
        setTimeout(addResultsToPage, 500);
    });
}, 1000);

console.log('实时测试工具已加载，开始执行测试...');