/* Visitor text sizing: text only, measured against the existing responsive styles. */
(() => {
 'use strict';
 const key='agent-lab-text-size-v1',sizes=[100,125,150,175,200];
 let size=100,storageOK=true,queued=false,resizeFrame=null,returnFocus=null;
 try{const stored=Number(localStorage.getItem(key));if(sizes.includes(stored))size=stored;}catch{storageOK=false;}
 const header=document.querySelector('.header-actions');if(!header)return;
 const button=document.createElement('button');button.type='button';button.id='textSizeButton';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','textSizeDialog');
 document.querySelector('#accountButton')?.after(button);if(!button.isConnected)header.append(button);
 const dialog=document.createElement('dialog');dialog.id='textSizeDialog';dialog.setAttribute('aria-labelledby','textSizeTitle');dialog.setAttribute('aria-describedby','textSizeDescription');
 dialog.innerHTML=`<div class="text-size-heading"><h2 id="textSizeTitle">خەت چوڭلۇقى</h2><button type="button" data-text-size-close aria-label="خەت چوڭلۇقى كۆزنىكىنى تاقاش">×</button></div><p id="textSizeDescription">ئۈسكۈنىڭىز ۋە ئوقۇش راھەتلىكىڭىزگە ماس چوڭلۇقنى تاللاڭ. تاللىشىڭىز بۇ توركۆرگۈچتە ساقلىنىدۇ.</p><div class="text-size-stepper"><button type="button" id="textSizeDecrease" aria-label="خەتنى كىچىكلىتىش" dir="ltr">A−</button><output id="textSizeValue" aria-live="polite" dir="ltr">100%</output><button type="button" id="textSizeIncrease" aria-label="خەتنى چوڭايتىش" dir="ltr">A+</button></div><label class="text-size-slider-label" for="textSizeRange">خەت چوڭلۇقىنى تەڭشەش</label><input id="textSizeRange" type="range" min="100" max="200" step="25" value="100" dir="ltr"><div class="text-size-range-labels" aria-hidden="true" dir="ltr"><span>100%</span><span>200%</span></div><p class="text-size-sample">ئوقۇڭ، سىناڭ ۋە جاۋابنىڭ سەۋەبىنى چۈشىنىڭ.</p><div class="text-size-actions"><button type="button" id="textSizeReset">ئەسلى چوڭلۇققا قايتۇرۇش</button><button type="button" data-text-size-close>تامام</button></div><p id="textSizeStorage" role="status" hidden>بۇ توركۆرگۈچ تەڭشەكنى ساقلاشقا يول قويمىدى؛ ھازىرقى بەتتە تاللىغان چوڭلۇقىڭىز ئىشلەيدۇ.</p>`;
 document.body.append(dialog);
 const $=q=>dialog.querySelector(q);
 const style=document.createElement('style');style.id='visitorTextScaleRules';style.textContent='html[data-user-text-size]:not([data-user-text-size="100"]) body [data-visitor-text]{font-size:calc(var(--visitor-base-font) * var(--visitor-text-scale))!important}';document.head.append(style);
 const selectors='p,h1,h2,h3,h4,h5,h6,a,button,label,input,select,textarea,legend,li,dt,dd,blockquote,summary,th,td,caption,code,pre,small,strong,em,span,bdi,output,kbd,#toast,#storageNotice';
 function measureText(){
  if(size===100)return;
  // Disable only our override while reading the design's true responsive/comfort sizes.
  style.sheet.disabled=true;
  const nodes=[...document.body.querySelectorAll(selectors)].filter(el=>!el.closest('#textSizeDialog,#textSizeButton'));
  const metrics=nodes.map(el=>[el,getComputedStyle(el).fontSize]);
  for(const [el,font] of metrics){el.style.setProperty('--visitor-base-font',font);el.setAttribute('data-visitor-text','');}
  style.sheet.disabled=false;
 }
 function queueMeasure(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;measureText();});}
 function update(value,{save=true}={}){
  if(!sizes.includes(value))return;size=value;
  document.documentElement.dataset.userTextSize=String(size);
  document.documentElement.style.setProperty('--visitor-text-scale',String(size/100));
  button.textContent='خەت چوڭلۇقى · '+size+'%';button.setAttribute('aria-label','خەت چوڭلۇقىنى تەڭشەش، ھازىر '+size+'%');
  $('#textSizeValue').textContent=size+'%';$('#textSizeRange').value=String(size);$('#textSizeRange').setAttribute('aria-valuetext',size+'%');
  $('#textSizeDecrease').disabled=size===sizes[0];$('#textSizeIncrease').disabled=size===sizes.at(-1);
  dialog.style.setProperty('--sample-text-scale',String(size/100));
  if(save){try{localStorage.setItem(key,String(size));storageOK=true;}catch{storageOK=false;}}
  $('#textSizeStorage').hidden=storageOK;measureText();
 }
 button.addEventListener('click',()=>{returnFocus=document.activeElement;dialog.showModal();$('#textSizeRange').focus();});
 dialog.addEventListener('click',event=>{if(event.target.closest('[data-text-size-close]'))dialog.close();if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
 $('#textSizeIncrease').addEventListener('click',()=>update(sizes[Math.min(sizes.length-1,sizes.indexOf(size)+1)]));
 $('#textSizeDecrease').addEventListener('click',()=>update(sizes[Math.max(0,sizes.indexOf(size)-1)]));
 $('#textSizeReset').addEventListener('click',()=>update(100));
 $('#textSizeRange').addEventListener('input',event=>update(Number(event.target.value)));
 new MutationObserver(records=>{if(records.some(r=>!r.target.closest?.('#textSizeDialog,#textSizeButton')))queueMeasure();}).observe(document.body,{childList:true,subtree:true});
 new MutationObserver(queueMeasure).observe(document.body,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',()=>{if(resizeFrame)cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(measureText);});
 window.addEventListener('storage',event=>{if(event.key===key)update(event.newValue===null?100:Number(event.newValue),{save:false});});
 update(size,{save:false});
})();
