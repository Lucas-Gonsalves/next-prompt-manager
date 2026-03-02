import { PromptSummary } from "@/core/domain/prompts/prompt.entity";
import { PromptCard } from "@/components/prompts/components";

type PromptListProps = {
  prompts: PromptSummary[];
};

export const PromptList = ({ prompts }: PromptListProps) => {
  return (
    <ul className="space-y-2">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </ul>
  );
};
