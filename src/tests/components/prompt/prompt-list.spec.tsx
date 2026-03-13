import {
  PromptList,
  type PromptListProps,
} from "@/components/prompts/components";
import { render, screen } from "@/lib/test-utils";

const makeSut = ({ prompts }: PromptListProps) => {
  return render(<PromptList prompts={prompts} />);
};

describe("PromptList", () => {
  it("should render the list with prompts", () => {
    const prompts = [
      { id: "1", title: "A", content: "X" },
      { id: "2", title: "B", content: "Y" },
    ];
    makeSut({ prompts });

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("shouldn't not be render when there are no prompts.", () => {
    const prompts = [] as PromptListProps["prompts"];
    makeSut({ prompts });

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
