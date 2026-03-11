"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type CopyButtonProps = {
  content: string;
};

export const CopyButton = ({ content }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const isContentEmpty = !content.trim();

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleCopy = async () => {
    const text = content.trim();

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      clearTimer();

      timerRef.current = setTimeout(() => setIsCopied(false), 750);
    } catch (error) {
      const _error = error as Error;
      toast.error(`Error to copy a text: ${_error.message}`);
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="disabled:opacity50 disabled:cursor-not-allowed"
      disabled={isContentEmpty}
      onClick={handleCopy}
    >
      {isCopied ? (
        <CheckIcon className="h-4 w-4 text-green-400" />
      ) : (
        <CheckIcon className="h-4 w-4" />
      )}
      <span>{isCopied ? "Copyed" : "Copy"}</span>
    </Button>
  );
};
