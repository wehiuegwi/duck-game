const rarityScale = [
  { label: "Common", min: 0, max: 49, className: "common" },
  { label: "Uncommon", min: 50, max: 99, className: "uncommon" },
  { label: "Rare", min: 100, max: 149, className: "rare" },
  { label: "Epic", min: 150, max: 199, className: "epic" },
  { label: "Legendary", min: 200, max: Infinity, className: "legendary" },
];

const colors = [
  { name: "Amber", value: "#f9c74f" },
  { name: "Mint", value: "#8ad7ad" },
  { name: "Sky", value: "#8ecae6" },
  { name: "Lavender", value: "#c7b8ff" },
  { name: "Coral", value: "#ff9f7d" },
  { name: "Pearl", value: "#f1e9d4" },
  { name: "Rose", value: "#f8b4c6" },
  { name: "Olive", value: "#b7c97a" },
  { name: "Midnight", value: "#3d4a7a" },
  { name: "Ruby", value: "#d94d4d" },
];

const patterns = [
  "Plain",
  "Speckled",
  "Striped",
  "Dotted",
  "Feathered",
  "Galaxy",
  "Sunburst",
  "Polka",
];

const accessories = [
  "No Accessory",
  "Tiny Crown",
  "Flower Bonnet",
  "Golden Bow",
  "Crystal Halo",
  "Sun Glasses",
  "Beanie",
  "Velvet Ribbon",
];

const traits = [
  "Sunny",
  "Sleepy",
  "Dapper",
  "Bouncy",
  "Dreamy",
  "Bashful",
  "Brave",
  "Silly",
  "Cheery",
  "Mischievous",
];

const moods = [
  "Waddling",
  "Proud",
  "Napping",
  "Dancing",
  "Curious",
  "Shimmering",
  "Purring",
  "Glowing",
];

const names = [
  "Puddle Peeper",
  "Biscuit Bob",
  "Velvet Splash",
  "Mallow Quack",
  "Noodle Nugget",
  "Banker Bop",
  "Mochi Mirth",
  "Pebble Flap",
  "Glow Waddle",
  "Sugar Ripple",
  "Quackalot",
  "Twinkle Waff",
];

const bestScoreKey = "duck-best-score";

const duckArt = document.getElementById("duck-art");
const rarityBadge = document.getElementById("rarity-badge");
const duckName = document.getElementById("duck-name");
const duckScore = document.getElementById("duck-score");
const duckColor = document.getElementById("duck-color");
const duckPattern = document.getElementById("duck-pattern");
const duckTrait = document.getElementById("duck-trait");
const bestScoreEl = document.getElementById("best-score");
const rollBtn = document.getElementById("roll-btn");
const rerollBtn = document.getElementById("reroll-btn");

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getBestScore() {
  return Number(localStorage.getItem(bestScoreKey) || 0);
}

function setBestScore(score) {
  localStorage.setItem(bestScoreKey, String(score));
  bestScoreEl.textContent = score;
}

function rarityForScore(score) {
  return rarityScale.find((entry) => score >= entry.min && score <= entry.max) || rarityScale[rarityScale.length - 1];
}

function determineDuckScore(duck) {
  let score = 15;

  const rareColorBonus = { Amber: 8, Mint: 10, Sky: 12, Lavender: 15, Coral: 14, Pearl: 18, Rose: 16, Olive: 11, Midnight: 22, Ruby: 24 };
  const patternBonus = { Plain: 4, Speckled: 9, Striped: 11, Dotted: 12, Feathered: 18, Galaxy: 30, Sunburst: 26, Polka: 20 };
  const accessoryBonus = {
    "No Accessory": 0,
    "Tiny Crown": 22,
    "Flower Bonnet": 18,
    "Golden Bow": 20,
    "Crystal Halo": 35,
    "Sun Glasses": 17,
    "Beanie": 16,
    "Velvet Ribbon": 19,
  };

  score += rareColorBonus[duck.color.name] || 5;
  score += patternBonus[duck.pattern] || 8;
  score += accessoryBonus[duck.accessory] || 0;
  score += duck.size * 7;

  if (duck.pattern === "Galaxy" && duck.accessory === "Crystal Halo") score += 45;
  if (duck.color.name === "Ruby" && duck.trait === "Brave") score += 30;
  if (duck.accessory === "Tiny Crown" && duck.mood === "Proud") score += 25;
  if (duck.pattern === "Sunburst" && duck.trait === "Dapper") score += 30;

  return Math.max(0, score);
}

