const dramas=[
 {id:'sa-likod-ng-pangako',title:'Sa Likod ng Pangako',genre:'Romance • Family',episodes:24,tag:'NEW'},
 {id:'mahal-kita-kahit-kailan',title:'Mahal Kita, Kahit Kailan',genre:'Romance • Drama',episodes:18,tag:'TRENDING'},
 {id:'ang-huling-lihim',title:'Ang Huling Lihim',genre:'Mystery • Drama',episodes:30,tag:'HOT'},
 {id:'bago-maghatinggabi',title:'Bago Maghatinggabi',genre:'Romance • Suspense',episodes:16,tag:'NEW'}
];
const grid=document.getElementById('dramaGrid');
if(grid){grid.innerHTML=dramas.map(d=>`<article class="card"><div class="poster"><div><small>${d.tag}</small><br><b>${d.title}</b></div></div><div class="card-body"><h3>${d.title}</h3><p>${d.genre} · ${d.episodes} episodes</p><div class="card-actions"><a class="primary" href="episodes.html?series=${encodeURIComponent(d.id)}">Episodes</a><button class="secondary favorite-btn" data-id="${d.id}">${isFavorite(d.id)?'♥ Saved':'♡ Favorite'}</button></div></div></article>`).join('');}
const toast=document.getElementById('toast');
function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2800)}
function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
function isFavorite(id){return readJSON('tagalogdrama.favorites',[]).includes(id)}
function toggleFavorite(id){const list=readJSON('tagalogdrama.favorites',[]);const next=list.includes(id)?list.filter(x=>x!==id):[...list,id];localStorage.setItem('tagalogdrama.favorites',JSON.stringify(next));const btn=document.querySelector(`.favorite-btn[data-id="${CSS.escape(id)}"]`);if(btn)btn.textContent=next.includes(id)?'♥ Saved':'♡ Favorite';showToast(next.includes(id)?'Added to My Library.':'Removed from My Library.')}
document.querySelectorAll('.favorite-btn').forEach(btn=>btn.addEventListener('click',()=>toggleFavorite(btn.dataset.id)));
const free=document.getElementById('freeBtn');if(free)free.addEventListener('click',()=>showToast('Rewarded-ad flow is ready for ad SDK integration.'));
document.querySelectorAll('.subscribe').forEach(btn=>btn.addEventListener('click',()=>showToast(`${btn.dataset.plan} plan selected. Payment integration is deferred.`)));
const login=document.getElementById('loginBtn');if(login)login.addEventListener('click',()=>showToast('Account authentication is prepared for the backend phase.'));
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
