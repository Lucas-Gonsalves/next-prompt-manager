import { SidebarContent } from "@/components/sidebar/components";
import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";

const makeSut = () => {
  return render(<SidebarContent />);
};

describe("SidebarContent", () => {
  it("should render a new prompt button", () => {
    makeSut();

    expect(screen.getByRole("complementary")).toBeVisible();
    expect(screen.getByRole("button", { name: "New prompt" })).toBeVisible();
  });

  describe("collapse / exand", () => {
    const user = userEvent.setup();

    it("should start expanded and display minimize button", () => {
      makeSut();
      const aside = screen.getByRole("complementary");
      expect(aside).toBeVisible();

      const collapseButton = screen.getByRole("button", {
        name: "Minimize sidebar",
      });
      expect(collapseButton).toBeVisible();

      const expandButton = screen.queryByRole("button", {
        name: "Expand sidebar",
      });
      expect(expandButton).not.toBeInTheDocument();
    });

    it("should contract and display expand button", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: "Minimize sidebar",
      });

      await user.click(collapseButton);

      const expandButton = screen.queryByRole("button", {
        name: "Expand sidebar",
      });

      expect(expandButton).toBeInTheDocument();

      expect(collapseButton).not.toBeInTheDocument();
    });
  });
});
