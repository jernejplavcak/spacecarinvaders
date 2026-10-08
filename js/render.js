import {WIDTH,HEIGHT,COLORS,WEAPONS,FINAL_LEVEL,BOSS_LEVELS} from './config.js';
const C=COLORS;

export class Renderer{
  constructor(ctx){
    this.ctx=ctx;
    this.font='bold 20px Consolas, monospace';
    this.mid='bold 28px Consolas, monospace';
    this.big='bold 52px Consolas, monospace';
    this.small='16px Consolas, monospace';
  }

  text(t,x,y,color=C.white,font=this.font,align='left',shadow=true){
    const c=this.ctx;c.font=font;c.textAlign=align;c.textBaseline='middle';
    if(shadow){c.fillStyle='#000';c.fillText(t,x+2,y+2);}
    c.fillStyle=color;c.fillText(t,x,y);
  }

  roundRect(x,y,w,h,r,fill=null,stroke=null,lw=1){
    const c=this.ctx;
    c.beginPath();
    if(c.roundRect)c.roundRect(x,y,w,h,r);
    else{
      r=Math.min(r,w/2,h/2);c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);
      c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);
      c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);
    }
    if(fill){c.fillStyle=fill;c.fill();}
    if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}
  }

  car(x,y,s=1){
    const c=this.ctx,p=(dx,dy)=>[x+dx*s,y+dy*s];
    c.fillStyle=C.orange;c.beginPath();c.moveTo(...p(-6,12));c.lineTo(...p(6,12));c.lineTo(...p(0,24));c.fill();
    c.fillStyle=C.cyan;c.beginPath();c.moveTo(...p(0,-20));c.lineTo(...p(12,-4));c.lineTo(...p(23,6));c.lineTo(...p(23,13));c.lineTo(...p(-23,13));c.lineTo(...p(-23,6));c.lineTo(...p(-12,-4));c.closePath();c.fill();
    c.fillStyle='#2878aa';c.beginPath();c.moveTo(...p(0,-20));c.lineTo(...p(12,-4));c.lineTo(...p(-12,-4));c.fill();
    c.fillStyle='#142850';c.beginPath();c.ellipse(x,y-1,9*s,6*s,0,0,Math.PI*2);c.fill();
    c.fillStyle='#82c8ff';c.beginPath();c.ellipse(x-2*s,y-3*s,4*s,2.5*s,0,0,Math.PI*2);c.fill();
    for(const wx of [-14,14]){c.fillStyle=C.grey;c.beginPath();c.arc(x+wx*s,y+13*s,Math.max(1,6*s),0,Math.PI*2);c.fill();c.fillStyle=C.black;c.beginPath();c.arc(x+wx*s,y+13*s,Math.max(1,3*s),0,Math.PI*2);c.fill();}
  }

  enemy(e){
    if(e.type==='shooter')this.shooter(e);
    else if(e.type==='drifter')this.drifter(e);
    else if(e.type==='roller')this.roller(e);
    else if(e.type==='boss')this.boss(e,C.purple);
    else if(e.type==='octopus')this.octopus(e);
    else if(e.type==='baby')this.baby(e);
    else if(e.type==='snake')this.snake(e);
  }

  shooter(e){
    const c=this.ctx,x=Math.round(e.x),y=Math.round(e.y);
    this.ellipse(x,y+6,22,10,e.tint(C.green));
    this.ellipse(x,y-5,13,11,e.tint('#3cae5a'));
    for(const ex of [-6,6]){c.fillStyle=C.white;c.beginPath();c.arc(x+ex,y-7,4,0,Math.PI*2);c.fill();c.fillStyle=C.black;c.beginPath();c.arc(x+ex,y-7,2,0,Math.PI*2);c.fill();}
    for(const lx of [-14,0,14]){c.fillStyle=C.yellow;c.beginPath();c.arc(x+lx,y+8,2,0,Math.PI*2);c.fill();}
    c.fillStyle=C.red;c.beginPath();c.arc(x,y+16,3,0,Math.PI*2);c.fill();
  }

  drifter(e){
    const c=this.ctx,x=e.x,y=e.y,pts=[];
    for(let i=0;i<10;i++){const r=i%2===0?19:10,a=e.spin+i*Math.PI/5;pts.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}
    c.fillStyle=e.tint(C.orange);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fill();
    c.fillStyle=e.tint(C.red);c.beginPath();c.arc(x,y,8,0,Math.PI*2);c.fill();
    c.fillStyle=C.yellow;c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fill();
    c.fillStyle=C.black;c.beginPath();c.arc(x,y,2,0,Math.PI*2);c.fill();
  }

  roller(e){
    const c=this.ctx,x=Math.round(e.x),y=Math.round(e.y),r=20;
    c.fillStyle=e.tint('#4682e6');c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();
    c.strokeStyle=e.tint('#1e4696');c.lineWidth=3;c.stroke();
    for(let i=0;i<6;i++){
      const a=e.angle+i*Math.PI/3;c.strokeStyle=e.tint('#c8dcff');c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*(r-2),y+Math.sin(a)*(r-2));c.stroke();
      const tip=[x+Math.cos(a)*(r+8),y+Math.sin(a)*(r+8)],b1=[x+Math.cos(a-.22)*r,y+Math.sin(a-.22)*r],b2=[x+Math.cos(a+.22)*r,y+Math.sin(a+.22)*r];
      c.fillStyle=e.tint('#ffc85a');c.beginPath();c.moveTo(...tip);c.lineTo(...b1);c.lineTo(...b2);c.closePath();c.fill();
    }
    c.fillStyle=C.yellow;c.beginPath();c.arc(x,y,6,0,Math.PI*2);c.fill();c.fillStyle=C.black;c.beginPath();c.arc(x,y,3,0,Math.PI*2);c.fill();
  }

  boss(e,col){
    const c=this.ctx,x=Math.round(e.x),y=Math.round(e.y),body=e.tint(e.enraged?'#d246c8':col);
    c.fillStyle=body;c.beginPath();c.ellipse(x,y+10,75,28,0,0,Math.PI*2);c.fill();
    c.fillStyle=e.tint('#6e32be');c.beginPath();c.ellipse(x,y-10,40,30,0,0,Math.PI*2);c.fill();
    for(const ex of [-14,14]){c.fillStyle=C.white;c.beginPath();c.arc(x+ex,y-18,8,0,Math.PI*2);c.fill();c.fillStyle=e.enraged?C.red:C.black;c.beginPath();c.arc(x+ex,y-18,4,0,Math.PI*2);c.fill();}
    for(const cx of [-55,-28,28,55]){this.roundRect(x+cx-5,y+25,10,18,2,C.grey);c.fillStyle=C.yellow;c.fillRect(x+cx-3,y+40,6,4);}
    for(let lx=-60;lx<=60;lx+=20){c.fillStyle=C.yellow;c.beginPath();c.arc(x+lx,y+10,3,0,Math.PI*2);c.fill();}
  }

  octopus(e){
    const c=this.ctx,x=Math.round(e.x),y=Math.round(e.y),body=e.tint(C.pink),dark=e.tint('#96236e');
    c.fillStyle=dark;c.beginPath();c.arc(x,y,48,0,Math.PI*2);c.fill();
    c.fillStyle=body;c.beginPath();c.arc(x,y-5,38,0,Math.PI*2);c.fill();
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4+e.t*.25,ex=x+Math.cos(a)*58,ey=y+8+Math.sin(a)*38;
      c.strokeStyle=body;c.lineWidth=7;c.beginPath();c.moveTo(x+Math.cos(a)*28,y+Math.sin(a)*24);c.lineTo(ex,ey);c.stroke();
      c.fillStyle=dark;c.beginPath();c.arc(ex,ey,7,0,Math.PI*2);c.fill();
    }
    for(const ex of [-15,15]){c.fillStyle=C.white;c.beginPath();c.arc(x+ex,y-12,11,0,Math.PI*2);c.fill();c.fillStyle=C.black;c.beginPath();c.arc(x+ex,y-12,5,0,Math.PI*2);c.fill();}
    c.fillStyle=C.yellow;c.beginPath();c.arc(x,y+13,7,0,Math.PI*2);c.fill();
  }

  baby(e){
    const c=this.ctx,x=Math.round(e.x),y=Math.round(e.y),body=e.tint('#eb64be'),dark=e.tint('#912d7d');
    c.fillStyle=dark;c.beginPath();c.arc(x,y,14,0,Math.PI*2);c.fill();
    c.fillStyle=body;c.beginPath();c.arc(x,y-4,12,0,Math.PI*2);c.fill();
    for(let i=0;i<4;i++){
      const off=[-11,-4,4,11][i],wave=Math.sin(e.wander*2+i)*3;
      c.strokeStyle=body;c.lineWidth=4;c.beginPath();c.moveTo(x+off,y+7);c.lineTo(x+off+Math.trunc(wave),y+18);c.stroke();
      c.fillStyle=dark;c.beginPath();c.arc(x+off+Math.trunc(wave),y+18,3,0,Math.PI*2);c.fill();
    }
    for(const ex of [-5,5]){c.fillStyle=C.white;c.beginPath();c.arc(x+ex,y-6,4,0,Math.PI*2);c.fill();c.fillStyle=C.black;c.beginPath();c.arc(x+ex,y-6,2,0,Math.PI*2);c.fill();}
  }

  snake(e){
    const c=this.ctx,segs=e.segments||[],enraged=e.enraged,base=enraged?'#d24646':'#3cbe5a',alt=enraged?'#a02828':'#288c46';
    for(let i=segs.length-1;i>=0;i--){const [sx,sy]=segs[i],r=Math.max(2,Math.trunc(21-i*.9));c.fillStyle=e.tint(i%2===0?base:alt);c.beginPath();c.arc(sx,sy,r,0,Math.PI*2);c.fill();c.strokeStyle=e.tint('#1e5a32');c.lineWidth=2;c.stroke();c.fillStyle=C.yellow;c.beginPath();c.arc(sx,sy,Math.max(2,Math.floor(r/4)),0,Math.PI*2);c.fill();}
    const x=Math.round(e.x),y=Math.round(e.y);
    c.strokeStyle=C.red;c.lineWidth=3;c.beginPath();c.moveTo(x,y+20);c.lineTo(x,y+34);c.stroke();c.lineWidth=2;c.beginPath();c.moveTo(x,y+34);c.lineTo(x-6,y+40);c.moveTo(x,y+34);c.lineTo(x+6,y+40);c.stroke();
    c.fillStyle=e.tint(base);c.beginPath();c.ellipse(x,y,27,23,0,0,Math.PI*2);c.fill();c.strokeStyle=e.tint(alt);c.lineWidth=3;c.stroke();
    for(const ex of [-11,11]){c.fillStyle=C.yellow;c.beginPath();c.arc(x+ex,y+2,7,0,Math.PI*2);c.fill();c.fillStyle=C.black;c.fillRect(x+ex-2,y-5,4,14);}
  }

  ellipse(x,y,rx,ry,col){const c=this.ctx;c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}

  projectile(a){
    const c=this.ctx,x=a.x,y=a.y;
    if(a.kind==='arrow'){
      c.strokeStyle=C.white;c.lineWidth=2;c.beginPath();c.moveTo(x,y-6);c.lineTo(x,y+12);c.stroke();
      c.fillStyle=C.yellow;c.beginPath();c.moveTo(x,y-14);c.lineTo(x-5,y-4);c.lineTo(x+5,y-4);c.closePath();c.fill();
      c.strokeStyle=C.cyan;c.beginPath();c.moveTo(x,y+12);c.lineTo(x-4,y+16);c.moveTo(x,y+12);c.lineTo(x+4,y+16);c.stroke();
    }else if(a.kind==='gun'){
      this.roundRect(x-3,y-9,6,18,3,'#ffc83c');this.roundRect(x-1,y-8,2,10,1,C.white);c.strokeStyle=C.orange;c.lineWidth=2;c.beginPath();c.moveTo(x,y+9);c.lineTo(x,y+15);c.stroke();
    }else if(a.kind==='bazooka'){
      c.fillStyle=C.orange;c.beginPath();c.moveTo(x-5,y+14);c.lineTo(x+5,y+14);c.lineTo(x+Math.round(Math.random()*8-4),y+26+Math.round(Math.random()*8));c.closePath();c.fill();
      c.fillStyle='#c8c8d2';c.fillRect(x-6,y-8,12,24);c.fillStyle=C.red;c.beginPath();c.moveTo(x,y-17);c.lineTo(x-6,y-7);c.lineTo(x+6,y-7);c.closePath();c.fill();
      for(const side of [-1,1]){c.beginPath();c.moveTo(x+side*6,y+10);c.lineTo(x+side*11,y+18);c.lineTo(x+side*6,y+16);c.closePath();c.fill();}
    }else{
      c.fillStyle=C.orange;c.beginPath();c.moveTo(x-9,y+15);c.lineTo(x+9,y+15);c.lineTo(x+Math.round(Math.random()*12-6),y-18);c.closePath();c.fill();
      c.fillStyle=C.yellow;c.beginPath();c.moveTo(x-5,y+10);c.lineTo(x+5,y+10);c.lineTo(x+Math.round(Math.random()*6-3),y-12);c.closePath();c.fill();
      c.fillStyle=C.red;c.beginPath();c.arc(x,y+16,4,0,Math.PI*2);c.fill();
    }
  }

  pickup(p){
    const c=this.ctx,x=Math.round(p.sx),y=Math.round(p.y);c.lineWidth=2;
    const label=(s,col)=>this.text(s,x,y-28,col,this.small,'center');
    const giftBg=(col,name,labCol=col)=>{c.strokeStyle=col;c.beginPath();c.arc(x,y,18,0,Math.PI*2);c.stroke();c.fillStyle=C.black;c.beginPath();c.arc(x,y,16,0,Math.PI*2);c.fill();label(name,labCol);};
    if(p.isWeapon){
      const col=WEAPONS[p.kind].color,pulse=4+Math.trunc(3*Math.sin(p.t*2));
      this.roundRect(x-19-pulse/2,y-19-pulse/2,38+pulse,38+pulse,9,null,col,1);
      this.roundRect(x-17,y-17,34,34,7,'#19192d',col,2);
      if(p.kind==='gun'){
        c.fillStyle=col;c.fillRect(x-11,y-6,20,7);c.fillRect(x-7,y,6,10);c.fillStyle=C.white;c.fillRect(x+8,y-5,5,4);
      }else if(p.kind==='laser'){
        c.fillStyle=col;c.fillRect(x-3,y-13,6,26);c.fillStyle=C.white;c.fillRect(x-1,y-13,2,26);c.fillStyle=col;c.beginPath();c.arc(x,y+12,4,0,Math.PI*2);c.fill();
      }else if(p.kind==='bazooka'){
        c.fillStyle='#c8c8d2';c.fillRect(x-13,y-4,22,8);c.fillStyle=col;c.beginPath();c.moveTo(x+9,y-6);c.lineTo(x+9,y+6);c.lineTo(x+16,y);c.closePath();c.fill();
        c.fillStyle=C.red;for(const dy of [-4,4]){c.beginPath();c.moveTo(x-13,y+dy);c.lineTo(x-17,y+dy+(dy<0?-5:5));c.lineTo(x-9,y+dy);c.closePath();c.fill();}
      }else{
        c.fillStyle='#5a5f69';c.beginPath();c.arc(x-6,y+7,9,0,Math.PI*2);c.fill();c.fillStyle='#9ba0aa';c.beginPath();c.arc(x-6,y+7,6,0,Math.PI*2);c.fill();
        this.roundRect(x-2,y+2,5,12,2,'#373c46');this.roundRect(x-2,y+1,22,6,2,'#6e737d');this.roundRect(x+2,y+7,7,10,2,'#373c46');
        c.fillStyle='#5f646e';c.beginPath();c.moveTo(x+17,y+1);c.lineTo(x+17,y+7);c.lineTo(x+24,y+4);c.closePath();c.fill();
        c.fillStyle=C.orange;c.beginPath();c.moveTo(x+24,y+4);c.lineTo(x+15,y-4);c.lineTo(x+17,y+4);c.lineTo(x+14,y+11);c.closePath();c.fill();c.fillStyle=C.yellow;c.beginPath();c.moveTo(x+23,y+4);c.lineTo(x+17,y);c.lineTo(x+18,y+5);c.lineTo(x+17,y+9);c.closePath();c.fill();
      }
      label(WEAPONS[p.kind].name,col);return;
    }
    if(p.kind==='water'){giftBg(C.cyan,'WATER');this.roundRect(x-9,y-14,18,28,5,'#50b4ff');this.roundRect(x-7,y-3,14,6,1,C.white);}
    else if(p.kind==='cola'){giftBg(C.red,'COLA');this.roundRect(x-9,y-14,18,28,4,C.red);this.roundRect(x-9,y-4,18,7,1,C.white);}
    else if(p.kind==='sausage'){giftBg(C.orange,'SAUSAGE');c.strokeStyle='#be4b2d';c.lineWidth=10;c.beginPath();c.moveTo(x-15,y+7);c.lineTo(x+15,y-7);c.stroke();c.fillStyle='#f08250';for(const [dx,dy] of [[-14,7],[14,-7]]){c.beginPath();c.arc(x+dx,y+dy,5,0,Math.PI*2);c.fill();}}
    else if(p.kind==='pizza'){giftBg(C.yellow,'PIZZA');c.fillStyle='#f5cd5a';c.beginPath();c.moveTo(x-15,y-12);c.lineTo(x+15,y-12);c.lineTo(x,y+16);c.closePath();c.fill();this.roundRect(x-16,y-15,32,6,3,'#c88c3c');for(const [dx,dy] of [[-6,-3],[6,-3],[0,7]]){c.fillStyle=C.red;c.beginPath();c.arc(x+dx,y+dy,3,0,Math.PI*2);c.fill();}}
    else if(p.kind==='bread'){giftBg('#d7aa55','BREAD');c.fillStyle='#d7aa55';c.beginPath();c.ellipse(x,y,17,11,0,0,Math.PI*2);c.fill();c.strokeStyle='#f5d791';c.lineWidth=2;for(const [dx1,dy1,dx2,dy2] of [[-7,-5,-3,3],[3,-5,7,3]]){c.beginPath();c.moveTo(x+dx1,y+dy1);c.lineTo(x+dx2,y+dy2);c.stroke();}}
    else if(p.kind==='oil'){giftBg(C.yellow,'OIL');this.roundRect(x-12,y-15,24,30,4,C.black);c.fillStyle='#232328';c.fillRect(x-9,y-11,18,22);c.fillStyle=C.yellow;c.fillRect(x-9,y-2,18,7);}
    else if(p.kind==='cake'){giftBg(C.pink,'CAKE');this.roundRect(x-15,y-3,30,15,3,'#f0aac8');this.roundRect(x-15,y-9,30,8,3,'#fff5fa');c.strokeStyle='#c86e96';c.lineWidth=2;c.beginPath();c.moveTo(x-15,y+4);c.lineTo(x+15,y+4);c.stroke();c.fillStyle=C.red;c.beginPath();c.arc(x,y-12,4,0,Math.PI*2);c.fill();}
    else if(p.kind==='medal'){
      giftBg(C.gold,'MEDAL');const rd='#be232d',dk='#7d1923',bl='#2d4b96';
      c.fillStyle=dk;c.beginPath();c.moveTo(x-11,y-19);c.lineTo(x-2,y-19);c.lineTo(x-2,y+1);c.lineTo(x-12,y-7);c.closePath();c.fill();c.fillStyle=rd;c.beginPath();c.moveTo(x-8,y-19);c.lineTo(x-3,y-19);c.lineTo(x-3,y-2);c.lineTo(x-9,y-7);c.closePath();c.fill();
      c.fillStyle=dk;c.beginPath();c.moveTo(x+11,y-19);c.lineTo(x+2,y-19);c.lineTo(x+2,y+1);c.lineTo(x+12,y-7);c.closePath();c.fill();c.fillStyle=bl;c.beginPath();c.moveTo(x+8,y-19);c.lineTo(x+3,y-19);c.lineTo(x+3,y-2);c.lineTo(x+9,y-7);c.closePath();c.fill();
      c.fillStyle=C.gold;c.beginPath();c.arc(x,y-8,5,0,Math.PI*2);c.fill();c.fillStyle=C.yellow;c.beginPath();c.arc(x,y-8,2,0,Math.PI*2);c.fill();
      c.fillStyle='#aa7d14';c.beginPath();c.arc(x,y+6,17,0,Math.PI*2);c.fill();c.fillStyle=C.gold;c.beginPath();c.arc(x,y+4,15,0,Math.PI*2);c.fill();
      c.strokeStyle=C.yellow;c.lineWidth=2;c.beginPath();c.arc(x,y+4,11,0,Math.PI*2);c.stroke();
      const star=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2===0?8:3.5;star.push([x+Math.cos(a)*r,y+4+Math.sin(a)*r]);}c.fillStyle=C.white;c.beginPath();star.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fill();
      c.strokeStyle='#f5dc5a';c.lineWidth=2;c.beginPath();c.arc(x,y+4,12,.4,2.7);c.stroke();c.beginPath();c.arc(x,y+4,12,3.55,5.85);c.stroke();this.text('500',x,y+31,C.gold,this.small,'center');
    }
    else if(p.kind==='wood'){giftBg('#8b4513','WOOD');this.roundRect(x-16,y-8,32,16,4,'#8b4513');c.fillStyle='#a0522d';c.beginPath();c.ellipse(x+14,y,4,8,0,0,Math.PI*2);c.fill();c.strokeStyle='#64320a';c.lineWidth=1;c.beginPath();c.moveTo(x-10,y-4);c.lineTo(x+5,y-4);c.stroke();}
    else if(p.kind==='nail'){giftBg(C.grey,'NAIL');c.fillStyle=C.grey;c.fillRect(x-2,y-12,4,24);c.fillStyle='#b4b4be';c.fillRect(x-6,y-14,12,4);}
    else if(p.kind==='hammer'){giftBg('#64646e','HAMMER');this.roundRect(x-3,y-5,6,20,2,'#8b4513');this.roundRect(x-12,y-14,24,10,2,C.grey);}
    else if(p.kind==='cheese'){giftBg(C.yellow,'CHEESE');c.fillStyle='#ffdc32';c.beginPath();c.moveTo(x-15,y+10);c.lineTo(x+15,y+10);c.lineTo(x+15,y-5);c.lineTo(x-5,y-15);c.closePath();c.fill();c.fillStyle='#dcae14';for(const [dx,dy,r] of [[5,0,3],[-2,5,2]]){c.beginPath();c.arc(x+dx,y+dy,r,0,Math.PI*2);c.fill();}}
    else if(p.kind==='wrench'){giftBg(C.grey,'WRENCH');this.roundRect(x-3,y-10,6,22,2,C.grey);c.fillStyle=C.grey;c.beginPath();c.arc(x,y-12,8,0,Math.PI*2);c.fill();c.fillStyle=C.black;c.beginPath();c.arc(x,y-12,4,0,Math.PI*2);c.fill();}
    else if(p.kind==='silver_medal'){giftBg(C.silver,'SILVER');c.fillStyle=C.silver;c.beginPath();c.arc(x,y+5,14,0,Math.PI*2);c.fill();c.strokeStyle=C.white;c.lineWidth=2;c.beginPath();c.arc(x,y+5,10,0,Math.PI*2);c.stroke();}
    else if(p.kind==='health'){
      const pulse=1+Math.trunc(2*Math.sin(p.t*2));c.strokeStyle='#ff7896';c.lineWidth=1;c.beginPath();c.arc(x,y,21+pulse,0,Math.PI*2);c.stroke();
      c.fillStyle=C.red;for(const [dx,dy] of [[-6,-5],[6,-5]]){c.beginPath();c.arc(x+dx,y+dy,8,0,Math.PI*2);c.fill();}c.beginPath();c.moveTo(x-14,y-2);c.lineTo(x+14,y-2);c.lineTo(x,y+16);c.closePath();c.fill();c.fillStyle='#ffaab4';c.beginPath();c.arc(x-8,y-8,2,0,Math.PI*2);c.fill();this.text('+1 LIFE',x,y-30,'#ff82a0',this.small,'center');
    }else if(p.kind==='shield'){
      const pulse=2+Math.trunc(3*Math.sin(p.t*2.5));c.strokeStyle='#ffeb78';c.lineWidth=1;c.beginPath();c.arc(x,y,21+pulse,0,Math.PI*2);c.stroke();c.fillStyle=C.gold;c.beginPath();c.moveTo(x,y-17);c.lineTo(x+15,y-9);c.lineTo(x+11,y+10);c.lineTo(x,y+18);c.lineTo(x-11,y+10);c.lineTo(x-15,y-9);c.closePath();c.fill();this.text('SHIELD',x,y-30,C.gold,this.small,'center');
    }
  }

  bullet(b){
    const c=this.ctx,x=b.x,y=b.y,col=b.color||(b.boss?C.purple:C.red);
    if(b.boss){
      const ang=Math.atan2(b.vy,b.vx),tip=[x+Math.cos(ang)*11,y+Math.sin(ang)*11],l=[x+Math.cos(ang+2.5)*8,y+Math.sin(ang+2.5)*8],r=[x+Math.cos(ang-2.5)*8,y+Math.sin(ang-2.5)*8],tail=[x-Math.cos(ang)*12,y-Math.sin(ang)*12];
      c.strokeStyle=C.white;c.lineWidth=2;c.beginPath();c.moveTo(...tail);c.lineTo(x,y);c.stroke();c.fillStyle=col;c.beginPath();c.moveTo(...tip);c.lineTo(...l);c.lineTo(...r);c.closePath();c.fill();
    }else{c.fillStyle=col;c.beginPath();c.arc(x,y,b.r,0,Math.PI*2);c.fill();c.fillStyle=C.white;c.beginPath();c.arc(x,y,Math.max(1,b.r-3),0,Math.PI*2);c.fill();}
  }

  bossBar(e,y=52){
    const c=this.ctx,w=360,x=WIDTH/2-w/2,col=e.barColor|| (e.type==='octopus'?C.pink:e.type==='snake'?C.green:C.purple);
    c.fillStyle='#3c143c';c.fillRect(x,y,w,12);c.fillStyle=e.enraged?C.red:col;c.fillRect(x,y,w*Math.max(0,e.hp)/e.maxHp,12);c.strokeStyle=C.white;c.lineWidth=1;c.strokeRect(x,y,w,12);
    this.text(e.type==='octopus'?'SPACE OCTOPUS':e.type==='snake'?'SNAKE':'BOSS',x-12,y+2,C.white,this.small,'right');
  }

  hud(g){
    this.text(`SCORE ${String(g.score).padStart(6,'0')}`,12,20,C.white,this.font);
    this.text(`HI ${String(g.high).padStart(6,'0')}`,WIDTH/2,20,C.yellow,this.font,'center');
    this.text(`TIME ${g.timeString()}`,WIDTH/2,42,C.white,this.small,'center');
    this.text(`LEVEL ${g.level}/${FINAL_LEVEL}`,WIDTH-12,20,C.cyan,this.font,'right');
    this.car(24,52,.55);this.text(`x ${g.player.lives}`,50,52,C.white,this.font);
    const bosses=g.enemies.filter(e=>['boss','octopus','snake'].includes(e.type));bosses.forEach((e,i)=>this.bossBar(e,52+i*16));
    const info=WEAPONS[g.player.weapon];this.text(`WEAPON: ${info.name}`,12,84,info.color,this.small);
    if(g.player.weapon!=='arrow'){const f=g.player.weaponTime/g.player.weaponTotal;this.bar(12,98,110,8,f,info.color);this.text(`${(g.player.weaponTime/60).toFixed(1)}s`,128,102,C.white,this.small);}
    if(g.player.shield>0){const f=g.player.shield/g.player.shieldTotal;this.bar(12,112,110,8,f,C.gold);this.text(`SHIELD ${(g.player.shield/60).toFixed(1)}s`,128,116,C.gold,this.small);}
  }

  bar(x,y,w,h,f,col){const c=this.ctx;c.fillStyle='#28283c';c.fillRect(x,y,w,h);c.fillStyle=col;c.fillRect(x,y,w*Math.max(0,Math.min(1,f)),h);c.strokeStyle=C.white;c.lineWidth=1;c.strokeRect(x,y,w,h);}

  playerEffects(g){
    const c=this.ctx;
    if(g.player.laserOn&&g.player.weapon==='laser'){
      const bx=Math.round(g.player.x),bh=Math.round(g.player.y)-22,w=8+Math.floor(Math.random()*5);
      c.fillStyle='#961e46';c.fillRect(bx-w,0,w*2,bh);c.fillStyle=C.pink;c.fillRect(bx-Math.floor(w/2),0,w,bh);c.fillStyle=C.white;c.fillRect(bx-2,0,4,bh);
    }
    if(g.player.laserOn&&g.player.weapon==='flamethrower'){
      const bx=Math.round(g.player.x),by=Math.round(g.player.y)-28,flameLength=Math.max(40,by),segments=28;
      for(let i=0;i<segments;i++){
        const t=i/(segments-1),yy=by-Math.trunc(t*flameLength),spread=Math.trunc(8+t*30),wobble=Math.trunc(Math.sin(g.tick*.55+i*1.7)*(3+t*7)),cx=bx+wobble+Math.floor(Math.random()*7-3);
        const outer=Math.max(5,Math.trunc(13-t*4)),inner=Math.max(3,outer-5);
        c.fillStyle=C.orange;c.beginPath();c.arc(cx,yy,outer+Math.floor(Math.random()*5),0,Math.PI*2);c.fill();c.fillStyle=C.yellow;c.beginPath();c.arc(cx+Math.floor(Math.random()*(Math.floor(spread/2)+1))-Math.floor(spread/4),yy+3,inner,0,Math.PI*2);c.fill();
        if(i%2===0){const tx=cx+Math.floor(Math.random()*(spread*2+1))-spread,th=Math.floor(Math.random()*19)+12+Math.trunc(t*10);c.fillStyle=C.orange;c.beginPath();c.moveTo(cx-4,yy+5);c.lineTo(tx,yy-th);c.lineTo(cx+5,yy+5);c.closePath();c.fill();c.fillStyle=C.yellow;c.beginPath();c.moveTo(cx-2,yy+3);c.lineTo(tx,yy-th+8);c.lineTo(cx+3,yy+3);c.closePath();c.fill();}
      }
      c.fillStyle=C.orange;c.beginPath();c.arc(bx,by,18,0,Math.PI*2);c.fill();c.fillStyle=C.yellow;c.beginPath();c.arc(bx,by-5,11,0,Math.PI*2);c.fill();
    }
  }

  scene(g){
    const c=this.ctx;c.fillStyle=C.black;c.fillRect(0,0,WIDTH,HEIGHT);
    for(const s of g.stars){const cc=Math.trunc(80+s.sp*80);c.fillStyle=`rgb(${cc},${cc},${Math.min(255,cc+30)})`;c.beginPath();c.arc(s.x,s.y,s.sz,0,Math.PI*2);c.fill();}
    if(g.state==='menu'){this.menu(g);return;}
    for(const p of g.pickups)this.pickup(p);
    for(const e of g.enemies)this.enemy(e);
    this.playerEffects(g);
    for(const a of g.arrows)this.projectile(a);
    for(const b of g.ebullets)this.bullet(b);
    if(!(g.player.invuln>0&&Math.floor(g.tick/4)%2===0))this.car(g.player.x,g.player.y);
    if(g.player.shield>0){const pulse=2.5+2.5*Math.sin(g.tick*.16),radius=34+pulse;c.strokeStyle='#ffeb78';c.lineWidth=2;c.beginPath();c.arc(g.player.x,g.player.y,radius+4,0,Math.PI*2);c.stroke();c.strokeStyle=C.gold;c.beginPath();c.arc(g.player.x,g.player.y,radius,0,Math.PI*2);c.stroke();c.strokeStyle='#fffab4';c.lineWidth=1;c.beginPath();c.arc(g.player.x,g.player.y,radius-5,0,Math.PI*2);c.stroke();c.strokeStyle=C.white;c.lineWidth=2;c.beginPath();c.arc(g.player.x,g.player.y,radius,g.tick*.04,g.tick*.04+Math.PI*.75);c.stroke();}
    this.hud(g);
    if(g.banner>0&&g.state==='play'){
      const title=g.level===FINAL_LEVEL?'FINAL LEVEL':`LEVEL ${g.level}`,kinds=BOSS_LEVELS[g.level];
      if(kinds){const warn=kinds.length>1?'!! DOUBLE BOSS !!':kinds[0]==='snake'?'!! SNAKE BOSS INCOMING !!':kinds[0]==='octopus'?'!! SPACE OCTOPUS INCOMING !!':'!! BOSS INCOMING !!';this.text(title,WIDTH/2,300,C.white,this.big,'center');this.text(warn,WIDTH/2,355,C.red,this.mid,'center');}
      else this.text(title,WIDTH/2,320,C.white,this.big,'center');
    }
    if(g.levelClearTimer>0){this.text('LEVEL CLEAR!',WIDTH/2,300,C.green,this.big,'center');this.text(`Bonus +${g.level*100}`,WIDTH/2,355,C.yellow,this.mid,'center');}
    if(g.state==='paused')this.text('PAUSED',WIDTH/2,HEIGHT/2,C.white,this.big,'center');
    if(g.state==='over')this.overlay(g,'GAME OVER',C.red,`Score: ${g.score}`,`Reached level ${g.level}`);
    if(g.state==='won')this.overlay(g,'YOU WIN!',C.yellow,`You beat all ${FINAL_LEVEL} levels!`,`Final score: ${g.score}`);
    if(g.menuOpen)this.escapeMenu(g);
  }

  overlay(g,title,col,a,b){const c=this.ctx;c.fillStyle='rgba(0,0,0,.68)';c.fillRect(0,0,WIDTH,HEIGHT);this.text(title,WIDTH/2,180,col,this.big,'center');this.text(a,WIDTH/2,245,C.white,this.mid,'center');this.text(b,WIDTH/2,285,C.cyan,this.mid,'center');this.text(`Time: ${g.timeString()}`,WIDTH/2,325,C.cyan,this.font,'center');this.text(`Enemies killed: ${g.kills}`,WIDTH/2,365,C.green,this.font,'center');this.text(`Enemies missed: ${g.missed}`,WIDTH/2,393,C.orange,this.font,'center');this.text(g.state==='won'?'Press ESC for the menu':'ENTER = play again     ESC = menu',WIDTH/2,490,C.white,this.font,'center');}

  menu(g){
    this.text('SPACE CAR INVADERS',WIDTH/2,120,C.cyan,this.big,'center');this.car(WIDTH/2,190,1.4);
    const rows=[['SHOOTER',C.green,'hovers and fires slow bullets at you','100'],['DRIFTER',C.orange,'drifts in a straight line at you','50'],['ROLLER','#4682e6','rolls side to side, steps closer','150'],['BOSS',C.purple,'mothership, fan volleys (L6, 15, 24)','1000+'],['SNAKE','#3cbe5a','hardest boss, winding body + venom (L9, 18, 27)','1500+'],['OCTOPUS',C.pink,'easiest boss, up to 3 wandering babies (L3, 12, 21)','1400+']];
    let y=250;for(const [name,col,desc,pts] of rows){this.text(name.padEnd(8),90,y,col,this.font);this.text(`${desc}  [${pts} pts]`,200,y+3,C.white,this.small);y+=30;}
    this.text(`${FINAL_LEVEL} levels - level ${FINAL_LEVEL} is the final showdown!`,WIDTH/2,438,C.yellow,this.small,'center');
    this.text('Crates = GUN / LASER / BAZOOKA / FLAMETHROWER',WIDTH/2,462,C.white,this.small,'center');
    this.text('Gifts + rare HEART (+1 life, max 100) + SHIELD (10s immortality)',WIDTH/2,490,C.white,this.small,'center');
    if(Math.floor(g.tick/30)%2===0)this.text('PRESS ENTER TO START',WIDTH/2,600,C.yellow,this.mid,'center');
    this.text(`High score: ${g.high}`,WIDTH/2,646,C.white,this.small,'center');
  }

  escapeMenu(g){const c=this.ctx;c.fillStyle='rgba(0,0,0,.68)';c.fillRect(0,0,WIDTH,HEIGHT);this.text('MENU',WIDTH/2,220,C.white,this.big,'center');g.menuItems().forEach((item,i)=>this.text(i===g.menuIndex?`> ${item} <`:item,WIDTH/2,320+i*60,i===g.menuIndex?C.yellow:C.grey,this.mid,'center'));this.text('UP / DOWN = select    ENTER = confirm    ESC = close',WIDTH/2,320+g.menuItems().length*60+30,C.grey,this.small,'center');}
}
