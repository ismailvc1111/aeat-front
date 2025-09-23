"use client";

import { Sidebar } from "../../components/Sidebar";
import { Topbar } from "../../components/Topbar";
import { useI18n } from "../../lib/i18n";
import { useRegisterCommand } from "../../components/CommandK";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export const runtime = "edge";

function CommandShortcuts() {
  const { t } = useI18n();
  const router = useRouter();

  useRegisterCommand(
    useMemo(
      () => ({
        id: "new-invoice",
        title: t("invoices.new"),
        shortcutKey: "n",
        shortcutLabel: "N",
        onSelect: () => router.push("/invoices/new"),
      }),
      [router, t]
    )
  );

  return null;
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,125,255,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-[20rem_1fr]">
        <Sidebar />
        <div className="flex min-h-screen flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-4 pb-16">
            <CommandShortcuts />
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
