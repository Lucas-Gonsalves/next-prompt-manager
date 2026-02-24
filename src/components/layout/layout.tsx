import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <section className="flex h-screen">
        <Sidebar />
        <main className="relative min-w-0 flex-1 overflow-auto">
          <div className="mx-auto h-full max-w-full p-4 sm:p-6 md:max-w-3xl md:p-8">
            {children}
          </div>
        </main>
      </section>
    </div>
  );
};
