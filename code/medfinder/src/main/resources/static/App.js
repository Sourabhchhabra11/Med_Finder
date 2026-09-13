/* ============================================================
   MedFinder — front-end logic
   ------------------------------------------------------------
   This file expects to be served BY the Spring Boot app itself
   (drop it in src/main/resources/static/) so relative fetches
   like "/api/search" hit the same origin — no CORS setup needed.

   FIELD MAPPING — adjust this if your /api/search JSON differs
   ------------------------------------------------------------
   This assumes each result item looks roughly like:
   {
     id: 1,
     medicine:  { id, name, description },
     pharmacy:  { id, name, location, latitude, longitude },
     price: 25.0,
     quantity: 50,
     lastUpdated: "Just now"
   }
   If your Inventory DTO serializes differently (e.g. flat fields
   like pharmacyName / lat / lng), edit the small `mapItem()`
   function below — everything else stays the same.
   ============================================================ */

const CONFIG = {
  searchEndpoint: (medicine) => `/api/search?medicine=${encodeURIComponent(medicine)}`,
  pharmacyEndpoint: '/api/pharmacy',
  // Fallback "you are here" point — central Ludhiana — used until/unless
  // the browser grants real geolocation.
  fallbackUser: { lat: 30.9000, lng: 75.8410 },
};

/* ---------- small utilities ---------- */

function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function stockInfo(quantity) {
  if (quantity <= 0) return { key: 'out', label: 'Out of stock' };
  if (quantity <= 10) return { key: 'low', label: `Low stock · ${quantity} left` };
  return { key: 'in', label: `In stock · ${quantity} left` };
}

/** Normalizes one raw API item into the shape the renderer expects.
 *  Edit this if your backend's JSON field names differ. */
function mapItem(raw) {
  const medicine = raw.medicine ?? { name: raw.medicineName };
  const pharmacy = raw.pharmacy ?? {
    name: raw.pharmacyName,
    location: raw.location,
    latitude: raw.latitude,
    longitude: raw.longitude,
  };
  return {
    id: raw.id,
    medicineName: medicine?.name ?? 'Medicine',
    pharmacyName: pharmacy?.name ?? 'Pharmacy',
    location: pharmacy?.location ?? '',
    lat: Number(pharmacy?.latitude),
    lng: Number(pharmacy?.longitude),
    price: raw.price,
    quantity: raw.quantity,
    lastUpdated: raw.lastUpdated,
  };
}

/* ---------- DOM refs ---------- */

const form = document.getElementById('search-form');
const input = document.getElementById('medicine-input');
const searchBtn = document.getElementById('search-btn');
const resultsSection = document.getElementById('results-section');
const resultsTitle = document.getElementById('results-title');
const resultsMeta = document.getElementById('results-meta');
const resultsList = document.getElementById('results-list');
const statusSection = document.getElementById('status-section');
const statusCard = document.getElementById('status-card');

/* ---------- status states ---------- */

function showStatus(title, message) {
  resultsSection.hidden = true;
  statusSection.hidden = false;
  statusCard.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
}

function hideStatus() {
  statusSection.hidden = true;
}

/* ---------- rendering ---------- */

