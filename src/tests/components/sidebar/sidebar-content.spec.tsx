import { SidebarContent } from "@/components/sidebar/components";
import { render, screen } from "@/lib/test-utils";

describe("SidebarContent", () => {
  it("should render a new prompt button", () => {
    render(<SidebarContent />);

    expect(screen.getByRole("complementary")).toBeVisible();
    expect(screen.getByRole("button", { name: "New prompt" })).toBeVisible();
  });
});
