(() => {
'use strict';
const toggle=document.getElementById('navToggle'), nav=document.getElementById('navLinks');
const closeMenu=()=>{nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');};
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav?.classList.contains('open')){closeMenu();toggle.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.topbar'))closeMenu();});
matchMedia('(min-width:821px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

const grid=document.querySelector('body[data-page="work"] .sheet');
if(grid){
 const cards=[...grid.querySelectorAll('.frame')];
 const category=card=>{
  const img=card.querySelector('img'), file=img.getAttribute('src');
  if(/night|dusk|sunset|distant|jacket-lift/.test(file))return 'Night & dusk';
  if(/aerial|drone|fpso|hose-disconnect|bolt-tensioning|subsea-template|lowering/.test(file))return 'Aerial';
  if(/crew|rigger|welding|control-room|load-out|wire-cutter|rigging/.test(file))return 'People & detail';
  return 'Offshore';
 };
 const bar=document.createElement('div');bar.className='gallery-tools';
 const group=document.createElement('div');group.className='filter-group';group.setAttribute('role','group');group.setAttribute('aria-label','Filter portfolio');
 let active='All work';
 const label=document.createElement('label');label.className='gallery-search';label.textContent='Search';
 const search=document.createElement('input');search.type='search';search.placeholder='Find a project…';label.append(search);
 const count=document.createElement('p');count.className='gallery-count';count.setAttribute('role','status');
 const empty=document.createElement('p');empty.className='gallery-empty';empty.textContent='No photographs match. Try another search or select All work.';empty.hidden=true;
 function update(){
  let n=0; const query=search.value.trim().toLowerCase();
  cards.forEach(card=>{const show=(active==='All work'||category(card)===active)&&(card.textContent+' '+card.querySelector('img').alt).toLowerCase().includes(query);card.hidden=!show;if(show)n++;});
  count.textContent=n+' of '+cards.length+' photographs';empty.hidden=n>0;
 }
 ['All work','Offshore','Aerial','People & detail','Night & dusk'].forEach(text=>{
  const b=document.createElement('button');b.type='button';b.className='filter-btn';b.textContent=text;b.setAttribute('aria-pressed',String(text===active));
  b.addEventListener('click',()=>{active=text;group.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));update();});
  group.append(b);
 });
 search.addEventListener('input',update);bar.append(group,label);grid.before(bar,count);grid.after(empty);update();
}

const photos=[...document.querySelectorAll('.frame-media img,.spec-photo img,.spec-thumbs img,.timeline-images img')];
if(photos.length){
 const dialog=document.createElement('dialog');dialog.className='lightbox';dialog.setAttribute('aria-label','Portfolio image viewer');
 dialog.innerHTML='<div class="lightbox-top"><span class="lightbox-index" aria-live="polite"></span><button type="button" aria-label="Close image viewer">×</button></div><img class="lightbox-image" alt=""><div class="lightbox-bottom"><button type="button" aria-label="Previous image">←</button><p class="lightbox-caption" aria-live="polite"></p><button type="button" aria-label="Next image">→</button></div>';
 document.body.append(dialog);
 const display=dialog.querySelector('img'),caption=dialog.querySelector('.lightbox-caption'),counter=dialog.querySelector('.lightbox-index');
 let current=0,available=[],opener;
 function show(index){current=(index+available.length)%available.length;const img=available[current];display.src=img.src;display.alt=img.alt;caption.textContent=img.closest('.frame,.mini-frame')?.querySelector('h3')?.textContent || img.alt;counter.textContent=(current+1)+' / '+available.length;}
 photos.forEach(img=>{
  const b=document.createElement('button');b.type='button';b.className='image-open';b.setAttribute('aria-label','Enlarge: '+img.alt);
  img.before(b);b.append(img);
  b.addEventListener('click',()=>{available=photos.filter(p=>!p.closest('[hidden]'));opener=b;show(available.indexOf(img));dialog.showModal();document.body.classList.add('modal-open');});
 });
 dialog.querySelector('[aria-label="Close image viewer"]').addEventListener('click',()=>dialog.close());
 dialog.querySelector('[aria-label="Previous image"]').addEventListener('click',()=>show(current-1));
 dialog.querySelector('[aria-label="Next image"]').addEventListener('click',()=>show(current+1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
 let startX=0;display.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;},{passive:true});
 display.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>65)show(current+(delta<0?1:-1));},{passive:true});
}
document.querySelectorAll('body[data-page="services"] .spec').forEach(card=>{
 const title=card.querySelector('h3').textContent;
 const a=document.createElement('a');a.className='service-link';a.href='contact.html?service='+encodeURIComponent(title);a.textContent='Discuss this service ↗';
 card.querySelector('.spec-body>div')?.append(a);
});
const form=document.getElementById('quoteForm');
if(form){
 const requested=new URLSearchParams(location.search).get('service');
 if(requested){const option=new Option(requested,requested,true,true);form.elements.namedItem('type').add(option);}
 form.addEventListener('submit',e=>{
  e.preventDefault();if(!form.reportValidity())return;
  const get=name=>form.elements.namedItem(name).value.trim();
  const body=['Name: '+get('name'),'Company / Operator: '+(get('company')||'-'),'Platform / Location: '+(get('location')||'-'),'Project type: '+get('type'),'',get('message')].join('\n');
  location.href='mailto:aliffcreative@gmail.com?subject='+encodeURIComponent('Project enquiry: '+get('type')+(get('company')?' — '+get('company'):''))+'&body='+encodeURIComponent(body);
  const box=document.getElementById('confirmBox');box.classList.add('show');box.setAttribute('role','status');
 });
}
const top=document.createElement('button');top.type='button';top.className='back-top';top.setAttribute('aria-label','Back to top');top.textContent='↑';top.hidden=true;document.body.append(top);
top.addEventListener('click',()=>{window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('.brand').focus({preventScroll:true});});
window.addEventListener('scroll',()=>{top.hidden=window.scrollY<650;},{passive:true});
})();