import { SearchPromptsUseCase } from "@/core/application/prompts/search-prompts.use-case";
import { Prompt } from "@/core/domain/prompts/prompt.entity";
import { PromptRepository } from "@/core/domain/prompts/prompt.repository";

describe("SeachPromptUseCase", () => {
  const input: Prompt[] = [
    {
      id: "1",
      title: "Title 01",
      content: "Title 01",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Title 02",
      content: "Title 02",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const repository: PromptRepository = {
    findMany: async () => input,
    create: async () => {},
    findByTitle: async (title: string) =>
      input.find((prompt) => prompt.title === title) ?? null,
    searchMany: async (term) =>
      input.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(term.toLocaleLowerCase()) ||
          prompt.content.toLowerCase().includes(term.toLocaleLowerCase())
      ),
  };

  it("should return all prompts when the term is empty", async () => {
    const useCase = new SearchPromptsUseCase(repository);
    const results = await useCase.execute("");

    expect(results).toHaveLength(2);
  });

  it("should filter the list of prompts by the searched term", async () => {
    const useCase = new SearchPromptsUseCase(repository);
    const query = "title 01";

    const results = await useCase.execute(query);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("1");
  });

  it("should apply trim to searches containing spaces in the term and return the entire list of prompts.", async () => {
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue([]);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = "   ";

    const results = await useCase.execute(query);

    expect(results).toHaveLength(2);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });

  it("should search for terms with blank spaces, dealing with the trim", async () => {
    const firstElement = input.slice(0, 1);
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue(firstElement);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = "title 02";

    const results = await useCase.execute(query);

    expect(results).toMatchObject(firstElement);
    expect(searchMany).toHaveBeenCalledWith(query.trim());
    expect(findMany).not.toHaveBeenCalled();
  });

  it("should handle the term undefined or null and return the complete list of prompts.", async () => {
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue([]);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = undefined as unknown as string;

    const results = await useCase.execute(query);

    expect(results).toMatchObject(input);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });
});
