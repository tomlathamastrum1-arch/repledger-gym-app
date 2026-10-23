
/* RepLedger — Exercise Quality Library
   Uses RepDB free-tier illustrations with attribution.
   Does not misrepresent still images as animations.
*/
(() => {
"use strict";

const API = "https://exercise-dataset.com/exercises.json";
const BASE = "https://exercise-dataset.com/";
const STORAGE = "repledger-quality-media-v1";

const aliases = {
  "barbell bench press": "bench-press",
  "barbell back squat": "barbell-back-squat",
  "deadlift": "barbell-deadlift",
  "dumbbell curl": "bicep-curl",
  "dumbbell biceps curl": "bicep-curl",
  "lat pulldown": "lat-pulldown"
};

const normalize = text => String(text || "")
  .toLowerCase()
  .normalize("NFKD")
  .replace(/\b(db|d-b)\b/g, "dumbbell")
  .replace(/\bbiceps\b/g, "bicep")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const escapeHTML = text => String(text || "")
  .replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

const catalog = {
  byName: new Map(),
  byId: new Map(),
  status: "loading"
};

let videos = {};
try {
  videos = JSON.parse(localStorage.getItem(STORAGE) || "{}");
} catch {}
if (!videos || typeof videos !== "object" ||
    Array.isArray(videos)) videos = {};

function imageURL(path) {
  if (typeof path !== "string") return "";
  if (!/^images\/flat\/[a-z0-9/-]+\.webp$/i.test(path))
    return "";
  return BASE + path;
}

function findExercise(name) {
  const normalized = normalize(name);
  const id = aliases[normalized];
  if (id && catalog.byId.has(id))
    return catalog.byId.get(id);

  return catalog.byName.get(normalized) ||
    catalog.byId.get(normalized.replace(/ /g, "-")) ||
    null;
}

function validVideo(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" &&
      !["localhost", "127.0.0.1"].includes(u.hostname) &&
      !u.username && !u.password;
  } catch {
    return false;
  }
}

function figure(src, label) {
  if (!src) return "";
  return `<figure class="quality-figure">
    <img src="${escapeHTML(src)}"
         alt="${escapeHTML(label)}"
         loading="lazy">
    <figcaption>${escapeHTML(label)}</figcaption>
  </figure>`;
}

function demonstration(name) {
  const ex = findExercise(name);
  const images = ex?.images?.flat || {};
  const positions = [
    images.start,
    images.peak,
    images.main
  ].map(imageURL).filter(Boolean);

  const clip = videos[name];
  const hasVideo = validVideo(clip);

  const instructions = Array.isArray(ex?.instructions_en)
    ? ex.instructions_en : [];
  const tips = Array.isArray(ex?.tips_en)
    ? ex.tips_en : [];

  let visual = "";

  if (hasVideo) {
    visual = `
      <video class="quality-video" controls muted
        playsinline loop preload="metadata"
        src="${escapeHTML(clip)}"></video>
      <p class="quality-note">
        User-supplied video. Verify its license and
        exercise technique.
      </p>`;
  } else if (positions.length) {
    visual = `
      <div class="quality-poses">
        ${positions.map((src, index) =>
          figure(src,
            positions.length === 1
              ? "Exercise position"
              : index === 0
                ? "Start position"
                : "Peak position")
        ).join("")}
      </div>
      <p class="quality-note">
        These are exercise illustrations, not motion
        animations. The movement between positions
        is not shown.
      </p>`;
  } else {
    visual = `<div class="quality-empty">
      ${catalog.status === "loading"
        ? "Loading exercise illustrations..."
        : catalog.status === "error"
          ? "Illustration service unavailable. Check your connection."
          : "No verified illustration is matched to this exercise yet."}
    </div>`;
  }

  return `
    <section class="quality-panel">
      <div class="quality-header">
        <div>
          <small>EXERCISE STUDIO</small>
          <h3>${escapeHTML(name)}</h3>
        </div>
        <span class="quality-badge">
          ${hasVideo ? "VIDEO" : "ILLUSTRATIONS"}
        </span>
      </div>

      ${visual}

      ${ex ? `<p class="quality-note">
        ${escapeHTML(ex.equipment || "Bodyweight")}
        · ${escapeHTML(ex.body_part || "")}
      </p>` : ""}

      ${instructions.length ? `
        <h4>How to perform it</h4>
        <ol>${instructions.slice(0, 8)
          .map(text => `<li>${escapeHTML(text)}</li>`)
          .join("")}</ol>
      ` : ""}

      ${tips.length ? `
        <h4>Technique tips</h4>
        <ul>${tips.slice(0, 5)
          .map(text => `<li>${escapeHTML(text)}</li>`)
          .join("")}</ul>
      ` : ""}

      <details>
        <summary>Add a licensed exercise video</summary>
        <p class="quality-note">
          Paste a direct HTTPS video URL that you
          own or have permission to use.
        </p>
        <input type="url" id="qualityVideoURL"
          placeholder="https://example.com/exercise.mp4"
          value="${escapeHTML(hasVideo ? clip : "")}">
        <div class="quality-actions">
          <button data-quality="save">Save video</button>
          <button class="alt" data-quality="clear">
            Clear
          </button>
        </div>
      </details>

      <p class="quality-note">
        Exercise illustrations and details by
        <a href="https://repdb.co/"
           target="_blank" rel="noopener noreferrer">
          RepDB
        </a>.
        <a href="https://repdb.co/preview/"
           target="_blank" rel="noopener noreferrer">
          Browse licensed animation previews
        </a>.
      </p>
    </section>`;
}

function improveThumbnails() {
  document.querySelectorAll(
    'button[data-a="detail"][data-n]'
  ).forEach(button => {
    let name;
    try {
      name = decodeURIComponent(button.dataset.n);
    } catch {
      return;
    }

    const ex = findExercise(name);
    const frames = ex?.images?.flat || {};
    const url = imageURL(
      frames.start || frames.main || frames.peak
    );

    if (!url) return;

    const holder = button.closest(".exercise")
      ?.querySelector(".thumb");

    if (holder && holder.dataset.qualityName !== name) {
      holder.innerHTML = `
        <img src="${escapeHTML(url)}"
             alt="${escapeHTML(name)}"
             loading="lazy">`;
      holder.dataset.qualityName = name;
    }
  });
}

function coverage() {
  const search = document.getElementById("query");
  if (!search || typeof listing !== "function") return;

  const all = listing();
  const matched = all.filter(x =>
    !!findExercise(x.name)
  ).length;

  const linked = all.filter(x =>
    validVideo(videos[x.name])
  ).length;

  let box = document.getElementById("qualityCoverage");
  if (!box) {
    box = document.createElement("p");
    box.id = "qualityCoverage";
    box.className = "quality-note";
    search.parentNode.insertBefore(box, search);
  }

  box.textContent = catalog.status === "loading"
    ? "Checking licensed exercise illustrations..."
    : catalog.status === "error"
      ? "Exercise catalog could not load."
      : `${matched} of ${all.length} exercises matched to illustrations · ${linked} linked videos`;
}

function enhance() {
  if (typeof msStop === "function") msStop();

  document.querySelectorAll(".ms-card")
    .forEach(node => node.remove());

  if (typeof tab === "string" &&
      tab === "exercises" &&
      typeof detail === "string" &&
      detail) {
    const back = document.querySelector(
      'button[data-a="back"]'
    );

    if (back) {
      back.insertAdjacentHTML(
        "afterend",
        demonstration(detail)
      );
    }
  }

  coverage();
  improveThumbnails();
}

if (typeof draw === "function") {
  const previousDraw = draw;
  draw = function() {
    previousDraw();
    enhance();
  };
}

const style = document.createElement("style");
style.textContent = `
.quality-panel {
  background:var(--card,#fff);
  border:1px solid var(--border,#ddd);
  border-radius:18px;
  padding:17px;
  margin:14px 0;
}
.quality-header {
  display:flex;
  justify-content:space-between;
  align-items:start;
  gap:10px;
  margin-bottom:15px;
}
.quality-header small {
  font-size:10px;
  letter-spacing:1px;
  color:var(--muted,#666);
}
.quality-header h3 {
  margin:6px 0;
  font-size:20px;
}
.quality-badge {
  color:var(--accent,#2563eb);
  border:1px solid var(--accent,#2563eb);
  padding:6px;
  border-radius:8px;
  font-size:10px;
  font-weight:700;
}
.quality-poses {
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:10px;
}
.quality-figure {
  margin:0;
  background:#f4f7fb;
  border-radius:12px;
  overflow:hidden;
}
.quality-figure:only-child {
  grid-column:1/-1;
  max-width:320px;
}
.quality-figure img {
  display:block;
  width:100%;
  aspect-ratio:1;
  object-fit:contain;
}
.quality-figure figcaption {
  color:#536277;
  text-align:center;
  font-size:12px;
  padding:8px;
}
.quality-video {
  width:100%;
  max-height:380px;
  background:#111;
  border-radius:12px;
}
.quality-note {
  font-size:12px;
  line-height:1.5;
  color:var(--muted,#64748b);
}
.quality-note a {
  color:var(--accent,#2563eb);
}
.quality-empty {
  padding:25px;
  text-align:center;
  background:var(--soft,#eee);
  border-radius:12px;
  font-size:13px;
}
.quality-panel h4 {
  margin:17px 0 6px;
}
.quality-panel li {
  padding:4px 0;
  font-size:14px;
}
.quality-panel details {
  margin-top:18px;
  padding:12px 0;
  border-top:1px solid var(--border,#ddd);
}
.quality-panel summary {
  cursor:pointer;
  font-weight:600;
  font-size:13px;
}
.quality-panel input {
  width:100%;
  margin:8px 0;
}
.quality-actions {
  display:flex;
  gap:8px;
}
.exercise .thumb img {
  width:100%;
  height:100%;
  object-fit:cover;
  border-radius:10px;
}
`;
document.head.appendChild(style);

document.addEventListener("click", event => {
  const button = event.target.closest(
    "button[data-quality]"
  );
  if (!button || !detail) return;

  if (button.dataset.quality === "clear") {
    delete videos[detail];
  } else {
    const url = document.getElementById(
      "qualityVideoURL"
    )?.value?.trim();

    if (!validVideo(url)) {
      alert("Enter a valid HTTPS video URL you have rights to use.");
      return;
    }

    videos[detail] = url;
  }

  try {
    localStorage.setItem(
      STORAGE,
      JSON.stringify(videos)
    );
  } catch {}

  draw();
});

async function loadCatalog() {
  try {
    let data = null;

    const sources = [
      API,
      "https://cdn.jsdelivr.net/gh/RepDB/exercise-dataset@main/exercises.json"
    ];

    for (const url of sources) {
      try {
        const response = await fetch(url, {
          mode:"cors",
          cache:"force-cache"
        });

        if (response.ok) {
          data = await response.json();
          break;
        }
      } catch {}
    }

    if (!data || !Array.isArray(data.exercises)) {
      throw new Error("Exercise catalog unavailable");
    }

    const counts = new Map();

    for (const ex of data.exercises) {
      const key = normalize(ex.name_en);
      counts.set(key, (counts.get(key) || 0) + 1);

      if (ex.id) catalog.byId.set(ex.id, ex);
    }

    for (const ex of data.exercises) {
      const key = normalize(ex.name_en);
      if (counts.get(key) === 1) {
        catalog.byName.set(key, ex);
      }
    }

    catalog.status = "ready";
  } catch (error) {
    catalog.status = "error";
    console.warn(error);
  }

  if (typeof draw === "function") draw();
}

loadCatalog();
if (typeof draw === "function") draw();
})();
