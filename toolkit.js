/* ========================================
   工具箱页交互逻辑
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

    // 音频文件映射
    const AUDIO_FILES = {
        A: 'assets/audio/type-a.mp3',
        B: 'assets/audio/type-b.mp3',
        C: 'assets/audio/type-c.mp3',
        D: 'assets/audio/type-d.mp3',
        E: 'assets/audio/type-e.mp3',
        emergency: 'assets/audio/emergency.mp3'
    };

    // 状态
    let isLooping = false;

    // DOM 元素
    const mainAudio = document.getElementById('mainAudio');
    const emergencyAudio = document.getElementById('emergencyAudio');
    const mainPlayBtn = document.getElementById('mainPlayBtn');
    const emergencyPlayBtn = document.getElementById('emergencyPlayBtn');
    const loopBtn = document.getElementById('loopBtn');

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

        // 更新用户类型显示
        updateUserTypeBadge(typeId, typeData);

        // 设置音频源
        setupAudioSources(typeId);

        // 绑定音频控制事件
        setupAudioControls();

        // 绑定打卡事件
        setupChecklist();

        // 绑定重新测试按钮
        document.getElementById('retestBtn').addEventListener('click', () => {
            window.SleepDecode.clearStorage();
            window.location.href = 'index.html';
        });

        // 隐藏过渡层
        setTimeout(() => {
            window.SleepDecode.hideTransition();
        }, 100);
    }

    // 更新用户类型徽章
    function updateUserTypeBadge(typeId, typeData) {
        const badge = document.getElementById('userTypeBadge');
        if (badge) {
            badge.querySelector('.badge-emoji').textContent = TYPE_EMOJIS[typeId] || '💭';
            badge.querySelector('.badge-text').textContent = `你是「${typeData.name}」`;
        }
    }

    // 设置音频源
    function setupAudioSources(typeId) {
        // 主音频（根据类型）
        if (mainAudio) {
            const audioSrc = AUDIO_FILES[typeId] || AUDIO_FILES.A;
            mainAudio.querySelector('source').src = audioSrc;
            mainAudio.load();
        }

        // 急救音频（通用）
        if (emergencyAudio) {
            emergencyAudio.querySelector('source').src = AUDIO_FILES.emergency;
            emergencyAudio.load();
        }
    }

    // 设置音频控制
    function setupAudioControls() {
        // 主音频播放控制
        if (mainPlayBtn && mainAudio) {
            mainPlayBtn.addEventListener('click', () => togglePlay(mainAudio, mainPlayBtn));

            mainAudio.addEventListener('timeupdate', () => {
                updateProgress(mainAudio, 'mainProgressFill', 'mainCurrentTime');
            });

            mainAudio.addEventListener('loadedmetadata', () => {
                document.getElementById('mainDuration').textContent = formatTime(mainAudio.duration);
            });

            mainAudio.addEventListener('ended', () => {
                resetPlayButton(mainPlayBtn);
            });

            // 进度条点击
            setupProgressBarClick('mainAudioPlayer', mainAudio);
        }

        // 急救音频播放控制
        if (emergencyPlayBtn && emergencyAudio) {
            emergencyPlayBtn.addEventListener('click', () => togglePlay(emergencyAudio, emergencyPlayBtn));

            emergencyAudio.addEventListener('timeupdate', () => {
                updateProgress(emergencyAudio, 'emergencyProgressFill', 'emergencyCurrentTime');
            });

            emergencyAudio.addEventListener('loadedmetadata', () => {
                document.getElementById('emergencyDuration').textContent = formatTime(emergencyAudio.duration);
            });

            emergencyAudio.addEventListener('ended', () => {
                if (isLooping) {
                    emergencyAudio.currentTime = 0;
                    emergencyAudio.play();
                } else {
                    resetPlayButton(emergencyPlayBtn);
                }
            });

            // 进度条点击
            setupProgressBarClick('emergencyAudioPlayer', emergencyAudio);
        }

        // 循环按钮
        if (loopBtn) {
            loopBtn.addEventListener('click', () => {
                isLooping = !isLooping;
                loopBtn.classList.toggle('active', isLooping);
            });
        }
    }

    // 切换播放状态
    function togglePlay(audio, btn) {
        if (audio.paused) {
            // 暂停其他音频
            pauseAllAudio();
            audio.play();
            btn.querySelector('.play-icon').classList.add('hidden');
            btn.querySelector('.pause-icon').classList.remove('hidden');
        } else {
            audio.pause();
            btn.querySelector('.play-icon').classList.remove('hidden');
            btn.querySelector('.pause-icon').classList.add('hidden');
        }
    }

    // 暂停所有音频
    function pauseAllAudio() {
        if (mainAudio && !mainAudio.paused) {
            mainAudio.pause();
            resetPlayButton(mainPlayBtn);
        }
        if (emergencyAudio && !emergencyAudio.paused) {
            emergencyAudio.pause();
            resetPlayButton(emergencyPlayBtn);
        }
    }

    // 重置播放按钮
    function resetPlayButton(btn) {
        if (btn) {
            btn.querySelector('.play-icon').classList.remove('hidden');
            btn.querySelector('.pause-icon').classList.add('hidden');
        }
    }

    // 更新进度
    function updateProgress(audio, fillId, timeId) {
        const fill = document.getElementById(fillId);
        const timeDisplay = document.getElementById(timeId);

        if (fill && audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            fill.style.width = percent + '%';
        }

        if (timeDisplay) {
            timeDisplay.textContent = formatTime(audio.currentTime);
        }
    }

    // 设置进度条点击
    function setupProgressBarClick(playerId, audio) {
        const player = document.getElementById(playerId);
        if (!player) return;

        const progressBar = player.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                audio.currentTime = percent * audio.duration;
            });
        }
    }

    // 格式化时间
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // 设置打卡功能
    function setupChecklist() {
        const dayBoxes = document.querySelectorAll('.day-box');
        const stored = window.SleepDecode.getFromStorage() || {};
        const checkedDays = stored.checkedDays || [];

        // 恢复已打卡状态
        checkedDays.forEach(day => {
            const box = document.querySelector(`.day-box[data-day="${day}"]`);
            if (box) {
                box.classList.add('checked');
                box.querySelector('.day-check').textContent = '✓';
            }
        });

        // 绑定打卡点击
        dayBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const day = box.dataset.day;
                const isChecked = box.classList.toggle('checked');

                box.querySelector('.day-check').textContent = isChecked ? '✓' : '□';

                // 更新存储
                const currentStored = window.SleepDecode.getFromStorage() || {};
                let days = currentStored.checkedDays || [];

                if (isChecked) {
                    if (!days.includes(day)) days.push(day);
                } else {
                    days = days.filter(d => d !== day);
                }

                window.SleepDecode.saveToStorage({ checkedDays: days });
            });
        });
    }

    // 页面加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
