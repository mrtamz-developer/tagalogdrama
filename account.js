const FAV='tagalogdrama.favorites', PROG='tagalogdrama.progress';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch{return {}}};
const fav=read(FAV), prog=read(PROG);
document.getElementById('favCount').textContent=Array.isArray(fav)?fav.length:0;
document.getElementById('progressCount').textContent=Object.keys(prog).filter(k=>Number(prog[k])>0).length;
document.getElementById('clearLocal').onclick=()=>{if(confirm('Clear favorites and watch progress on this device?')){localStorage.removeItem(FAV);localStorage.removeItem(PROG);location.reload()}};
