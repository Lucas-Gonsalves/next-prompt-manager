import { CopyButton, CopyButtonProps } from "@/components/button-actions";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: { error: jest.fn() },
}));
const writeTextMock = jest.fn();

const makeSut = ({ content }: CopyButtonProps = {} as CopyButtonProps) => {
  return render(<CopyButton content={content} />);
};

describe("CopyButton", () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  beforeEach(() => {
    writeTextMock.mockReset();
    Object.defineProperty(global.navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  it("should disable the button when content is empty", async () => {
    const content = "     ";
    makeSut({ content });

    const button = screen.getByRole("button", { name: /Copy/i });

    await user.click(button);

    expect(button).toBeDisabled();
    expect(writeTextMock).not.toHaveBeenCalled();
  });

  it("should copy and change label to 'Copyed' and get back to 'Copy'", async () => {
    writeTextMock.mockResolvedValueOnce(undefined);
    const content = "text";
    makeSut({ content });

    const button = screen.getByRole("button", { name: /Copy/i });
    await user.click(button);

    expect(
      await screen.findByRole("button", { name: /Copyed/i })
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(
      await screen.findByRole("button", { name: /Copy/i })
    ).toBeInTheDocument();
  });

  it("should clean the previous timer before copying again", async () => {
    writeTextMock.mockResolvedValueOnce(undefined);
    const clearSpy = jest.spyOn(window, "clearTimeout");
    const content = "text";
    makeSut({ content });

    const button = screen.getByRole("button", { name: /Copy/i });
    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Copyed/i })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Copyed/i }));

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it("should display a toast of error when the copy failed", async () => {
    const errorMessage = "Failed to copyed";
    const error = new Error(errorMessage);

    jest
      .spyOn(global.navigator.clipboard, "writeText")
      .mockRejectedValueOnce(error);

    const content = "text";
    makeSut({ content });

    const button = screen.getByRole("button", { name: /Copy/i });
    await user.click(button);

    await waitFor(async () => {
      expect(toast.error).toHaveBeenCalledWith(
        `Error to copy a text: ${errorMessage}`
      );
    });
    expect(screen.getByRole("button", { name: /Copy/i })).toBeVisible();
  });
});
