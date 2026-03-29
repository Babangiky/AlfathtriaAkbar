import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { TextAnimate } from "./magicui/text-animate";
import { AnimatedGradientText } from "./magicui/animated-gradient-text";
import { AnimatedThemeToggler } from "./magicui/animated-theme-toggler";
import { LanguageSwitcher } from "@/src/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useI18n } from "@/src/i18n/I18nContext";

const navKeys = ["home", "about", "education", "portfolio", "contact"] as const;
const navHrefs = ["/", "#about", "#education", "#portfolio", "#contact"];

export const Navbar = () => {
  const { t } = useI18n();

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit ">
          <a className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">{t("brand")}</p>
          </a>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {navKeys.map((key, i) => (
            <NavbarItem key={key}>
              <a
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                href={navHrefs[i]}
              >
                {t(`nav.${key}`)}
              </a>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <LanguageSwitcher />
          <AnimatedThemeToggler className="cursor-pointer" />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <a href="#contact">
            <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] cursor-pointer">
              <span
                className={cn(
                  "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]",
                )}
                style={{
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
              />
              <AnimatedGradientText className="text-sm font-medium">
                <TextAnimate animation="scaleUp">Me</TextAnimate>
              </AnimatedGradientText>
            </div>
          </a>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <LanguageSwitcher />
        <AnimatedThemeToggler className="cursor-pointer" />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navKeys.map((key, i) => (
            <NavbarMenuItem key={key}>
              <Link
                color={i === 2 ? "primary" : i === navKeys.length - 1 ? "danger" : "foreground"}
                href={navHrefs[i]}
                size="lg"
              >
                {t(`nav.${key}`)}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