function buildDuck() {
  const color = randomItem(colors);
  const pattern = randomItem(patterns);
  const accessory = randomItem(accessories);
  const trait = randomItem(traits);
  const mood = randomItem(moods);
  const name = randomItem(names);
  const size = 40 + Math.floor(Math.random() * 60);

  const duck = {
    color,
    pattern,
    accessory,
    trait,
    mood,
    name,
    size,
  };

  duck.score = determineDuckScore(duck);
  duck.rarity = rarityForScore(duck.score);

  return duck;
}

function makePatternElements(pattern, bodyColor, accentColor) {
  const svgNS = "http://www.w3.org/2000/svg";
  const group = document.createElementNS(svgNS, "g");
  const overlay = document.createElementNS(svgNS, "path");
  overlay.setAttribute("fill", "none");
  overlay.setAttribute("stroke", "rgba(0,0,0,0.15)");
  overlay.setAttribute("stroke-width", "4");
  overlay.setAttribute("stroke-linecap", "round");

  if (pattern === "Speckled") {
    for (let i = 0; i < 20; i += 1) {
      const dot = document.createElementNS(svgNS, "circle");
      const x = 120 + ((i * 13) % 150) + (i % 3) * 8;
      const y = 120 + (i * 11) % 70;
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", 4 + (i % 3));
      dot.setAttribute("fill", accentColor);
      dot.setAttribute("opacity", "0.6");
      group.appendChild(dot);
    }
  }

  if (pattern === "Striped") {
    for (let i = 0; i < 8; i += 1) {
      const stripe = document.createElementNS(svgNS, "path");
      stripe.setAttribute("d", `M 110 ${100 + i * 18} Q 240 ${100 + i * 18} 300 ${80 + i * 12}`);
      stripe.setAttribute("stroke", accentColor);
      stripe.setAttribute("stroke-width", "4");
      stripe.setAttribute("fill", "none");
      stripe.setAttribute("opacity", "0.7");
      group.appendChild(stripe);
    }
  }

  if (pattern === "Dotted") {
    for (let i = 0; i < 14; i += 1) {
      const dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", 130 + i * 12);
      dot.setAttribute("cy", 100 + ((i % 3) * 22));
      dot.setAttribute("r", 6);
      dot.setAttribute("fill", accentColor);
      dot.setAttribute("opacity", "0.7");
      group.appendChild(dot);
    }
  }

  if (pattern === "Feathered") {
    for (let i = 0; i < 6; i += 1) {
      const feather = document.createElementNS(svgNS, "path");
      feather.setAttribute("d", `M ${170 + i * 18} ${150} Q ${195 + i * 18} ${120} ${210 + i * 18} ${160}`);
      feather.setAttribute("stroke", accentColor);
      feather.setAttribute("stroke-width", "3");
      feather.setAttribute("fill", "none");
      feather.setAttribute("opacity", "0.8");
      group.appendChild(feather);
    }
  }

  if (pattern === "Galaxy") {
    const stars = [
      { x: 135, y: 96, r: 4 },
      { x: 180, y: 126, r: 3 },
      { x: 255, y: 92, r: 5 },
      { x: 228, y: 150, r: 4 },
      { x: 292, y: 120, r: 3 },
    ];

    stars.forEach((star) => {
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", star.x);
      circle.setAttribute("cy", star.y);
      circle.setAttribute("r", star.r);
      circle.setAttribute("fill", accentColor);
      circle.setAttribute("opacity", "0.9");
      group.appendChild(circle);
    });
  }

  if (pattern === "Sunburst") {
    for (let i = 0; i < 8; i += 1) {
      const ray = document.createElementNS(svgNS, "path");
      ray.setAttribute("d", `M 210 85 L ${210 + Math.cos((i / 8) * Math.PI * 2) * 50} ${85 + Math.sin((i / 8) * Math.PI * 2) * 40}`);
      ray.setAttribute("stroke", accentColor);
      ray.setAttribute("stroke-width", "3");
      ray.setAttribute("opacity", "0.8");
      ray.setAttribute("stroke-linecap", "round");
      group.appendChild(ray);
    }
  }

  if (pattern === "Polka") {
    for (let i = 0; i < 12; i += 1) {
      const dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", 130 + (i % 4) * 45);
      dot.setAttribute("cy", 105 + Math.floor(i / 4) * 28);
      dot.setAttribute("r", 6);
      dot.setAttribute("fill", accentColor);
      dot.setAttribute("opacity", "0.7");
      group.appendChild(dot);
    }
  }

  if (pattern === "Plain") {
    overlay.setAttribute("d", "M 120 112 Q 190 80 270 110 Q 285 140 268 186 Q 180 220 118 180 Q 98 146 120 112");
    group.appendChild(overlay);
  }

  return group;
}

