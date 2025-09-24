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
    <div className="relative flex min-h-screen w-full bg-background text-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,125,255,0.15),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.1),transparent_60%)]" />
      <Sidebar />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="relative flex-1 overflow-y-auto">
          <CommandShortcuts />
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-10 lg:px-8">
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] border border-border/40 bg-surface/80 shadow-[0_24px_80px_rgba(8,8,8,0.25)] backdrop-blur" aria-hidden="true" />
            <div className="relative space-y-10">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
