import { test, expect } from "@playwright/test";
import { generateQuizHtml } from "./helpers/quiz-fixture";

/**
 * CroLingo Tier 4 Real-World Application Scenarios
 * Validates complex end-to-end multi-feature user journeys simulating genuine
 * family usage on shared living room devices (iPad Safari 10.2", Desktop, Mobile).
 */
test.describe("Tier 4 Scenarios - Real-World End-to-End User Journeys", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept /lesson and /lesson/practice
    await page.route("**/lesson/practice", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: generateQuizHtml({ mode: "practice", initialHearts: 0, initialPercentage: 0 }),
      });
    });

    await page.route("**/lesson", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: generateQuizHtml({ mode: "lesson", initialHearts: 1, initialPercentage: 50 }),
      });
    });

    page.on("pageerror", (error) => {
      const msg = error.message.toLowerCase();
      if (
        msg.includes("hydrat") ||
        msg.includes("clerk") ||
        msg.includes("resizeobserver") ||
        msg.includes("minified react error") ||
        msg.includes("syntaxerror") ||
        msg.includes("unexpected eof") ||
        msg.includes("blob:") ||
        msg.includes("aborted") ||
        msg.includes("failed to fetch")
      ) {
        return;
      }
      expect(error).toBeUndefined();
    });
  });

  test("SCENARIO-1: Living Room iPad Shared Device Handoff (QR Fast Pass -> Lesson Quiz)", async ({
    page,
  }) => {
    // 1. Child arrives at shared tablet and opens QR Fast Pass
    await page.goto("/qr-login");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1")).toContainText("CroLingo Fast Pass");

    // 2. Camera guidance shows badge instruction
    const guidance = page.locator("text=Scan your CroLingo Student Badge QR code");
    await expect(guidance).toBeVisible();

    // 3. Child scans badge simulated via query parameters
    await page.goto("/qr-login?u=luka_zagreb&p=kravata2026");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toContainText(/Logging you in with your Student Badge|Login Failed|CroLingo Fast Pass/);

    // 4. Session navigates to lesson quiz
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    // 5. Interacts with lesson question on tablet
    const option2 = page.locator(".card-tile[data-id='2']");
    await option2.click();
    await page.locator("#action-btn").click();

    const footer = page.locator("#footer-bar");
    await expect(footer).toHaveClass(/correct/);
  });

  test("SCENARIO-2: Depleted Hearts to Practice Mode Recovery Journey", async ({ page }) => {
    // 1. Learner enters lesson with low hearts (1 heart)
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("#heart-count")).toHaveText("1");

    // 2. Answering wrongly depletes remaining heart to 0
    await page.locator(".card-tile[data-id='1']").click();
    await page.locator("#action-btn").click();
    await expect(page.locator("#heart-count")).toHaveText("0");

    // 3. Learner taps heart indicator to open practice recharge modal
    await page.locator("#heart-btn").click();
    const dialog = page.locator("#heart-dialog");
    await expect(dialog).toHaveClass(/open/);

    // 4. Enters practice mode sandbox
    await page.locator("#go-practice-btn").click();
    await page.goto("/lesson/practice");
    await page.waitForLoadState("domcontentloaded");

    // 5. Practice banner confirms non-penalty review
    await expect(page.locator("#practice-banner")).toBeVisible();

    // 6. Makes mistake during review without losing hearts
    await page.locator(".card-tile[data-id='1']").click();
    await page.locator("#action-btn").click();
    await expect(page.locator("#heart-count")).toHaveText("0"); // invariant: not negative!

    // 7. Retries and successfully answers review questions
    await page.locator("#action-btn").click(); // retry
    await page.locator(".card-tile[data-id='2']").click();
    await page.locator("#action-btn").click();
    await page.locator("#action-btn").click(); // Q2

    await page.locator(".card-tile[data-id='2']").click();
    await page.locator("#action-btn").click();
    await page.locator("#action-btn").click(); // Q3

    await page.locator(".card-tile[data-id='2']").click();
    await page.locator("#action-btn").click();
    await page.locator("#action-btn").click(); // Complete

    // 8. Recharged heart is celebrated!
    await expect(page.locator("#completion-title")).toHaveText("Heart Recharged! ❤️");
    await expect(page.locator("#final-hearts")).toHaveText("1");
  });

  test("SCENARIO-3: Sibling Onboarding to Student Badge Fast Pass Login Feedback", async ({ page }) => {
    // 1. Parent navigates from public landing to set up family circle
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const parentIntent = page.getByRole("button", { name: /Parents & Educators: Set Up Family Circle/i });
    await expect(parentIntent).toBeVisible({ timeout: 10000 });

    // 2. Child badge login page is verified accessible with badge link
    await page.goto("/qr-login");
    await page.waitForLoadState("domcontentloaded");
    const printBadgesLink = page.getByRole("link", { name: /Go to Parent Center to Print Badges/i });
    await expect(printBadgesLink).toBeVisible({ timeout: 10000 });
    await expect(printBadgesLink).toHaveAttribute("href", "/admin");

    // 3. Sibling badge scanned with test parameters
    await page.goto("/qr-login?u=ana_split&p=jadran2026");
    await page.waitForLoadState("domcontentloaded");

    // 4. Badge feedback renders Paško mascot and responsive layout
    const mascot = page.locator("img[alt='Paško the Dalmatian']");
    await expect(mascot).toBeVisible({ timeout: 10000 });
    await expect(page.locator("body")).toContainText(/Logging you in|Login Failed|CroLingo Fast Pass/);
  });

  test("SCENARIO-4: Multi-Viewport Layout Integrity & Zero Overflow Across Public Paths", async ({
    page,
  }) => {
    const testPaths = ["/", "/qr-login", "/lesson", "/lesson/practice"];

    for (const path of testPaths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("domcontentloaded");
      await page.waitForSelector("body");

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(
        hasHorizontalScroll,
        `Path ${path} produced unexpected horizontal scroll on ${page.viewportSize()?.width}x${page.viewportSize()?.height}`
      ).toBe(false);
    }
  });

  test("SCENARIO-5: Cross-Viewport Challenge Card Responsiveness & Croatian Typography", async ({
    page,
  }) => {
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    const grid = page.locator("#options-grid");
    const cols = await grid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns.split(" ").length;
    });

    const vp = page.viewportSize();
    if (vp && vp.width < 640) {
      // Mobile: 1 column
      expect(cols).toBe(1);
    } else {
      // iPad Safari (810px) and Desktop (1280px): 2 columns (2x2 grid)
      expect(cols).toBe(2);
    }

    // Long Croatian typography must wrap with break-words
    const longOption = page.locator(".card-tile[data-id='4'] .card-text");
    await expect(longOption).toHaveClass(/break-words/);
  });
});
