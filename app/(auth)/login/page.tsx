import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useI18n } from "../../../lib/i18n";

export const runtime = "edge";

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <form className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">{t("auth.loginTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          Demo UI. Conecta con tu backend más adelante.
        </p>
      </div>
      <div className="space-y-4">
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
        <Link href="/register" className="hover:text-primary">
          {t("auth.registerTitle")}
        </Link>
        <Link href="/forgot" className="hover:text-primary">
          {t("auth.forgotTitle")}
        </Link>
      </div>
    </form>
  );
}
