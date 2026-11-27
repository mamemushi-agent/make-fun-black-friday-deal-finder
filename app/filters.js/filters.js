// filters.js — search, filtering and sorting over the deal list.
// Pure functions over plain deal objects; no DOM in here.

export function discountPct(deal) {
  if (!deal.usual || deal.usual <= 0) return 0;
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

export function savings(deal) {
  return Math.max(0, deal.usual - deal.sale);
}

export function categoriesOf(deals) {
  return [...new Set(deals.map((d) => d.category))];
}

export function storesOf(deals) {
  return [...new Set(deals.map((d) => d.store))].sort();
}

// state: { query, category, store, minDiscount, sort }
// sort: 'verdict' | 'discount' | 'savings' | 'priceAsc' | 'priceDesc'
const VERDICT_RANK = { lowest: 0, strong: 1, fair: 2, routine: 3, inflated: 4 };

export function applyFilters(deals, state) {
  const q = (state.query || '').trim().toLowerCase();
  const out = deals.filter((deal) => {
    if (state.category && state.category !== 'All' && deal.category !== state.category) return false;
    if (state.store && state.store !== 'All' && deal.store !== state.store) return false;
    if (state.minDiscount && discountPct(deal) < state.minDiscount) return false;
    if (q) {
      const hay = `${deal.product} ${deal.store} ${deal.category} ${deal.blurb}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const by = {
    verdict: (a, b) => (VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict]) || (discountPct(b) - discountPct(a)),
    discount: (a, b) => discountPct(b) - discountPct(a),
    savings: (a, b) => savings(b) - savings(a),
    priceAsc: (a, b) => a.sale - b.sale,
    priceDesc: (a, b) => b.sale - a.sale,
  }[state.sort || 'verdict'];
  return out.sort(by);
}

export function sameProduct(deals, deal) {
  return deals.filter((d) => d.group === deal.group);
}

export function bestPriceOf(deals, deal) {
  return Math.min(...sameProduct(deals, deal).map((d) => d.sale));
}

export function statsOf(deals) {
  const totalSavings = deals.reduce((sum, d) => sum + savings(d), 0);
  const avgDiscount = deals.length
    ? Math.round(deals.reduce((sum, d) => sum + discountPct(d), 0) / deals.length)
    : 0;
  const lows = deals.filter((d) => d.verdict === 'lowest').length;
  return { count: deals.length, totalSavings, avgDiscount, lows };
}
