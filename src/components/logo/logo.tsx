import { MessageSquareIcon } from "lucide-react";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="hover:text-accent-600 flex items-center gap-2 rounded-lg transition-colors"
    >
      <MessageSquareIcon className="" />
      <span className="text-lg font-semibold">PROMPTS</span>
    </Link>
  );
};
