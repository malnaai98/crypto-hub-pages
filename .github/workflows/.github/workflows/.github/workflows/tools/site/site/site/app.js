(function(){
  const btn = document.getElementById('modeBtn')
  const setMode = (light)=>{ document.documentElement.classList.toggle('light', !!light); btn.textContent = light ? 'Dark mode' : 'Light mode' }
  setMode(false); btn.addEventListener('click', ()=> setMode(!document.documentElement.classList.contains('light')))
  document.getElementById('year').textContent = new Date().getFullYear()

  async function load(){
    try{
      const r = await fetch('./feed.json', { cache:'no-store' })
      const j = await r.json()
      const ts = j.updatedAt ? Math.max(0, Math.floor((Date.now() - j.updatedAt)/1000)) : null
      document.getElementById('fresh').textContent = ts==null ? '—' : `Updated ${ts}s ago`
      const list = document.getElementById('whaleList'); list.innerHTML = ''
      ;(j.items||[]).slice(0,8).forEach(w => {
        const tx = w.whale||{}; const chain = (tx.chain||'eth').toLowerCase()
        const base = chain==='arb'?'https://arbiscan.io/tx/':chain==='bsc'?'https://bscscan.com/tx/':'https://etherscan.io/tx/'
        const url = tx.hash ? (base+tx.hash) : null
        const usd = tx.amountUsd, pc = tx.percentCirc
        const li = document.createElement('li'); li.className='row'; li.style.alignItems='flex-start'; li.style.gap='.75rem'
        li.innerHTML = `
          <div style="min-width:0">
            <div style="font-size:.95rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${tx.tokenSymbol||'Asset'} ${tx.amountDecimal?`· ${tx.amountDecimal}`:''} ${usd?`· $${Number(usd).toLocaleString()}`:''}
            </div>
            <div class="muted">${tx.counterparty?`${tx.counterparty} · `:''}${chain.toUpperCase()}${pc!=null?` · ${pc.toFixed(2)}% circ`:''}</div>
            ${url?`<a class="underline" href="${url}" target="_blank" rel="noreferrer">View on explorer ↗</a>`:''}
          </div>
          <div class="badge" style="font-size:12px">${(tx.hash||'').slice(0,10)}…</div>
        `
        list.appendChild(li)
      })
    }catch(e){ document.getElementById('fresh').textContent = 'feed missing' }
  }
  load(); setInterval(load, 10000)
})();
