import { prisma } from "@/lib/prisma";
import { SidebarContent } from "./components";

export const Sidebar = async () => {
  const prompts = await prisma.prompt.findMany();

  return (
    <aside>
      <SidebarContent
        prompts={[
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
        ]}
      />
    </aside>
  );
};
