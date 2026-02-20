// CRM登录检查
(function() {
    const isLoggedIn = localStorage.getItem("crm_logged_in") === "true";
    if (!isLoggedIn) {
        window.location.href = "crm-login.html";
    }
    
    // 添加登出功能
    document.addEventListener("DOMContentLoaded", function() {
        const header = document.querySelector(".header");
        if (header) {
            const userInfo = document.createElement("div");
            userInfo.style.cssText = "color: #666; font-size: 14px;";
            userInfo.innerHTML = `用户：${localStorage.getItem("crm_username") || "admin"} | <a href="#" id="logoutBtn" style="color: #dc3545;">退出登录</a>`;
            header.appendChild(userInfo);
            
            document.getElementById("logoutBtn").addEventListener("click", function(e) {
                e.preventDefault();
                localStorage.removeItem("crm_logged_in");
                localStorage.removeItem("crm_username");
                localStorage.removeItem("crm_login_time");
                window.location.href = "crm-login.html";
            });
        }
    });
})();