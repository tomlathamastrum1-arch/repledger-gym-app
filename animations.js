
/* RepLedger Exercise Animations */

const rdPatterns = [
 {key:"bench",label:"Pressing demonstration",re:/bench press|floor press|chest press|squeeze press|hex press/i},
 {key:"squat",label:"Squat demonstration",re:/\bsquat\b|lunge|split squat|step.up/i},
 {key:"curl",label:"Curl demonstration",re:/\bcurl\b|hammer curl|preacher curl/i},
 {key:"pulldown",label:"Pulldown demonstration",re:/lat pulldown|pull.up|chin.up|pull.down/i},
 {key:"deadlift",label:"Hip-hinge demonstration",re:/deadlift|romanian|good morning|back extension|hip hinge/i},
 {key:"overhead",label:"Overhead pressing demonstration",re:/overhead press|shoulder press|arnold press|landmine press|push press|z press/i},
 {key:"row",label:"Row demonstration",re:/\brow\b|face pull/i},
 {key:"pushup",label:"Push-up demonstration",re:/push.up|plank shoulder/i}
];

const rdType = name =>
 rdPatterns.find(p => p.re.test(name)) ||
 {key:"general",label:"General motion illustration"};

const rdLine = (a,b,c,d,w=10) =>
 `<path d="M${a} ${b}L${c} ${d}"
 stroke="var(--rd-human)" stroke-width="${w}"
 fill="none" stroke-linecap="round"/>`;

const rdFigures = {
 bench: `
 <path d="M46 164H277" stroke="var(--rd-rail)"
 stroke-width="9"/>
 <path d="M95 164v34M250 164v34"
 stroke="var(--rd-rail)" stroke-width="7"/>
 ${rdLine(115,136,236,136,18)}
 <circle cx="94" cy="133" r="17" fill="var(--rd-human)"/>
 ${rdLine(222,138,252,172)}
 ${rdLine(252,172,275,193)}
 <g class="rd-rep-vertical">
 ${rdLine(160,131,160,80,9)}
 ${rdLine(198,131,198,80,9)}
 <path d="M132 70H239" stroke="var(--rd-metal)"
 stroke-width="7"/>
 <rect x="140" y="53" width="13" height="34"
 rx="3" fill="var(--rd-weight)"/>
 <rect x="218" y="53" width="13" height="34"
 rx="3" fill="var(--rd-weight)"/>
 </g>`,

 squat: `
 <path d="M50 196H330" stroke="var(--rd-rail)"
 stroke-width="4"/>
 <g class="rd-rep-squat">
 <circle cx="192" cy="45" r="20" fill="var(--rd-human)"/>
 ${rdLine(192,70,184,126,23)}
 ${rdLine(185,124,152,164,15)}
 ${rdLine(152,164,128,193,13)}
 ${rdLine(185,124,221,164,15)}
 ${rdLine(221,164,248,193,13)}
 ${rdLine(173,84,144,106,9)}
 ${rdLine(207,84,230,106,9)}
 <path d="M115 72h151" stroke="var(--rd-metal)"
 stroke-width="6"/>
 <rect x="126" y="57" width="13" height="31"
 fill="var(--rd-weight)"/>
 <rect x="246" y="57" width="13" height="31"
 fill="var(--rd-weight)"/>
 </g>`,

 curl: `
 <path d="M70 195h240" stroke="var(--rd-rail)"
 stroke-width="4"/>
 <circle cx="179" cy="34" r="19" fill="var(--rd-human)"/>
 ${rdLine(179,57,178,130,23)}
 ${rdLine(178,130,165,191,13)}
 ${rdLine(178,130,203,191,13)}
 ${rdLine(167,78,151,112,12)}
 <g class="rd-rep-curl">
 ${rdLine(151,112,155,165,11)}
 <path d="M128 166h53" stroke="var(--rd-metal)"
 stroke-width="7"/>
 <rect x="132" y="152" width="10" height="28"
 fill="var(--rd-weight)"/>
 <rect x="170" y="152" width="10" height="28"
 fill="var(--rd-weight)"/>
 </g>
 ${rdLine(193,80,207,118,12)}
 ${rdLine(207,118,205,151,10)}`,

 pulldown: `
 <rect x="113" y="148" width="155" height="13"
 rx="5" fill="var(--rd-rail)"/>
 ${rdLine(145,160,145,201,6)}
 ${rdLine(247,160,247,201,6)}
 <circle cx="190" cy="65" r="18" fill="var(--rd-human)"/>
 ${rdLine(190,87,191,158,23)}
 ${rdLine(190,152,166,186,11)}
 ${rdLine(190,152,219,186,11)}
 <g class="rd-rep-pulldown">
 <path d="M105 38H271" stroke="var(--rd-metal)"
 stroke-width="6"/>
 ${rdLine(153,39,163,116,8)}
 ${rdLine(231,39,218,116,8)}
 </g>`,

 deadlift: `
 <path d="M49 195H322" stroke="var(--rd-rail)"
 stroke-width="4"/>
 <circle cx="187" cy="47" r="18" fill="var(--rd-human)"/>
 ${rdLine(187,67,181,128,22)}
 ${rdLine(181,128,160,188,13)}
 ${rdLine(181,128,208,188,13)}
 ${rdLine(180,83,148,133,10)}
 ${rdLine(191,84,233,133,10)}
 <g class="rd-rep-deadlift">
 <path d="M109 170H271" stroke="var(--rd-metal)"
 stroke-width="7"/>
 <rect x="113" y="148" width="15" height="43"
 fill="var(--rd-weight)"/>
 <rect x="251" y="148" width="15" height="43"
 fill="var(--rd-weight)"/>
 </g>`,

 overhead: `
 <path d="M50 196H330" stroke="var(--rd-rail)"
 stroke-width="4"/>
 <circle cx="188" cy="59" r="18" fill="var(--rd-human)"/>
 ${rdLine(188,80,188,140,23)}
 ${rdLine(188,140,166,192,13)}
 ${rdLine(188,140,209,192,13)}
 <g class="rd-rep-overhead">
 ${rdLine(174,91,151,72,9)}
 ${rdLine(202,91,224,72,9)}
 <path d="M122 67H250" stroke="var(--rd-metal)"
 stroke-width="7"/>
 <rect x="133" y="51" width="12" height="32"
 fill="var(--rd-weight)"/>
 <rect x="228" y="51" width="12" height="32"
 fill="var(--rd-weight)"/>
 </g>`,

 row: `
 <path d="M70 195H310" stroke="var(--rd-rail)"
 stroke-width="4"/>
 <circle cx="160" cy="52" r="18" fill="var(--rd-human)"/>
 ${rdLine(171,69,218,110,22)}
 ${rdLine(218,110,202,184,14)}
 ${rdLine(218,110,255,182,14)}
 <g class="rd-rep-row">
 ${rdLine(193,88,264,123,12)}
 <path d="M257 118h50" stroke="var(--rd-metal)"
 stroke-width="7"/>
 <rect x="284" y="104" width="12" height="29"
 fill="var(--rd-weight)"/>
 </g>`,

 pushup: `
 <path d="M48 195H332" stroke="var(--rd-rail)"
 stroke-width="4"/>
 <g class="rd-rep-pushup">
 <circle cx="94" cy="107" r="18" fill="var(--rd-human)"/>
 ${rdLine(114,116,235,127,20)}
 ${rdLine(235,127,291,160,13)}
 ${rdLine(166,119,155,179,10)}
 ${rdLine(189,120,205,179,10)}
 </g>`,

 general: `
 <circle cx="188" cy="63" r="19" fill="var(--rd-human)"/>
 ${rdLine(188,86,188,146,23)}
 ${rdLine(188,146,163,192,12)}
 ${rdLine(188,146,213,192,12)}
 ${rdLine(178,101,144,140,11)}
 ${rdLine(198,101,231,140,11)}
 <g class="rd-rep-general">
 <path d="M116 144h59M200 144h59"
 stroke="var(--rd-metal)" stroke-width="7"/>
 <rect x="116" y="131" width="11" height="27"
 fill="var(--rd-weight)"/>
 <rect x="248" y="131" width="11" height="27"
 fill="var(--rd-weight)"/>
 </g>`
};

