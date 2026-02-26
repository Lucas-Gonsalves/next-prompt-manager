import { SidebarContent } from "@/components/sidebar/components";
import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";

const makeSut = () => {
  return render(<SidebarContent />);
};

describe("SidebarContent", () => {
  const user = userEvent.setup();

  it("Should render a new prompt button", () => {
    makeSut();

    expect(screen.getByRole("complementary")).toBeVisible();
    expect(screen.getByRole("button", { name: "New prompt" })).toBeVisible();
  });

  describe("collapse / exand", () => {
    it("Should start expanded and display minimize button", () => {
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

    it("Should contract and display expand button", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimize sidebar/i,
      });

      await user.click(collapseButton);

      const expandButton = screen.queryByRole("button", {
        name: /expand sidebar/i,
      });

      expect(expandButton).toBeInTheDocument();

      expect(collapseButton).not.toBeInTheDocument();
    });
  });

  describe("New prompt", () => {
    it("Should navigate the user to the new prompt /new", async () => {
      makeSut();

      const link = screen.getByRole("link", {
        name: /new prompt/i,
      });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/new");
    });
  });
});
