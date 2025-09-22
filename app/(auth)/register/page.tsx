import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useI18n } from "../../../lib/i18n";

export const runtime = "edge";

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <form className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">{t("auth.registerTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          Crea tu cuenta demo. Personaliza el onboarding en el backend real.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("auth.name")}</Label>
          <Input id="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input id="password" type="password" required />
        </div>
      </div>
      <Button type="submit" className="w-full">
        {t("auth.submit")}
      </Button>
      <div className="text-center text-xs text-muted-foreground">
        <Link href="/login" className="hover:text-primary">
          {t("auth.backToLogin")}
        </Link>
      </div>
    </form>
  );
}
