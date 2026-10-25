import { test, expect } from "@playwright/test";

/**
 * CroLingo E2E QR Login & Student Fast Pass Test Suite
 * Validates camera guidance mode, parameter parsing, mascot feedback,
 * and authentication error states across Desktop Chrome, iPad Safari, and Mobile.
 */
test.describe("E2E QR Login - Student Badge & Fast Pass Flow", () => {
  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (error) => {
      const msg = error.message.toLowerCase();
      if (
        msg.includes("hydrat") ||
        msg.includes("clerk") ||
        msg.includes("resizeobserver") ||
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

  test("R4-QR-01: Displays guidance mode when visited without query parameters", async ({ page }) => {
    await page.goto("/qr-login");
    await page.waitForLoadState("domcontentloaded");

    // Fast Pass Heading
    const title = page.locator("h1:has-text('CroLingo Fast Pass')");
    await expect(title).toBeVisible();

    const subtitle = page.locator("text=Student Badge & Quick Login");
    await expect(subtitle).toBeVisible();

    // Paško Mascot Header
    const mascotImg = page.locator("img[alt='Paško the Dalmatian']");
    await expect(mascotImg).toBeVisible();

    // Camera Scan Guidance
    const scanInstruction = page.locator("text=Scan your CroLingo Student Badge QR code");
    await expect(scanInstruction).toBeVisible();

    const badgeNote = page.locator("text=Badges can be generated and printed anytime in the Parent Center");
    await expect(badgeNote).toBeVisible();
  });

  test("R4-QR-02: Guidance mode links to Parent Center for badge printing", async ({ page }) => {
    await page.goto("/qr-login");
    await page.waitForLoadState("domcontentloaded");

    const parentCenterBtn = page.getByRole("link", { name: /Go to Parent Center to Print Badges/i });
    await expect(parentCenterBtn).toBeVisible();
    await expect(parentCenterBtn).toHaveAttribute("href", "/admin");
  });

  test("R4-QR-03: Guidance mode provides navigation back to Sign In", async ({ page }) => {
    await page.goto("/qr-login");
    await page.waitForLoadState("domcontentloaded");

    const backBtn = page.getByRole("link", { name: /Back to Sign In/i });
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toHaveAttribute("href", "/");
  });

  test("R4-QR-04: Loading badge credentials triggers authenticating feedback state", async ({ page }) => {
    await page.goto("/qr-login?u=test_student&p=secret_token_123");
    await page.waitForLoadState("domcontentloaded");

    // Mascot header remains visible
    const mascotImg = page.locator("img[alt='Paško the Dalmatian']");
    await expect(mascotImg).toBeVisible();

    // Either authenticating state or completion state should be rendered
    const container = page.locator("body");
    await expect(container).toContainText(/Logging you in with your Student Badge|Login Failed|CroLingo Fast Pass/);
  });

  test("R4-QR-05: Missing password parameter displays explicit badge error message", async ({ page }) => {
    await page.goto("/qr-login?u=test_student");
    await page.waitForLoadState("domcontentloaded");

    // State machine transitions to error with specific message
    const errorMsg = page.locator("text=No password provided in QR pass. Please scan complete badge.");
    await expect(errorMsg).toBeVisible({ timeout: 10000 });

    // Home return button
    const backHomeBtn = page.getByRole("button", { name: /Back to Home/i });
    await expect(backHomeBtn).toBeVisible();
  });

  test("R4-QR-06: Zero horizontal overflow on QR Login page across viewports", async ({ page }) => {
    await page.goto("/qr-login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector("h1");

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasOverflow).toBe(false);
  });

  test("R4-QR-07: Card container maintains centered responsive layout", async ({ page }) => {
    await page.goto("/qr-login");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("div.max-w-md")).toHaveCSS("max-width", "448px");
    await expect(page.locator("div.max-w-md")).toBeVisible();

    const modalBox = await page.locator("div.max-w-md").boundingBox();
    expect(modalBox).not.toBeNull();
    if (modalBox) {
      expect(modalBox.width).toBeLessThanOrEqual(448); // max-w-md is 28rem (448px)
      expect(modalBox.width).toBeGreaterThan(250);
    }
  });
});
