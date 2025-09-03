import { mkdir, writeFile, cp } from 'fs/promises'
import { join } from 'path'

const dist = join(process.cwd(), 'dist')
await mkdir(dist, { recursive: true })
await cp('site', dist, { recursive: true })

// Demo whales (zero external APIs — stays 100% free)
const whales = [
  { id:'w:demo1', kind:'WHALE',
    whale:{ chain:'eth', hash:'0xabc123...', tokenSymbol:'ETH', amountDecimal:1500, amountUsd:3600000, percentCirc:0.00075, counterparty:'Binance Hot Wallet' } },
  { id:'w:demo2', kind:'WHALE',
    whale:{ chain:'arb', hash:'0xdef456...', tokenSymbol:'USDT', amountDecimal:20000000, amountUsd:20000000, percentCirc:0.01, counterparty:'Kraken' } },
  { id:'w:demo3', kind:'WHALE',
    whale:{ chain:'bsc', hash:'0xghi789...', tokenSymbol:'BNB', amountDecimal:50000, amountUsd:12000000, percentCirc:0.003, counterparty:'OKX' } },
]

const payload = { items: whales, updatedAt: Date.now() }
await writeFile(join(dist, 'feed.json'), JSON.stringify(payload, null, 2))
console.log('Built dist with feed.json at', new Date().toISOString())
