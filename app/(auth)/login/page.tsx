import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useI18n } from "../../../lib/i18n";

export const runtime = "edge";

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <form className="space-y-8 text-left">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t("auth.loginTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          Demo UI. Conecta con tu backend más adelante.
        </p>
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" placeholder="you@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input id="password" type="password" required />
        </div>
      </div>
      <Button type="submit" className="w-full">
        {t("auth.submit")}
      </Button>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Link
          href="/register"
          className="rounded-full border border-transparent px-3 py-1 transition hover:border-border/60 hover:text-foreground"
        >
          {t("auth.registerTitle")}
        </Link>
        <Link
          href="/forgot"
          className="rounded-full border border-transparent px-3 py-1 transition hover:border-border/60 hover:text-foreground"
        >
          {t("auth.forgotTitle")}
        </Link>
      </div>
    </form>
  );
}
