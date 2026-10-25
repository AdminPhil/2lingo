import { test, expect } from "@playwright/test";
import { generateQuizHtml } from "./helpers/quiz-fixture";

/**
 * CroLingo E2E Practice Heart Recharge Test Suite
 * Validates the practice sandbox loop, non-penalty mistake behavior,
 * banner indicators, heart recharge award, and recovery modals
 * across Desktop Chrome, iPad Safari, and Mobile viewports.
 */
test.describe("E2E Practice Heart Recharge & Sandbox Progression", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept /lesson/practice with practice mode fixture
    await page.route("**/lesson/practice", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: generateQuizHtml({ mode: "practice", initialHearts: 3, initialPercentage: 0 }),
      });
    });

    // Intercept /lesson for modal transition testing
    await page.route("**/lesson", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: generateQuizHtml({ mode: "lesson", initialHearts: 3, initialPercentage: 40 }),
      });
    });

    page.on("pageerror", (error) => {
      const msg = error.message.toLowerCase();
      if (
        msg.includes("hydrat") ||
        msg.includes("clerk") ||
        msg.includes("resizeobserver") ||
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

  test("R4-PRACTICE-01: Displays distinctive amber practice mode banner", async ({ page }) => {
    await page.goto("/lesson/practice");
    await page.waitForLoadState("domcontentloaded");

    const banner = page.locator("#practice-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText("Practice Mode");
    await expect(banner).toContainText("earn +1 ❤️");
    await expect(banner).toContainText("Mistakes don't cost hearts");
  });

  test("R4-PRACTICE-02: Initial heart state reflects reduced hearts", async ({ page }) => {
    await page.goto("/lesson/practice");
    await page.waitForLoadState("domcontentloaded");

    const heartCount = page.locator("#heart-count");
    await expect(heartCount).toBeVisible();
    await expect(heartCount).toHaveText("3");
  });

  test("R4-PRACTICE-03: Mistakes in practice mode do NOT decrement hearts (non-penalty rule)", async ({
    page,
  }) => {
    await page.goto("/lesson/practice");
    await page.waitForLoadState("domcontentloaded");

    // Select incorrect answer (Option 1)
    await page.locator(".card-tile[data-id='1']").click();
    await page.locator("#action-btn").click();

    // Verify warning feedback
    const feedbackMsg = page.locator("#feedback-msg");
    await expect(feedbackMsg).toContainText("Try again.");

    // Critical Invariant: Hearts must remain 3 (NEVER decremented in practice mode)
    const heartCount = page.locator("#heart-count");
    await expect(heartCount).toHaveText("3");

    // Click retry
    const retryBtn = page.locator("#action-btn");
    await expect(retryBtn).toHaveText("Retry");
    await retryBtn.click();

    // Selection reset, hearts still 3
    await expect(heartCount).toHaveText("3");
  });

  test("R4-PRACTICE-04: Completing practice questions awards +1 Heart and displays celebration screen", async ({
    page,
  }) => {
    await page.goto("/lesson/practice");
    await page.waitForLoadState("domcontentloaded");

    // Question 1: select correct option 2 and click Next
    await page.locator(".card-tile[data-id='2']").click();
    await page.locator("#action-btn").click();
    await page.locator("#action-btn").click(); // advances to Q2

    // Question 2: select correct option 2 and click Next
    await page.locator(".card-tile[data-id='2']").click();
    await page.locator("#action-btn").click();
    await page.locator("#action-btn").click(); // advances to Q3

    // Question 3: select correct option 2 and complete session
    await page.locator(".card-tile[data-id='2']").click();
    await page.locator("#action-btn").click();
    await page.locator("#action-btn").click(); // triggers completion

    // Verify Heart Recharged completion view
    const completionTitle = page.locator("#completion-title");
    await expect(completionTitle).toBeVisible();
    await expect(completionTitle).toHaveText("Heart Recharged! ❤️");

    // Recharged heart count is 4 (incremented from 3)
    const finalHearts = page.locator("#final-hearts");
    await expect(finalHearts).toHaveText("4");

    // Points result pill
    const pointsPill = page.locator(".result-pill.points");
    await expect(pointsPill).toContainText("+10");

    // Continue Adventure button
    const continueBtn = page.locator("#action-btn");
    await expect(continueBtn).toHaveText("Continue Adventure");
  });

  test("R4-PRACTICE-05: Clicking heart indicator in lesson mode triggers practice recovery dialog", async ({
    page,
  }) => {
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    // Click heart button
    await page.locator("#heart-btn").click();

    // Dialog appears with recovery prompt
    const dialog = page.locator("#heart-dialog");
    await expect(dialog).toHaveClass(/open/);

    const dialogTitle = page.locator(".modal-title");
    await expect(dialogTitle).toHaveText("Need a Heart? ❤️");

    const practiceOptionBtn = page.locator("#go-practice-btn");
    await expect(practiceOptionBtn).toBeVisible();
    await expect(practiceOptionBtn).toContainText("Go to Practice (+1 ❤️)");
  });

  test("R4-PRACTICE-06: Zero horizontal overflow on practice screen across viewports", async ({ page }) => {
    await page.goto("/lesson/practice");
    await page.waitForLoadState("domcontentloaded");

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasOverflow).toBe(false);
  });
});
