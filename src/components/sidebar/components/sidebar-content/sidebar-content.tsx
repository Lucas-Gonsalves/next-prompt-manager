"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowLeftToLineIcon,
  ArrowRightIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const SidebarContent = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 flex h-full w-[80vw] flex-col border-r border-gray-700 bg-gray-800",
        "transition-[transform,width] duration-300 ease-in-out",
        "sm:w-80 md:relative md:z-auto",
        isCollapsed ? "md:w-18" : "md:w-96"
      )}
    >
      {isCollapsed && (
        <section className="px-2 py-6">
          <header className="mb-6 flex items-center justify-center">
            <Button
              variant="icon"
              className="hidden rounded-lg p-2 md:inline-flex"
              aria-label="expand-sidebar"
              title="Expand sidebar"
              onClick={toggleSidebar}
            >
              <ArrowRightIcon className="h-5 w-5 text-gray-100" />
            </Button>
          </header>
        </section>
      )}

      {!isCollapsed && (
        <section className="p-6">
          <div className="mb-4 md:hidden">
            <div className="flex items-center justify-between">
              <Button
                variant="icon"
                aria-label="close-menu"
                title="Close menu"
                onClick={toggleSidebar}
              >
                <XIcon className="h-5 w-5 text-gray-100" />
              </Button>
            </div>
          </div>

          <div className="mb-6 flex w-full items-center justify-between">
            <header className="flex w-full items-center justify-between">
              <Logo />

              <Button
                variant="icon"
                className="hidden md:inline-flex"
                onClick={toggleSidebar}
              >
                <ArrowLeftToLineIcon className="h-5 w-5 text-gray-100" />
              </Button>
            </header>
          </div>

          <div>
            <Link href="/new">
              <Button className="w-full" size="lg">
                <PlusIcon className="mr-2 h-4 w-5" />
                <span>New prompt</span>
              </Button>
            </Link>
          </div>
        </section>
      )}
    </aside>
  );
};
