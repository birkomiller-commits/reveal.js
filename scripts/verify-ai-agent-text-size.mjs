import puppeteer from 'puppeteer';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import{pathToFileURL}from'node:url';
const b=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});const p=await b.newPage(),errors=[],issues=[],checks=[];p.on('pageerror',e=>errors.push(e.message));const wait=ms=>new Promise(r=>setTimeout(r,ms));
const click=async q=>{await p.$eval(q,e=>e.scrollIntoView({block:'center',behavior:'instant'}));await p.click(q);};
const size=async n=>{await p.click('#textSizeButton');await p.$eval('#textSizeRange',(e,n)=>{e.value=String(n);e.dispatchEvent(new Event('input',{bubbles:true}));},n);await click('[data-text-size-close]');await wait(60);};
const open=async id=>{await p.$eval(`#desktopLessons [data-open-lesson="${id}"]`,e=>e.click());await wait(40);};
try{
 await fs.mkdir('docs/ai-agent/text-size',{recursive:true});await p.setViewport({width:1440,height:1000});await p.setOfflineMode(true);await p.goto(pathToFileURL(path.resolve('AI_agent_lesson.html')).href+'#lesson-9',{waitUntil:'networkidle0'});
 const originalIcon=await p.$eval('.heading-icon',e=>getComputedStyle(e).width);
 const base=await p.$eval('.lesson-explanation>p',e=>parseFloat(getComputedStyle(e).fontSize));assert.equal(base,12);await size(150);assert.equal(await p.$eval('.heading-icon',e=>getComputedStyle(e).width),originalIcon);assert.equal(await p.$eval('.lesson-explanation>p',e=>parseFloat(getComputedStyle(e).fontSize)),18);
 await p.reload({waitUntil:'networkidle0'});assert.equal(await p.$eval('.lesson-explanation>p',e=>parseFloat(getComputedStyle(e).fontSize)),18);assert.equal(await p.$eval('#textSizeButton',e=>e.textContent),'خەت چوڭلۇقى · 150%');
 await open(18);assert.equal(await p.$eval('.learning-bridge p',e=>parseFloat(getComputedStyle(e).fontSize)),18);
 await p.click('#textSizeButton');await p.focus('#textSizeRange');await p.keyboard.press('ArrowRight');assert.equal(await p.$eval('#textSizeValue',e=>e.textContent),'175%');await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>document.activeElement.id),'textSizeButton');
 await p.$eval('.reading-tools [data-reading-toggle]',e=>e.click());await wait(50);assert.equal(await p.$eval('.learning-bridge p',e=>parseFloat(getComputedStyle(e).fontSize)),26.25);await p.$eval('.reading-tools [data-reading-toggle]',e=>e.click());
 checks.push('text-only scaling, reload persistence, dynamic lesson content, keyboard range/Escape and comfort-mode compatibility');
 let layouts=0;
 for(const [width,height] of [[1440,1000],[1024,640],[390,844],[320,568]]){
  await p.setViewport({width,height});
  for(const scale of [125,200]){
   await size(scale);
   for(let id=1;id<=18;id++){
    await open(id);
    const bad=await p.evaluate(()=>{
     const bad=[];if(document.documentElement.scrollWidth>innerWidth+2)bad.push('document horizontal overflow');
     for(const e of document.querySelectorAll('.lesson-heading,.hint-dock,.learning-bridge,.quiz-choice,.demo-panel,#lessonFooter button')){const r=e.getBoundingClientRect();if(r.left< -2||r.right>innerWidth+2)bad.push(e.className+' outside viewport');if(e.scrollWidth>e.clientWidth+3)bad.push(e.className+' clipped text');}
     const h=document.querySelector('.app-header').getBoundingClientRect(),f=document.querySelector('#lessonFooter').getBoundingClientRect();if(h.bottom>=f.top)bad.push('header/footer overlap');
     return bad;
    });layouts++;if(bad.length)issues.push({width,height,scale,id,bad});
   }
   await p.$eval('#homeButton',e=>e.click());await wait(40);const home=await p.evaluate(()=>{const result=[];for(const e of document.querySelectorAll('.home-lesson-card,.resume-learning,.first-visit-guide,.pearl-card,.depth-card')){const r=e.getBoundingClientRect();if(r.left< -2||r.right>innerWidth+2)result.push(e.className+' outside');for(const t of e.querySelectorAll('p,strong,small')){if(t.scrollWidth>t.clientWidth+3)result.push('home text clipped');}}return result;});if(home.length)issues.push({width,height,scale,route:'home',bad:home});
   await p.$eval('[data-open-mission]',e=>e.click());await wait(40);const mission=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);assert(!mission);
   await p.click('#accountButton');await wait(40);assert(await p.$eval('#authDialog',e=>{const r=e.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1&&r.height<=innerHeight;}));await p.keyboard.press('Escape');
  }
 }
 await p.setViewport({width:390,height:844});await open(9);await p.$eval('.hint-dock>.text-button',e=>e.click());await p.evaluate(()=>scrollTo(0,0));await wait(1100);await p.screenshot({path:'docs/ai-agent/text-size/phone-200.png'});await p.click('#textSizeButton');await p.screenshot({path:'docs/ai-agent/text-size/controls-phone.png'});await click('#textSizeReset');await click('[data-text-size-close]');assert.equal(await p.$eval('.lesson-explanation>p',e=>parseFloat(getComputedStyle(e).fontSize)),12);await p.reload({waitUntil:'networkidle0'});assert.equal(await p.$eval('.lesson-explanation>p',e=>parseFloat(getComputedStyle(e).fontSize)),12);
 checks.push('all 18 lessons at 125% and 200% across four viewports; home, mission and sign-in dialog fit; reset survives reload');assert.deepEqual(issues,[]);assert.deepEqual(errors,[]);
 const report={result:'passed',layouts,checks,issues,errors};await fs.writeFile('docs/ai-agent/text-size/validation.json',JSON.stringify(report,null,2)+'\n');console.log(report);
}catch(e){console.log('DETAILS',JSON.stringify({issues,errors}));await p.screenshot({path:'/private/tmp/text-size-failure.png'});throw e;}finally{await b.close();}
