// Checks theme and language: switching, saving, and no flash of the wrong mode.
// Start the dev server, then: node test-settings.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";

const browser = await chromium.launch();
const fails = [];
const check = (name, ok) => {
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}`);
  if (!ok) fails.push(name);
};

// A fresh context per run so localStorage starts empty.
const ctx = await browser.newContext({ colorScheme: "light", viewport: { width: 1100, height: 800 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
const lang = () => page.evaluate(() => document.documentElement.lang);

await page.goto(`${BASE}/decks`);
await page.waitForTimeout(700);

// 1. follows the OS preference when nothing is stored
check("light OS preference renders light", !(await isDark()));

// 2. toggling flips the mode
await page.getByRole("button", { name: "Switch to dark mode" }).click();
await page.waitForTimeout(300);
check("toggle switches to dark", await isDark());

// 3. the choice survives a reload, and is applied before paint (no flash)
await page.goto(`${BASE}/decks`, { waitUntil: "commit" });
const darkAtFirstPaint = await page.evaluate(
  () =>
    new Promise((r) =>
      requestAnimationFrame(() => r(document.documentElement.classList.contains("dark"))),
    ),
);
check("dark persists across reload", darkAtFirstPaint);
check("no flash: class set before first paint", darkAtFirstPaint);

// 4. OS preference is overridden by the explicit choice
const darkOsPage = await (await browser.newContext({ colorScheme: "dark" })).newPage();
await darkOsPage.goto(`${BASE}/decks`);
await darkOsPage.waitForTimeout(500);
check(
  "dark OS preference renders dark",
  await darkOsPage.evaluate(() => document.documentElement.classList.contains("dark")),
);

// 5. language switch changes copy and <html lang>
await page.waitForTimeout(600);
check("defaults to English", (await page.locator("h1").innerText()).includes("Pick your depth"));
await page.getByRole("button", { name: "Bahasa Indonesia" }).click();
await page.waitForTimeout(400);
check("switches to Indonesian", (await page.locator("h1").innerText()).includes("Pilih kedalaman"));
check("html lang updates", (await lang()) === "id");

// 6. deck content is translated too, not just the UI around it
check(
  "deck titles localized",
  (await page.getByText("Ringan & Seru").count()) > 0 &&
    (await page.getByText("Menyelam Dalam").count()) > 0,
);

// 7. language persists, and reaches the questions
await page.goto(`${BASE}/play/deep-dive`);
await page.waitForTimeout(800);
check("language persists across navigation", (await lang()) === "id");
const card = page.locator('[role="button"]').last();
check(
  "card aria label localized",
  (await card.getAttribute("aria-label")).startsWith("Ketuk untuk"),
);
await card.click();
await page.waitForTimeout(900);
check("question localized", !(await card.innerText()).includes("What's something"));

check("no page errors", errors.length === 0);
if (errors.length) console.log(errors);

await browser.close();
console.log(fails.length ? `\nFAILED: ${fails.join(", ")}` : "\nPASS");
process.exit(fails.length ? 1 : 0);
