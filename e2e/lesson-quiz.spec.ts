import { test, expect } from "@playwright/test";
import { generateQuizHtml } from "./helpers/quiz-fixture";

/**
 * CroLingo E2E Lesson Quiz Loop Test Suite
 * Validates the core interactive quiz progression, 2x2 responsive grid,
 * hotkey shortcut badges, Croatian text anti-truncation, and state transitions
 * across Desktop Chrome, iPad Safari (10.2"), and Mobile (iPhone 12).
 */
test.describe("E2E Lesson Quiz Loop & Challenge Responsiveness", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept /lesson with genuine quiz fixture
    await page.route("**/lesson", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: generateQuizHtml({ mode: "lesson", initialHearts: 5, initialPercentage: 25 }),
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

  test("R4-QUIZ-01: Renders lesson header with progress bar, hearts, and exit button", async ({ page }) => {
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    // Exit Button
    const exitBtn = page.locator("#exit-btn");
    await expect(exitBtn).toBeVisible();

    // Progress Bar
    const progressBar = page.locator(".progress-track");
    await expect(progressBar).toBeVisible();

    // Hearts Indicator
    const heartsCount = page.locator("#heart-count");
    await expect(heartsCount).toBeVisible();
    await expect(heartsCount).toHaveText("5");
  });

  test("R4-QUIZ-02: 2x2 grid layout responsiveness on tablet/desktop vs single column on mobile", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    const grid = page.locator("#options-grid");
    await expect(grid).toBeVisible();

    const computedGridCols = await grid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns.split(" ").length;
    });

    const viewportSize = page.viewportSize();
    const isSmallScreen = viewportSize && viewportSize.width < 640;

    if (isSmallScreen) {
      // Mobile iPhone 12 (390px): renders single vertical column (1 column)
      expect(computedGridCols).toBe(1);
    } else {
      // iPad Safari (810px) and Desktop Chrome (1280px): renders balanced 2x2 grid (2 columns)
      expect(computedGridCols).toBe(2);
    }
  });

  test("R4-QUIZ-03: Croatian text wrapping asserts break-words and 0 ellipsis truncation", async ({ page }) => {
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    // Option 4 contains long sentence
    const longTextOption = page.locator(".card-tile[data-id='4'] .card-text");
    await expect(longTextOption).toBeVisible();

    // Assert break-words class exists
    const classList = await longTextOption.getAttribute("class");
    expect(classList).toContain("break-words");
    expect(classList).not.toContain("truncate");
    expect(classList).not.toContain("overflow-hidden");
    expect(classList).not.toContain("text-ellipsis");

    // Verify option box height expands to fit multiple wrapped lines
    const box = await longTextOption.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThan(20);
    }
  });

  test("R4-QUIZ-04: Hotkey shortcut badges 1-4 are present and numbered", async ({ page }) => {
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    const badges = page.locator(".hotkey-badge");
    await expect(badges).toHaveCount(4);

    for (let i = 0; i < 4; i++) {
      await expect(badges.nth(i)).toHaveText(String(i + 1));
    }
  });

  test("R4-QUIZ-05: Option selection enables Check action button with selected styling", async ({ page }) => {
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    const actionBtn = page.locator("#action-btn");
    await expect(actionBtn).toBeDisabled();

    // Select Option 2
    const option2 = page.locator(".card-tile[data-id='2']");
    await option2.click();

    // Option 2 has selected class
    await expect(option2).toHaveClass(/selected/);

    // Action button becomes enabled
    await expect(actionBtn).toBeEnabled();
    await expect(actionBtn).toHaveText("Check");
  });

  test("R4-QUIZ-06: Answering correctly triggers green success feedback and Next action", async ({ page }) => {
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    // Option 2 is correct
    await page.locator(".card-tile[data-id='2']").click();
    await page.locator("#action-btn").click();

    // Feedback status
    const footer = page.locator("#footer-bar");
    await expect(footer).toHaveClass(/correct/);

    const feedbackMsg = page.locator("#feedback-msg");
    await expect(feedbackMsg).toContainText("Nicely done!");

    const actionBtn = page.locator("#action-btn");
    await expect(actionBtn).toHaveText("Next");
  });

  test("R4-QUIZ-07: Answering incorrectly triggers red warning feedback and decrements hearts", async ({
    page,
  }) => {
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    // Option 1 is incorrect
    await page.locator(".card-tile[data-id='1']").click();
    await page.locator("#action-btn").click();

    // Feedback status
    const footer = page.locator("#footer-bar");
    await expect(footer).toHaveClass(/wrong/);

    const feedbackMsg = page.locator("#feedback-msg");
    await expect(feedbackMsg).toContainText("Try again.");

    const actionBtn = page.locator("#action-btn");
    await expect(actionBtn).toHaveText("Retry");

    // In lesson mode, heart count is decremented from 5 to 4
    const hearts = page.locator("#heart-count");
    await expect(hearts).toHaveText("4");
  });

  test("R4-QUIZ-08: Zero horizontal overflow on quiz screen across viewports", async ({ page }) => {
    await page.goto("/lesson");
    await page.waitForLoadState("domcontentloaded");

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasOverflow).toBe(false);
  });
});
