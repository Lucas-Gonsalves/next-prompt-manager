import { PromptForm } from "@/components/prompts/components";
import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

const refreshMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const createActionMock = jest.fn();
jest.mock("@/app/actions/prompt.actions", () => ({
  createPromptAction: (...args: unknown[]) => createActionMock(...args),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const makeSut = () => {
  return render(<PromptForm />);
};

describe("PromptForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    createActionMock.mockReset();
    refreshMock.mockReset();
    (toast.success as jest.Mock).mockReset();
  });

  it("should create a new prompt with success", async () => {
    const successMessage = "Prompt created with success";
    createActionMock.mockResolvedValueOnce({
      success: true,
      message: successMessage,
    });
    makeSut();

    const titleInput = screen.getByPlaceholderText("Prompt Title");
    await user.type(titleInput, "title");
    const contentInput = screen.getByPlaceholderText(
      "Type a content of the prompt..."
    );
    await user.type(contentInput, "content");

    const submitButton = screen.getByRole("button", { name: "Save" });
    await user.click(submitButton);

    expect(createActionMock).toHaveBeenCalledWith({
      title: "title",
      content: "content",
    });
    expect(toast.success).toHaveBeenCalledWith(successMessage);
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it("should display an error when the action of creation failed", async () => {
    const errorMessage = "Prompt created with success";
    createActionMock.mockResolvedValueOnce({
      success: false,
      message: errorMessage,
    });
    makeSut();

    const titleInput = screen.getByPlaceholderText("Prompt Title");
    await user.type(titleInput, "title");
    const contentInput = screen.getByPlaceholderText(
      "Type a content of the prompt..."
    );
    await user.type(contentInput, "content");

    const submitButton = screen.getByRole("button", { name: "Save" });
    await user.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
