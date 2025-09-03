async function load(){
  try{
    const r=await fetch('./feed.json',{cache:'no-store'});
    const j=await r.json();
    const ts=j.updatedAt?Math.floor((Date.now()-j.updatedAt)/1000):null;
    document.getElementById('fresh').textContent=ts==null?'—':('Updated '+ts+'s ago');

    const list=document.getElementById('list'); list.innerHTML='';
    (j.items||[]).forEach(w=>{
      const tx=w.whale||{},chain=(tx.chain||'eth').toLowerCase();
      const base=chain==='arb'?'https://arbiscan.io/tx/':chain==='bsc'?'https://bscscan.com/tx/':'https://etherscan.io/tx/';
      const url=tx.hash?base+tx.hash:null;

      const div=document.createElement('div'); div.className='card';
      div.innerHTML =
        '<div class="row"><div>'+
          '<div style="font-weight:600">'+(tx.tokenSymbol||'Asset')+
          (tx.amountDecimal!=null?(' · '+tx.amountDecimal):'')+
          (tx.amountUsd!=null?(' · $'+Number(tx.amountUsd).toLocaleString()):'')+
          '</div>'+
          '<div class="muted">'+
          (tx.counterparty?tx.counterparty+' · ':'')+chain.toUpperCase()+
          (tx.percentCirc!=null?(' · '+Number(tx.percentCirc).toFixed(3)+'% circ'):'')+
          '</div>'+
          (url?('<a href="'+url+'" target="_blank" rel="noreferrer">View on explorer ↗</a>'):'')+
        '</div>'+
        '<div class="badge">'+(tx.hash||'').slice(0,10)+'…</div></div>';
      list.appendChild(div);
    });
  }catch(e){
    document.getElementById('fresh').textContent='feed missing';
  }
}
load();
