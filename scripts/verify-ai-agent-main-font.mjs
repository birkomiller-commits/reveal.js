import puppeteer from 'puppeteer';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import{pathToFileURL}from'node:url';
const b=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
 await fs.mkdir('docs/ai-agent/main-font',{recursive:true});await p.setOfflineMode(true);await p.setViewport({width:1440,height:1000});await p.goto(pathToFileURL(path.resolve('AI_agent_lesson.html')).href+'#lesson-9',{waitUntil:'networkidle0'});await p.evaluate(()=>document.fonts.ready);await new Promise(r=>setTimeout(r,1100));
 assert(await p.evaluate(()=>document.fonts.check('20px UKIJKUY')));const cdp=await p.createCDPSession();await cdp.send('DOM.enable');await cdp.send('CSS.enable');
 const used=[];
 for(const selector of ['.lesson-explanation>p','.lesson-heading h1','.hint-intro h2']){
  const {root}=await cdp.send('DOM.getDocument'),{nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});assert(fonts.some(f=>f.familyName==='UKIJ Kufi Yay'&&f.isCustomFont&&f.glyphCount>0),selector);used.push({selector,fonts});
 }
 await p.click('#textSizeButton');await p.evaluate(()=>document.fonts.ready);const {root}=await cdp.send('DOM.getDocument'),{nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'#textSizeTitle'}),{fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});assert(fonts.some(f=>f.familyName==='UKIJ Kufi Yay'&&f.isCustomFont));await p.keyboard.press('Escape');
 assert((await p.$eval('.english-term',e=>getComputedStyle(e).fontFamily)).includes('monospace'));await p.screenshot({path:'docs/ai-agent/main-font/desktop.png'});await p.setViewport({width:390,height:844});await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:'docs/ai-agent/main-font/phone.png'});assert.deepEqual(errors,[]);
 const report={result:'passed',source:'assets/fonts/UKIJKUY.TTF',font_family:'UKIJ Kufi Yay',css_alias:'UKIJKUY',custom_font_glyphs_verified:used,controls_font_verified:true,code_font_preserved:true,offline:true,errors};await fs.writeFile('docs/ai-agent/main-font/validation.json',JSON.stringify(report,null,2)+'\n');console.log({result:report.result,actual_font:report.font_family,errors});
}finally{await b.close();}
