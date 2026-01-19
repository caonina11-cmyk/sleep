/* ========================================
   问卷页交互逻辑 (Dynamic Version)
   ======================================== */

(function () {
    'use strict';

    // 依赖全局对象
    // const SleepDecode = window.SleepDecode;  <-- REMOVED (Redundant)
    // const QUESTIONS = SleepDecode.QUIZ_QUESTIONS; <-- REMOVED (Redundant)

    // 状态
    let currentStepIndex = 0; // 0-indexed

    // Debug helper
    function showError(msg) {
        const errDiv = document.createElement('div');
        errDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:red;color:white;padding:10px;z-index:9999;font-size:12px;';
        errDiv.textContent = 'Error: ' + msg;
        document.body.appendChild(errDiv);
        console.error(msg);
    }

    // Safety check
    if (!window.SleepDecode) {
        showError('SleepDecode Global Object Missing! Check script.js');
        return;
    }

    const SleepDecode = window.SleepDecode;
    const QUESTIONS = SleepDecode.QUIZ_QUESTIONS;

    if (!QUESTIONS || QUESTIONS.length === 0) {
        showError('QUIZ_QUESTIONS is empty or undefined!');
        return;
    }

    const totalSteps = QUESTIONS.length;
    const answers = {};
    const answerData = {};

    // DOM 元素
    const quizWrapper = document.getElementById('quizWrapper');
    const dotsContainer = document.getElementById('progressDots');
    const progressText = document.getElementById('progressText');

    // 初始化
    function init() {
        try {
            renderQuiz();
            updateProgress();
        } catch (e) {
            showError('Render Error: ' + e.message);
        }
    }

    // 渲染问卷
    function renderQuiz() {
        if (!quizWrapper) return;
        quizWrapper.innerHTML = ''; // 清空

        QUESTIONS.forEach((q, index) => {
            const slide = document.createElement('div');
            slide.className = `quiz-slide ${index === 0 ? 'active' : ''}`;
            slide.dataset.questionIndex = index;
            slide.dataset.id = q.id;

            // 选项生成
            const optionsHtml = q.options.map((opt, optIndex) => {
                // 判断是否有描述
                const hasDesc = opt.desc || opt.description;
                const descHtml = hasDesc ? `<span class="option-desc">${opt.desc || opt.description}</span>` : '';

                return `
                    <button class="option-btn" data-index="${optIndex}">
                        <span class="option-text">${optIndex + 1}. ${opt.text}</span>
                        ${descHtml}
                    </button>
                `;
            }).join('');

            slide.innerHTML = `
                <h2 class="question-text">${q.question || q.text}</h2>
                <div class="options-list">
                    ${optionsHtml}
                </div>
            `;

            quizWrapper.appendChild(slide);
        });

        // 重新绑定事件
        bindEvents();
    }

    // 绑定事件
    function bindEvents() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', handleOptionClick);
        });
    }

    // 处理选项点击
    function handleOptionClick(e) {
        const btn = e.currentTarget;
        const slide = btn.closest('.quiz-slide');
        const index = parseInt(slide.dataset.questionIndex);
        const questionId = parseInt(slide.dataset.id); // Parse int for comparison
        const optionIndex = parseInt(btn.dataset.index);

        // Q6 MULTI-SELECT LOGIC
        if (questionId === 6) {
            // Toggle
            btn.classList.toggle('selected');

            // Get current buttons
            const currentSelected = slide.querySelectorAll('.option-btn.selected');

            // Limit to 3 (Undo selection if over limit)
            if (currentSelected.length > 3) {
                btn.classList.remove('selected');
                // Optional: Toast
                return;
            }

            // Find or Refresh Confirm Button
            let confirmBtn = slide.querySelector('.confirm-btn');

            // Lazy Create if missing
            if (!confirmBtn) {
                confirmBtn = document.createElement('button');
                // Style: Aurora Blue Gradient, Pill Shape, Shadow (Inline Styles to bypass cache/Tailwind issues)
                confirmBtn.className = 'confirm-btn w-full fade-in-up flex items-center justify-center gap-2 transition-all';
                confirmBtn.style.cssText = `
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    margin: 40px auto 0 auto; /* Centered with top margin */
                    background: linear-gradient(90deg, #7C3AED, #2563EB); /* Static Blue-Purple */
                    color: white;
                    padding: 12px 0; /* Smaller height */
                    width: 50%; /* Smaller width */
                    border-radius: 9999px; /* Pill Shape */
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
                    font-size: 16px; /* Slightly smaller text */
                    font-weight: 600;
                    letter-spacing: 1px;
                    border: 1px solid rgba(255,255,255,0.2);
                `;
                confirmBtn.innerHTML = `
                    <span>下一步</span>
                `;
                confirmBtn.onclick = () => {
                    const indices = Array.from(slide.querySelectorAll('.option-btn.selected')).map(b => parseInt(b.dataset.index));
                    if (indices.length === 0) return;

                    answers[questionId] = indices;
                    captureSpecialData(questionId, indices);

                    if (index < totalSteps - 1) goToStep(index + 1);
                    else finishQuiz();
                };
                slide.appendChild(confirmBtn);
            }

            // Visibility Check (using re-queried or current set)
            // Re-query to be safe or use currentSelected (it is valid scope here)
            const validCount = slide.querySelectorAll('.option-btn.selected').length;

            if (validCount === 0) {
                confirmBtn.style.display = 'none';
            } else {
                confirmBtn.style.display = 'flex';
                confirmBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Auto Advance
            if (validCount === 3) {
                setTimeout(() => confirmBtn.click(), 300);
            }

            return; // EXIT FUNCTION (Do not run single-select logic)
        }

        // STANDARD SINGLE-SELECT LOGIC
        // 防止重复点击
        if (btn.classList.contains('selected')) return;

        // 添加波纹效果
        btn.classList.add('ripple');
        setTimeout(() => btn.classList.remove('ripple'), 400);

        // 标记选中
        slide.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        // 保存基础答案 (QID -> Index)
        answers[questionId] = optionIndex;

        // 捕获特殊数据 (Magic Fields)
        captureSpecialData(questionId, optionIndex);

        // 延迟后跳转
        setTimeout(() => {
            if (index < totalSteps - 1) {
                goToStep(index + 1);
            } else {
                finishQuiz();
            }
        }, 400); // 400ms delay
    }

    // 捕获特殊数据
    function captureSpecialData(qid, optIndex) {
        const question = QUESTIONS.find(q => q.id == qid);
        const option = question.options[optIndex];

        // Q1 Duration
        if (qid == 1) {
            answerData.duration = option.text;
        }
        // Q4 Peak Time
        if (qid == 4 && option.value) {
            answerData.peak_time = option.value;
        }
        // Q10 Golden Sentence
        if (qid == 10) {
            answerData.golden_sentence = option.text;
        }
    }

    // 跳转步骤
    function goToStep(index) {
        const slides = document.querySelectorAll('.quiz-slide');

        // 隐藏当前
        slides[currentStepIndex].classList.remove('active');

        // 更新索引
        currentStepIndex = index;

        // 显示新的
        slides[currentStepIndex].classList.add('active');

        updateProgress();
    }

    // 更新进度指示器
    function updateProgress() {
        // 重绘点点？或者只是更新状态
        // 10个点太多了，可以用进度条，或者只显示简化的 "3/10"
        // 既然设计是点点，先保留点点，但是10个可能溢出。
        // check CSS. If dots, render 10 dots.

        if (dotsContainer.children.length !== totalSteps) {
            dotsContainer.innerHTML = Array(totalSteps).fill('<span class="dot"></span>').join('');
        }

        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentStepIndex);
            dot.classList.toggle('completed', idx < currentStepIndex);
        });

        if (progressText) {
            progressText.textContent = `${currentStepIndex + 1}/${totalSteps}`;
        }
    }

    // 完成问卷
    function finishQuiz() {
        // 计算类型
        const userType = SleepDecode.classifyType(answers);

        // 整合完整结果数据
        const finalData = {
            answers: answers,
            extraData: answerData,
            userType: userType,
            completedAt: new Date().toISOString()
        };

        console.log('Quiz Finished:', finalData);

        // 保存
        SleepDecode.saveToStorage(finalData);

        // 过渡
        SleepDecode.showTransition('正在解码你的睡眠深层机制…'); // Updated text

        setTimeout(() => {
            window.location.href = 'result.html';
        }, 1500); // Slightly longer for the "Decoding" feeling
    }

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
