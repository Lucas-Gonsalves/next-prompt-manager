import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const PromptForm = () => {
  return (
    <form className="space-y-6">
      <header className="mb-6 flex flex-wrap items-center justify-end gap-2">
        <Button type="submit" size="sm">
          Save
        </Button>
      </header>

      <Input
        placeholder="Prompt Title"
        variant="transparent"
        size="lg"
        autoFocus
      />

      <Textarea
        placeholder="Type a content of the prompt..."
        variant="transparent"
        size="lg"
      />
    </form>
  );
};
