// Timer App - Timerz.net Style
class TimerApp {
    constructor() {
        this.currentMode = 'fight';
        this.isRunning = false;
        this.isPaused = false;
        this.soundEnabled = true;
        this.interval = null;
        
        // Fight Timer Settings
        this.rounds = 12;
        this.roundTime = 180; // 3 minutes in seconds
        this.breakTime = 60; // 1 minute in seconds
        this.currentRound = 1;
        this.currentPhase = 'round'; // 'round' or 'break'
        this.timeRemaining = this.roundTime;
        
        // Stopwatch Settings
        this.stopwatchTime = 0; // em milissegundos
        this.stopwatchStartTime = 0;
        
        // Countdown Settings
        this.countdownHours = 0;
        this.countdownMinutes = 5;
        this.countdownSeconds = 0;
        this.countdownTimeRemaining = 300; // 5 minutes
        
        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        // Navigation pills
        this.pills = document.querySelectorAll('.pill');
        
        // Timer modes
        this.fightMode = document.getElementById('fight-mode');
        this.stopwatchMode = document.getElementById('stopwatch-mode');
        this.countdownMode = document.getElementById('countdown-mode');
        
        // Fight timer elements
        this.roundsValue = document.getElementById('roundsValue');
        this.mainTimer = document.getElementById('mainTimer');
        this.breakValue = document.getElementById('breakValue');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.progressBlocks = document.getElementById('progressBlocks');
        this.progressText = document.getElementById('progressText');
        this.progressContainer = document.querySelector('.progress-container');
        
        // Adjustment buttons
        this.roundsMinus = document.getElementById('roundsMinus');
        this.roundsPlus = document.getElementById('roundsPlus');
        this.timeMinus = document.getElementById('timeMinus');
        this.timePlus = document.getElementById('timePlus');
        this.breakMinus = document.getElementById('breakMinus');
        this.breakPlus = document.getElementById('breakPlus');
        
        // Stopwatch elements
        this.stopwatchDisplay = document.getElementById('stopwatchDisplay');
        this.stopwatchStart = document.getElementById('stopwatchStart');
        this.stopwatchReset = document.getElementById('stopwatchReset');
        
        // Countdown elements
        this.hoursDisplay = document.getElementById('hoursDisplay');
        this.minutesDisplay = document.getElementById('minutesDisplay');
        this.secondsDisplay = document.getElementById('secondsDisplay');
        this.countdownStart = document.getElementById('countdownStart');
        this.countdownReset = document.getElementById('countdownReset');
        this.timeButtons = document.querySelectorAll('.time-btn');
        
        // Sound toggle
        this.soundToggle = document.getElementById('soundToggle');
    }
    
