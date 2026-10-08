import {WIDTH,HEIGHT} from './config.js';
import {Game} from './game.js';
import {Renderer} from './render.js';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const game=new Game(),renderer=new Renderer(ctx);let keys={left:false,right:false,fire:false};
function setKey(e,v){if(e.code==='ArrowLeft'||e.code==='KeyA')keys.left=v;if(e.code==='ArrowRight'||e.code==='KeyD')keys.right=v;if(e.code==='Space')keys.fire=v;}
addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(game.menuOpen){if(['ArrowUp','ArrowDown','KeyW','KeyS','Enter','Space','Escape'].includes(e.code)){game.handleMenu(e.code==='ArrowUp'||e.code==='KeyW'?'up':e.code==='ArrowDown'||e.code==='KeyS'?'down':e.code==='Enter'?'enter':e.code==='Space'?'space':'escape');}return;}if(e.code==='Escape'){game.openMenu();return;}if(e.code==='Enter'&&(game.state==='menu'||game.state==='over')){game.reset();game.state='play';game.audio.ensure();game.audio.startMusic();return;}if(e.code==='KeyP'){if(game.state==='play')game.state='paused';else if(game.state==='paused')game.state='play';return;}if(e.code==='KeyM'){game.audio.toggle();game.soundEnabled=game.audio.enabled;return;}setKey(e,true);if(e.code==='Enter'&&game.state==='menu'){game.state='play';game.audio.ensure();game.audio.startMusic();}});
addEventListener('keyup',e=>setKey(e,false));
canvas.addEventListener('click',()=>{if(game.state==='play'||game.state==='paused'){game.audio.ensure();game.audio.startMusic();}});
game.onFullscreen=async on=>{if(on){await document.documentElement.requestFullscreen?.();}else if(document.fullscreenElement)await document.exitFullscreen?.();};
// Exit: stop game + audio completely, try to close tab, else show goodbye screen.
let running=true, rafId=0;
game.onExit=()=>{
  running=false;
  if(rafId)cancelAnimationFrame(rafId);
  game.menuOpen=false;
  game.state='exit';
  game.audio.stop();
  keys={left:false,right:false,fire:false};
  if(document.fullscreenElement)document.exitFullscreen?.();
  window.close();
  // If the browser blocks close, replace the page so nothing keeps running.
  document.body.innerHTML='<div style="min-height:100vh;display:grid;place-items:center;background:#050510;color:#80dcff;font-family:Consolas,monospace;text-align:center;padding:24px"><div><h1 style="margin:0 0 12px">Thanks for playing</h1><p style="color:#777b94;margin:0">You can close this tab now.</p></div></div>';
};
function resize(){const maxW=innerWidth-16,maxH=innerHeight-48,scale=Math.min(maxW/WIDTH,maxH/HEIGHT);canvas.style.width=`${WIDTH*scale}px`;canvas.style.height=`${HEIGHT*scale}px`;}
addEventListener('resize',resize);resize();
let last=performance.now(),acc=0,step=1000/60;
function loop(now){
  if(!running)return;
  acc+=Math.min(100,now-last);last=now;
  while(acc>=step){game.update(keys);acc-=step;}
  renderer.scene(game);
  rafId=requestAnimationFrame(loop);
}
rafId=requestAnimationFrame(loop);
