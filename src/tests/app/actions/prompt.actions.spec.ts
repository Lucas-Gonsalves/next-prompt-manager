import {
  createPromptAction,
  searchPromptAction,
} from "@/app/actions/prompt.actions";

jest.mock("@/lib/prisma", () => ({ prisma: {} }));
const mockedSearchExecute = jest.fn();
const mockedCreateExecute = jest.fn();

jest.mock("@/core/application/prompts/search-prompts.use-case", () => ({
  SearchPromptsUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

jest.mock("@/core/application/prompts/create-prompt.use-case", () => ({
  CreatePromptUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedCreateExecute })),
}));

describe("Server actions: Prompts", () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
    mockedCreateExecute.mockReset();
  });

  describe("createPromptAction", () => {
    it("should create a prompt with success", async () => {
      mockedCreateExecute.mockResolvedValue(undefined);
      const data = {
        title: "Title",
        content: "Content",
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(true);
      expect(result?.message).toBe("Prompt created with success.");
      expect(result?.errors).not.toBeDefined();
    });

    it("should return an error of validation when the fields are empty", async () => {
      const data = {
        title: "",
        content: "",
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Validation error.");
      expect(result?.errors).toBeDefined();
    });

    it("should return an error when PROMPT_ALREADY_EXISTS happens", async () => {
      mockedCreateExecute.mockRejectedValue(new Error("PROMPT_ALREADY_EXISTS"));

      const data = {
        title: "duplicate",
        content: "duplicate",
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("This prompt already exists.");
    });

    it("should return a generic error when failed creation", async () => {
      mockedCreateExecute.mockRejectedValue(new Error("UNKNOWN"));
      const data = {
        title: "title",
        content: "content",
      };

      const result = await createPromptAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Failed to create the prompt.");
    });
  });

  describe("searchPromptAction", () => {
    it("should return success with not empty search term", async () => {
      const input = [{ id: "1", title: "AI Title", content: "Content" }];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append("q", "AI");

      const result = await searchPromptAction({ success: true }, formData);
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it("should return success and list all prompts when term is empty", async () => {
      const input = [
        { id: "1", title: "First", content: "Content 01" },
        { id: "2", title: "Second", content: "Content 02" },
      ];

      mockedSearchExecute.mockReturnValue(input);
      const formData = new FormData();
      formData.append("q", "");

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBeDefined();
      expect(result.prompts).toEqual(input);
    });

    it("should return a generic error when failed to search", async () => {
      const error = new Error("UNKNOWN");
      mockedSearchExecute.mockRejectedValue(error);

      const formData = new FormData();
      formData.append("q", "error");

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.prompts).toBe(undefined);
      expect(result.message).toBe("Failed to fetch prompts");
    });

    it("should trim the spaces in terms before to execute", async () => {
      const input = [{ id: "1", title: "title 01", content: "content 01" }];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append("q", "title 01 ");

      const result = await searchPromptAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith("title 01");
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it("should treat absence of query like empty term", async () => {
      const input = [
        { id: "1", title: "first title", content: "content 01" },
        { id: "2", title: "second title", content: "content 02" },
      ];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchPromptAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith("");
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });
  });
});
