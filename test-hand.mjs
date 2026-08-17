// Checks the random draw: how many cards, no repeats, that it changes between
// rounds, and that it stays the same when the language changes.
// Start the dev server, then: node test-hand.mjs
import { chromium } from "playwright";
import { drawHand, CARDS_PER_ROUND } from "./lib/hand.js";

const BASE = process.env.BASE ?? "http://localhost:3000";
const fails = [];
const check = (name, ok) => {
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}`);
  if (!ok) fails.push(name);
};

// --- drawHand on its own ---------------------------------------------------
const POOL = 50;
let allSeen = new Set();
let sizeOk = true;
let uniqueOk = true;
let inRangeOk = true;
for (let i = 0; i < 300; i++) {
  const h = drawHand(POOL);
  if (h.length !== CARDS_PER_ROUND) sizeOk = false;
  if (new Set(h).size !== h.length) uniqueOk = false;
  if (h.some((n) => n < 0 || n >= POOL || !Number.isInteger(n))) inRangeOk = false;
  h.forEach((n) => allSeen.add(n));
}
check(`deals exactly ${CARDS_PER_ROUND}`, sizeOk);
check("never repeats a card within a hand", uniqueOk);
check("indices stay inside the pool", inRangeOk);
check("reaches the whole pool over many draws", allSeen.size === POOL);
check("handles a pool smaller than a hand", drawHand(4).length === 4);

// --- in the running app ----------------------------------------------------
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 460, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

const card = page.locator('[role="button"]').last();

async function readRound() {
  const seen = [];
  for (let i = 0; i < CARDS_PER_ROUND; i++) {
    await card.click(); // flip
    await page.waitForTimeout(750);
    seen.push((await card.innerText()).replace(/unfold/gi, "").trim());
    const box = await card.boundingBox();
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width / 2, y);
    await page.mouse.down();
    for (let s = 1; s <= 8; s++) await page.mouse.move(box.x + box.width / 2 + s * 22, y);
    await page.mouse.up();
    await page.waitForTimeout(850);
  }
  return seen;
}

await page.goto(`${BASE}/play/deep-dive`);
await card.waitFor();
await page.waitForTimeout(800);

const first = await readRound();
check(`round is ${CARDS_PER_ROUND} cards long`, first.length === CARDS_PER_ROUND);
check("no repeat within a round", new Set(first).size === first.length);
check("end screen after the last card", await page.getByText("unfolded everything").isVisible());

// Restart deals a fresh hand.
await page.getByRole("button", { name: "Restart Deck" }).click();
await page.waitForTimeout(900);
await card.click();
await page.waitForTimeout(800);
const afterRestart = (await card.innerText()).replace(/unfold/gi, "").trim();

// Reload deals a fresh hand too.
await page.goto(`${BASE}/play/deep-dive`);
await page.waitForTimeout(900);
await card.click();
await page.waitForTimeout(800);
const afterReload = (await card.innerText()).replace(/unfold/gi, "").trim();

check(
  "a new round is not the same order as the last",
  afterRestart !== first[0] || afterReload !== first[0],
);

// Switching language should translate the hand, not deal a new one.
const beforeSwitch = afterReload;
await page.getByRole("button", { name: "Bahasa Indonesia" }).click();
await page.waitForTimeout(700);
const afterSwitch = (await card.innerText()).replace(/unfold/gi, "").trim();
check("language switch keeps the same card", afterSwitch !== beforeSwitch && afterSwitch.length > 0);
await page.getByRole("button", { name: "English" }).click();
await page.waitForTimeout(700);
check(
  "switching back restores the identical question",
  (await card.innerText()).replace(/unfold/gi, "").trim() === beforeSwitch,
);

check("no page errors", errors.length === 0);
if (errors.length) console.log(errors);

await browser.close();
console.log(fails.length ? `\nFAILED: ${fails.join(", ")}` : "\nPASS");
process.exit(fails.length ? 1 : 0);
