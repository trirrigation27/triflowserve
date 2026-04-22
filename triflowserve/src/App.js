import { useState, useRef, useEffect } from "react";

// ─── BUSINESS DATA ────────────────────────────────────────────────────────────
const TECHS = {
  robert: { name: "Robert Pellicci", color: "#3b82f6", initials: "RP" },
  thomas: { name: "Thomas Pellicci", color: "#10b981", initials: "TP" },
};
const SERVICES = [
  { id: "startup", name: "System Startup", rate: 70.00, duration: 60, parts: [] },
  { id: "winter", name: "Winterization Blowout", rate: 85.00, duration: 45, parts: [] },
  { id: "labor", name: "Service Call / Labor", rate: 95.00, duration: 60, parts: [] },
  { id: "line1", name: "Repair 1\" Line Break", rate: 150.00, duration: 90, parts: [{ id: "linkit1", qty: 1 }, { id: "pvckit", qty: 1 }] },
  { id: "line34", name: "Repair 3/4\" Line Break", rate: 120.00, duration: 75, parts: [{ id: "linkit34", qty: 1 }, { id: "pvckit", qty: 1 }] },
  { id: "spray", name: "Replace 1/2\" Spray Head", rate: 45.00, duration: 30, parts: [{ id: "sprayhead", qty: 1 }] },
  { id: "rotor", name: "Replace Rotor Head", rate: 55.00, duration: 30, parts: [{ id: "rotorhead", qty: 1 }] },
  { id: "valve", name: "Replace Solenoid Valve", rate: 95.00, duration: 45, parts: [{ id: "solenoid", qty: 1 }, { id: "wireconn", qty: 2 }] },
  { id: "backflow", name: "Backflow Preventer Test", rate: 75.00, duration: 30, parts: [] },
  { id: "controller", name: "Controller Replacement", rate: 250.00, duration: 60, parts: [{ id: "battery9v", qty: 2 }] },
  { id: "zone", name: "New Zone Install", rate: 350.00, duration: 120, parts: [] },
  { id: "midseason", name: "Mid-Season Check-Up", rate: 65.00, duration: 45, parts: [] },
];
const INIT_INVENTORY = [
  { id: "sprayhead", name: "1/2\" Spray Head", qty: 20, reorder: 5 },
  { id: "rotorhead", name: "Rotor Head (standard)", qty: 10, reorder: 3 },
  { id: "linkit1", name: "1\" Line Repair Kit", qty: 8, reorder: 2 },
  { id: "linkit34", name: "3/4\" Line Repair Kit", qty: 8, reorder: 2 },
  { id: "solenoid", name: "Solenoid Valve 24V", qty: 6, reorder: 2 },
  { id: "wireconn", name: "Wire Connector (weatherproof)", qty: 50, reorder: 15 },
  { id: "backflowprev", name: "Backflow Preventer 3/4\"", qty: 3, reorder: 1 },
  { id: "battery9v", name: "Controller Battery (9V)", qty: 12, reorder: 4 },
  { id: "teflontape", name: "Teflon Tape Roll", qty: 10, reorder: 3 },
  { id: "pvckit", name: "PVC Primer & Cement Set", qty: 4, reorder: 1 },
  { id: "elbow12", name: "Marlex Elbow 1/2\"", qty: 20, reorder: 5 },
  { id: "tee12", name: "Marlex Tee 1/2\"", qty: 15, reorder: 5 },
];
const CLIENTS = [
  { name: "Agnieszka Gruntha", address: "35 Gaymor Road", city: "Hauppauge", zip: "11788", phone: "", email: "" },
  { name: "Amanda Tooker", address: "15 River Ave", city: "Eastport", zip: "11941", phone: "", email: "amanda.k.tooker@gmail.com" },
  { name: "Billy Stevens", address: "3 Wilderness Ct", city: "Manorville", zip: "11949", phone: "516-417-1515", email: "" },
  { name: "Brian O'Sullivan", address: "1 Tupelo St", city: "Manorville", zip: "11949", phone: "", email: "" },
  { name: "Brian Sullivan", address: "1 Tupelo St", city: "Manorville", zip: "11949", phone: "", email: "" },
  { name: "Damon Smith", address: "5 Wilderness Ct", city: "Manorville", zip: "11933", phone: "", email: "" },
  { name: "Dan O'Sullivan Sr.", address: "4 Halsey Manor Road", city: "Manorville", zip: "11949", phone: "631-339-3206", email: "" },
  { name: "Danny O'Sullivan", address: "252 Dayton Ave", city: "Manorville", zip: "11949", phone: "(631) 891-9136", email: "Daniel.osullivan15@yahoo.com" },
  { name: "Dave", address: "85 Lewis Rd", city: "East Quogue", zip: "11942", phone: "", email: "" },
  { name: "Dave Spooner", address: "14 Ruth Lane", city: "Selden", zip: "11784", phone: "", email: "" },
  { name: "Diane", address: "9 Bedford Ct", city: "Ridge", zip: "11961", phone: "(631) 849-5597", email: "" },
  { name: "Edith", address: "71 Franklin", city: "Mastic", zip: "11950", phone: "", email: "" },
  { name: "Eric Giallorenzi", address: "23 Manorage Rd", city: "Manorville", zip: "11949", phone: "", email: "" },
  { name: "Eunice", address: "26 Franklin Ave", city: "Mastic", zip: "11950", phone: "", email: "" },
  { name: "Francis", address: "1251 Saxon Ave", city: "Bay Shore", zip: "11706", phone: "(631) 338-6201", email: "" },
  { name: "Frank", address: "20 Tern Court", city: "Bayshore", zip: "11706", phone: "", email: "" },
  { name: "Frank 2", address: "934 Manor Lane", city: "Bay Shore", zip: "11706", phone: "(516) 315-2867", email: "" },
  { name: "Frank Dowsenburg", address: "40 Florence Dr", city: "Manorville", zip: "11949", phone: "631-703-8947", email: "" },
  { name: "Gary Dubovick", address: "6 Halsey Manor", city: "Manorville", zip: "11949", phone: "(516) 600-0089", email: "dubovickgary@gmail.com" },
  { name: "James", address: "4 Saybrook Ct", city: "Port Jefferson Station", zip: "11776", phone: "", email: "" },
  { name: "Jason Middleton", address: "1485 Sound Ave", city: "Calverton", zip: "11933", phone: "(573) 823-8431", email: "" },
  { name: "Jehovah's Witnesses Kingdom Hall", address: "4 Paul's Path", city: "Coram", zip: "11727", phone: "", email: "" },
  { name: "Joseph Garcia", address: "133 S Hickory St", city: "Port Jefferson Station", zip: "11776", phone: "(631) 710-1629", email: "" },
  { name: "Julie's Mom", address: "11 Crosby St", city: "Center Moriches", zip: "11934", phone: "(631) 721-8206", email: "" },
  { name: "Kim", address: "75 Woodland Rd", city: "Miller Place", zip: "11764", phone: "631-766-7615", email: "", balance: 87.00 },
  { name: "Kurt McKinnon", address: "25 Halfcircle Dr", city: "Holbrook", zip: "11741", phone: "(631) 294-3777", email: "" },
  { name: "Lee Thumser", address: "127 Deer Run", city: "Wading River", zip: "11792", phone: "", email: "" },
  { name: "Lorri Kropp", address: "8 Mariposa Lane", city: "Manorville", zip: "11949", phone: "", email: "", balance: 163.13 },
  { name: "Mary Ann Steinmeyer", address: "2 Saybrook Ct", city: "Port Jefferson Station", zip: "11776", phone: "(631) 235-6551", email: "tennismom11@hotmail.com" },
  { name: "Max Fehr", address: "5 Nicole Ct", city: "Manorville", zip: "11949", phone: "", email: "" },
  { name: "Mike Andreassi", address: "6 Nicole Ct", city: "Manorville", zip: "11949", phone: "", email: "" },
  { name: "Mr O'Sullivan", address: "4 Halsey Manor Rd", city: "Manorville", zip: "11949", phone: "(516) 527-0971", email: "" },
  { name: "Nick", address: "75 Woodland Ave", city: "Miller Place", zip: "11764", phone: "", email: "nobrien44@gmail.com" },
  { name: "Pat Kelleher", address: "80 Leonard St", city: "Wading River", zip: "11792", phone: "", email: "" },
  { name: "Phyllis Early", address: "8 Bedford Ct", city: "Ridge", zip: "11961", phone: "(631) 461-5903", email: "Southhamptonearly@gmail.com" },
  { name: "Primi Restaurant - Zach", address: "999 Montauk Hwy", city: "West Islip", zip: "11795", phone: "(347) 453-6177", email: "" },
  { name: "Rich", address: "23 Estates Lane", city: "Shoreham", zip: "11786", phone: "(631) 332-4898", email: "" },
  { name: "Rolando", address: "4 Granada Circle", city: "Mount Sinai", zip: "11766", phone: "", email: "", balance: 288.19, lastService: "04/16/2026", lastServiceDetail: "Startup + line break + spray head" },
  { name: "Shelley Tooker", address: "27 Andy's Lane", city: "Eastport", zip: "11941", phone: "", email: "" },
  { name: "Stan Pappo", address: "8 Cottonwood Ave", city: "Port Jefferson", zip: "11776", phone: "", email: "" },
  { name: "Steve Quartuccio", address: "941 Thompson Dr", city: "Bay Shore", zip: "11706", phone: "(631) 741-3257", email: "" },
  { name: "Steve Rimoli", address: "17 Sarah Dr", city: "Hauppauge", zip: "11788", phone: "(631) 525-7823", email: "" },
  { name: "Thomas LTP", address: "10 Drew Drive", city: "Eastport", zip: "11941", phone: "", email: "" },
  { name: "Tom", address: "4 Wilderness Ct", city: "Manorville", zip: "11949", phone: "", email: "" },
  { name: "Tom Batsche", address: "43 Sams Path", city: "Rocky Point", zip: "11778", phone: "(631) 626-9788", email: "" },
  { name: "Tom Scott", address: "26 Gansett Ln", city: "Amagansett", zip: "11930", phone: "(631) 680-0604", email: "" },
  { name: "Warren Ellenwood", address: "7 Rolling Rd", city: "Miller Place", zip: "11764", phone: "", email: "Wellenwood@gmail.com" },
  { name: "Will Smith", address: "140 Southfield Rd", city: "Calverton", zip: "11933", phone: "", email: "" },
  { name: "Zack", address: "19 La Salle Place", city: "Oakdale", zip: "11769", phone: "(347) 453-6177", email: "" },
];