function rdDemo(name) {
 const type = rdType(name);
 const generic = type.key === "general";

 return `
 <section class="rd-demo-card">
  <div class="rd-demo-heading">
   <div>
    <b>Exercise demonstration</b>
    <p>${clean(type.label)} · Original animation</p>
   </div>
   <button class="alt sm" data-rd-pause>Pause</button>
  </div>

  <div class="rd-demo-stage" data-rd-stage
       style="--rd-speed:2.5s">
   <svg viewBox="0 0 380 220" role="img"
        aria-label="${clean(type.label)}">
    <rect width="380" height="220"
          rx="14" fill="var(--rd-bg)"/>
    <circle cx="313" cy="40" r="21"
            fill="var(--rd-halo)"/>
    ${rdFigures[type.key]}
   </svg>
  </div>

  <div class="rd-demo-controls">
   <label>Playback
    <select data-rd-speed>
     <option value="3.7s">Slow</option>
     <option value="2.5s" selected>Normal</option>
     <option value="1.5s">Fast</option>
    </select>
   </label>
   <span>Looping animation</span>
  </div>

  <p class="rd-disclaimer">
   ${generic
    ? "Generic animation, not specific to this exercise."
    : "Simplified movement illustration, not a precise form tutorial."}
   Always use appropriate technique.
  </p>
 </section>`;
}

