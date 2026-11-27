// main.js — wires the page together: filter state, the grid, and the
// hash router (#/ for the finder, #/deal/<id> for one deal's page).

import { DEALS, CHECKED_LABEL } from './deals.js';
import { applyFilters, categoriesOf, storesOf, statsOf, bestPriceOf, sameProduct } from './filters.js';
import { dealCard, detailPage, money } from './render.js';

const els = {
  grid: document.querySelector('#grid'),
  detail: document.querySelector('#detail'),
  count: document.querySelector('#result-count'),
  stats: document.querySelector('#stats'),
  search: document.querySelector('#search'),
  category: document.querySelector('#filter-category'),
  store: document.querySelector('#filter-store'),
  discount: document.querySelector('#filter-discount'),
  sort: document.querySelector('#sort'),
  finderSections: document.querySelectorAll('.hero, .controls, .result-count, .how'),
};

function fillSelect(select, values) {
  select.innerHTML = ['All', ...values].map((v) => `<option value="${v}">${v}</option>`).join('');
}
fillSelect(els.category, categoriesOf(DEALS));
fillSelect(els.store, storesOf(DEALS));
document.querySelector('#checked-date').textContent = CHECKED_LABEL;

function currentState() {
  return {
    query: els.search.value,
    category: els.category.value,
    store: els.store.value,
    minDiscount: Number(els.discount.value),
    sort: els.sort.value,
  };
}

function renderStats() {
  const s = statsOf(DEALS);
  els.stats.innerHTML = [
    [`${s.count}`, 'deals checked'],
    [`${money(s.totalSavings)}`, 'total savings vs usual prices'],
    [`${s.avgDiscount}%`, 'average discount'],
    [`${s.lows}`, 'all-time lows found'],
  ].map(([n, label]) => `<div class="stat"><strong>${n}</strong><span>${label}</span></div>`).join('');
}

function renderGrid() {
  const shown = applyFilters(DEALS, currentState());
  els.count.textContent = shown.length === DEALS.length
    ? `Showing all ${shown.length} checked deals.`
    : `Showing ${shown.length} of ${DEALS.length} checked deals.`;
  els.grid.innerHTML = shown.length
    ? shown.map((d) => dealCard(d, sameProduct(DEALS, d).length > 1 && d.sale <= bestPriceOf(DEALS, d))).join('')
    : '<p class="empty">No checked deals match that combination. Loosen a filter — the deals are real, but there are only so many of them.</p>';
}

function showFinder() {
  els.detail.innerHTML = '';
  els.grid.style.display = '';
  for (const s of els.finderSections) s.style.display = '';
  renderGrid();
}

function showDetail(id) {
  const deal = DEALS.find((d) => d.id === id);
  if (!deal) { showFinder(); return; }
  els.grid.style.display = 'none';
  for (const s of els.finderSections) s.style.display = 'none';
  els.detail.innerHTML = detailPage(DEALS, deal);
  window.scrollTo(0, 0);
}

function route() {
  const match = location.hash.match(/^#\/deal\/(.+)$/);
  if (match) showDetail(match[1]);
  else showFinder();
}

for (const el of [els.search, els.category, els.store, els.discount, els.sort]) {
  el.addEventListener('input', renderGrid);
  el.addEventListener('change', renderGrid);
}
window.addEventListener('hashchange', route);

renderStats();
route();
