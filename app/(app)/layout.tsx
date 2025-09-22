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
    <div className="grid min-h-screen w-full bg-background text-foreground lg:grid-cols-[16rem_1fr]">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <CommandShortcuts />
          {children}
        </main>
      </div>
    </div>
  );
}
