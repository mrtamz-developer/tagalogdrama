const dramas=[
 {title:'Sa Likod ng Pangako',genre:'Romance • Family',episodes:24,tag:'NEW'},
 {title:'Mahal Kita, Kahit Kailan',genre:'Romance • Drama',episodes:18,tag:'TRENDING'},
 {title:'Ang Huling Lihim',genre:'Mystery • Drama',episodes:30,tag:'HOT'},
 {title:'Bago Maghatinggabi',genre:'Romance • Suspense',episodes:16,tag:'NEW'}
];
const grid=document.getElementById('dramaGrid');
if(grid){
 grid.innerHTML=dramas.map(d=>`<article class="card"><div class="poster"><div><small>${d.tag}</small><br><b>${d.title}</b></div></div><div class="card-body"><h3>${d.title}</h3><p>${d.genre} · ${d.episodes} episodes</p><a class="primary" href="watch.html?title=${encodeURIComponent(d.title)}">Watch Episode 1</a></div></article>`).join('');
}
const toast=document.getElementById('toast');
function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2800)}
const free=document.getElementById('freeBtn'); if(free) free.addEventListener('click',()=>showToast('Rewarded-ad flow is ready for ad SDK integration.'));
document.querySelectorAll('.subscribe').forEach(btn=>btn.addEventListener('click',()=>showToast(`${btn.dataset.plan} plan selected. Connect your payment provider to complete checkout.`)));
const login=document.getElementById('loginBtn'); if(login) login.addEventListener('click',()=>showToast('Account authentication will be connected in the backend phase.'));
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