const TAX = 0.0875;
const cur = (n) => `$${Number(n).toFixed(2)}`;
const fmt = (d) => d.toISOString().split("T")[0];
const today = new Date();

const seedJobs = () => {
  const pairs = [
    ["Gary Dubovick", "startup", "robert", "08:00"],
    ["Dan O'Sullivan Sr.", "startup", "thomas", "08:00"],
    ["Brian O'Sullivan", "startup", "robert", "10:00"],
    ["Frank Dowsenburg", "spray", "thomas", "10:30"],
    ["Mike Andreassi", "startup", "robert", "14:00"],
    ["Rolando", "midseason", "thomas", "14:00"],
    ["Danny O'Sullivan", "startup", "robert", "08:00"],
    ["Max Fehr", "startup", "thomas", "09:00"],
    ["Tom", "valve", "robert", "13:00"],
    ["Lee Thumser", "startup", "thomas", "13:00"],
  ];
  return pairs.map(([client, service, tech, time], i) => {
    const d = new Date(today); d.setDate(today.getDate() + Math.floor(i / 2));
    return { id: `j${i}`, client, service, tech, date: fmt(d), time, status: i < 2 ? "complete" : "scheduled" };
  });
};

const MODULES = [
  { id: "calendar", label: "Calendar", icon: "📅", color: "#3b82f6", desc: "Schedule Robert & Thomas" },
  { id: "invoice", label: "Invoice Builder", icon: "📋", color: "#10b981", desc: "Build & send invoices" },
  { id: "inventory", label: "Inventory", icon: "📦", color: "#f59e0b", desc: "Parts & auto-reorder" },
  { id: "sms", label: "SMS Campaigns", icon: "💬", color: "#8b5cf6", desc: "Seasonal client outreach" },
  { id: "clients", label: "Clients", icon: "👤", color: "#06b6d4", desc: "49 Long Island clients" },
  { id: "ai", label: "AI Assistant", icon: "🤖", color: "#ef4444", desc: "Diagnose, quote, schedule" },
];

