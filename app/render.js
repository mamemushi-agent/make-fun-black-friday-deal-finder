// render.js — turns deals into HTML: cards for the grid, a detail page for
// one deal, and the little pieces (badges, price blocks) both share.

import { VERDICTS } from './deals.js';
import { discountPct, savings, sameProduct } from './filters.js';

export function money(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// A CSS monogram tile stands in for a product photo: the site ships no
// images at all, so nothing it shows is borrowed from a store or a brand.
const CATEGORY_HUES = {
  'Audio': '#7c5cd6',
  'TVs & Streaming': '#2563eb',
  'Laptops & Computers': '#0e7490',
  'Phones, Tablets & Wearables': '#db2777',
  'Gaming': '#16a34a',
  'Smart Home': '#d97706',
  'Kitchen & Home': '#b45309',
};

export function tileFor(deal, big) {
  const words = deal.product.replace(/\(.*?\)/g, '').split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));
  const initials = words.slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const hue = CATEGORY_HUES[deal.category] || '#475569';
  return `<div class="tile${big ? ' tile-big' : ''}" style="--tile:${hue}" aria-hidden="true"><span>${esc(initials)}</span></div>`;
}

export function verdictBadge(deal) {
  const v = VERDICTS[deal.verdict];
  return `<span class="badge badge-${deal.verdict}" title="${esc(v.hint)}">${esc(v.label)}</span>`;
}

export function priceBlock(deal) {
  return `<div class="prices">
    <span class="sale">${money(deal.sale)}</span>
    <span class="usual">${money(deal.usual)}</span>
    <span class="off">${discountPct(deal)}% off · save ${money(savings(deal))}</span>
  </div>`;
}

export function storeLink(deal, label) {
  const text = label || (deal.linkKind === 'product' ? `See it at ${deal.store}` : `Search ${deal.store} for this deal`);
  return `<a class="store-link" href="${esc(deal.url)}" target="_blank" rel="noopener">${esc(text)} →</a>`;
}

export function dealCard(deal, isBest) {
  return `<article class="card">
    ${tileFor(deal)}
    <div class="card-body">
      <div class="card-top">${verdictBadge(deal)}${isBest ? '<span class="best-tag">Lowest across stores</span>' : ''}</div>
      <h3><a href="#/deal/${esc(deal.id)}">${esc(deal.product)}</a></h3>
      <p class="store-line">at <strong>${esc(deal.store)}</strong> · ${esc(deal.category)}</p>
      ${priceBlock(deal)}
      <p class="evidence">${esc(deal.evidence)}</p>
      <p class="checked">Checked ${esc(deal.checked)} · Source: ${esc(deal.source)}</p>
      <div class="card-actions">
        ${storeLink(deal)}
        <a class="details-link" href="#/deal/${esc(deal.id)}">Details</a>
      </div>
    </div>
  </article>`;
}

export function compareTable(deals, current) {
  const rows = [...deals].sort((a, b) => a.sale - b.sale).map((d) => `
    <tr${d.id === current.id ? ' class="current"' : ''}>
      <td>${esc(d.store)}${d.id === current.id ? ' (this one)' : ''}</td>
      <td>${money(d.sale)}</td>
      <td>${money(d.usual)}</td>
      <td>${discountPct(d)}% off</td>
      <td>${esc(VERDICTS[d.verdict].label)}</td>
      <td>${storeLink(d, 'Open')}</td>
    </tr>`).join('');
  return `<table class="compare">
    <thead><tr><th>Store</th><th>Sale price</th><th>Usual price</th><th>Discount</th><th>Our verdict</th><th></th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export function detailPage(deals, deal) {
  const siblings = sameProduct(deals, deal);
  const compare = siblings.length > 1
    ? `<section class="compare-block"><h2>Same product, other stores</h2>${compareTable(siblings, deal)}</section>`
    : '';
  return `<article class="detail">
    <p class="back"><a href="#/">← All deals</a></p>
    <div class="detail-head">
      ${tileFor(deal, true)}
      <div>
        ${verdictBadge(deal)}
        <h1>${esc(deal.product)}</h1>
        <p class="store-line">at <strong>${esc(deal.store)}</strong> · ${esc(deal.category)}</p>
        ${priceBlock(deal)}
      </div>
    </div>
    <p class="blurb">${esc(deal.blurb)}</p>
    <section class="verdict-block">
      <h2>Is it really a deal?</h2>
      <p><strong>${esc(VERDICTS[deal.verdict].label)}.</strong> ${esc(VERDICTS[deal.verdict].hint)}</p>
      <p>${esc(deal.evidence)}</p>
    </section>
    ${compare}
    <section class="receipt">
      <h2>How this price was checked</h2>
      <ul>
        <li>Price read from: <strong>${esc(deal.source)}</strong></li>
        <li>Checked on: <strong>${esc(deal.checked)}</strong> (Black Friday week, 2026)</li>
        <li>Link: ${deal.linkKind === 'product' ? 'the store\u2019s own product page' : 'the store\u2019s own search page for this product'}</li>
      </ul>
      ${storeLink(deal)}
      <p class="fineprint">Prices move fast on Black Friday. The price at checkout is the one that counts — if it has changed, the verdict on this page may have changed with it.</p>
    </section>
  </article>`;
}
