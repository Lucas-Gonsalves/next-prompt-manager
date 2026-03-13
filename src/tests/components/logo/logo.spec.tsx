import { Logo } from "@/components/logo";
import { render, screen } from "@testing-library/react";

describe("Logo", () => {
  it("should render the link for home with text", () => {
    render(<Logo />);

    const link = screen.getByRole("link", { name: "PROMPTS" });

    expect(link).toBeVisible();
    expect(link).toHaveAttribute("href", "/");
  });
});