function renderResults(medicineQuery, items, userPoint) {
  hideStatus();

  if (items.length === 0) {
    showStatus(
      `No stock found for "${medicineQuery}"`,
      "None of our verified pharmacies currently have this in stock. Try a nearby generic name, or check back shortly — inventory updates live."
    );
    return;
  }

  const withDistance = items
    .map((item) => {
      const distanceKm =
        Number.isFinite(item.lat) && Number.isFinite(item.lng)
          ? haversineKm(userPoint, { lat: item.lat, lng: item.lng })
          : null;
      return { ...item, distanceKm };
    })
    .sort((a, b) => {
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });

  resultsTitle.textContent = `Results for "${medicineQuery}"`;
  resultsMeta.textContent = `${withDistance.length} pharmac${withDistance.length === 1 ? 'y has' : 'ies have'} it near you, nearest first`;

  resultsList.innerHTML = '';
  withDistance.forEach((item) => resultsList.appendChild(buildCard(item)));

  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildCard(item) {
  const stock = stockInfo(item.quantity);
  const card = document.createElement('article');
  card.className = 'result-card';

  const distanceLabel =
    item.distanceKm !== null ? `${item.distanceKm.toFixed(1)} km` : '—';
  const priceLabel =
    typeof item.price === 'number' ? `₹${item.price.toFixed(0)}` : '—';

  card.innerHTML = `
    <div class="result-pharmacy">
      <h3>${item.pharmacyName}</h3>
      <p>${item.location || ''}</p>
    </div>
    <div class="result-stat">
      <span class="label">Price</span>
      <span class="value">${priceLabel}</span>
    </div>
    <div class="result-stat">
      <span class="label">Distance</span>
      <span class="value">${distanceLabel}</span>
    </div>
    <div>
      <span class="stock-flag stock-${stock.key}"><i class="dot"></i>${stock.label}</span>
    </div>
  `;

  const actionCell = document.createElement('div');
  const reserveBtn = document.createElement('button');
  reserveBtn.className = 'btn-reserve';
  reserveBtn.textContent = stock.key === 'out' ? 'Notify me' : 'Reserve';
  if (stock.key === 'out') {
    reserveBtn.addEventListener('click', () => {
      reserveBtn.textContent = "We'll notify you";
      reserveBtn.disabled = true;
    });
  } else {
    reserveBtn.addEventListener('click', () => handleReserve(item, reserveBtn));
  }
  actionCell.appendChild(reserveBtn);
  card.appendChild(actionCell);

  return card;
}

/** Reserve is not wired to a backend endpoint yet (none exists in the
 *  current API). This gives a real interaction for the demo now, and
 *  is the one line to change once you add POST /api/reserve. */
function handleReserve(item, button) {
  button.disabled = true;
  button.textContent = 'Reserving…';

  // TODO: replace with a real call once the endpoint exists, e.g.
  // fetch('/api/reserve', { method: 'POST', headers: {...}, body: JSON.stringify({ inventoryId: item.id }) })

  setTimeout(() => {
    button.textContent = 'Reserved ✓';
    button.classList.add('is-reserved');
  }, 500);
}

/* ---------- search flow ---------- */

async function runSearch(medicineQuery) {
  showStatus('Searching nearby pharmacies…', `Checking live stock for "${medicineQuery}".`);
  searchBtn.disabled = true;

  const userPoint = await getUserPoint();

  try {
    const res = await fetch(CONFIG.searchEndpoint(medicineQuery));
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const raw = await res.json();
    const items = Array.isArray(raw) ? raw.map(mapItem) : [];
    renderResults(medicineQuery, items, userPoint);
  } catch (err) {
    showStatus(
      "Couldn't reach the MedFinder backend",
      `Make sure Spring Boot is running and serving this page from the same origin. (${err.message})`
    );
  } finally {
    searchBtn.disabled = false;
  }
}

function getUserPoint() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(CONFIG.fallbackUser);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(CONFIG.fallbackUser),
      { timeout: 2500 }
    );
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) runSearch(query);
});

/* ---------- pharmacy count (real data, falls back quietly) ---------- */

fetch(CONFIG.pharmacyEndpoint)
  .then((res) => (res.ok ? res.json() : []))
  .then((list) => {
    if (Array.isArray(list) && list.length > 0) {
      document.getElementById('pharmacy-count').textContent = list.length;
    }
  })
  .catch(() => {});

/* ---------- hero capsule 3D parallax (single orchestrated moment) ---------- */

const stage = document.getElementById('capsule-stage');
const visual = document.getElementById('hero-visual');

if (stage && visual && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  visual.addEventListener('pointermove', (e) => {
    const rect = visual.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    stage.style.transform = `rotateX(${8 - py * 16}deg) rotateY(${-14 + px * 24}deg)`;
  });
  visual.addEventListener('pointerleave', () => {
    stage.style.transform = 'rotateX(8deg) rotateY(-14deg)';
  });
}