const AI_SYSTEM = `You are the AI operations assistant for T&R Irrigation LLC, Rocky Point NY.
Owners: Robert Pellicci and Thomas Pellicci — two-man operation, Long Island NY.
49 active clients across Suffolk County. Tax rate: 8.75% NY.

════════════════════════════════════════
SERVICE PRICING
════════════════════════════════════════
- System Startup: $70 base (up to 6 zones) + $10/zone beyond 6
- Winterization Blowout: $85 flat
- Service Call / Labor: $95/hr
- Repair 1" Line Break: $150
- Repair 3/4" Line Break: $120
- Replace 1/2" Spray Head: $45 per head
- Replace Rotor Head: $55 per head
- Replace Solenoid Valve: $95 per valve
- Backflow Preventer Test: $75
- Controller Replacement: $250 (varies by model)
- New Zone Install: $350/zone
- Mid-Season Check-Up: $65

Always apply 8.75% NY sales tax to all quotes.
Format quotes with: itemized line items, subtotal, tax, total due.

════════════════════════════════════════
EXACT MATERIALS BY JOB TYPE
════════════════════════════════════════

SPRING STARTUP — $70 base (up to 6 zones), +$10/zone beyond 6
Zone pricing:
  • 6 zones  = $70
  • 7 zones  = $80
  • 8 zones  = $90
  • 10 zones = $100
  • 12 zones = $110
ALWAYS ask zone count before quoting. If unknown, quote $70 base and note "adjusted by zone count on site."
What's included:
- Turn on main water supply to the irrigation system
- Manually activate each zone and verify all turn on
- Inspect all sprinkler heads for proper operation
- Check for full rotation on rotors
- Make coverage and arc adjustments as needed
- Inspect for excessive leakage at any heads
- Review and verify controller/clock programming
- Check rain sensor function if present
Parts used: NONE in the base startup price.
Upsell triggers — inform customer and add to scope if found during startup:
  • Head leaking excessively → Replace K-Rain Pro-S Spray Head 4" ($45/head)
  • Rotor not rotating fully or can't adjust → Replace K-Rain RPS 75 Rotor 4" ($55/head)
  • Major underground leak detected → Repair Line Break ($120–$150 depending on pipe size)
  • Controller not functioning → Controller Replacement ($250)
Always itemize each line separately. Example quote (8-zone startup + 2 spray heads + 1 rotor):
  Startup (8 zones):      $90.00
  Replace spray head x2:  $90.00
  Replace rotor head x1:  $55.00
  Subtotal:              $235.00
  Tax (8.75%):            $20.56
  Total:                 $255.56

1" POLY PIPE LINE BREAK REPAIR — $150
IMPORTANT: Poly pipe does NOT use PVC cement or Teflon tape.
Exact materials required:
  • 2x 1" barbed couplings
  • 4x stainless steel pinch clamps
  • ~12" of 1" poly pipe
Labor note: typically 60–90 min depending on dig depth and access.

3/4" POLY PIPE LINE BREAK REPAIR — $120
IMPORTANT: Poly pipe does NOT use PVC cement or Teflon tape.
Exact materials required:
  • 2x 3/4" barbed couplings
  • 4x stainless steel pinch clamps
  • ~12" of 3/4" poly pipe

REPLACE 1/2" SPRAY HEAD — $45/head
Exact materials required:
  • 1x K-Rain Pro-S Spray Head 4"
  • 1x 1/2" nipple
  • 1x Hunter 0–360 degree nozzle

REPLACE ROTOR HEAD — $55/head
Exact materials required:
  • 1x K-Rain RPS 75 Rotor 4"
  • 1x 3/4" nipple

REBUILD IRRITROL SOLENOID VALVE — $95/valve
Exact materials required:
  • 1x Irritrol 2400 Series valve
Note: T&R rebuilds the valve rather than replacing the entire assembly.

WINTERIZATION BLOWOUT — $85
Materials: none (compressor equipment only)
Notes: schedule mid-Oct to early-Nov before first freeze, ~30–45 min per system

BACKFLOW PREVENTER TEST — $75
Materials: none (testing equipment only)
Notes: required annually by many municipalities

CONTROLLER REPLACEMENT — $250 base
Materials: 1x replacement controller (brand/model varies), 2x 9V batteries
Notes: price varies by zone count and smart controller vs basic

NEW ZONE INSTALL — $350/zone
Materials vary significantly — quote individually based on zone length, head type, pipe run.
See COMPLETE SYSTEM INSTALLATION section below for full material breakdowns.

MID-SEASON CHECK-UP — $65
Includes: walk all zones, adjust heads, check pressure, review schedule
Parts: variable — any heads replaced billed additionally at normal rates

════════════════════════════════════════
COMPLETE SYSTEM INSTALLATION QUOTING
════════════════════════════════════════
T&R installs complete irrigation systems. Pricing formula:
  Final Price = (Parts cost × 1.08) × markup + Labor + Profit margin + 8.75% tax
  Parts markup: typically 8% on sub total, then 20–35% profit margin on top
  Labor: $20–$50/hr per tech depending on job complexity

STANDARD INSTALLATION MATERIAL LIST
These are the core materials used across all system installs. Quantities vary by zone count and property size.

PIPE & FITTINGS:
  • 1" poly pipe — $73–$77/100ft roll (main supply lines)
  • 1-1/4" poly pipe — $100/roll (larger properties, pump systems)
  • Poly insert couplings — $0.55–$0.76 each
  • Poly insert tees — $1.11–$1.79 each
  • Poly head L (IxF elbow) — $1.07–$1.65 each
  • 1" stainless steel pinch clamps — $0.21 each (or $15.67/bag of ~75)
  • 3/4" nipple short — $0.36–$0.50 each (one per rotor head)
  • 1/2" nipple short — $0.25 each (one per spray head)

HEADS:
  • K-Rain rotor heads — $7–$10 each (quantity varies by zone layout)
  • K-Rain spray heads — $7–$8 each
  • Nozzles — included with spray heads

VALVES & CONTROL:
  • 1" Irritrol solenoid valves (FPT x barb) — $15–$30 each (one per zone)
  • Manifold tees — $3–$6 each (one per valve)
  • 1" close nipples — $0.87 each (one per valve)
  • PVC plug — $0.88 (one per manifold)
  • Valve boxes (large 3-valve) — $44.99–$80 each
  • Standard valve box — $25.14 each

CONTROLLER:
  • 4-zone Hunter Pro-C (regular) — $99
  • 4-zone Hunter Pro-C (WiFi) — $199
  • Hunter Pro-C 3-station expansion module — $40 each
  • Hunter 9-zone module — $100
  • 7-zone controller — $240
  • 16-zone controller — $300–$350
  • Note: use WiFi controllers for smart scheduling capability

BACKFLOW PREVENTION:
  • 3/4" double check valve — $233.19 (required on most residential installs)

WIRE:
  • 18/13 wire — $0.74–$1.70/ft (multi-zone, main control wire)
  • 18/7 wire — $0.67/ft (smaller zone runs)

COPPER PLUMBING (connection to house water supply):
  • 3/4" 10' copper pipe — $45.26 each
  • 3/4" ProPress elbow 90° — $4.80 each
  • 3/4" ProPress tee — $7.86 each
  • 3/4" ProPress pipe to 3/4" male — $6.60 each
  • 3/4" ProPress pipe to 1/2" female — $6.94 each
  • 3/4" sweat ball valve — $23.64
  • 3/4" copper pipe hanger straps — $0.86–$7.82 each
  • Copper heel tee — $12.08
  • 3/4" tee copper — $5.13
  • 3/4" elbow copper — $2.89
  • 3/4" coupling copper — $1.97
  • 1" 10' copper pipe — $60 each (larger service lines)
  • 1" ProPress elbow 90° — $11 each
  • 1x1x.75" ProPress tee — $19 each
  • 1" press ball valve — $19 each
  • 1" copper hanger strap — $1.47 each
  • 1"x1"x.75" press threaded tee — $31

MISC:
  • Wire nuts / connectors — $85.45/box
  • Hose spigot — $12 each
  • Ditch Witch rental — $300–$500/day
  • Nettafim drip line 250' — $69.10 (for drip zones)
  • PC drip line 250' — $150 (pressure-compensating drip)
  • Metal stand for pump — $90
  • Brass 1-1/4" check valve — $45

REAL JOBS REFERENCE (from actual T&R estimates):

EST25001 — Steve Rimoli, 17 Sarah Dr Hauppauge (7-zone):
  Parts: $1,440 → marked up to $1,567 | Labor: $1,500 | Profit 15% | Total after tax: ~$4,227

EST25003 — Tom Scott, 26 Gansett Ln Amagansett (9-zone):
  Parts: $1,780 → marked up to $1,936 | Labor: $750 | Profit 15% | Total after tax: ~$3,359

EST25004 — Frank, 20 Tern Ct Bayshore (12-zone, pump system):
  Parts: $2,994 → marked up to $3,256 | Labor: $1,800 | Profit 20% | Total after tax: ~$7,448

EST25006 — Amanda Tooker, 15 River Ave Eastport (4-zone):
  Parts: $1,551 → marked up to $1,687 | Labor: $1,600 | Profit 35% | Total after tax: ~$5,321

EST23002 — Matt Marsicano, 53 Michaels Ln Shoreham (7-zone):
  Parts: $1,928 → marked up to $2,095 | Labor: $1,500 | Total after tax: ~$3,595

EST24001 — Ryan, Yaphank (2-zone, partial):
  Parts: $479 → marked up to $521 | Labor: $600 | Final: ~$1,522

EST210602 — (16-zone, large property):
  Parts: $3,717 → marked up to $4,014 | Labor: $5,400 | Total: ~$9,414

EST210701 — (7-zone with drip):
  Parts: $2,239 → marked up to $2,419 | Labor: $3,600 | Sub: $300 | Total: ~$6,319

EST210608 — (5-zone with drip):
  Parts: $1,389 → marked up to $1,501 | Labor: $4,000 | Total: ~$5,501

INSTALLATION PRICING GUIDELINES:
  • Small residential (4–6 zones): $3,500–$5,500 total
  • Medium residential (7–9 zones): $3,500–$6,000 total
  • Large residential (10–12+ zones): $7,000–$10,000+ total
  • Labor rate: 2 techs × 30hrs average for standard install
  • Always add Ditch Witch rental ($300–$500) for new installs
  • Backflow preventer required on most new installs (+$233)
  • WiFi controller upgrades add $100–$200 vs basic

════════════════════════════════════════
HYDRAULIC SYSTEM DESIGN — ZONE SIZING
════════════════════════════════════════
Every new system design starts with a site assessment. ALWAYS follow this intake sequence:

STEP 0 — COLLECT PROPERTY INFORMATION FIRST
Before any hydraulic calculations, ask for ALL of the following:
  1. Customer name and full street address (street, city, zip)
  2. Lot size in sq ft or acreage (if known — can look up on county tax records)
  3. Static pressure (psi) — at hose bib with no water running
  4. Water meter / service line size (3/4" or 1" most common in Suffolk County)
  5. Measured flow rate (GPM) at the hose bib

GOOGLE MAPS SATELLITE LINK — GENERATE FOR EVERY NEW INSTALL
When an address is provided, immediately generate and display a Google Maps satellite link:
  Format: https://www.google.com/maps/search/?api=1&query=STREET+CITY+STATE+ZIP
  Replace all spaces with + signs.

  Examples:
  "35 Gaymor Road, Hauppauge NY 11788"
  → https://www.google.com/maps/search/?api=1&query=35+Gaymor+Road+Hauppauge+NY+11788

  "26 Gansett Ln, Amagansett NY 11930"
  → https://www.google.com/maps/search/?api=1&query=26+Gansett+Ln+Amagansett+NY+11930

  "53 Michaels Lane, Shoreham NY 11786"
  → https://www.google.com/maps/search/?api=1&query=53+Michaels+Lane+Shoreham+NY+11786

Always tell the user: "Tap this link to open the property in Google Maps satellite view.
Use the Measure Distance tool (right-click on map → Measure distance) to trace the lawn
and bed areas. Note the square footage of each irrigation zone area before the site visit."

PROPERTY SIZE → IRRIGATED AREA ESTIMATION
Use these Suffolk County benchmarks when lot size is known:
  • 1/4 acre  (10,890 sq ft) → ~6,000–7,500 sq ft irrigated lawn
  • 1/3 acre  (14,520 sq ft) → ~8,000–10,000 sq ft irrigated
  • 1/2 acre  (21,780 sq ft) → ~12,000–15,000 sq ft irrigated
  • 3/4 acre  (32,670 sq ft) → ~18,000–22,000 sq ft irrigated
  • 1 acre    (43,560 sq ft) → ~25,000–30,000 sq ft irrigated
  Deduct ~25–35% for house footprint, driveway, hardscape, and planting beds.
  Add a separate estimate for bed/border areas to be served by spray heads.

HEAD COVERAGE → PRELIMINARY HEAD COUNT
  K-Rain RPS 75 Rotor: covers ~400 sq ft per head (standard Long Island lawn estimate)
  K-Rain Pro-S Spray Head: covers ~120 sq ft per head

  Total rotors needed  = Irrigated lawn sq ft ÷ 400
  Total spray heads    = Irrigated bed sq ft ÷ 120

STEP 1 — WORKING PRESSURE
  Working pressure = Static pressure × 0.75
  Example: 80 psi static → 60 psi working pressure

STEP 2 — AVAILABLE FLOW (GPM)
  Safe zone flow = Measured GPM × 0.75
  Meter size maximums:
    3/4" meter:    10–12 GPM max
    1" meter:      15–18 GPM max
    1-1/4" meter:  20–25 GPM max
  Use the LOWER of measured flow × 0.75 vs meter size max.

STEP 3 — HEAD FLOW RATES
  K-Rain RPS 75 Rotor: 2.0 GPM per head — CONFIRMED T&R STANDARD, use this value always
  K-Rain Pro-S Spray:  ~1.5 GPM per head (conservative estimate)
  NEVER mix rotors and spray heads on the same zone.

STEP 4 — HEADS PER ZONE
  Max rotors per zone  = Safe zone GPM ÷ 2.0 (round down) — confirmed T&R standard
  Max spray per zone   = Safe zone GPM ÷ 1.5 (round down)

STEP 5 — ZONE COUNT
  Rotor zones  = Total rotors needed ÷ Max rotors per zone (round up)
  Spray zones  = Total spray heads needed ÷ Max spray per zone (round up)
  Total zones  = Rotor zones + Spray zones + Drip zones (if applicable)
  Add 1 buffer zone to controller recommendation for future expansion.

COMPLETE DESIGN EXAMPLE WITH ADDRESS:
  Customer: Gary Dubovick — 6 Halsey Manor, Manorville NY 11949
  Google Maps: https://www.google.com/maps/search/?api=1&query=6+Halsey+Manor+Manorville+NY+11949
  Lot: ~1/3 acre → estimated 8,500 sq ft lawn + 600 sq ft beds
  Static: 80 psi → working: 60 psi
  Meter: 3/4" | Flow: 10 GPM → safe zone flow: 7.5 GPM

  HEAD COUNT:
    Lawn rotors:  8,500 ÷ 400 = ~21 rotors
    Bed sprays:   600 ÷ 120   = ~5 spray heads

  ZONE BREAKDOWN:
    Max rotors/zone:  7.5 ÷ 2.0 = 3 rotors per zone
    Max sprays/zone:  7.5 ÷ 1.5 = 5 spray heads per zone
    Rotor zones:      21 ÷ 3    = 7 zones
    Spray zones:      5 ÷ 5     = 1 zone
    TOTAL:            8 zones → recommend 9-zone controller

  MATERIAL HIGHLIGHTS:
    ~21 K-Rain RPS 75 Rotors + 21x 3/4" nipples
    ~5 K-Rain Pro-S Spray Heads + 5x 1/2" nipples + 5x Hunter nozzles
    8x Irritrol solenoid valves + 8x manifold tees + 8x 1" close nipples
    1x Hunter Pro-C 9-zone controller
    1x 3/4" double check backflow preventer ($233)
    Poly pipe, fittings, clamps, 18/13 wire, copper supply plumbing
    Ditch Witch rental
    Estimated total: $4,500–$6,000 depending on pipe run lengths

REAL PROPERTY EXAMPLES FROM T&R JOBS:
  Matt Marsicano, 53 Michaels Ln Shoreham — 90 psi, 1" meter, 0.785 acres → 7 zones
  Steve Rimoli, 17 Sarah Dr Hauppauge — 3/4" service line → 7 zones
  Tom Scott, 26 Gansett Ln Amagansett — 3/4" service line → 9 zones
  Frank, 20 Tern Ct Bayshore — 3/4" service, pump system → 12 zones
  Amanda Tooker, 15 River Ave Eastport — 1" service line → 4 zones

LONG ISLAND WATER NOTES:
  • Suffolk County municipal: 60–90 psi static typical
  • Well water: always measure — pressure and flow vary widely
  • Below 45 psi: pressure booster pump may be needed
  • Above 100 psi: install pressure regulator to protect heads
  • Sandy LI soil drains fast — rotors preferred for lawn areas

DESIGN OUTPUT FORMAT — always present in this order:
  1. Customer name + address
  2. Google Maps satellite link
  3. Lot size + estimated irrigated area (lawn vs beds)
  4. Static pressure → working pressure
  5. Meter size + measured GPM → safe zone GPM
  6. Head count estimate (rotors + spray)
  7. Heads per zone calculation
  8. Zone breakdown (rotor / spray / drip)
  9. Controller size
  10. Valve count
  11. Material list
  12. Price range

GPM MEASUREMENT — if customer doesn't know:
  "Fill a 5-gallon bucket and time it. GPM = 5 ÷ seconds × 60.
   (30 seconds to fill = 10 GPM). Or we measure it on-site."


════════════════════════════════════════
QUOTING RULES
════════════════════════════════════════
1. Always list materials needed alongside the quote, not just the price
2. For startups, always note: "Additional repairs quoted separately if needed during service"
3. For line breaks, always specify pipe diameter in the quote (1" vs 3/4")
4. For multi-service jobs, itemize every line separately before subtotal
5. Round material quantities up — always better to have extra on the truck
6. For jobs with unknown scope (e.g. "system not working"), recommend a service call ($95) first to diagnose before committing to repair price
7. Always apply 8.75% NY sales tax and show the full total

════════════════════════════════════════
FAULT DIAGNOSIS RULES
════════════════════════════════════════
When a customer describes a problem, list probable causes in order of likelihood:
1. Start with the simplest/cheapest fix first
2. Note which zone vs system-wide to narrow diagnosis
3. Common Long Island issues: poly pipe freeze damage in spring, head damage from mowers, solenoid failure from power surge, controller battery death, backflow preventer freeze crack
4. Always recommend a service call if diagnosis is unclear remotely

════════════════════════════════════════
SCHEDULING NOTES
════════════════════════════════════════
- Two technicians: Robert and Thomas Pellicci
- Service area: Suffolk County, Long Island NY
- Top client clusters: Manorville (most clients), Bay Shore, Miller Place, Wading River, Port Jefferson Station
- For routing, group by geography to minimize drive time
- Spring startup season: April–May (book early, slots fill fast)
- Winterization season: mid-October to early November
- Always stagger startup campaigns to avoid overbooking both techs

Be specific, practical, and concise. Always show your work on quotes.`;


