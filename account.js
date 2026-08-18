const FAV='tagalogdrama.favorites',PROG='tagalogdrama.progress';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch{return {}}};
const fav=read(FAV),prog=read(PROG);
document.getElementById('favCount').textContent=Array.isArray(fav)?fav.length:0;
document.getElementById('progressCount').textContent=Object.keys(prog).filter(k=>Number(prog[k])>0).length;
document.getElementById('clearLocal').onclick=()=>{if(confirm('Clear favorites and watch progress on this device?')){localStorage.removeItem(FAV);localStorage.removeItem(PROG);location.reload()}};

const planName=document.getElementById('planName');
const details=document.getElementById('subscriptionDetails');
const message=document.getElementById('accountMessage');
const subscribeLink=document.getElementById('subscribeLink');

function formatPlan(plan){return String(plan||'free').toUpperCase();}
function formatDate(value){if(!value)return '';const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toLocaleString();}

async function loadAccount(){
  const base=window.TAGALOGDRAMA_API||'';
  const token=localStorage.getItem('tagalogdrama.token');
  if(!token){message.textContent='Sign in to view your live subscription status. Your local library remains available on this device.';planName.textContent='FREE';details.textContent='No active subscription is connected to this browser session.';return;}
  if(!base){message.textContent='The account service is not configured yet.';details.textContent='Your local library is still available.';return;}
  try{
    const meResponse=await fetch(`${base}/me`,{headers:{Authorization:`Bearer ${token}`}});
    if(!meResponse.ok)throw new Error('Your session has expired. Please sign in again.');
    const me=await meResponse.json();
    if(me?.user?.email)document.getElementById('greeting').textContent=`Welcome, ${me.user.email}`;

    const response=await fetch(`${base}/me/subscription`,{headers:{Authorization:`Bearer ${token}`}});
    const body=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(body.error||'Unable to load subscription status.');

    planName.textContent=formatPlan(body.plan);
    if(body.active){
      message.textContent='Your premium subscription is active.';
      const expires=formatDate(body.expiresAt);
      details.textContent=`${formatPlan(body.plan)} plan${expires?` · Active until ${expires}`:''}`;
      subscribeLink.textContent='Change or Extend Plan';
    }else{
      message.textContent='You currently have free access.';
      details.textContent='Watch eligible free episodes with verified rewarded ads, or subscribe for premium episodes.';
      subscribeLink.textContent='Upgrade to Premium';
    }
  }catch(error){
    message.textContent=error.message||'Unable to load account status.';
    details.textContent='Your local favorites and watch progress are still available on this device.';
  }
}

loadAccount();
