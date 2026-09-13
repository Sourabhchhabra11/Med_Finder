document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  /* ---------- Fade-in on scroll ---------- */
  const fadeEls = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeEls.forEach((el) => observer.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Hero capsule 3D parallax ---------- */
  const stage = document.getElementById("capsuleStage");
  const visual = document.getElementById("heroVisual");
  if (stage && visual && matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    visual.addEventListener("pointermove", (e) => {
      const rect = visual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      stage.style.transform = `rotateX(${8 - py * 16}deg) rotateY(${-14 + px * 24}deg)`;
    });
    visual.addEventListener("pointerleave", () => {
      stage.style.transform = "rotateX(8deg) rotateY(-14deg)";
    });
  }

  /* ---------- Live demo search (mock data mirroring the seeded backend) ---------- */
  const DEMO_DATA = {
    paracetamol: [
      { pharmacy: "Apollo Pharmacy", location: "Model Town", price: 25, distance: "1.2 km", quantity: 50 },
      { pharmacy: "MedPlus", location: "Ferozepur Road", price: 22, distance: "2.8 km", quantity: 8 },
      { pharmacy: "City Care Pharmacy", location: "Sarabha Nagar", price: 20, distance: "3.5 km", quantity: 0 },
    ],
    ibuprofen: [
      { pharmacy: "Apollo Pharmacy", location: "Model Town", price: 40, distance: "1.2 km", quantity: 25 },
    ],
  };

  function stockInfo(qty) {
    if (qty <= 0) return { key: "out", label: "Out of stock" };
    if (qty <= 10) return { key: "low", label: `Low stock \u00B7 ${qty} left` };
    return { key: "in", label: `In stock \u00B7 ${qty} left` };
  }

  function renderDemo(query) {
    const results = document.getElementById("demoResults");
    const key = query.trim().toLowerCase();
    const rows = DEMO_DATA[key];

    if (!rows) {
      results.innerHTML = `<p class="demo-empty">No demo data for "${escapeHtml(query)}" \u2014 try "Paracetamol" or "Ibuprofen".</p>`;
      return;
    }

    results.innerHTML = "";
    rows.forEach((r) => {
      const stock = stockInfo(r.quantity);
      const row = document.createElement("div");
      row.className = "demo-row";
      row.innerHTML = `
        <div class="demo-row-pharmacy">
          <h4>${r.pharmacy}</h4>
          <p>${r.location}</p>
        </div>
        <div class="demo-stat"><span class="label">Price</span><span class="value">\u20B9${r.price}</span></div>
        <div class="demo-stat"><span class="label">Distance</span><span class="value">${r.distance}</span></div>
        <div><span class="demo-flag flag-${stock.key}"><i class="dot"></i>${stock.label}</span></div>
      `;
      const actionCell = document.createElement("div");
      const btn = document.createElement("button");
      btn.className = "demo-reserve";
      btn.textContent = stock.key === "out" ? "Notify me" : "Reserve";
      if (stock.key === "out") {
        btn.addEventListener("click", () => {
          btn.textContent = "We'll notify you";
          btn.disabled = true;
        });
      } else {
        btn.addEventListener("click", () => {
          btn.disabled = true;
          btn.textContent = "Reserving\u2026";
          setTimeout(() => {
            btn.textContent = "Reserved \u2713";
            btn.classList.add("is-reserved");
          }, 450);
        });
      }
      actionCell.appendChild(btn);
      row.appendChild(actionCell);
      results.appendChild(row);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  const demoForm = document.getElementById("demoForm");
  const demoInput = document.getElementById("demoInput");
  if (demoForm && demoInput) {
    demoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      renderDemo(demoInput.value);
    });
    renderDemo(demoInput.value); // seed initial results on load
  }
});
