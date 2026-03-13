import { test, expect, Page } from "@playwright/test";

test("should load initial page", async ({ page }: { page: Page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Select a prompt" })
  ).toBeVisible();

  await expect(
    page.getByText("Choose a prompt on the side list to view and edit")
  ).toBeVisible();
});