// ─── PERSISTENT STORAGE HELPERS ──────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(`triflow_${key}`);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const save = (key, val) => {
  try { localStorage.setItem(`triflow_${key}`, JSON.stringify(val)); } catch {}
};

export default function TRIrrigationApp() {
  const [active, setActive] = useState("calendar");
  const [jobs, setJobs] = useState(() => load("jobs", seedJobs()));
  const [inventory, setInventory] = useState(() => load("inventory", INIT_INVENTORY));
  const [calView, setCalView] = useState("week");
  const [calDate, setCalDate] = useState(new Date());
  const [showJobModal, setShowJobModal] = useState(false);
  const [newJob, setNewJob] = useState({ client: "", service: "startup", tech: "robert", date: fmt(today), time: "09:00", notes: "" });
  const [availBlocks, setAvailBlocks] = useState(() => load("availBlocks", { robert: { start: "08:00", end: "17:00", lunch: true }, thomas: { start: "08:00", end: "17:00", lunch: true } }));
  const [showAvailModal, setShowAvailModal] = useState(false);
  const [editTech, setEditTech] = useState("robert");
  const [invClient, setInvClient] = useState("");
  const [invLines, setInvLines] = useState([]);
  const [invSent, setInvSent] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [selClient, setSelClient] = useState(null);
  const [smsCampaign, setSmsCampaign] = useState({ type: "startup", sending: false, sent: false, testSent: false, testSending: false, testMode: true, testPhone: "", testName: "Robert", msg: "Hi {name}, it's Robert & Thomas from T&R Irrigation! Spring startup season is here. Reply YES to schedule or tap: [booking link] — (631) 494-2813. Reply STOP to opt out." });
  const [aiChats, setAiChats] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEnd = useRef(null);

  // ─── PERSIST TO LOCALSTORAGE ON CHANGE ────────────────────────────────────
  useEffect(() => { save("jobs", jobs); }, [jobs]);
  useEffect(() => { save("inventory", inventory); }, [inventory]);
  useEffect(() => { save("availBlocks", availBlocks); }, [availBlocks]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [aiChats, aiLoading]);


  const getWeekDates = (d) => {
    const s = new Date(d); s.setDate(d.getDate() - d.getDay());
    return Array.from({ length: 7 }, (_, i) => { const dd = new Date(s); dd.setDate(s.getDate() + i); return dd; });
  };
  const weekDates = getWeekDates(calDate);
  const jobsForDate = (ds) => jobs.filter(j => j.date === ds);
  const jobsForTechDate = (tech, ds) => jobs.filter(j => j.tech === tech && j.date === ds);

  const addLine = (svcId) => {
    const svc = SERVICES.find(s => s.id === svcId);
    if (!svc) return;
    setInvLines(p => [...p, { id: Date.now(), svcId, name: svc.name, qty: 1, rate: svc.rate }]);
    svc.parts.forEach(p => setInventory(prev => prev.map(i => i.id === p.id ? { ...i, qty: Math.max(0, i.qty - p.qty) } : i)));
  };
  const subtotal = invLines.reduce((s, l) => s + l.qty * l.rate, 0);
  const invTotal = subtotal + subtotal * TAX;
  const invNum = `INV${String(Date.now()).slice(-5)}`;

  const sendAI = async (text) => {
    const msg = text || aiInput.trim();
    if (!msg || aiLoading) return;
    setAiInput(""); setAiLoading(true);
    const history = [...aiChats, { role: "user", content: msg }];
    setAiChats(history);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "x-api-key": process.env.REACT_APP_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: AI_SYSTEM, messages: history.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setAiChats([...history, { role: "assistant", content: data.content?.[0]?.text || "No response." }]);
    } catch { setAiChats([...history, { role: "assistant", content: "Connection error." }]); }
    setAiLoading(false);
  };

  const lowStock = inventory.filter(i => i.qty <= i.reorder);
  const clientsWithBalance = CLIENTS.filter(c => c.balance > 0);
  const filteredClients = CLIENTS.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.city.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.zip.includes(clientSearch)
  );
  const mod = MODULES.find(m => m.id === active);

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        textarea:focus,input:focus,select:focus{outline:none}
      `}</style>

      {/* HEADER */}
      <div style={S.header}>
        <div style={S.brand}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="7" fill="#0c2040"/>
            <circle cx="15" cy="15" r="10" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
            <path d="M15 7c0 0-5 5.5-5 9a5 5 0 0010 0C20 12.5 15 7 15 7z" fill="#3b82f6" opacity=".85"/>
            <line x1="15" y1="10.5" x2="15" y2="19.5" stroke="#060f1a" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#060f1a" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={S.brandName}>T&R Irrigation LLC</div>
            <div style={S.brandSub}>Rocky Point NY · Robert & Thomas Pellicci · (631) 494-2813</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {lowStock.length > 0 && <div style={S.alertPill}>⚠ {lowStock.length} low stock</div>}
          {clientsWithBalance.map(c => <div key={c.name} style={S.balPill}>⚠ {c.name.split(" ")[0]}: ${c.balance}</div>)}
          <div style={S.livePill}>● Live</div>
        </div>
      </div>

      <div style={S.body}>
        {/* SIDEBAR */}
        <div style={S.sidebar}>
          {MODULES.map(m => (
            <button key={m.id} onClick={() => setActive(m.id)} style={{ ...S.navBtn, ...(active === m.id ? { background: "#0c1a2e", borderLeftColor: m.color } : {}) }}>
              <span style={{ fontSize: 15 }}>{m.icon}</span>
              <div>
                <div style={{ ...S.navLabel, color: active === m.id ? "#e2e8f0" : "#64748b" }}>{m.label}</div>
                <div style={S.navDesc}>{m.desc}</div>
              </div>
            </button>
          ))}
          <div style={S.divider} />
          <div style={{ padding: "0 6px" }}>
            <div style={S.sLabel}>TECHNICIANS</div>
            {Object.entries(TECHS).map(([key, t]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 2px", marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{t.name.split(" ")[0]}</div>
                  <div style={{ fontSize: 9, color: "#334155" }}>{availBlocks[key].start}–{availBlocks[key].end}</div>
                </div>
              </div>
            ))}
            <button onClick={() => setShowAvailModal(true)} style={S.smallBtn}>Edit Hours</button>
          </div>
        </div>

        {/* MAIN */}
        <div style={S.main}>
          <div style={{ ...S.modBar, borderBottomColor: mod.color + "44" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{mod.icon}</span>
              <div>
                <div style={{ ...S.modTitle, color: mod.color }}>{mod.label}</div>
                <div style={S.modDesc}>{mod.desc}</div>
              </div>
            </div>
            {active === "calendar" && (
              <button onClick={() => setShowJobModal(true)} style={S.addBtn}>+ Book Job</button>
            )}
          </div>

          {/* ══ CALENDAR ══ */}
          {active === "calendar" && (
            <div style={S.scroll}>
              <div style={S.calCtrl}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => { const d = new Date(calDate); d.setDate(d.getDate() - 7); setCalDate(d); }} style={S.navBtnSm}>‹</button>
                  <button onClick={() => setCalDate(new Date())} style={S.navBtnSm}>Today</button>
                  <button onClick={() => { const d = new Date(calDate); d.setDate(d.getDate() + 7); setCalDate(d); }} style={S.navBtnSm}>›</button>
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, color: "#e2e8f0", letterSpacing: "0.04em" }}>
                  {calDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["week", "employee"].map(v => (
                    <button key={v} onClick={() => setCalView(v)} style={{ ...S.viewBtn, ...(calView === v ? { background: "#1e3a5f", color: "#60a5fa" } : {}) }}>
                      {v === "employee" ? "By Tech" : "Week"}
                    </button>
                  ))}
                </div>
              </div>

              {calView === "week" && (
                <div style={{ overflowX: "auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(110px,1fr))", minWidth: 700 }}>
                    {weekDates.map((d, i) => {
                      const ds = fmt(d); const isToday = ds === fmt(new Date());
                      return (
                        <div key={i} style={{ borderRight: "1px solid #0c2040", minHeight: 300, borderTop: isToday ? "2px solid #3b82f6" : "2px solid transparent" }}>
                          <div style={{ padding: "8px 8px 6px", borderBottom: "1px solid #0c2040", background: "#07111f", textAlign: "center" }}>
                            <div style={{ fontSize: 10, color: isToday ? "#3b82f6" : "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                              {d.toLocaleDateString("en-US", { weekday: "short" })}
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: isToday ? "#3b82f6" : "#94a3b8", fontFamily: "'Barlow Condensed', sans-serif" }}>{d.getDate()}</div>
                          </div>
                          <div style={{ padding: "6px 5px", display: "flex", flexDirection: "column", gap: 4 }}>
                            {jobsForDate(ds).map(job => {
                              const svc = SERVICES.find(s => s.id === job.service);
                              const tech = TECHS[job.tech];
                              return (
                                <div key={job.id} style={{ padding: "5px 7px", borderRadius: 7, borderLeft: `3px solid ${tech.color}`, background: job.status === "complete" ? "#0d1f0d" : "#0c1a2e" }}>
                                  <div style={{ fontSize: 9, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>{job.time}</div>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: job.status === "complete" ? "#4ade80" : "#e2e8f0", lineHeight: 1.2 }}>{job.client}</div>
                                  <div style={{ fontSize: 10, color: "#475569" }}>{svc?.name}</div>
                                  <div style={{ fontSize: 9, color: tech.color, marginTop: 1 }}>{tech.name.split(" ")[0]}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {calView === "employee" && (
                <div style={{ overflowX: "auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr", minWidth: 480 }}>
                    <div style={{ background: "#07111f", borderRight: "1px solid #0c2040", borderBottom: "1px solid #0c2040" }} />
                    {Object.entries(TECHS).map(([key, t]) => (
                      <div key={key} style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #0c2040", background: "#07111f", borderLeft: `3px solid ${t.color}` }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{t.name}</div>
                          <div style={{ fontSize: 10, color: "#475569" }}>{availBlocks[key].start} – {availBlocks[key].end}{availBlocks[key].lunch ? " · Lunch 12–1pm" : ""}</div>
                        </div>
                      </div>
                    ))}
                    {weekDates.map((d, i) => {
                      const ds = fmt(d); const isToday = ds === fmt(new Date());
                      return [
                        <div key={`lbl-${i}`} style={{ padding: "8px 6px", textAlign: "center", borderBottom: "1px solid #0c2040", borderRight: "1px solid #0c2040", background: "#07111f" }}>
                          <div style={{ fontSize: 9, color: isToday ? "#3b82f6" : "#475569", fontFamily: "'JetBrains Mono', monospace" }}>{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: isToday ? "#3b82f6" : "#64748b", fontFamily: "'Barlow Condensed', sans-serif" }}>{d.getDate()}</div>
                        </div>,
                        ...Object.keys(TECHS).map(techKey => (
                          <div key={`${techKey}-${i}`} style={{ padding: "6px 8px", borderBottom: "1px solid #0c2040", borderLeft: "1px solid #0c2040", minHeight: 70, display: "flex", flexDirection: "column", gap: 4 }}>
                            {jobsForTechDate(techKey, ds).map(job => {
                              const svc = SERVICES.find(s => s.id === job.service);
                              return (
                                <div key={job.id} style={{ padding: "4px 8px", borderRadius: 6, background: job.status === "complete" ? "#0d1f0d" : "#0c2040", border: `1px solid ${TECHS[techKey].color}33`, display: "flex", flexDirection: "column", gap: 1 }}>
                                  <span style={{ fontSize: 9, color: TECHS[techKey].color, fontFamily: "'JetBrains Mono', monospace" }}>{job.time}</span>
                                  <span style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 600 }}>{job.client}</span>
                                  <span style={{ fontSize: 10, color: "#475569" }}>{svc?.name}</span>
                                </div>
                              );
                            })}
                            {jobsForTechDate(techKey, ds).length === 0 && (
                              <div style={{ fontSize: 10, color: "#1e3a5f", padding: "6px 4px" }}>Available</div>
                            )}
                          </div>
                        ))
                      ];
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ INVOICE ══ */}
          {active === "invoice" && (
            <div style={S.scroll}>
              {!invSent ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, padding: "14px 18px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={S.card}>
                      <div style={S.cardLabel}>CLIENT</div>
                      <select value={invClient} onChange={e => setInvClient(e.target.value)} style={S.sel}>
                        <option value="">Select client...</option>
                        {CLIENTS.map(c => <option key={c.name} value={c.name}>{c.name} — {c.city}</option>)}
                      </select>
                    </div>
                    <div style={S.card}>
                      <div style={S.cardLabel}>ADD SERVICES — tap to add to invoice</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {SERVICES.map(svc => (
                          <button key={svc.id} onClick={() => addLine(svc.id)} style={S.svcBtn}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", textAlign: "left" }}>{svc.name}</span>
                            <span style={{ fontSize: 11, color: "#10b981", fontFamily: "'JetBrains Mono', monospace" }}>{cur(svc.rate)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    {invLines.length > 0 && (
                      <div style={S.card}>
                        <div style={S.cardLabel}>LINE ITEMS</div>
                        {invLines.map(line => (
                          <div key={line.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid #0c2040" }}>
                            <span style={{ flex: 1, fontSize: 13, color: "#e2e8f0" }}>{line.name}</span>
                            <button onClick={() => setInvLines(p => p.map(l => l.id === line.id ? { ...l, qty: Math.max(1, l.qty - 1) } : l))} style={S.qBtn}>−</button>
                            <span style={{ fontSize: 13, color: "#94a3b8", minWidth: 16, textAlign: "center" }}>{line.qty}</span>
                            <button onClick={() => setInvLines(p => p.map(l => l.id === line.id ? { ...l, qty: l.qty + 1 } : l))} style={S.qBtn}>+</button>
                            <span style={{ fontSize: 13, color: "#10b981", fontFamily: "'JetBrains Mono', monospace", minWidth: 60, textAlign: "right" }}>{cur(line.qty * line.rate)}</span>
                            <button onClick={() => setInvLines(p => p.filter(l => l.id !== line.id))} style={{ ...S.qBtn, color: "#ef4444" }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ ...S.card, flex: 1 }}>
                      <div style={S.cardLabel}>INVOICE PREVIEW</div>
                      <div style={{ paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid #0c2040" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#3b82f6", fontFamily: "'Barlow Condensed', sans-serif" }}>T&R Irrigation LLC</div>
                        <div style={{ fontSize: 10, color: "#475569" }}>678 Route 25A, Rocky Point NY 11778</div>
                        <div style={{ fontSize: 10, color: "#475569" }}>(631) 494-2813</div>
                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontSize: 10, color: "#334155" }}>Invoice #: {invNum}</div>
                          <div style={{ fontSize: 10, color: "#334155" }}>Date: {new Date().toLocaleDateString()}</div>
                          <div style={{ fontSize: 10, color: "#334155" }}>Due: {new Date(Date.now() + 30 * 86400000).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {invClient && <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Bill to: <strong style={{ color: "#e2e8f0" }}>{invClient}</strong></div>}
                      {invLines.map(l => (
                        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "3px 0", borderBottom: "1px solid #0c2040" }}>
                          <span style={{ color: "#94a3b8" }}>{l.name} × {l.qty}</span>
                          <span style={{ color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>{cur(l.qty * l.rate)}</span>
                        </div>
                      ))}
                      {invLines.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          {[["Subtotal", cur(subtotal)], ["Tax 8.75%", cur(subtotal * TAX)]].map(([k, v]) => (
                            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#475569", marginBottom: 3 }}>
                              <span>{k}</span><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: "#10b981", borderTop: "1px solid #1e3a5f", paddingTop: 6, marginTop: 4 }}>
                            <span>Total</span><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{cur(invTotal)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {[["📨 Send via SMS", "#10b981"], ["📧 Send via Email", "#3b82f6"]].map(([label, bg]) => (
                      <button key={label} onClick={() => { if (invClient && invLines.length) setInvSent(true); }}
                        disabled={!invClient || !invLines.length}
                        style={{ padding: "11px 0", border: "none", borderRadius: 9, color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "'Barlow', sans-serif", background: (!invClient || !invLines.length) ? "#1e293b" : bg, cursor: (!invClient || !invLines.length) ? "not-allowed" : "pointer" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 14, padding: 40 }}>
                  <div style={{ fontSize: 48 }}>✅</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#10b981", fontFamily: "'Barlow Condensed', sans-serif" }}>Invoice Sent!</div>
                  <div style={{ fontSize: 13, color: "#64748b", textAlign: "center" }}>
                    {invClient} received invoice {invNum} for {cur(invTotal)}<br />
                    Pay Now link delivered · QuickBooks updated · Inventory adjusted
                  </div>
                  <button onClick={() => { setInvLines([]); setInvClient(""); setInvSent(false); }} style={S.addBtn}>+ New Invoice</button>
                </div>
              )}
            </div>
          )}

          {/* ══ INVENTORY ══ */}
          {active === "inventory" && (
            <div style={S.scroll}>
              <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                {lowStock.length > 0 && (
                  <div style={{ background: "#3d1a00", border: "1px solid #92400e", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24", marginBottom: 6 }}>⚠ LOW STOCK — {lowStock.length} item(s) need reordering</div>
                    {lowStock.map(i => <div key={i.id} style={{ fontSize: 12, color: "#f97316", marginBottom: 2 }}>• {i.name}: {i.qty} left (reorder at {i.reorder})</div>)}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 8 }}>
                  {inventory.map(item => {
                    const isLow = item.qty <= item.reorder;
                    const pct = Math.min(100, (item.qty / Math.max(item.reorder * 4, 1)) * 100);
                    return (
                      <div key={item.id} style={{ background: "#0c1a2e", border: `1px solid ${isLow ? "#92400e" : "#0c2040"}`, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", flex: 1, lineHeight: 1.3 }}>{item.name}</div>
                          {isLow && <div style={{ fontSize: 9, color: "#fbbf24", background: "#3d1a00", padding: "2px 6px", borderRadius: 8, marginLeft: 6 }}>LOW</div>}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 13, color: isLow ? "#f97316" : "#10b981", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{item.qty} units</span>
                          <span style={{ fontSize: 10, color: "#334155" }}>Min: {item.reorder}</span>
                        </div>
                        <div style={{ height: 4, background: "#0c2040", borderRadius: 2, marginBottom: 8 }}>
                          <div style={{ height: 4, width: `${pct}%`, background: isLow ? "#f97316" : "#10b981", borderRadius: 2 }} />
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button onClick={() => setInventory(p => p.map(i => i.id === item.id ? { ...i, qty: Math.max(0, i.qty - 1) } : i))} style={{ ...S.invBtn, color: "#ef4444" }}>−1</button>
                          <button onClick={() => setInventory(p => p.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} style={S.invBtn}>+1</button>
                          <button onClick={() => setInventory(p => p.map(i => i.id === item.id ? { ...i, qty: i.reorder * 4 } : i))} style={{ ...S.invBtn, flex: 1, color: "#fbbf24" }}>Restock</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══ SMS ══ */}
          {active === "sms" && (
            <div style={S.scroll}>
              <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 14, alignItems: "start" }}>

                {/* LEFT COLUMN — controls */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* Campaign type */}
                  <div style={S.card}>
                    <div style={S.cardLabel}>CAMPAIGN TYPE</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {[
                        { key: "startup", label: "🌱 Spring Startup", msg: "Hi {name}, it's Robert & Thomas from T&R Irrigation! Spring startup season is here — we're booking April slots now. Reply YES to schedule or tap: [booking link] — (631) 494-2813. Reply STOP to opt out." },
                        { key: "winter", label: "❄️ Winterization", msg: "Hi {name}, T&R Irrigation here! Time to schedule your winterization blowout before the first freeze. Slots are limited — reply BOOK or call (631) 494-2813. Reply STOP to opt out." },
                        { key: "midseason", label: "🔧 Mid-Season", msg: "Hi {name}, Robert & Thomas from T&R Irrigation. Is your system running well this summer? We're offering mid-season check-ups for $65. Reply CHECK to schedule. Reply STOP to opt out." },
                      ].map(c => (
                        <button key={c.key} onClick={() => setSmsCampaign(p => ({ ...p, type: c.key, msg: c.msg, sent: false, testSent: false }))}
                          style={{ padding: "10px 8px", background: smsCampaign.type === c.key ? "#1e3a5f" : "#0c1a2e", border: `1px solid ${smsCampaign.type === c.key ? "#3b82f6" : "#1e3a5f"}`, borderRadius: 8, color: smsCampaign.type === c.key ? "#60a5fa" : "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "'Barlow', sans-serif", textAlign: "center" }}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message editor */}
                  <div style={S.card}>
                    <div style={S.cardLabel}>MESSAGE — {"{name}"} is replaced with each client's first name</div>
                    <textarea value={smsCampaign.msg} onChange={e => setSmsCampaign(p => ({ ...p, msg: e.target.value, testSent: false }))} rows={4}
                      style={{ width: "100%", background: "#060f1a", border: "1px solid #1e3a5f", borderRadius: 8, color: "#e2e8f0", padding: "10px 12px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", resize: "vertical", lineHeight: 1.6 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                      <span style={{ fontSize: 10, color: "#334155" }}>{smsCampaign.msg.length} characters</span>
                      <span style={{ fontSize: 10, color: smsCampaign.msg.length > 160 ? "#f97316" : "#334155" }}>
                        {smsCampaign.msg.length > 160 ? `⚠ ${Math.ceil(smsCampaign.msg.length / 160)} SMS segments` : "✓ 1 SMS segment"}
                      </span>
                    </div>
                  </div>

                  {/* ── TEST MODE PANEL ── */}
                  <div style={{ background: "#0c1a2e", border: "2px solid #f59e0b", borderRadius: 10, padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>TEST MODE</span>
                      <span style={{ fontSize: 10, color: "#475569", marginLeft: 4 }}>Send to yourself before going live</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                      <div>
                        <label style={S.fLabel}>YOUR PHONE NUMBER</label>
                        <input value={smsCampaign.testPhone} onChange={e => setSmsCampaign(p => ({ ...p, testPhone: e.target.value, testSent: false }))}
                          placeholder="(631) 494-2813" style={{ ...S.sel, fontSize: 13 }} />
                      </div>
                      <div>
                        <label style={S.fLabel}>PREVIEW AS NAME</label>
                        <input value={smsCampaign.testName} onChange={e => setSmsCampaign(p => ({ ...p, testName: e.target.value, testSent: false }))}
                          placeholder="Robert" style={{ ...S.sel, fontSize: 13 }} />
                      </div>
                    </div>

                    {/* Preview of rendered message */}
                    <div style={{ background: "#060f1a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                      <div style={{ fontSize: 9, color: "#475569", fontFamily: "'JetBrains Mono', monospace", marginBottom: 5 }}>MESSAGE PREVIEW — as {smsCampaign.testName || "Robert"} will see it:</div>
                      <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {smsCampaign.msg.replace(/\{name\}/g, smsCampaign.testName || "Robert")}
                      </div>
                    </div>

                    {!smsCampaign.testSent ? (
                      <button
                        onClick={() => {
                          if (!smsCampaign.testPhone) return;
                          setSmsCampaign(p => ({ ...p, testSending: true }));
                          setTimeout(() => setSmsCampaign(p => ({ ...p, testSending: false, testSent: true })), 1500);
                        }}
                        disabled={!smsCampaign.testPhone || smsCampaign.testSending}
                        style={{ width: "100%", padding: "10px 0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: "'Barlow', sans-serif", color: "#fff", background: smsCampaign.testSending ? "#334155" : !smsCampaign.testPhone ? "#1e293b" : "#f59e0b", cursor: !smsCampaign.testPhone || smsCampaign.testSending ? "not-allowed" : "pointer" }}>
                        {smsCampaign.testSending ? "Sending test..." : `📱 Send Test to ${smsCampaign.testPhone || "your number"}`}
                      </button>
                    ) : (
                      <div style={{ background: "#1c1400", border: "1px solid #b45309", borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 12, color: "#fbbf24", fontWeight: 700, marginBottom: 3 }}>✓ Test sent to {smsCampaign.testPhone}</div>
                        <div style={{ fontSize: 11, color: "#78716c" }}>Check your phone — message shows as {smsCampaign.testName}. Happy with it?</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <button onClick={() => setSmsCampaign(p => ({ ...p, testSent: false }))} style={{ flex: 1, padding: "6px 0", background: "#0c2040", border: "1px solid #1e3a5f", borderRadius: 6, color: "#60a5fa", cursor: "pointer", fontSize: 11, fontFamily: "'Barlow', sans-serif" }}>Edit Message</button>
                          <button onClick={() => { setSmsCampaign(p => ({ ...p, sending: true })); setTimeout(() => setSmsCampaign(p => ({ ...p, sending: false, sent: true })), 2000); }}
                            style={{ flex: 2, padding: "6px 0", background: "#8b5cf6", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'Barlow', sans-serif" }}>
                            ✓ Looks good — Send to All {CLIENTS.length} Clients
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Send to all — only shown after test */}
                  {!smsCampaign.sent && !smsCampaign.testSent && (
                    <button
                      onClick={() => { setSmsCampaign(p => ({ ...p, sending: true })); setTimeout(() => setSmsCampaign(p => ({ ...p, sending: false, sent: true })), 2000); }}
                      style={{ padding: "12px 0", border: `2px solid ${smsCampaign.testSent ? "#8b5cf6" : "#334155"}`, borderRadius: 9, color: smsCampaign.testSent ? "#fff" : "#475569", fontSize: 13, fontWeight: 700, fontFamily: "'Barlow', sans-serif", background: smsCampaign.sending ? "#334155" : smsCampaign.testSent ? "#8b5cf6" : "#0c1a2e", cursor: smsCampaign.sending ? "not-allowed" : "pointer" }}>
                      {smsCampaign.sending ? "Sending..." : `💬 Send to All ${CLIENTS.length} Clients`}
                    </button>
                  )}

                  {smsCampaign.sent && (
                    <div style={{ background: "#0d1f0d", border: "1px solid #166534", borderRadius: 10, padding: "16px", textAlign: "center" }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>✅</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#4ade80", fontFamily: "'Barlow Condensed', sans-serif" }}>Campaign Sent!</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{CLIENTS.length} clients reached · Replies appear in your Quo shared inbox</div>
                      <button onClick={() => setSmsCampaign(p => ({ ...p, sent: false, testSent: false }))} style={{ ...S.smallBtn, marginTop: 10, color: "#4ade80", borderColor: "#166534" }}>New Campaign</button>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN — client list */}
                <div style={S.card}>
                  <div style={S.cardLabel}>RECIPIENTS — {CLIENTS.length} CLIENTS</div>
                  <div style={{ maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
                    {CLIENTS.map(c => (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", background: "#060f1a", borderRadius: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.phone || c.email ? "#10b981" : "#1e3a5f", flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: "#94a3b8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                        {c.phone && <span style={{ fontSize: 9, color: "#10b981" }}>📱</span>}
                        {c.email && <span style={{ fontSize: 9, color: "#3b82f6" }}>✉</span>}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #0c2040" }}>
                    <div style={{ fontSize: 10, color: "#334155", lineHeight: 1.6 }}>
                      📱 = has phone<br />
                      ✉ = has email<br />
                      <span style={{ color: "#475569" }}>Grey dot = contact info missing</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ══ CLIENTS ══ */}
          {active === "clients" && (
            <div style={{ ...S.scroll, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#0c1a2e", border: "1px solid #1e3a5f", borderRadius: 8, padding: "9px 13px", flexShrink: 0 }}>
                <span>🔍</span>
                <input value={clientSearch} onChange={e => setClientSearch(e.target.value)} placeholder="Search name, city, or zip..." style={{ flex: 1, background: "transparent", border: "none", color: "#e2e8f0", fontSize: 13, fontFamily: "'Barlow', sans-serif" }} />
                <span style={{ fontSize: 10, color: "#334155", fontFamily: "'JetBrains Mono', monospace" }}>{filteredClients.length}</span>
              </div>
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
                {filteredClients.map((c, i) => (
                  <div key={i} onClick={() => setSelClient(selClient?.name === c.name ? null : c)}
                    style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 13px", background: "#0c1a2e", borderRadius: 9, border: `1px solid ${selClient?.name === c.name ? "#3b82f6" : "#0c2040"}`, cursor: "pointer" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#60a5fa", background: c.balance ? "#3d1a00" : "#0c2040", flexShrink: 0 }}>{c.name[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "#334155" }}>{c.address}, {c.city} {c.zip}</div>
                      {c.phone && <div style={{ fontSize: 10, color: "#1e3a5f", fontFamily: "'JetBrains Mono', monospace" }}>{c.phone}</div>}
                      {c.lastService && <div style={{ fontSize: 10, color: "#166534" }}>Last: {c.lastService}</div>}
                    </div>
                    {c.balance > 0 && <div style={{ padding: "2px 7px", background: "#3d1a00", borderRadius: 10, fontSize: 10, color: "#fbbf24", fontFamily: "'JetBrains Mono', monospace" }}>${c.balance}</div>}
                  </div>
                ))}
              </div>
              {selClient && (
                <div style={{ background: "#0c1a2e", border: "1px solid #1e3a5f", borderRadius: 10, padding: 14, flexShrink: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <strong style={{ color: "#e2e8f0", fontSize: 14 }}>{selClient.name}</strong>
                    <button onClick={() => setSelClient(null)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>✕</button>
                  </div>
                  {[["Address", `${selClient.address}, ${selClient.city} NY ${selClient.zip}`], selClient.phone && ["Phone", selClient.phone], selClient.email && ["Email", selClient.email], selClient.balance && ["Balance", `$${selClient.balance} owed`], selClient.lastService && ["Last Visit", `${selClient.lastService} — ${selClient.lastServiceDetail}`]].filter(Boolean).map(([l, v]) => (
                    <div key={l} style={{ display: "flex", gap: 10, marginBottom: 6, fontSize: 12 }}>
                      <span style={{ color: "#334155", width: 60, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, paddingTop: 1 }}>{l}</span>
                      <span style={{ color: l === "Balance" ? "#fbbf24" : "#94a3b8" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button onClick={() => { setNewJob(p => ({ ...p, client: selClient.name })); setShowJobModal(true); setActive("calendar"); }} style={{ flex: 1, padding: "8px 0", background: "#0c2040", border: "1px solid #1e3a5f", borderRadius: 7, color: "#60a5fa", cursor: "pointer", fontSize: 12, fontFamily: "'Barlow', sans-serif", textAlign: "center" }}>📅 Book Job</button>
                    <button onClick={() => { setInvClient(selClient.name); setActive("invoice"); setSelClient(null); }} style={{ flex: 1, padding: "8px 0", background: "#0c2040", border: "1px solid #166534", borderRadius: 7, color: "#4ade80", cursor: "pointer", fontSize: 12, fontFamily: "'Barlow', sans-serif", textAlign: "center" }}>📋 Invoice</button>
                    {selClient.balance > 0 && <button onClick={() => { sendAI(`Draft a polite follow-up message for ${selClient.name} about their outstanding balance of $${selClient.balance}`); setActive("ai"); setSelClient(null); }} style={{ flex: 1, padding: "8px 0", background: "#3d1a00", border: "1px solid #92400e", borderRadius: 7, color: "#fbbf24", cursor: "pointer", fontSize: 12, fontFamily: "'Barlow', sans-serif", textAlign: "center" }}>⚠ Follow Up</button>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ AI ══ */}
          {active === "ai" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 13 }}>
                {aiChats.length === 0 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px", gap: 10 }}>
                    <div style={{ fontSize: 34 }}>🤖</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444", fontFamily: "'Barlow Condensed', sans-serif" }}>T&R AI Assistant</div>
                    <div style={{ fontSize: 12, color: "#334155", textAlign: "center" }}>Real pricing, 49 clients & Long Island geography loaded</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 8, maxWidth: 540 }}>
                      {["Diagnose: one zone won't turn on", "Quote spring startup for Danny O'Sullivan", "Route Manorville clients for Monday", "Winterization checklist for Long Island", "Which clients are overdue for service?", "Low pressure troubleshooting steps"].map((q, i) => (
                        <button key={i} onClick={() => sendAI(q)} style={{ padding: "9px 13px", background: "#0c1a2e", border: "1px solid #0c2040", borderRadius: 7, color: "#475569", fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "'Barlow', sans-serif", lineHeight: 1.4 }}>{q}</button>
                      ))}
                    </div>
                  </div>
                )}
                {aiChats.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-end", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp 0.18s ease" }}>
                    {m.role === "assistant" && <div style={{ width: 30, height: 30, borderRadius: 6, background: "#0c2040", border: "1px solid #1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: "#60a5fa", flexShrink: 0 }}>T&R</div>}
                    <div style={{ maxWidth: "76%", padding: "10px 14px", borderRadius: 11, ...(m.role === "user" ? { background: "#ef4444", color: "#fff", borderBottomRightRadius: 3 } : { background: "#0c1a2e", border: "1px solid #1e3a5f", borderBottomLeftRadius: 3, color: "#94a3b8" }) }}>
                      <pre style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.7 }}>{m.content}</pre>
                    </div>
                    {m.role === "user" && <div style={{ width: 30, height: 30, borderRadius: 6, background: "#0c1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontFamily: "'JetBrains Mono', monospace", color: "#334155", flexShrink: 0 }}>YOU</div>}
                  </div>
                ))}
                {aiLoading && (
                  <div style={{ display: "flex", gap: 9, alignItems: "flex-end" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 6, background: "#0c2040", border: "1px solid #1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: "#60a5fa", flexShrink: 0 }}>T&R</div>
                    <div style={{ padding: "10px 14px", borderRadius: 11, background: "#0c1a2e", border: "1px solid #1e3a5f" }}>
                      <div style={{ display: "flex", gap: 5 }}>{[0, 1, 2].map(n => <div key={n} style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", animation: `pulse 1.2s ${n * 0.2}s infinite` }} />)}</div>
                    </div>
                  </div>
                )}
                <div ref={chatEnd} />
              </div>
              <div style={{ display: "flex", gap: 8, padding: "12px 18px", borderTop: "1px solid #0c2040" }}>
                <textarea value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAI(); } }} placeholder="Ask about diagnosis, quoting, scheduling, routing..." rows={2}
                  style={{ flex: 1, background: "#0c1a2e", border: "1px solid #1e3a5f", borderRadius: 9, color: "#e2e8f0", padding: "10px 13px", fontSize: 13, fontFamily: "'Barlow', sans-serif", resize: "none", lineHeight: 1.5 }} />
                <button onClick={() => sendAI()} disabled={aiLoading || !aiInput.trim()}
                  style={{ width: 42, borderRadius: 9, border: "none", color: "#fff", fontSize: 19, background: aiLoading || !aiInput.trim() ? "#1e293b" : "#ef4444", cursor: aiLoading || !aiInput.trim() ? "not-allowed" : "pointer" }}>↑</button>
              </div>
              <div style={{ fontSize: 10, color: "#0c2040", textAlign: "center", padding: "3px 0 7px", fontFamily: "'JetBrains Mono', monospace" }}>Enter to send · Shift+Enter for new line</div>
            </div>
          )}
        </div>
      </div>

      {/* ══ BOOK JOB MODAL ══ */}
      {showJobModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowJobModal(false)}>
          <div style={{ background: "#0c1a2e", border: "1px solid #1e3a5f", borderRadius: 14, padding: 22, width: "min(460px,94vw)", maxHeight: "90vh", overflowY: "auto", animation: "slideIn 0.2s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Barlow Condensed', sans-serif" }}>Book New Job</div>
              <button onClick={() => setShowJobModal(false)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Client", <select value={newJob.client} onChange={e => setNewJob(p => ({ ...p, client: e.target.value }))} style={S.sel}><option value="">Select client...</option>{CLIENTS.map(c => <option key={c.name} value={c.name}>{c.name} — {c.city}</option>)}</select>],
                ["Service", <select value={newJob.service} onChange={e => setNewJob(p => ({ ...p, service: e.target.value }))} style={S.sel}>{SERVICES.map(s => <option key={s.id} value={s.id}>{s.name} — {cur(s.rate)}</option>)}</select>],
              ].map(([label, field]) => (
                <div key={label}><label style={S.fLabel}>{label}</label>{field}</div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={S.fLabel}>Technician</label>
                  <select value={newJob.tech} onChange={e => setNewJob(p => ({ ...p, tech: e.target.value }))} style={S.sel}>
                    <option value="robert">Robert Pellicci</option>
                    <option value="thomas">Thomas Pellicci</option>
                  </select>
                </div>
                <div>
                  <label style={S.fLabel}>Time</label>
                  <input type="time" value={newJob.time} onChange={e => setNewJob(p => ({ ...p, time: e.target.value }))} style={S.sel} />
                </div>
              </div>
              <div><label style={S.fLabel}>Date</label><input type="date" value={newJob.date} onChange={e => setNewJob(p => ({ ...p, date: e.target.value }))} style={S.sel} /></div>
              <div><label style={S.fLabel}>Notes</label><input value={newJob.notes} onChange={e => setNewJob(p => ({ ...p, notes: e.target.value }))} placeholder="e.g. 6 zones, gate code 1234" style={S.sel} /></div>
              {newJob.date && newJob.tech && (
                <div style={{ background: "#060f1a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>{TECHS[newJob.tech].name} — {new Date(newJob.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</div>
                  {jobsForTechDate(newJob.tech, newJob.date).length === 0
                    ? <div style={{ fontSize: 12, color: "#10b981" }}>✓ Fully available</div>
                    : jobsForTechDate(newJob.tech, newJob.date).map(j => <div key={j.id} style={{ fontSize: 12, color: "#f59e0b" }}>⚠ {j.time} — {j.client}</div>)
                  }
                </div>
              )}
              <button onClick={() => { if (!newJob.client) return; setJobs(p => [...p, { ...newJob, id: `j${Date.now()}`, status: "scheduled" }]); setShowJobModal(false); setNewJob({ client: "", service: "startup", tech: "robert", date: fmt(today), time: "09:00", notes: "" }); }}
                style={{ padding: "11px 0", background: "#3b82f6", border: "none", borderRadius: 9, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'Barlow', sans-serif", cursor: "pointer", marginTop: 4 }}>
                ✓ Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ AVAILABILITY MODAL ══ */}
      {showAvailModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowAvailModal(false)}>
          <div style={{ background: "#0c1a2e", border: "1px solid #1e3a5f", borderRadius: 14, padding: 22, width: "min(400px,94vw)", animation: "slideIn 0.2s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Barlow Condensed', sans-serif" }}>Edit Working Hours</div>
              <button onClick={() => setShowAvailModal(false)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {Object.entries(TECHS).map(([key, t]) => (
                <button key={key} onClick={() => setEditTech(key)} style={{ flex: 1, padding: "8px 0", background: editTech === key ? "#1e3a5f" : "#060f1a", border: `1px solid ${editTech === key ? t.color : "#1e3a5f"}`, borderRadius: 8, color: editTech === key ? t.color : "#475569", cursor: "pointer", fontSize: 12, fontFamily: "'Barlow', sans-serif" }}>
                  {t.name.split(" ")[0]}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["Start Time", "start"], ["End Time", "end"]].map(([label, key]) => (
                  <div key={key}><label style={S.fLabel}>{label}</label><input type="time" value={availBlocks[editTech][key]} onChange={e => setAvailBlocks(p => ({ ...p, [editTech]: { ...p[editTech], [key]: e.target.value } }))} style={S.sel} /></div>
                ))}
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 12, color: "#94a3b8" }}>
                <input type="checkbox" checked={availBlocks[editTech].lunch} onChange={e => setAvailBlocks(p => ({ ...p, [editTech]: { ...p[editTech], lunch: e.target.checked } }))} />
                Block 12pm–1pm lunch break
              </label>
              <button onClick={() => setShowAvailModal(false)} style={{ padding: "11px 0", background: TECHS[editTech].color, border: "none", borderRadius: 9, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'Barlow', sans-serif", cursor: "pointer", marginTop: 4 }}>
                ✓ Save Hours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  root: { fontFamily: "'Barlow', sans-serif", background: "#060f1a", minHeight: "100vh", color: "#e2e8f0", display: "flex", flexDirection: "column" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: "1px solid #0c2040", background: "#07111f", flexWrap: "wrap", gap: 8, flexShrink: 0 },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  brandName: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, color: "#f1f5f9", letterSpacing: "0.02em" },
  brandSub: { fontSize: 10, color: "#334155", fontFamily: "'JetBrains Mono', monospace" },
  alertPill: { padding: "3px 9px", background: "#3d1a00", border: "1px solid #92400e", borderRadius: 20, fontSize: 10, color: "#f97316", fontFamily: "'JetBrains Mono', monospace" },
  balPill: { padding: "3px 9px", background: "#3d1a00", border: "1px solid #92400e", borderRadius: 20, fontSize: 10, color: "#fbbf24", fontFamily: "'JetBrains Mono', monospace" },
  livePill: { padding: "3px 9px", background: "#052e16", border: "1px solid #166534", borderRadius: 20, fontSize: 10, color: "#4ade80", fontFamily: "'JetBrains Mono', monospace" },
  body: { display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 57px)" },
  sidebar: { width: 196, flexShrink: 0, borderRight: "1px solid #0c2040", padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", background: "#07111f" },
  navBtn: { display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 8px", borderRadius: 7, border: "1px solid transparent", borderLeft: "3px solid transparent", background: "transparent", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.12s" },
  navLabel: { fontSize: 12, fontWeight: 600, marginBottom: 1 },
  navDesc: { fontSize: 9, color: "#334155", lineHeight: 1.3 },
  divider: { height: 1, background: "#0c2040", margin: "8px 4px" },
  sLabel: { fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#1e3a5f", letterSpacing: "0.1em", marginBottom: 8 },
  smallBtn: { padding: "5px 10px", background: "#0c2040", border: "1px solid #1e3a5f", borderRadius: 6, color: "#475569", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", width: "100%", marginTop: 4 },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  modBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 18px", borderBottom: "2px solid", flexShrink: 0 },
  modTitle: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "0.03em" },
  modDesc: { fontSize: 10, color: "#334155", marginTop: 1 },
  addBtn: { padding: "5px 14px", background: "#3b82f6", border: "none", borderRadius: 6, color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "'Barlow', sans-serif" },
  scroll: { flex: 1, overflowY: "auto" },
  calCtrl: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: "1px solid #0c2040", gap: 10 },
  navBtnSm: { padding: "5px 12px", background: "#0c2040", border: "1px solid #1e3a5f", borderRadius: 6, color: "#60a5fa", fontSize: 13, cursor: "pointer" },
  viewBtn: { padding: "5px 12px", background: "#0c1a2e", border: "1px solid #1e3a5f", borderRadius: 6, color: "#475569", fontSize: 11, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" },
  card: { background: "#0c1a2e", border: "1px solid #1e3a5f", borderRadius: 10, padding: "12px 14px" },
  cardLabel: { fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#1e3a5f", letterSpacing: "0.1em", marginBottom: 10 },
  sel: { width: "100%", background: "#060f1a", border: "1px solid #1e3a5f", borderRadius: 7, color: "#e2e8f0", padding: "8px 10px", fontSize: 12, fontFamily: "'Barlow', sans-serif" },
  svcBtn: { padding: "8px 10px", background: "#060f1a", border: "1px solid #1e3a5f", borderRadius: 8, cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 2 },
  qBtn: { width: 24, height: 24, background: "#0c2040", border: "1px solid #1e3a5f", borderRadius: 5, color: "#94a3b8", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" },
  invBtn: { flex: 1, padding: "5px 0", background: "#0c2040", border: "1px solid #1e3a5f", borderRadius: 6, color: "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" },
  fLabel: { display: "block", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#334155", letterSpacing: "0.08em", marginBottom: 5 },
};
