/* ========================================
   结果页交互逻辑
   ======================================== */

(function () {
    'use strict';

    // 类型对应的emoji
    const TYPE_EMOJIS = {
        A: '💭',
        B: '🧘',
        C: '🌙',
        D: '⏰',
        E: '💫'
    };

    // 初始化
    function init() {
        // 从存储获取用户类型
        const stored = window.SleepDecode.getFromStorage();

        if (!stored || !stored.userType) {
            // 没有类型数据，返回首页
            window.location.href = 'index.html';
            return;
        }

        const typeId = stored.userType;
        const typeData = window.SleepDecode.SLEEP_TYPES[typeId];

        if (!typeData) {
            window.location.href = 'index.html';
            return;
        }

        // 填充页面内容
        renderTypeContent(typeId, typeData);

        // 绑定按钮事件
        document.getElementById('enterToolkitBtn').addEventListener('click', () => {
            window.SleepDecode.showTransition('正在准备你的工具箱…');
            setTimeout(() => {
                window.location.href = 'toolkit.html';
            }, 800);
        });

        // 隐藏过渡层
        setTimeout(() => {
            window.SleepDecode.hideTransition();
        }, 100);
    }

    // 渲染类型内容
    function renderTypeContent(typeId, typeData) {
        // 更新emoji
        const typeEmoji = document.getElementById('typeEmoji');
        if (typeEmoji) {
            typeEmoji.textContent = TYPE_EMOJIS[typeId] || '💭';
        }

        // 更新类型名称
        const typeName = document.getElementById('typeName');
        if (typeName) {
            typeName.textContent = `你是「${typeData.name}」`;
        }

        // 更新描述
        const typeDescription = document.getElementById('typeDescription');
        if (typeDescription) {
            typeDescription.textContent = typeData.description;
        }

        // 更新建议
        const typeAdvice = document.getElementById('typeAdvice');
        if (typeAdvice) {
            typeAdvice.textContent = typeData.advice;
        }

        // 更新步骤
        const stepsList = document.getElementById('stepsList');
        if (stepsList && typeData.steps) {
            stepsList.innerHTML = typeData.steps.map(step => `
                <div class="step-item">
                    <span class="step-num">${step.num}</span>
                    <span class="step-arrow">→</span>
                    <span class="step-text">${step.text}</span>
                </div>
            `).join('');
        }
    }

    // 页面加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