    initializeEventListeners() {
        // Navigation pills
        this.pills.forEach(pill => {
            pill.addEventListener('click', () => {
                this.switchMode(pill.dataset.mode);
            });
        });
        
        // Fight timer controls
        this.roundsMinus.addEventListener('click', () => this.adjustRounds(-1));
        this.roundsPlus.addEventListener('click', () => this.adjustRounds(1));
        this.timeMinus.addEventListener('click', () => this.adjustRoundTime(-30));
        this.timePlus.addEventListener('click', () => this.adjustRoundTime(30));
        this.breakMinus.addEventListener('click', () => this.adjustBreak(-15));
        this.breakPlus.addEventListener('click', () => this.adjustBreak(15));
        this.startBtn.addEventListener('click', () => this.toggleFightTimer());
        this.resetBtn.addEventListener('click', () => this.resetFightTimer());
        
        // Stopwatch controls
        this.stopwatchStart.addEventListener('click', () => this.toggleStopwatch());
        this.stopwatchReset.addEventListener('click', () => this.resetStopwatch());
        
        // Countdown controls
        this.timeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const unit = btn.dataset.unit;
                const action = btn.dataset.action;
                this.adjustCountdown(unit, action);
            });
        });
        this.countdownStart.addEventListener('click', () => this.toggleCountdown());
        this.countdownReset.addEventListener('click', () => this.resetCountdown());
        
        // Sound toggle
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleSpaceKey();
            }
        });
    }
    
    switchMode(mode) {
        this.currentMode = mode;
        this.stopAllTimers();
        
        // Update pills
        this.pills.forEach(pill => {
            pill.classList.toggle('active', pill.dataset.mode === mode);
        });
        
        // Show/hide timer modes
        this.fightMode.classList.toggle('hidden', mode !== 'fight');
        this.stopwatchMode.classList.toggle('hidden', mode !== 'stopwatch');
        this.countdownMode.classList.toggle('hidden', mode !== 'countdown');
        
        this.updateDisplay();
    }
    
    // Fight Timer Methods
    adjustRounds(delta) {
        if (this.isRunning) return;
        this.rounds = Math.max(1, Math.min(99, this.rounds + delta));
        
        // Toggle single-round class
        if (this.fightMode) {
            if (this.rounds === 1) {
                this.fightMode.classList.add('single-round');
            } else {
                this.fightMode.classList.remove('single-round');
            }
        }
        
        this.updateDisplay();
    }
    
    adjustBreak(delta) {
        if (this.isRunning) return;
        this.breakTime = Math.max(15, Math.min(300, this.breakTime + delta));
        this.updateDisplay();
    }
    
    adjustRoundTime(delta) {
        if (this.isRunning) return;
        this.roundTime = Math.max(30, Math.min(600, this.roundTime + delta));
        this.timeRemaining = this.roundTime;
        this.updateDisplay();
    }
    
    toggleFightTimer() {
        if (!this.isRunning && !this.isPaused) {
            this.startFightTimer();
        } else if (this.isRunning) {
            this.pauseFightTimer();
        } else if (this.isPaused) {
            this.resumeFightTimer();
        }
    }
    
    startFightTimer() {
        this.isRunning = true;
        this.isPaused = false;
        this.currentRound = 1;
        this.currentPhase = 'round';
        this.timeRemaining = this.roundTime;
        
        if (this.startBtn) {
            this.startBtn.textContent = 'PAUSAR';
            this.startBtn.classList.add('pause');
        }
        
        if (this.resetBtn) {
            this.resetBtn.classList.add('show');
        }
        
        if (this.fightMode) {
            this.fightMode.classList.add('running');
        }
        
        if (this.progressContainer) {
            this.progressContainer.classList.add('show');
        }
        
        this.updateProgressBar();
        this.playSound('start');
        this.startInterval();
    }
    
    pauseFightTimer() {
        this.isRunning = false;
        this.isPaused = true;
        this.startBtn.textContent = 'CONTINUAR';
        this.startBtn.classList.remove('pause');
        this.clearInterval();
    }
    
    resumeFightTimer() {
        this.isRunning = true;
        this.isPaused = false;
        this.startBtn.textContent = 'PAUSAR';
        this.startBtn.classList.add('pause');
        this.startInterval();
    }
    
    resetFightTimer() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentRound = 1;
        this.currentPhase = 'round';
        this.timeRemaining = this.roundTime;
        
        if (this.startBtn) {
            this.startBtn.textContent = 'INICIAR';
            this.startBtn.classList.remove('pause');
        }
        
        if (this.resetBtn) {
            this.resetBtn.classList.remove('show');
        }
        
        if (this.fightMode) {
            this.fightMode.classList.remove('running', 'break');
        }
        
        if (this.progressContainer) {
            this.progressContainer.classList.remove('show');
        }
        
        this.clearInterval();
        this.updateDisplay();
    }
    
    // Stopwatch Methods
    toggleStopwatch() {
        if (!this.isRunning) {
            this.startStopwatch();
        } else {
            this.pauseStopwatch();
        }
    }
    
    startStopwatch() {
        this.isRunning = true;
        this.stopwatchStartTime = Date.now() - this.stopwatchTime;
        this.stopwatchStart.textContent = 'PAUSAR';
        this.stopwatchStart.classList.add('pause');
        this.stopwatchReset.classList.add('show');
        this.startStopwatchInterval();
    }
    
    pauseStopwatch() {
        this.isRunning = false;
        this.stopwatchStart.textContent = 'INICIAR';
        this.stopwatchStart.classList.remove('pause');
        this.clearStopwatchInterval();
    }
    
    resetStopwatch() {
        this.isRunning = false;
        this.stopwatchTime = 0;
        this.stopwatchStartTime = 0;
        this.stopwatchStart.textContent = 'INICIAR';
        this.stopwatchStart.classList.remove('pause');
        this.stopwatchReset.classList.remove('show');
        this.clearStopwatchInterval();
        this.updateDisplay();
    }
    
    // Stopwatch interval methods
    startStopwatchInterval() {
        this.stopwatchInterval = setInterval(() => {
            this.stopwatchTime = Date.now() - this.stopwatchStartTime;
            this.updateStopwatchDisplay();
        }, 10); // Atualiza a cada 10ms para mostrar milissegundos
    }
    
    clearStopwatchInterval() {
        if (this.stopwatchInterval) {
            clearInterval(this.stopwatchInterval);
            this.stopwatchInterval = null;
        }
    }

    // Countdown Methods
    adjustCountdown(unit, action) {
        if (this.isRunning) return;
        
        const delta = action === 'plus' ? 1 : -1;
        
        switch (unit) {
            case 'hours':
                this.countdownHours = Math.max(0, Math.min(23, this.countdownHours + delta));
                break;
            case 'minutes':
                this.countdownMinutes = Math.max(0, Math.min(59, this.countdownMinutes + delta));
                break;
            case 'seconds':
                this.countdownSeconds = Math.max(0, Math.min(59, this.countdownSeconds + delta));
                break;
        }
        
        this.countdownTimeRemaining = this.countdownHours * 3600 + this.countdownMinutes * 60 + this.countdownSeconds;
        this.updateDisplay();
    }
    
    toggleCountdown() {
        if (!this.isRunning && !this.isPaused) {
            this.startCountdown();
        } else if (this.isRunning) {
            this.pauseCountdown();
        } else if (this.isPaused) {
            this.resumeCountdown();
        }
    }
    
    startCountdown() {
        if (this.countdownTimeRemaining === 0) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.countdownStart.textContent = 'PAUSAR';
        this.countdownStart.classList.add('pause');
        this.countdownReset.classList.add('show');
        this.playSound('start');
        this.startInterval();
    }
    
    pauseCountdown() {
        this.isRunning = false;
        this.isPaused = true;
        this.countdownStart.textContent = 'CONTINUAR';
        this.countdownStart.classList.remove('pause');
        this.clearInterval();
    }
    
    resumeCountdown() {
        this.isRunning = true;
        this.isPaused = false;
        this.countdownStart.textContent = 'PAUSAR';
        this.countdownStart.classList.add('pause');
        this.startInterval();
    }
    
    resetCountdown() {
        this.isRunning = false;
        this.isPaused = false;
        this.countdownTimeRemaining = this.countdownHours * 3600 + this.countdownMinutes * 60 + this.countdownSeconds;
        this.countdownStart.textContent = 'INICIAR';
        this.countdownStart.classList.remove('pause');
        this.countdownReset.classList.remove('show');
        this.clearInterval();
        this.updateDisplay();
    }
    
    // Timer Logic
    startInterval() {
        this.interval = setInterval(() => {
            switch (this.currentMode) {
                case 'fight':
                    this.updateFightTimer();
                    break;
                case 'stopwatch':
                    // Stopwatch uses its own interval with milliseconds
                    break;
                case 'countdown':
                    this.updateCountdownTimer();
                    break;
            }
            this.updateDisplay();
        }, 1000);
    }
    
    updateFightTimer() {
        this.timeRemaining--;
        
        if (this.timeRemaining <= 0) {
            if (this.currentPhase === 'round') {
                if (this.currentRound < this.rounds) {
                    // Switch to break
                    this.currentPhase = 'break';
                    this.timeRemaining = this.breakTime;
                    this.fightMode.classList.add('break');
                    this.playSound('break');
                } else {
                    // Finish workout
                    this.finishFightTimer();
                    return;
                }
            } else {
                // Switch to next round
                this.currentRound++;
                this.currentPhase = 'round';
                this.timeRemaining = this.roundTime;
                this.fightMode.classList.remove('break');
                this.playSound('round');
            }
        }
        
        // Warning sounds
        if (this.timeRemaining <= 3 && this.timeRemaining > 0) {
            this.playSound('warning');
        }
        
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        if (this.currentMode !== 'fight') return;
        
        this.generateProgressBlocks();
        this.updateProgressBlocks();
        
        // Update progress text
        if (this.currentPhase === 'round') {
            this.progressText.textContent = `Round ${this.currentRound} de ${this.rounds}`;
        } else {
            this.progressText.textContent = `Descanso - Round ${this.currentRound} de ${this.rounds}`;
        }
    }
    
    generateProgressBlocks() {
        if (!this.progressBlocks) return;
        
        // Clear existing blocks
        this.progressBlocks.innerHTML = '';
        
        // Create blocks for each round + break (except after last round)
        for (let i = 1; i <= this.rounds; i++) {
            // Round block
            const roundBlock = document.createElement('div');
            roundBlock.className = 'progress-block round';
            roundBlock.dataset.round = i;
            roundBlock.dataset.type = 'round';
            this.progressBlocks.appendChild(roundBlock);
            
            // Break block (except after last round)
            if (i < this.rounds) {
                const breakBlock = document.createElement('div');
                breakBlock.className = 'progress-block break';
                breakBlock.dataset.round = i;
                breakBlock.dataset.type = 'break';
                this.progressBlocks.appendChild(breakBlock);
            }
        }
    }
    
    updateProgressBlocks() {
        if (!this.progressBlocks) return;
        
        const blocks = this.progressBlocks.querySelectorAll('.progress-block');
        
        blocks.forEach(block => {
            const blockRound = parseInt(block.dataset.round);
            const blockType = block.dataset.type;
            
            // Reset classes
            block.classList.remove('completed', 'current');
            block.style.removeProperty('--progress');
            
            if (blockRound < this.currentRound) {
                // Completed rounds and breaks
                block.classList.add('completed');
            } else if (blockRound === this.currentRound) {
                if (blockType === 'round' && this.currentPhase === 'round') {
                    // Current round
                    block.classList.add('current');
                    const progress = ((this.roundTime - this.timeRemaining) / this.roundTime) * 100;
                    block.style.setProperty('--progress', `${progress}%`);
                } else if (blockType === 'break' && this.currentPhase === 'break') {
                    // Current break
                    block.classList.add('current');
                    const progress = ((this.breakTime - this.timeRemaining) / this.breakTime) * 100;
                    block.style.setProperty('--progress', `${progress}%`);
                } else if (blockType === 'round' && this.currentPhase === 'break') {
                    // Round was completed, now in break
                    block.classList.add('completed');
                }
            }
        });
    }
    
    updateCountdownTimer() {
        this.countdownTimeRemaining--;
        
        if (this.countdownTimeRemaining <= 0) {
            this.finishCountdown();
            return;
        }
        
        // Warning sounds
        if (this.countdownTimeRemaining <= 3) {
            this.playSound('warning');
        }
    }
    
    finishFightTimer() {
        this.resetFightTimer();
        this.playSound('finish');
    }
    
    finishCountdown() {
        this.resetCountdown();
        this.playSound('finish');
    }
    
    // Display Updates
    updateDisplay() {
        switch (this.currentMode) {
            case 'fight':
                this.updateFightDisplay();
                break;
            case 'stopwatch':
                this.updateStopwatchDisplay();
                break;
            case 'countdown':
                this.updateCountdownDisplay();
                break;
        }
    }
    
    updateFightDisplay() {
        this.roundsValue.textContent = this.rounds.toString().padStart(2, '0');
        this.mainTimer.textContent = this.formatTime(this.timeRemaining);
        this.breakValue.textContent = this.formatTime(this.breakTime);
        
        // Toggle single-round class based on current rounds
        if (this.fightMode) {
            if (this.rounds === 1) {
                this.fightMode.classList.add('single-round');
            } else {
                this.fightMode.classList.remove('single-round');
            }
        }
        
        // Generate progress blocks only if they don't exist or rounds changed
        if (!this.progressBlocks.hasChildNodes() || this.progressBlocks.children.length !== (this.rounds * 2 - 1)) {
            this.generateProgressBlocks();
        }
        
        // Update progress text when not running
        if (!this.isRunning) {
            this.progressText.textContent = `Round 1 de ${this.rounds}`;
        }
    }
    
    updateStopwatchDisplay() {
        this.stopwatchDisplay.innerHTML = this.formatStopwatchTime(this.stopwatchTime);
    }
    
    updateCountdownDisplay() {
        const hours = Math.floor(this.countdownTimeRemaining / 3600);
        const minutes = Math.floor((this.countdownTimeRemaining % 3600) / 60);
        const seconds = this.countdownTimeRemaining % 60;
        
        this.hoursDisplay.textContent = hours.toString().padStart(2, '0');
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Helper Methods
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    formatStopwatchTime(totalMilliseconds) {
        const totalSeconds = Math.floor(totalMilliseconds / 1000);
        const milliseconds = totalMilliseconds % 1000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}<span class="milliseconds">.${milliseconds.toString().padStart(3, '0')}</span>`;
    }
    
    stopAllTimers() {
        this.isRunning = false;
        this.isPaused = false;
        this.clearInterval();
        
        // Reset fight timer
        this.resetFightTimer();
        
        // Reset stopwatch
        this.resetStopwatch();
        
        // Reset countdown
        this.resetCountdown();
    }
    
    clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearStopwatchInterval();
    }
    
    handleSpaceKey() {
        switch (this.currentMode) {
            case 'fight':
                this.toggleFightTimer();
                break;
            case 'stopwatch':
                this.toggleStopwatch();
                break;
            case 'countdown':
                this.toggleCountdown();
                break;
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggle.classList.toggle('muted', !this.soundEnabled);
        
        const icon = this.soundToggle.querySelector('i');
        icon.className = this.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
    
    playSound(type) {
        if (!this.soundEnabled) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        let frequency, duration;
        
        switch (type) {
            case 'start':
                frequency = 800;
                duration = 0.5;
                break;
            case 'round':
                frequency = 1000;
                duration = 1;
                break;
            case 'break':
                frequency = 600;
                duration = 0.8;
                break;
            case 'warning':
                frequency = 1200;
                duration = 0.2;
                break;
            case 'finish':
                frequency = 800;
                duration = 2;
                break;
            default:
                return;
        }
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
}

// Initialize the timer app
document.addEventListener('DOMContentLoaded', () => {
    new TimerApp();
});

// Prevent page from sleeping during timer
let wakeLock = null;

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
        console.log('Wake Lock não suportado:', err);
    }
}

document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
});
