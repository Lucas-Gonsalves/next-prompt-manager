import { prisma } from "@/lib/prisma";
import { SidebarContent } from "./components";

export const Sidebar = async () => {
  const prompts = await prisma.prompt.findMany();

  return (
    <aside>
      <SidebarContent />
    </aside>
  );
};
