const dramas=[
 {title:'Sa Likod ng Pangako',genre:'Romance • Family',episodes:24,tag:'NEW'},
 {title:'Mahal Kita, Kahit Kailan',genre:'Romance • Drama',episodes:18,tag:'TRENDING'},
 {title:'Ang Huling Lihim',genre:'Mystery • Drama',episodes:30,tag:'HOT'},
 {title:'Bago Maghatinggabi',genre:'Romance • Suspense',episodes:16,tag:'NEW'}
];
const grid=document.getElementById('dramaGrid');
grid.innerHTML=dramas.map((d,i)=>`<article class="card"><div class="poster"><div><small>${d.tag}</small><br><b>${d.title}</b></div></div><div class="card-body"><h3>${d.title}</h3><p>${d.genre} · ${d.episodes} episodes</p><button class="primary play" data-title="${d.title}">Watch Episode 1</button></div></article>`).join('');
const toast=document.getElementById('toast');
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2800)}
document.querySelectorAll('.play').forEach(btn=>btn.addEventListener('click',()=>showToast(`Starting ${btn.dataset.title}. Connect your video backend to stream the episode.`)));
document.getElementById('freeBtn').addEventListener('click',()=>showToast('Rewarded-ad flow is ready for ad SDK integration.'));
document.querySelectorAll('.subscribe').forEach(btn=>btn.addEventListener('click',()=>showToast(`${btn.dataset.plan} plan selected. Connect your payment provider to complete checkout.`)));
document.getElementById('loginBtn').addEventListener('click',()=>showToast('Account authentication will be connected in the next backend phase.'));
