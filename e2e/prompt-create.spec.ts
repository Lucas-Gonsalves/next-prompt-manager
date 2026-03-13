import test, { expect } from "@playwright/test";

test("Creation of prompt via UI (success)", async ({ page }) => {
  const uniqueTitle = `E2E Prompt ${Date.now()}`;
  const content = `content generated via E2E`;

  await page.goto("/new");
  await expect(page.getByPlaceholder("Prompt title")).toBeVisible();
  await page.fill("input[name='title']", uniqueTitle);
  await page.fill("textarea[name='content']", content);
  await page.getByRole("button", { name: "save" }).click();

  await page.waitForSelector("text=Prompt created with success", {
    state: "visible",
    timeout: 1500,
  });
});