function renderDuck(duck) {
  duckArt.innerHTML = "";

  const bodyColor = duck.color.value;
  const accent = duck.color.name === "Midnight" ? "#c0d6ff" : "#f2f4ff";

  const body = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  body.setAttribute("cx", "220");
  body.setAttribute("cy", "170");
  body.setAttribute("rx", "110");
  body.setAttribute("ry", "62");
  body.setAttribute("fill", bodyColor);
  duckArt.appendChild(body);

  const wing = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  wing.setAttribute("cx", "220");
  wing.setAttribute("cy", "178");
  wing.setAttribute("rx", "52");
  wing.setAttribute("ry", "28");
  wing.setAttribute("fill", "rgba(255,255,255,0.26)");
  wing.setAttribute("transform", "rotate(-10 220 178)");
  duckArt.appendChild(wing);

  const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  head.setAttribute("cx", "322");
  head.setAttribute("cy", "120");
  head.setAttribute("r", "44");
  head.setAttribute("fill", bodyColor);
  duckArt.appendChild(head);

  const beak = document.createElementNS("http://www.w3.org/2000/svg", "path");
  beak.setAttribute("d", "M 360 120 L 395 132 L 360 145 Z");
  beak.setAttribute("fill", "#ff9f43");
  duckArt.appendChild(beak);

  const eye = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  eye.setAttribute("cx", "336");
  eye.setAttribute("cy", "116");
  eye.setAttribute("r", "4");
  eye.setAttribute("fill", "#1d2439");
  duckArt.appendChild(eye);

  const mouth = document.createElementNS("http://www.w3.org/2000/svg", "path");
  mouth.setAttribute("d", duck.trait === "Sleepy" ? "M 330 132 Q 342 138 354 132" : "M 330 132 Q 342 146 354 132");
  mouth.setAttribute("stroke", "#1d2439");
  mouth.setAttribute("stroke-width", "3");
  mouth.setAttribute("fill", "none");
  mouth.setAttribute("stroke-linecap", "round");
  duckArt.appendChild(mouth);

  const accessoryGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

  if (duck.accessory === "Tiny Crown") {
    accessoryGroup.innerHTML = '<path d="M 305 88 L 320 72 L 336 88 L 350 72 L 365 88 L 350 100 L 305 100 Z" fill="#ffd166" />';
  }
  if (duck.accessory === "Flower Bonnet") {
    accessoryGroup.innerHTML = '<path d="M 300 86 Q 331 60 360 86 L 360 102 L 300 102 Z" fill="#d8a9ff" /><circle cx="318" cy="76" r="8" fill="#ff6fa5" /><circle cx="338" cy="70" r="7" fill="#ffd166" /><circle cx="352" cy="82" r="7" fill="#7ce4c3" />';
  }
  if (duck.accessory === "Golden Bow") {
    accessoryGroup.innerHTML = '<path d="M 300 94 Q 323 82 345 94 Q 331 108 316 108 Q 301 108 300 94" fill="#f9c74f" /><path d="M 319 90 Q 331 104 342 90" stroke="#f9c74f" stroke-width="4" fill="none" />';
  }
  if (duck.accessory === "Crystal Halo") {
    accessoryGroup.innerHTML = '<circle cx="322" cy="112" r="18" fill="none" stroke="#b9d9ff" stroke-width="4" opacity="0.9" /><circle cx="344" cy="95" r="6" fill="#d7edff" />';
  }
  if (duck.accessory === "Sun Glasses") {
    accessoryGroup.innerHTML = '<rect x="312" y="108" width="18" height="12" rx="4" fill="#3a4050" /><rect x="338" y="108" width="18" height="12" rx="4" fill="#3a4050" /><path d="M 330 114 L 336 114" stroke="#cfd7ff" stroke-width="2" />';
  }
  if (duck.accessory === "Beanie") {
    accessoryGroup.innerHTML = '<path d="M 298 94 Q 320 72 344 94 L 344 102 Q 320 110 298 102 Z" fill="#7bc4ff" /><circle cx="328" cy="88" r="10" fill="#ffca7a" />';
  }
  if (duck.accessory === "Velvet Ribbon") {
    accessoryGroup.innerHTML = '<path d="M 300 90 L 322 100 L 340 90 L 360 100 L 340 110 L 322 110 Z" fill="#d8a0ff" />';
  }
  duckArt.appendChild(accessoryGroup);

  const patternGroup = makePatternElements(duck.pattern, bodyColor, accent);
  duckArt.appendChild(patternGroup);

  const tail = document.createElementNS("http://www.w3.org/2000/svg", "path");
  tail.setAttribute("d", "M 110 165 Q 80 150 90 180 Q 108 188 120 175 Z");
  tail.setAttribute("fill", "rgba(255,255,255,0.35)");
  duckArt.appendChild(tail);

  const feet = document.createElementNS("http://www.w3.org/2000/svg", "g");
  feet.innerHTML = '<path d="M 180 215 L 195 240" stroke="#f5b15d" stroke-width="5" stroke-linecap="round" /><path d="M 240 215 L 255 240" stroke="#f5b15d" stroke-width="5" stroke-linecap="round" />';
  duckArt.appendChild(feet);

  if (duck.mood === "Dancing") {
    const bounce = document.createElementNS("http://www.w3.org/2000/svg", "path");
    bounce.setAttribute("d", "M 175 230 Q 205 210 232 230");
    bounce.setAttribute("stroke", "rgba(0,0,0,0.12)");
    bounce.setAttribute("stroke-width", "4");
    bounce.setAttribute("fill", "none");
    duckArt.appendChild(bounce);
  }
}

function updateBestScoreDisplay() {
  const best = getBestScore();
  bestScoreEl.textContent = best;
}

function updateDuckDisplay(duck) {
  rarityBadge.textContent = duck.rarity.label;
  rarityBadge.className = `rarity-badge ${duck.rarity.className}`;
  duckName.textContent = duck.name;
  duckScore.textContent = String(duck.score);
  duckColor.textContent = duck.color.name;
  duckPattern.textContent = duck.pattern;
  duckTrait.textContent = duck.trait;

  const best = getBestScore();
  if (duck.score > best) {
    setBestScore(duck.score);
  }

  renderDuck(duck);
}

function rollDuck() {
  const duck = buildDuck();
  updateDuckDisplay(duck);
}

rollBtn.addEventListener("click", rollDuck);
rerollBtn.addEventListener("click", () => {
  const duck = buildDuck();
  if (duck.score < 100) {
    rollDuck();
    return;
  }
  updateDuckDisplay(duck);
});

updateBestScoreDisplay();
rollDuck();

window.addEventListener("DOMContentLoaded", () => {
  updateBestScoreDisplay();
  rollDuck();
});

