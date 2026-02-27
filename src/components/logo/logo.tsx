import { MessageSquareIcon } from "lucide-react";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="hover:text-accent-600 focus-visible:ring-ring flex items-center gap-2 rounded-sm p-1 transition-colors outline-none focus-visible:ring-2"
    >
      <MessageSquareIcon className="" />
      <span className="text-lg font-semibold">PROMPTS</span>
    </Link>
  );
};
