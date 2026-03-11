import { CreatePromptDTO } from "@/core/application/prompts/create-prompt.dto";
import { Prompt } from "@/core/domain/prompts/prompt.entity";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPromptRepository } from "@/infra/repository/prisma-prompt.repository";

type PromptDelegateMock = {
  create: jest.MockedFunction<
    (args: { data: CreatePromptDTO }) => Promise<void>
  >;

  findFirst: jest.MockedFunction<
    (args: {
      where: { title: string };
    }) => Promise<Pick<Prompt, "id" | "title" | "content"> | null>
  >;

  findMany: jest.MockedFunction<
    (args: {
      orderBy?: { createdAt: "asc" | "desc" };
      where?: {
        OR: Array<{
          title?: { contains: string; mode: "insensitive" };
          content?: { contains: string; mode: "insensitive" };
        }>;
      };
    }) => Promise<Prompt[]>
  >;
};

type PrismaMock = {
  prompt: PromptDelegateMock;
};

function createMockPrisma() {
  const mock: PrismaMock = {
    prompt: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  return mock as unknown as PrismaClient & PrismaMock;
}

describe("prismaPromptRepository", () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let repository: PrismaPromptRepository;

  beforeEach(() => {
    prisma = createMockPrisma();
    repository = new PrismaPromptRepository(prisma);
  });

  describe("create", () => {
    it("should call the create method with correct data", async () => {
      const input = {
        title: "title",
        content: "content",
      };

      await repository.create(input);

      expect(prisma.prompt.create).toHaveBeenCalledWith({
        data: input,
      });
    });
  });

  describe("findByTitle", () => {
    it("should call the findFirst correctly with title", async () => {
      const title = "title 01";
      const input = {
        id: "p1",
        title,
        content: "content 01",
      };

      prisma.prompt.findFirst.mockResolvedValue(input);

      const result = await repository.findByTitle(title);

      expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
        where: {
          title,
        },
      });
      expect(result).toEqual(input);
    });
  });

  describe("findMany", () => {
    it("should sort by createdAt descendants and map the results", async () => {
      const now = new Date();
      const input = [
        {
          id: "1",
          title: "Title 01",
          content: "Content 01",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "2",
          title: "Title 02",
          content: "Content 02",
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.findMany();

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
      expect(results).toMatchObject(input);
    });
  });

  describe("searchMany", () => {
    it("should search by empty term, not by where", async () => {
      const now = new Date();
      const input = [
        {
          id: "1",
          title: "Title 01",
          content: "Content 01",
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany("     ");

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: "desc" },
      });
      expect(results).toMatchObject(input);
    });

    it("should search by term and populate OR in where", async () => {
      const now = new Date();
      const input = [
        {
          id: "1",
          title: "Title 01",
          content: "Content 01",
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany("  title 01  ");

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: "title 01", mode: "insensitive" } },
            { content: { contains: "title 01", mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
      expect(results).toMatchObject(input);
    });
  });
});
