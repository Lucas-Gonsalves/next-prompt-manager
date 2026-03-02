"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { PromptSummary } from "@/core/domain/prompts/prompt.entity";
import { PromptList } from "@/components/prompts/components";
import { searchPromptAction } from "@/app/actions/prompt.actions";
import { Spinner } from "@/components/ui/spinner";

export type SidebarContentProps = {
  prompts: PromptSummary[];
};

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [searchState, searchAction, isPending] = useActionState(
    searchPromptAction,
    {
      success: true,
      prompts,
    }
  );

  const [query, setQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const hasQuery = query.trim().length > 0;
  const promptsList = hasQuery ? (searchState.prompts ?? prompts) : prompts;

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    startTransition(() => {
      const url = newQuery ? `/?q=${encodeURIComponent(newQuery)}` : "/";
      router.push(url);
      formRef.current?.requestSubmit();
    });
  };

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
              aria-label="Expand sidebar"
              title="Expand sidebar"
              onClick={toggleSidebar}
            >
              <ArrowRightToLineIcon className="h-5 w-5 text-gray-100" />
            </Button>
          </header>
          <div className="space-4 flex flex-col items-center">
            <Link href="/new" tabIndex={-1}>
              <Button aria-label="New prompt" title="New prompt">
                <PlusIcon className="h-5 w-5 text-white" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {!isCollapsed && (
        <>
          <section className="p-6">
            <div className="mb-4 md:hidden">
              <div className="flex items-center justify-between">
                <Button
                  variant="icon"
                  aria-label="Close Menu"
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
                  aria-label="Minimize sidebar"
                  title="Minimize sidebar"
                  onClick={toggleSidebar}
                >
                  <ArrowLeftToLineIcon className="h-5 w-5 text-gray-100" />
                </Button>
              </header>
            </div>

            <section className="mb-5">
              <form
                action={searchAction}
                ref={formRef}
                className="group relative w-full"
              >
                <Input
                  name="q"
                  type="text"
                  value={query}
                  placeholder="Search prompts..."
                  onChange={handleQueryChange}
                  autoFocus
                />
                {isPending && (
                  <div
                    title="Loading prompts"
                    aria-label="Loading prompts"
                    className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-2 text-gray-300"
                  >
                    <Spinner />
                  </div>
                )}
              </form>
            </section>

            <div>
              <Link href="/new" className="outline-none" tabIndex={-1}>
                <Button className="w-full" size="lg">
                  <PlusIcon className="mr-2 h-4 w-5" />
                  <span>New prompt</span>
                </Button>
              </Link>
            </div>
          </section>

          <nav
            className="flex-1 overflow-auto px-6 pb-6"
            aria-label="List of prompts"
          >
            <PromptList prompts={promptsList} />
          </nav>
        </>
      )}
    </aside>
  );
};
