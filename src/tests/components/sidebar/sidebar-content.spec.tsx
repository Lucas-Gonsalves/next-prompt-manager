import {
  SidebarContent,
  type SidebarContentProps,
} from "@/components/sidebar/components";

import { render, screen, waitFor } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const initialPrompts = [
  {
    id: "1",
    title: "Title 01",
    content: "Content 01",
  },
  {
    id: "2",
    title: "Title 02",
    content: "Content 02",
  },
];
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => mockSearchParams,
}));

const makeSut = (
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps
) => {
  return render(<SidebarContent prompts={prompts} />);
};

describe("SidebarContent", () => {
  const user = userEvent.setup();

  describe("Base", () => {
    it("Should render a new prompt button", () => {
      makeSut();

      expect(screen.getByRole("complementary")).toBeVisible();
      expect(screen.getByRole("button", { name: "New prompt" })).toBeVisible();
    });

    it("should render prompts list", () => {
      const input = [
        {
          id: "2",
          title: "Title 02",
          content: "Content 02",
        },
        {
          id: "1",
          title: "Title 01",
          content: "Content 01",
        },
      ];
      makeSut({ prompts: input });

      expect(screen.getByText(input[0].title)).toBeInTheDocument();
      expect(screen.getAllByRole("paragraph")).toHaveLength(input.length);
    });

    it("Should update field of search as you type", async () => {
      makeSut();
      const searchInput = screen.getByPlaceholderText("Search prompts...");

      const text = "AI";
      await user.type(searchInput, text);

      expect(searchInput).toHaveValue(text);
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe("collapse / exand", () => {
    it("Should start expanded and display minimize button", () => {
      makeSut();
      const aside = screen.getByRole("complementary");
      expect(aside).toBeVisible();
      const collapseButton = screen.getByRole("button", {
        name: "Minimize sidebar",
      });
      const expandButton = screen.queryByRole("button", {
        name: "Expand sidebar",
      });

      expect(collapseButton).toBeVisible();
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

    it("Should display the button of create a new prompt in sidebar minimized", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimize sidebar/i,
      });

      await user.click(collapseButton);

      const newPromptButton = screen.getByRole("button", {
        name: "New prompt",
      });

      expect(newPromptButton).toBeVisible();
    });

    it("should expand when click the expand button", async () => {
      makeSut();
      const collapseButton = screen.getByRole("button", {
        name: /minimize sidebar/i,
      });

      await user.click(collapseButton);

      const expandButton = screen.getByRole("button", {
        name: /expand sidebar/i,
      });

      await user.click(expandButton);

      expect(
        screen.getByRole("button", { name: /minimize sidebar/i })
      ).toBeVisible();

      expect(
        screen.getByRole("navigation", { name: "List of prompts" })
      ).toBeVisible();
    });

    it("Shouln't display the list of prompts in sidebar minimized", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimize sidebar/i,
      });

      await user.click(collapseButton);

      const nav = screen.queryByRole("navigation", {
        name: "List of prompts",
      });

      expect(nav).not.toBeInTheDocument();
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

  describe("Search", () => {
    it("should navigate with coded URL when typing and clean.", async () => {
      const text = "A B";
      makeSut();
      const searchInput = screen.getByPlaceholderText("Search prompts...");

      await user.type(searchInput, text);

      expect(pushMock).toHaveBeenCalled();
      const lastCall = pushMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe("/?q=A%20B");

      await user.clear(searchInput);
      const lastClearCall = pushMock.mock.calls.at(-1);
      expect(lastClearCall?.[0]).toBe("/");
    });

    it("should submit form when type in search field", async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, "requestSubmit")
        .mockImplementation(() => undefined);
      makeSut();

      const searchInput = screen.getByPlaceholderText("Search prompts...");

      await user.type(searchInput, "AI");

      expect(submitSpy).toHaveBeenCalled();
      submitSpy.mockRestore();
    });

    it("should automatically submit when assembling a query when there is one.", async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, "requestSubmit")
        .mockImplementation(() => undefined);
      const text = "text";
      const searchParams = new URLSearchParams(`q=${text}`);
      mockSearchParams = searchParams;
      makeSut();

      expect(submitSpy).toHaveBeenCalled();
      submitSpy.mockRestore();
    });

    it("should search field should start with the search parameter.", async () => {
      const text = "initial";
      const searchParams = new URLSearchParams(`q=${text}`);
      mockSearchParams = searchParams;
      makeSut();
      const searchInput = screen.getByPlaceholderText("Search prompts...");

      await waitFor(() => expect(searchInput).toHaveValue(text));
    });
  });
});
