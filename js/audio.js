export class AudioEngine {
  constructor(){ this.ctx=null; this.enabled=true; this.musicTimer=null; this.step=0; }
  ensure(){ if(!this.ctx){ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); } if(this.ctx.state==='suspended') this.ctx.resume(); }
  toggle(){ this.enabled=!this.enabled; if(this.enabled)this.ensure(); }
  tone(freq,duration=.12,type='sine',gain=.035,endFreq=freq){
    if(!this.enabled)return; this.ensure(); const o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,this.ctx.currentTime); o.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),this.ctx.currentTime+duration);
    g.gain.setValueAtTime(.0001,this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(gain,this.ctx.currentTime+.008); g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+duration);
    o.connect(g).connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+duration+.01);
  }
  sfx(name){
    const map={arrow:[520,180,.16,'sine'],gun:[170,75,.075,'square'],bazooka:[95,42,.24,'sine'],laser:[1250,280,.11,'sine'],flamethrower:[85,48,.13,'sawtooth'],pickup:[620,1040,.18,'sine'],hurt:[180,70,.18,'square'],health:[360,880,.28,'sine'],shield:[280,560,.55,'sine'],octopus_spawn:[320,520,.22,'sine'],death:[220,55,.35,'sine']};
    if(map[name]){ const [freq,endFreq,duration,type]=map[name]; this.tone(freq,duration,type,.035,endFreq); }
    if(name==='level_clear'){this.tone(440,.1);setTimeout(()=>this.tone(554,.1),100);setTimeout(()=>this.tone(660,.16),200);}
    if(name==='win'){[392,494,587,784,988].forEach((f,i)=>setTimeout(()=>this.tone(f,i===4?.22:.12,'sine'),i*130));}
    if(name==='lose'){[392,330,262].forEach((f,i)=>setTimeout(()=>this.tone(f,i===2?.22:.16),i*170));}
    if(name==='extra_life'){[523,659,784].forEach((f,i)=>setTimeout(()=>this.tone(f,.12),i*100));}
    if(name==='explosion'){ this.tone(90,.38,'sawtooth',.045,35); }
  }
  startMusic(){
    if(!this.enabled||this.musicTimer)return;
    const notes=[262,330,392,330,294,349,440,349,262,330,392,494,440,392,330,294,220,277,330,277,247,294,370,294,196,247,294,392,370,330,277,247];
    let i=0; this.musicTimer=setInterval(()=>{ if(this.enabled)this.tone(notes[i++%notes.length],.20,'sine',.012); },220);
  }
  /** Hard stop: kill music timer, mute, and close the AudioContext. */
  stop(){
    this.enabled=false;
    if(this.musicTimer){ clearInterval(this.musicTimer); this.musicTimer=null; }
    if(this.ctx){
      try{ this.ctx.close(); }catch(_){}
      this.ctx=null;
    }
  }
}
