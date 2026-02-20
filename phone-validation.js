// 手机号实时验证增强
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;
        
        console.log('手机号实时验证已启用');
        
        // 实时验证
        phoneInput.addEventListener('input', function() {
            const value = this.value.replace(/[^\d]/g, ''); // 只保留数字
            if (value !== this.value) {
                this.value = value; // 自动过滤非数字
            }
            
            // 限制长度
            if (value.length > 11) {
                this.value = value.substring(0, 11);
            }
            
            // 实时验证提示
            const pattern = /^1[3-9]\d{9}$/;
            const isValid = pattern.test(this.value);
            
            // 添加/移除样式
            if (this.value.length > 0) {
                this.classList.toggle('valid-phone', isValid);
                this.classList.toggle('invalid-phone', !isValid && this.value.length === 11);
            } else {
                this.classList.remove('valid-phone', 'invalid-phone');
            }
        });
        
        // 失去焦点时验证
        phoneInput.addEventListener('blur', function() {
            if (this.value && this.value.length === 11) {
                const pattern = /^1[3-9]\d{9}$/;
                if (!pattern.test(this.value)) {
                    this.classList.add('invalid-phone');
                    // 显示错误提示
                    const errorMsg = '请输入有效的手机号（以1开头，第二位为3-9）';
                    let errorSpan = this.nextElementSibling;
                    if (!errorSpan || !errorSpan.classList.contains('phone-error')) {
                        errorSpan = document.createElement('span');
                        errorSpan.className = 'phone-error';
                        errorSpan.style.color = '#dc3545';
                        errorSpan.style.fontSize = '12px';
                        errorSpan.style.marginLeft = '10px';
                        this.parentNode.insertBefore(errorSpan, this.nextSibling);
                    }
                    errorSpan.textContent = errorMsg;
                }
            }
        });
        
        // 获取焦点时清除错误
        phoneInput.addEventListener('focus', function() {
            const errorSpan = this.nextElementSibling;
            if (errorSpan && errorSpan.classList.contains('phone-error')) {
                errorSpan.remove();
            }
            this.classList.remove('invalid-phone');
        });
    });
})();