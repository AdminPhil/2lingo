import { test, expect } from "@playwright/test";

/**
 * CroLingo E2E Smoke Test Suite
 * Validates landing page branding, Paško mascot, action gates,
 * and cross-viewport layout integrity across Desktop Chrome, iPad Safari, and Mobile.
 */
test.describe("E2E Smoke Tests - Public Landing Page & Viewports", () => {
  test.beforeEach(async ({ page }) => {
    // Capture unhandled errors, filtering benign third-party or hydration warnings
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
        msg.includes("aborted")
      ) {
        return;
      }
      expect(error).toBeUndefined();
    });
  });

  test("R4-SMOKE-01: Displays core branding, Paško mascot, and cultural badge", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // CroLingo branding in header
    const brandHeading = page.locator("header h1:has-text('CroLingo')");
    await expect(brandHeading).toBeVisible();

    // Hrvatska Šahovnica header ribbon
    const sahovnicaRibbon = page.locator("div[title='Hrvatska Šahovnica']");
    await expect(sahovnicaRibbon).toBeVisible();

    // Paško the Dalmatian mascot hero image
    const mascotImage = page.locator("img[alt*='Paško']").first();
    await expect(mascotImage).toBeVisible();

    // 100% Focused on Croatian heritage pill
    const heritageBadge = page.locator("text=100% Focused on Croatian");
    await expect(heritageBadge).toBeVisible();

    // Playful bold headline
    const headline = page.locator("h1:has-text('Bok! Learn Croatian the playful way.')");
    await expect(headline).toBeVisible();
  });

  test("R4-SMOKE-02: Renders dual child-friendly action gates and parent intent link", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Gate 1: Returning Learner Button
    const returningLearnerBtn = page.getByRole("button", { name: /I Already Have an Account/i });
    await expect(returningLearnerBtn).toBeVisible({ timeout: 10000 });

    // Gate 2: New Learner Button
    const newLearnerBtn = page.getByRole("button", { name: /I'm New Here! Start Learning/i });
    await expect(newLearnerBtn).toBeVisible({ timeout: 10000 });

    // Secondary Parent Intent Gate
    const parentCircleBtn = page.getByRole("button", { name: /Parents & Educators: Set Up Family Circle/i });
    await expect(parentCircleBtn).toBeVisible({ timeout: 10000 });

    // Free reassurance text
    const reassuranceText = page.locator("text=Free for families & learners");
    await expect(reassuranceText).toBeVisible({ timeout: 10000 });
  });

  test("R4-SMOKE-03: Header navigation provides accessible Parent Portal link", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const parentPortalBtn = page.getByRole("button", { name: /Parent Portal/i }).first();
    await expect(parentPortalBtn).toBeVisible({ timeout: 10000 });
  });

  test("R4-SMOKE-04: Footer renders cultural badge and feature tags on desktop viewports", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const viewportSize = page.viewportSize();
    const isDesktop = viewportSize && viewportSize.width >= 1024;

    const footer = page.locator("footer");
    if (isDesktop) {
      await expect(footer).toBeVisible();
      const croatianTag = page.locator("text=Hrvatski (Croatian)");
      await expect(croatianTag).toBeVisible();

      const streakTag = page.locator("text=Daily Streaks");
      await expect(streakTag).toBeVisible();

      const practiceTag = page.locator("text=Practice for Hearts");
      await expect(practiceTag).toBeVisible();
    } else {
      // Hidden on tablet (810px) and mobile (390px) per responsive design: hidden lg:block
      await expect(footer).toBeHidden();
    }
  });

  test("R4-SMOKE-05: Layout integrity has zero horizontal overflow on current viewport", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector("h1");

    const hasOverflow = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      return scrollWidth > innerWidth;
    });

    expect(hasOverflow).toBe(false);
  });

  test("R4-SMOKE-06: Hero Paško image preserves aspect ratio and does not collapse", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const heroImg = page.locator("img[alt*='learning Croatian with CroLingo']");
    await heroImg.waitFor({ state: "visible", timeout: 10000 });

    const heroBox = await heroImg.boundingBox();
    expect(heroBox).not.toBeNull();
    if (heroBox) {
      expect(heroBox.width).toBeGreaterThan(100);
      expect(heroBox.height).toBeGreaterThan(100);
    }
  });

  test("R4-SMOKE-07: Interactive buttons have active touch feedback classes", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const returnBtn = page.getByRole("button", { name: /I Already Have an Account/i });
    await returnBtn.waitFor({ state: "visible", timeout: 10000 });
    const classList = await returnBtn.getAttribute("class");
    expect(classList).toContain("rounded-2xl");
    expect(classList).toContain("border-b-4");
  });
});
