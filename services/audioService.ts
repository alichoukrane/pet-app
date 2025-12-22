
import { SoundType, PremiumSoundType } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private schedulerTimer: any = null;
  private suspendTimer: any = null;
  private oscillators: AudioNode[] = [];

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
  }

  // Explicitly try to resume/unlock audio context (call this on user interaction)
  async unlock() {
    this.initCtx();
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  isLocked(): boolean {
    return !this.ctx || this.ctx.state === 'suspended';
  }

  private cleanUpOscillators() {
    this.oscillators.forEach(osc => {
      try {
        osc.disconnect();
        // @ts-ignore
        if (typeof osc.stop === 'function') osc.stop();
      } catch (e) {}
    });
    this.oscillators = [];
  }

  stop() {
    this.isPlaying = false;
    if (this.schedulerTimer) clearTimeout(this.schedulerTimer);
    
    // Cancel any pending suspend to avoid killing a new sound that started immediately after
    if (this.suspendTimer) clearTimeout(this.suspendTimer);

    if (this.masterGain) {
      try {
        const now = this.ctx?.currentTime || 0;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0, now + 0.5); // Smooth 0.5s fade out
      } catch (e) {}
    }

    // Schedule cleanup
    this.suspendTimer = setTimeout(() => {
        this.cleanUpOscillators();
        // Only suspend if not playing new sound
        if (!this.isPlaying && this.ctx?.state === 'running') {
            // this.ctx.suspend(); // Optional: keep running for better responsiveness
        }
    }, 600);
  }

  playAlarm(type: SoundType | PremiumSoundType = 'Reflection', targetVolume: number = 0.5) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    // Ensure running
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stop(); // Clean previous
    this.isPlaying = true;

    // Fade In Logic (Gradual over 8 seconds for gentler wake up)
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(targetVolume * 0.2, now + 1); // Jump to 20% in 1s
    this.masterGain.gain.linearRampToValueAtTime(targetVolume, now + 8); // Fade to target in 8s

    const playSequence = () => {
       if (!this.isPlaying) return;
       
       switch (type) {
         case 'Reflection': 
           this.playMarimbaRun([392.00, 493.88, 587.33, 739.99, 880.00], 0.2, 0);
           this.schedulerTimer = setTimeout(playSequence, 2500);
           break;

         case 'Radar': 
           this.playPulse(1200, 0, 0.15);
           this.playPulse(1200, 0.2, 0.15);
           this.playPulse(1200, 0.4, 0.15);
           this.schedulerTimer = setTimeout(playSequence, 1500);
           break;

         case 'Cosmic': 
           this.playPadChord([220, 329.63, 440, 554.37], 2.5);
           this.schedulerTimer = setTimeout(playSequence, 3000);
           break;

         case 'Circuit': 
           this.playSineArp([440, 880, 660, 1320, 990], 0.1);
           this.schedulerTimer = setTimeout(playSequence, 1200);
           break;

         case 'Silk': 
           this.playSoftChord([261.63, 329.63, 392.00, 523.25], 2.0);
           this.schedulerTimer = setTimeout(playSequence, 4000);
           break;
           
         case 'Waves': 
           this.playFMBell(440, 0);
           this.playFMBell(554.37, 0.3);
           this.playFMBell(659.25, 0.6);
           this.schedulerTimer = setTimeout(playSequence, 2500);
           break;

         case 'Aurora': 
           this.playSparkle([880, 1108, 1318, 1760], 0.15);
           this.schedulerTimer = setTimeout(playSequence, 2000);
           break;
           
         case 'Daybreak':
           this.playPadChord([196, 246.94, 293.66, 392], 4.0);
           this.schedulerTimer = setTimeout(playSequence, 4500);
           break;

         case 'Classic': 
         default:
           this.playBeep(880, 0);
           this.playBeep(880, 0.5);
           this.schedulerTimer = setTimeout(playSequence, 1000);
           break;
       }
    };

    playSequence();
  }

  // --- SYNTHESIS HELPERS (Same as before but ensured robustness) ---

  private playMarimbaRun(freqs: number[], duration: number, startTimeOffset: number) {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime + startTimeOffset;
      
      freqs.forEach((f, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          
          osc.type = 'sine';
          osc.frequency.value = f;
          
          const start = now + (i * 0.15);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(1, start + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

          osc.connect(gain);
          gain.connect(this.masterGain!);
          
          osc.start(start);
          osc.stop(start + duration + 0.1);
          
          this.oscillators.push(osc);
          this.oscillators.push(gain);
      });
  }

  private playFMBell(freq: number, startTimeOffset: number) {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime + startTimeOffset;

      const carrier = this.ctx.createOscillator();
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const carrierGain = this.ctx.createGain();

      carrier.frequency.value = freq;
      modulator.frequency.value = freq * 1.4; 
      
      const attack = 0.01;
      const decay = 1.5;

      carrierGain.gain.setValueAtTime(0, now);
      carrierGain.gain.linearRampToValueAtTime(0.8, now + attack);
      carrierGain.gain.exponentialRampToValueAtTime(0.01, now + decay);

      modGain.gain.setValueAtTime(0, now);
      modGain.gain.linearRampToValueAtTime(freq * 2, now + attack);
      modGain.gain.exponentialRampToValueAtTime(0.01, now + decay * 0.5);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);
      carrier.connect(carrierGain);
      carrierGain.connect(this.masterGain);

      carrier.start(now);
      modulator.start(now);
      carrier.stop(now + decay + 0.1);
      modulator.stop(now + decay + 0.1);

      this.oscillators.push(carrier, modulator, modGain, carrierGain);
  }

  private playPulse(freq: number, startTimeOffset: number, duration: number) {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime + startTimeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
      gain.gain.setValueAtTime(0.3, now + duration - 0.01);
      gain.gain.linearRampToValueAtTime(0, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.1);
      this.oscillators.push(osc, gain);
  }

  private playPadChord(freqs: number[], duration: number) {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      
      freqs.forEach(f => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle'; 
          osc.frequency.value = f;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.3, now + 1.0);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(now);
          osc.stop(now + duration + 0.1);
          this.oscillators.push(osc, gain);
      });
  }

  private playSineArp(freqs: number[], step: number) {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      
      freqs.forEach((f, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;

          const start = now + (i * step);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.4, start + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);

          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(start);
          osc.stop(start + 0.4);
          this.oscillators.push(osc, gain);
      });
  }

  private playSoftChord(freqs: number[], duration: number) {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      
      freqs.forEach(f => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
          gain.gain.setValueAtTime(0.5, now + duration - 0.5);
          gain.gain.linearRampToValueAtTime(0, now + duration);

          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(now);
          osc.stop(now + duration + 0.1);
          this.oscillators.push(osc, gain);
      });
  }

  private playSparkle(freqs: number[], step: number) {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      
      freqs.forEach((f, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.value = f;

          const start = now + (i * step);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
          gain.gain.linearRampToValueAtTime(0, start + 0.5);

          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(start);
          osc.stop(start + 0.6);
          this.oscillators.push(osc, gain);
      });
  }

  private playBeep(freq: number, startTimeOffset: number) {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime + startTimeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.5);
      this.oscillators.push(osc, gain);
  }
}

export const audioService = new AudioService();
