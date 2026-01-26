// Audio Alert System
class AudioAlert {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
    }

    // Initialize audio context
    initAudio() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            this.initialized = true;
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    // Play beep sound for error (low frequency, 3 beeps)
    playErrorBeep() {
        this.initAudio();
        if (!this.audioContext) return;

        const time = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 300; // Low frequency for error
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, time);

        // Create 3 beeps
        const beepDuration = 0.1;
        const pauseDuration = 0.1;

        oscillator.start(time);
        gainNode.gain.setValueAtTime(0.3, time);
        gainNode.gain.setValueAtTime(0, time + beepDuration);

        oscillator.stop(time + beepDuration);

        // Second beep
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(this.audioContext.destination);
        osc2.frequency.value = 300;
        osc2.type = 'sine';

        const beepStart2 = time + beepDuration + pauseDuration;
        osc2.start(beepStart2);
        gain2.gain.setValueAtTime(0.3, beepStart2);
        gain2.gain.setValueAtTime(0, beepStart2 + beepDuration);
        osc2.stop(beepStart2 + beepDuration);

        // Third beep
        const osc3 = this.audioContext.createOscillator();
        const gain3 = this.audioContext.createGain();
        osc3.connect(gain3);
        gain3.connect(this.audioContext.destination);
        osc3.frequency.value = 300;
        osc3.type = 'sine';

        const beepStart3 = beepStart2 + beepDuration + pauseDuration;
        osc3.start(beepStart3);
        gain3.gain.setValueAtTime(0.3, beepStart3);
        gain3.gain.setValueAtTime(0, beepStart3 + beepDuration);
        osc3.stop(beepStart3 + beepDuration);
    }

    // Play success beep (higher frequency, 2 beeps)
    playSuccessBeep() {
        this.initAudio();
        if (!this.audioContext) return;

        const time = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 800; // Higher frequency for success
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.2, time);

        // Create 2 beeps
        const beepDuration = 0.15;
        const pauseDuration = 0.1;

        oscillator.start(time);
        gainNode.gain.setValueAtTime(0.2, time);
        gainNode.gain.setValueAtTime(0, time + beepDuration);
        oscillator.stop(time + beepDuration);

        // Second beep
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(this.audioContext.destination);
        osc2.frequency.value = 800;
        osc2.type = 'sine';

        const beepStart2 = time + beepDuration + pauseDuration;
        osc2.start(beepStart2);
        gain2.gain.setValueAtTime(0.2, beepStart2);
        gain2.gain.setValueAtTime(0, beepStart2 + beepDuration);
        osc2.stop(beepStart2 + beepDuration);
    }

    // Play check-in beep (ascending tone)
    playCheckInBeep() {
        this.initAudio();
        if (!this.audioContext) return;

        const time = this.audioContext.currentTime;
        const duration = 0.2;

        // First tone
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(this.audioContext.destination);
        osc1.frequency.value = 600;
        osc1.type = 'sine';

        osc1.start(time);
        gain1.gain.setValueAtTime(0.2, time);
        gain1.gain.setValueAtTime(0, time + duration);
        osc1.stop(time + duration);

        // Second tone (higher)
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(this.audioContext.destination);
        osc2.frequency.value = 900;
        osc2.type = 'sine';

        const start2 = time + duration + 0.05;
        osc2.start(start2);
        gain2.gain.setValueAtTime(0.2, start2);
        gain2.gain.setValueAtTime(0, start2 + duration);
        osc2.stop(start2 + duration);
    }
}

// Create global audio alert instance
const audioAlert = new AudioAlert();
