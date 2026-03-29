import { Button } from "@heroui/react";
import { useI18n } from "@/src/i18n/I18nContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <Button
      variant="bordered"
      size="sm"
      radius="full"
      onPress={() => setLocale(locale === "id" ? "en" : "id")}
      className="min-w-[48px] h-8 text-xs font-bold border-primary/30 hover:border-primary gap-1"
      startContent={<Globe className="w-3.5 h-3.5" />}
    >
      {locale.toUpperCase()}
    </Button>
  );
}
