import { render, screen } from "@/lib/test-utils";

describe("Exemple", () => {
  it("must pass", () => {
    render(<div>Test</div>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