function rdInsert() {
 if (typeof tab === "undefined" ||
     tab !== "exercises" ||
     !detail) return;

 const back = document.querySelector(
  '#app button[data-a="back"]'
 );

 if (back && !document.querySelector("[data-rd-stage]")) {
  back.insertAdjacentHTML("afterend",rdDemo(detail));
 }
}

const rdPreviousDraw = draw;
draw = function() {
 rdPreviousDraw();
 rdInsert();
};

const rdCSS = document.createElement("style");
rdCSS.textContent = `
.rd-demo-card {
 margin:14px 0;
 padding:14px;
 background:var(--card);
 border:1px solid var(--border);
 border-radius:15px
}
.rd-demo-heading {
 display:flex;
 justify-content:space-between;
 align-items:center;
 gap:10px
}
.rd-demo-heading b {font-size:16px}
.rd-demo-heading p {
 color:var(--muted);
 font-size:12px;
 margin:5px 0
}
.rd-demo-stage {
 --rd-human:#5675a3;
 --rd-weight:#226ce8;
 --rd-metal:#9eaebd;
 --rd-rail:#b5bfcc;
 --rd-bg:#edf4ff;
 --rd-halo:#dceaff;
 border-radius:13px;
 overflow:hidden;
 margin:12px 0
}
body:not(.light) .rd-demo-stage {
 --rd-human:#b7d0ef;
 --rd-weight:#4b9dff;
 --rd-metal:#b6c7db;
 --rd-rail:#536a83;
 --rd-bg:#132136;
 --rd-halo:#1e3251
}
.rd-demo-stage svg {
 width:100%;
 height:auto;
 display:block;
 max-height:245px
}
.rd-demo-controls {
 display:flex;
 align-items:center;
 justify-content:space-between;
 gap:10px;
 color:var(--muted);
 font-size:12px
}
.rd-demo-controls label {
 display:flex;
 align-items:center;
 gap:8px
}
.rd-demo-controls select {
 width:auto;
 padding:6px
}
.rd-disclaimer {
 color:var(--muted);
 font-size:12px;
 line-height:1.5
}
.rd-rep-vertical {
 animation:rd-vertical var(--rd-speed) ease-in-out infinite
}
.rd-rep-squat {
 animation:rd-squat var(--rd-speed) ease-in-out infinite
}
.rd-rep-curl {
 transform-origin:151px 112px;
 animation:rd-curl var(--rd-speed) ease-in-out infinite
}
.rd-rep-pulldown {
 animation:rd-pulldown var(--rd-speed) ease-in-out infinite
}
.rd-rep-deadlift {
 animation:rd-deadlift var(--rd-speed) ease-in-out infinite
}
.rd-rep-overhead {
 animation:rd-overhead var(--rd-speed) ease-in-out infinite
}
.rd-rep-row {
 animation:rd-row var(--rd-speed) ease-in-out infinite
}
.rd-rep-pushup {
 animation:rd-pushup var(--rd-speed) ease-in-out infinite
}
.rd-rep-general {
 animation:rd-general var(--rd-speed) ease-in-out infinite
}
.rd-paused [class^="rd-rep-"] {
 animation-play-state:paused
}
@keyframes rd-vertical {
 0%,100% {transform:translateY(-26px)}
 50% {transform:translateY(12px)}
}
@keyframes rd-squat {
 0%,100% {transform:translateY(-15px)}
 50% {transform:translateY(16px)}
}
@keyframes rd-curl {
 0%,100% {transform:rotate(0)}
 50% {transform:rotate(-60deg)}
}
@keyframes rd-pulldown {
 0%,100% {transform:translateY(-11px)}
 50% {transform:translateY(30px)}
}
@keyframes rd-deadlift {
 0%,100% {transform:translateY(0)}
 50% {transform:translateY(-58px)}
}
@keyframes rd-overhead {
 0%,100% {transform:translateY(17px)}
 50% {transform:translateY(-34px)}
}
@keyframes rd-row {
 0%,100% {transform:translateX(0)}
 50% {transform:translateX(-40px)}
}
@keyframes rd-pushup {
 0%,100% {transform:translateY(0)}
 50% {transform:translateY(26px)}
}
@keyframes rd-general {
 0%,100% {transform:translateY(0)}
 50% {transform:translateY(-28px)}
}
@media (prefers-reduced-motion:reduce) {
 .rd-demo-stage [class^="rd-rep-"] {
  animation:none!important
 }
}
`;
document.head.appendChild(rdCSS);

document.addEventListener("click",e=>{
 const button=e.target.closest("[data-rd-pause]");
 if(!button)return;

 const stage=document.querySelector("[data-rd-stage]");
 if(!stage)return;

 const paused=stage.classList.toggle("rd-paused");
 button.textContent=paused?"Play":"Pause";
});

document.addEventListener("change",e=>{
 const select=e.target.closest("[data-rd-speed]");
 if(!select)return;

 const stage=document.querySelector("[data-rd-stage]");
 if(stage)stage.style.setProperty(
  "--rd-speed",select.value
 );
});

draw();
