import { PromptSummary } from "@/core/domain/prompts/prompt.entity";
import Link from "next/link";

type PromptCardProps = {
  prompt: PromptSummary;
};

export const PromptCard = ({ prompt }: PromptCardProps) => {
  return (
    <li className="group relative rounded-lg p-3 transition-all duration-200 hover:bg-gray-700">
      <header className="flex items-start justify-between">
        <Link href={`/${prompt.id}`} prefetch className="min-w-0 flex-1">
          <h3 className="group-hover:text-accent-300 text-sm font-medium text-white transition-colors">
            {prompt.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-gray-400">
            {prompt.content}
          </p>
        </Link>
      </header>
    </li>
  );
};
