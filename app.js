const dramas=[
 {id:'sa-likod-ng-pangako',title:'Sa Likod ng Pangako',genre:'Romance • Family',episodes:24,tag:'NEW'},
 {id:'mahal-kita-kahit-kailan',title:'Mahal Kita, Kahit Kailan',genre:'Romance • Drama',episodes:18,tag:'TRENDING'},
 {id:'ang-huling-lihim',title:'Ang Huling Lihim',genre:'Mystery • Drama',episodes:30,tag:'HOT'},
 {id:'bago-maghatinggabi',title:'Bago Maghatinggabi',genre:'Romance • Suspense',episodes:16,tag:'NEW'}
];
const grid=document.getElementById('dramaGrid');
function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
function isFavorite(id){return readJSON('tagalogdrama.favorites',[]).includes(id)}
function showToast(message){const toast=document.getElementById('toast');if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2800)}
function toggleFavorite(id){const list=readJSON('tagalogdrama.favorites',[]);const next=list.includes(id)?list.filter(x=>x!==id):[...list,id];localStorage.setItem('tagalogdrama.favorites',JSON.stringify(next));const btn=document.querySelector(`.favorite-btn[data-id="${CSS.escape(id)}"]`);if(btn)btn.textContent=next.includes(id)?'♥ Saved':'♡ Favorite';showToast(next.includes(id)?'Added to My Library.':'Removed from My Library.')}
if(grid){grid.innerHTML=dramas.map(d=>`<article class="card"><div class="poster"><div><small>${d.tag}</small><br><b>${d.title}</b></div></div><div class="card-body"><h3>${d.title}</h3><p>${d.genre} · ${d.episodes} episodes</p><div class="card-actions"><a class="primary" href="episodes.html?series=${encodeURIComponent(d.id)}">Episodes</a><button class="secondary favorite-btn" data-id="${d.id}">${isFavorite(d.id)?'♥ Saved':'♡ Favorite'}</button></div></div></article>`).join('');grid.querySelectorAll('.favorite-btn').forEach(btn=>btn.addEventListener('click',()=>toggleFavorite(btn.dataset.id)))}

document.querySelectorAll('.subscribe').forEach(btn=>btn.addEventListener('click',async()=>{
  const plan=btn.dataset.plan;
  if(!plan)return;
  showToast(`${plan} subscription requires a configured payment provider.`);
  try{
    const base=window.TAGALOGDRAMA_API||'';
    if(!base)return;
    const token=localStorage.getItem('tagalogdrama.token');
    const response=await fetch(`${base}/subscriptions/checkout`,{method:'POST',headers:{'content-type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({plan})});
    const body=await response.json().catch(()=>({}));
    showToast(body.error||'Checkout is not configured yet.');
  }catch{showToast('Unable to reach the subscription service.');}
}));

const login=document.getElementById('loginBtn');
if(login)login.addEventListener('click',()=>showToast('Sign-in will be available after the production authentication provider is configured.'));

// Use the single canonical service worker registered by index.html. The old ./sw.js registration was removed to prevent competing caches.
