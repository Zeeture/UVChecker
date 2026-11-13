const $=id=>document.getElementById(id);
const canvas=$("canvas"),ctx=canvas.getContext("2d");
const defaults={w:2048,h:2048,cols:8,rows:8,squareMode:"fit",a:"#FFFFFF",b:"#202020",flip:"none",numberMode:"continuous",start:1,padding:0,prefix:"",format:"{row}_{col}",order:"ltr",vOrigin:"top",fontSize:20,position:"center",textColor:"#FF0000",outlineColor:"#FFFFFF",showNumbers:true,showOutline:true,showGrid:false,showAxis:true,showRowCol:false,gridColor:"#808080",gridWidth:2};
let s={...defaults};
function n(id,def,min,max){let v=Math.round(Number($(id).value));return Math.max(min,Math.min(max,Number.isFinite(v)?v:def))}
function pad(v){return s.padding?String(v).padStart(s.padding,"0"):String(v)}
function indexFor(r,c){let rr=r,cc=c;if(s.order==="rtl")cc=s.cols-1-c;if(s.order==="ttb")return c*s.rows+r+Number(s.start);if(s.order==="btt")return c*s.rows+(s.rows-1-r)+Number(s.start);return rr*s.cols+cc+Number(s.start)}
function labelFor(r,c){
  const idx=indexFor(r,c),row=r+1,col=c+1;
  const u=(c/s.cols).toFixed(2),v=((s.vOrigin==="top"?r:s.rows-r)/s.rows).toFixed(2);
  if(s.numberMode==="continuous")return s.prefix+pad(idx);
  if(s.numberMode==="rc")return s.prefix+"R"+pad(row)+"C"+pad(col);
  if(s.numberMode==="uv")return s.prefix+"U"+u+" V"+v;
  return s.prefix+s.format.replaceAll("{index}",pad(idx)).replaceAll("{row}",pad(row)).replaceAll("{col}",pad(col)).replaceAll("{u}",u).replaceAll("{v}",v);
}
function draw(){
  const W=s.w,H=s.h,cols=s.cols,rows=s.rows;
  canvas.width=W;canvas.height=H;ctx.clearRect(0,0,W,H);
  ctx.fillStyle=s.a;ctx.fillRect(0,0,W,H);
  const cell=Math.min(W/cols,H/rows),gw=cell*cols,gh=cell*rows;
  const ox=s.squareMode==="crop"?(W-gw)/2:0,oy=s.squareMode==="crop"?(H-gh)/2:0;
  const flipV=s.flip==="vertical"||s.flip==="both",flipH=s.flip==="horizontal"||s.flip==="both";
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const rr=flipV?rows-1-r:r,cc=flipH?cols-1-c:c,x=ox+c*cell,y=oy+r*cell;
    ctx.fillStyle=(rr+cc)%2===0?s.a:s.b;
    ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(x+cell)-Math.floor(x),Math.ceil(y+cell)-Math.floor(y));
    if(s.showNumbers){
      const text=labelFor(rr,cc),fs=Math.max(6,Math.min(cell*s.fontSize/100,cell*.8));
      ctx.font="bold "+fs+"px Consolas,monospace";ctx.textBaseline="middle";ctx.textAlign="center";
      let tx=x+cell/2,ty=y+cell/2;
      const padPx=cell*.06;
      if(s.position==="tl"){tx=x+padPx;ty=y+padPx;ctx.textAlign="left";ctx.textBaseline="top"}
      if(s.position==="tr"){tx=x+cell-padPx;ty=y+padPx;ctx.textAlign="right";ctx.textBaseline="top"}
      if(s.position==="bl"){tx=x+padPx;ty=y+cell-padPx;ctx.textAlign="left";ctx.textBaseline="bottom"}
      if(s.position==="br"){tx=x+cell-padPx;ty=y+cell-padPx;ctx.textAlign="right";ctx.textBaseline="bottom"}
      if(s.showOutline){ctx.lineWidth=Math.max(1,fs*.12);ctx.strokeStyle=s.outlineColor;ctx.strokeText(text,tx,ty)}
      ctx.fillStyle=s.textColor;ctx.fillText(text,tx,ty);
    }
  }
  if(s.showGrid){ctx.strokeStyle=s.gridColor;ctx.lineWidth=Math.max(1,s.gridWidth*Math.min(W,H)/2048);ctx.beginPath();for(let c=0;c<=cols;c++){let x=ox+c*cell;ctx.moveTo(x,oy);ctx.lineTo(x,oy+gh)}for(let r=0;r<=rows;r++){let y=oy+r*cell;ctx.moveTo(ox,y);ctx.lineTo(ox+gw,y)}ctx.stroke()}
  if(s.showAxis){
    ctx.strokeStyle="#e5e7eb";ctx.lineWidth=Math.max(2,Math.min(W,H)/1024);ctx.strokeRect(0,0,W,H);
    ctx.fillStyle="#e5e7eb";ctx.font=Math.max(14,Math.min(W,H)/90)+"px Arial";ctx.textAlign="left";ctx.textBaseline="top";ctx.fillText("U 0",12,12);ctx.textAlign="right";ctx.fillText("U 1",W-12,12);ctx.textAlign="left";ctx.textBaseline="bottom";ctx.fillText("V 0",12,H-12);ctx.textAlign="right";ctx.fillText("V 1",W-12,H-12);
  }
  if(s.showRowCol){
    ctx.fillStyle="#e5e7eb";ctx.font=Math.max(12,Math.min(W,H)/120)+"px Arial";ctx.textAlign="center";ctx.textBaseline="bottom";
    for(let c=0;c<cols;c++)ctx.fillText("C"+(c+1),ox+(c+.5)*cell,Math.max(12,oy-3));
    ctx.textAlign="right";ctx.textBaseline="middle";
    for(let r=0;r<rows;r++)ctx.fillText("R"+(r+1),Math.max(20,ox-5),oy+(r+.5)*cell);
  }
  $("previewSize").textContent=W+" × "+H;$("statResolution").textContent=W+" × "+H;$("statGrid").textContent=cols+" × "+rows;$("statCount").textContent=(cols*rows).toLocaleString();
}
function update(){
  s.w=n("width",2048,1,16384);s.h=n("height",2048,1,16384);s.cols=n("cols",8,1,512);s.rows=n("rows",8,1,512);
  s.squareMode=$("squareMode").value;s.a=$("colorA").value;s.b=$("colorB").value;s.flip=$("flip").value;
  s.numberMode=$("numberMode").value;s.start=Number($("start").value)||1;s.padding=Number($("padding").value)||0;s.prefix=$("prefix").value;s.format=$("format").value;s.order=$("order").value;s.vOrigin=$("vOrigin").value;
  s.fontSize=n("fontSize",20,5,60);s.position=$("position").value;s.textColor=$("textColor").value;s.outlineColor=$("outlineColor").value;s.showNumbers=$("showNumbers").checked;s.showOutline=$("showOutline").checked;
  s.showGrid=$("showGrid").checked;s.showAxis=$("showAxis").checked;s.showRowCol=$("showRowCol").checked;s.gridColor=$("gridColor").value;s.gridWidth=n("gridWidth",2,1,20);
  $("width").value=s.w;$("height").value=s.h;$("cols").value=s.cols;$("rows").value=s.rows;draw();
}
document.querySelectorAll("input,select").forEach(el=>el.addEventListener("input",update));
document.querySelectorAll("[data-size]").forEach(b=>b.addEventListener("click",()=>{$("width").value=b.dataset.size;$("height").value=b.dataset.size;update()}));
$("resetBtn").addEventListener("click",()=>{s={...defaults};for(const [k,v] of Object.entries({width:s.w,height:s.h,cols:s.cols,rows:s.rows,squareMode:s.squareMode,colorA:s.a,colorB:s.b,flip:s.flip,numberMode:s.numberMode,start:s.start,padding:String(s.padding),prefix:s.prefix,format:s.format,order:s.order,vOrigin:s.vOrigin,fontSize:s.fontSize,position:s.position,textColor:s.textColor,outlineColor:s.outlineColor,gridColor:s.gridColor,gridWidth:s.gridWidth}))$(k).value=v;for(const [id,v] of Object.entries({showNumbers:s.showNumbers,showOutline:s.showOutline,showGrid:s.showGrid,showAxis:s.showAxis,showRowCol:s.showRowCol}))$(id).checked=v;update();$("status").textContent="已恢复默认设置。"});
$("exportBtn").addEventListener("click",async()=>{const btn=$("exportBtn");btn.disabled=true;btn.textContent="正在导出…";try{const result=await window.uvDesktop.savePng(canvas.toDataURL("image/png"));$("status").textContent=result.canceled?"已取消导出。":"PNG 已保存："+result.filePath}catch(e){$("status").textContent="导出失败："+e.message}finally{btn.disabled=false;btn.textContent="导出 PNG"}});
update();
