// Checks that swiping a card away brings in the next one.
// Start the dev server, then: node test-swipe.mjs
import { chromium } from "playwright";

const URL = process.env.URL ?? "http://localhost:3000/play/deep-dive";
import { CARDS_PER_ROUND } from "./lib/hand.js";

const TOTAL = CARDS_PER_ROUND; // one round deals this many, drawn at random

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 860 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(URL);

const card = page.locator('[role="button"]');
await card.waitFor();
await page.waitForTimeout(600);

async function swipe() {
  const box = await card.boundingBox();
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) {
    await page.mouse.move(box.x + box.width / 2 + i * 25, y, { steps: 2 });
  }
  await page.mouse.up();
  await page.waitForTimeout(1000);
}

// Tell the two sides apart by the aria-label, not the text, since both sides
// show the deck name.
const faceDown = async () =>
  (await card.getAttribute("aria-label")).startsWith("Tap to reveal");

const visible = () =>
  card.evaluate((el) => {
    const s = getComputedStyle(el);
    return +s.opacity > 0.95 && !/,\s*-?[3-9]\d\d(\.\d+)?,\s*-?[\d.]+\)$/.test(s.transform);
  });

const fails = [];
const check = (name, ok) => {
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}`);
  if (!ok) fails.push(name);
};

// Every card, including the last, hands off to the next one.
for (let n = 1; n < TOTAL; n++) {
  await swipe();
  check(`card ${n + 1} visible after swipe ${n}`, await visible());
  check(`card ${n + 1} is face down`, (await faceDown()));
}

// Tap flips to the question.
await card.click();
await page.waitForTimeout(800);
check("tap reveals the question", !(await faceDown()));

// Last swipe ends the deck.
await swipe();
check("end screen shown", await page.getByText("unfolded everything").isVisible());

// Restart should bring back a visible card that is face down.
await page.getByRole("button", { name: "Restart Deck" }).click();
await page.waitForTimeout(900);
check("restart shows card 1", await faceDown());
check("restarted card visible", await visible());
check("no page errors", errors.length === 0);
if (errors.length) console.log(errors);

await browser.close();
console.log(fails.length ? `\nFAILED: ${fails.join(", ")}` : "\nPASS");
process.exit(fails.length ? 1 : 0);
