import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/src/hooks/useTheme";
import { Button, Card, CardBody, CardHeader, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip, Input, Textarea, Accordion, AccordionItem } from "@heroui/react";
import { Divider } from "@heroui/divider";
import { Github, Instagram, Linkedin, Mail, Phone, ExternalLink, ChevronLeft, ChevronRight, Send, Grid3X3, Rows3, Loader2, GraduationCap, Zap } from "lucide-react";
import { Ripple } from "@/components/magicui/ripple";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { TextAnimate } from "@/components/magicui/text-animate";
import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { MagicCard } from "@/components/magicui/magic-card";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { Meteors } from "@/components/magicui/meteors";
import { usePortfolioData, type SiteSettings, type SocialLink as SocialLinkType, type SkillIcon as SkillIconType } from "@/src/hooks/usePortfolioData";
import { Navbar } from "@/components/navbar";
import { LoadingScreen } from "@/src/components/LoadingScreen";
import { useI18n } from "@/src/i18n/I18nContext";
import { supabase } from "@/src/integrations/supabase/client";
import { toast } from "sonner";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Linkedin, Github, Instagram, Mail,
};

export default function Portfolio() {
  const { resolvedTheme } = useTheme();
  const { t, lf } = useI18n();
  const { settings, education, skills, skillIcons, projects, socialLinks, loading } = usePortfolioData();

  if (loading) return <LoadingScreen />;

  const dock1Icons = skillIcons.filter((i) => i.dock_group === 1);
  const dock2Icons = skillIcons.filter((i) => i.dock_group === 2);
  const gradientColor = resolvedTheme === "light" ? "violet" : "#e9e9e9ff";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="relative container mx-auto">
        <div className="bg-background overflow-x-hidden">

          {/* =================== HERO — TIDAK DIUBAH =================== */}
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
            <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 py-12 md:py-20 px-6">
              <div className="flex-1 text-center md:text-left space-y-6">
                <BlurFade delay={0.3} inView>
                  <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
                    {t("hero.greeting")} <br />
                    <AnimatedGradientText>{lf(settings, "hero_name") || "Developer"}</AnimatedGradientText>
                  </h1>
                </BlurFade>
                <TextAnimate className="text-default-500 text-lg md:text-xl max-w-lg" animation="slideLeft">
                  {lf(settings, "hero_subtitle") || ""}
                </TextAnimate>
                <BlurFade delay={0.4} inView>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <a href="#portfolio">
                      <RainbowButton color="primary" size="lg">
                        <TextAnimate animation="scaleUp">{t("hero.viewProjects")}</TextAnimate>
                      </RainbowButton>
                    </a>
                    <ModalCV settings={settings} />
                  </div>
                </BlurFade>
                <BlurFade delay={0.4} inView>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <Sosmed socialLinks={socialLinks} />
                  </div>
                </BlurFade>
              </div>
              <BlurFade delay={0.6} inView>
                <div className="flex-1 flex justify-center md:justify-end">
                  <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem]">
                    <div className="absolute inset-0 rounded-full animate-pulse" />
                    <img alt={lf(settings, "hero_name") || ""} className="relative w-full h-full  object-cover rounded-full shadow-2xl ring-4 ring-primary/20" src={settings?.hero_image_url || ""} />
                  </div>
                </div>
              </BlurFade>
            </section>
            <Ripple />
          </div>

          {/* =================== RUNNING TEXT =================== */}
          <section className="relative w-full overflow-hidden py-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm" />
            <motion.div animate={{ x: ["0%", "-100%"] }} className="flex whitespace-nowrap relative" transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
              {[0, 1, 2].map((i) => (
                <p key={i} className="text-xl font-bold text-primary/80 px-8 tracking-wider">
                  {lf(settings, "running_text") || ""}
                </p>
              ))}
            </motion.div>
          </section>

          {/* =================== ABOUT ME =================== */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" id="about">
            <div className="text-center mb-14">
              <BlurFade delay={0.2} inView>
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">{t("about.subtitle")}</p>
              </BlurFade>
              <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter">
                <BlurFade delay={0.3} inView>
                  <AnimatedGradientText>{t("about.title")}</AnimatedGradientText>
                </BlurFade>
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-10 xl:gap-16">
              <motion.div className="w-full lg:w-5/12 flex justify-center" initial={{ opacity: 0, x: -50 }} transition={{ duration: 0.6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="relative w-full max-w-sm">
                    <img alt={lf(settings, "hero_name") || ""} className="w-full h-[380px] md:h-[460px] object-cover rounded-xl" src={settings?.about_image_url || ""} />
                </div>
              </motion.div>

              <motion.div className="w-full lg:w-7/12 text-center lg:text-left space-y-6" initial={{ opacity: 0, x: 50 }} transition={{ duration: 0.6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <MagicCard className=" rounded-2xl" gradientColor={gradientColor} gradientOpacity={0.1}>
                  <div className="text-default-600 text-base leading-relaxed p-6">
                    <TextAnimate>{lf(settings, "about_text") || ""}</TextAnimate>
                  </div>
                  <BorderBeam duration={12} size={150} />
                </MagicCard>

                <div className="space-y-3">
                  <BlurFade delay={0.4} inView>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">{t("about.techStack")}</p>
                  </BlurFade>
                  <SkillDockSection icons={dock1Icons} />
                  <SkillDockSection icons={dock2Icons} />
                </div>
              </motion.div>
            </div>
          </section>

          <Divider className="my-2 max-w-5xl mx-auto opacity-40" />

          {/* =================== EDUCATION & SKILLS — 2-KOLOM KREATIF =================== */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" id="education">

            {/* Section Header */}
            <div className="text-center mb-16">
              <BlurFade delay={0.2} inView>
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">{t("education.subtitle")}</p>
              </BlurFade>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                <BlurFade delay={0.3} inView>
                  <AnimatedGradientText>{t("education.title")}</AnimatedGradientText>
                </BlurFade>
              </h2>
            </div>

            {/* ── 2-KOLOM: Pendidikan (kiri) | Keahlian (kanan) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start">

              {/* ── KOLOM KIRI: Education ── */}
              <BlurFade delay={0.3} inView>
                <div className="h-full">
                  {/* Header kolom */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 shrink-0">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-primary">
                      {t("education.sectionEducation")}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                  </div>

                  {/* Timeline-style accordion */}
                  <div className="relative pl-4 border-l-2 border-primary/20 space-y-0">
                    <Accordion variant="splitted" selectionMode="multiple" className="gap-3 px-0">
                      {education.map((edu, idx) => (
                        <AccordionItem
                          key={edu.id}
                          aria-label={lf(edu, "title")}
                          title={
                            <div className="flex items-center gap-3 py-1">
                              {/* Timeline dot (positioned over the border-l) */}
                              <div className="relative -ml-[1.45rem] w-3 h-3 rounded-full bg-primary ring-2 ring-background shadow-[0_0_10px_hsl(var(--primary)/0.6)] shrink-0" />
                              <span className="text-base font-bold leading-snug">{lf(edu, "title")}</span>
                            </div>
                          }
                          classNames={{
                            base: "bg-default-50/50 backdrop-blur-sm border border-default-200/50 hover:border-primary/30 transition-colors",
                            content: "pt-0 pb-4 px-4",
                            title: "text-sm",
                          }}
                        >
                          <MagicCard className="p-4 rounded-xl" gradientColor={gradientColor} gradientOpacity={0.08}>
                            <p className="text-default-500 text-sm leading-relaxed">{lf(edu, "description")}</p>
                            {(edu.extra_info || edu.extra_info_en) && (
                              <div className="pt-3">
                                <Chip color="primary" variant="flat" size="sm">
                                  <AuroraText className="font-medium text-xs">{lf(edu, "extra_info")}</AuroraText>
                                </Chip>
                              </div>
                            )}
                          </MagicCard>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </BlurFade>

              {/* ── KOLOM KANAN: Skills ── */}
              <BlurFade delay={0.4} inView>
                <div className="h-full">
                  {/* Header kolom */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 shrink-0">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-primary">
                      {t("education.sectionSkills")}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                  </div>

                  {/* Skill rows — simple & clean */}
                  <div className="space-y-3">
                    {skills.map((skill, i) => (
                      <BlurFade key={skill.id} delay={0.1 + i * 0.07} inView>
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="flex items-start gap-4 p-4 rounded-xl border border-default-200/50 hover:border-primary/40 bg-default-50/40 hover:bg-primary/5 transition-all duration-200 group"
                        >
                          {/* Letter badge */}
                          <div className="w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                            <AuroraText className="font-bold text-sm">{lf(skill, "category").charAt(0)}</AuroraText>
                          </div>
                          {/* Text */}
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground mb-0.5">{lf(skill, "category")}</p>
                            <p className="text-default-400 text-xs leading-relaxed">{lf(skill, "content")}</p>
                          </div>
                        </motion.div>
                      </BlurFade>
                    ))}
                  </div>
                </div>
              </BlurFade>
            </div>
          </section>

          <Divider className="my-2 max-w-5xl mx-auto opacity-40" />

          {/* =================== PORTFOLIO =================== */}
          <PortfolioSection projects={projects} resolvedTheme={resolvedTheme} />

          {/* =================== CONTACT =================== */}
          <ContactSection settings={settings} socialLinks={socialLinks} />
        </div>
      </div>

      <footer className="w-full flex items-center justify-center py-5 bg-background border-t border-default-200/50">
        <span className="text-default-400 text-sm">© {new Date().getFullYear()} {lf(settings, "hero_name")}. {t("footer.rights")}</span>
      </footer>
    </div>
  );
}

/* ====== Portfolio Section with Carousel + Grid ====== */
function PortfolioSection({ projects, resolvedTheme }: { projects: any[]; resolvedTheme: string }) {
  const { t, lf } = useI18n();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const gradientColor = resolvedTheme === "light" ? "violet" : "#e9e9e9ff";

  const badges = [t("portfolio.all"), ...Array.from(new Set(projects.map((p) => p.badge)))];
  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === t("portfolio.all") || project.badge === filter;
    const matchesSearch =
      (lf(project, "title")).toLowerCase().includes(search.toLowerCase()) ||
      (lf(project, "description")).toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" id="portfolio">
      <div className="text-center mb-14">
        <BlurFade delay={0.2} inView>
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">{t("portfolio.subtitle")}</p>
        </BlurFade>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
          <BlurFade delay={0.3} inView>
            <AnimatedGradientText>{t("portfolio.title")}</AnimatedGradientText>
          </BlurFade>
        </h2>
      </div>

      {/* Filter Bar */}
      <BlurFade delay={0.3} inView>
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="flex-1 w-full relative">
            <Input
              classNames={{
                inputWrapper: "border border-default-200 focus-within:border-primary transition-colors bg-default-50/50 backdrop-blur-sm",
                input: "placeholder:text-default-400",
              }}
              type="text"
              placeholder={t("portfolio.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="bordered"
              radius="lg"
              color="primary"
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-primary hover:cursor-pointer transition-colors"
                type="button"
                onClick={() => setSearch("")}
              >✕</button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-center items-center">
            {badges.map((b) => (
              <Chip
                key={b}
                className={`cursor-pointer transition-all duration-300 ${filter === b ? "shadow-md shadow-primary/20" : ""}`}
                variant={filter === b ? "solid" : "bordered"}
                color="primary"
                size="md"
                onClick={() => setFilter(b)}
              >{b}</Chip>
            ))}
            <div className="flex gap-1 ml-1">
              <Button isIconOnly size="sm" variant={viewMode === "carousel" ? "solid" : "bordered"} color="primary" onPress={() => setViewMode("carousel")}>
                <Rows3 className="w-4 h-4" />
              </Button>
              <Button isIconOnly size="sm" variant={viewMode === "grid" ? "solid" : "bordered"} color="primary" onPress={() => setViewMode("grid")}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </BlurFade>

      <p className="text-default-500 text-sm mb-5">
        {t("portfolio.showing")} <span className="font-semibold text-foreground">{filteredProjects.length}</span> {filteredProjects.length === 1 ? t("portfolio.project") : t("portfolio.projects")}
      </p>

      {/* Carousel View */}
      {viewMode === "carousel" && filteredProjects.length > 0 && (
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                  <ProjectCard project={project} gradientColor={gradientColor} />
                </div>
              ))}
            </div>
          </div>
          {filteredProjects.length > 1 && (
            <div className="flex justify-center gap-3 mt-5">
              <Button isIconOnly size="sm" variant="bordered" color="primary" radius="full" onPress={scrollPrev}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button isIconOnly size="sm" variant="bordered" color="primary" radius="full" onPress={scrollNext}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 25, delay: i * 0.08 }}
                layout
              >
                <ProjectCard project={project} gradientColor={gradientColor} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

/* ====== Project Card ====== */
function ProjectCard({ project, gradientColor }: { project: any; gradientColor: string }) {
  const { t, lf } = useI18n();
  return (
    <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="h-full">
      <Card isBlurred className="rounded-2xl overflow-hidden h-full group">
        <MagicCard className="rounded-2xl flex flex-col h-full" gradientColor={gradientColor} gradientOpacity={0.1}>
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <motion.img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={project.cover_url}
              alt={lf(project, "title")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Chip className="absolute top-3 right-3 backdrop-blur-md" variant="flat" color="primary" size="sm">{project.badge}</Chip>
          </div>
          <div className="flex flex-col justify-between flex-1 p-5">
            <div className="space-y-2">
              <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{lf(project, "title")}</h4>
              <p className="text-default-500 text-sm leading-relaxed line-clamp-3">{lf(project, "description")}</p>
            </div>
            <div className="mt-5">
              <a href={project.link || "#"} target={project.link === "#portfolio" ? "" : "_blank"} rel={project.link === "#portfolio" ? undefined : "noopener noreferrer"}>
                <ShimmerButton className="shadow-lg w-full" shimmerColor="violet">
                  <span className="flex items-center gap-2 text-white text-sm font-medium">
                    {t("portfolio.viewProject")} <ExternalLink className="w-4 h-4" />
                  </span>
                </ShimmerButton>
              </a>
            </div>
          </div>
          <BorderBeam duration={15} size={150} />
        </MagicCard>
      </Card>
    </motion.div>
  );
}

/* ====== Contact Section with Form ====== */
function ContactSection({ settings, socialLinks }: { settings: SiteSettings | null; socialLinks: SocialLinkType[] }) {
  const { t, lf } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email, and message");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages" as any).insert({
        name: form.name,
        email: form.email,
        subject: form.subject || null,
        message: form.message,
      } as any);
      if (error) throw error;

      try {
        await supabase.functions.invoke("send-contact-email", {
          body: { ...form, to_email: settings?.contact_email },
        });
      } catch {
        // Edge function may not be deployed yet
      }

      toast.success(t("contact.success"));
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      toast.error(t("contact.error"));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" id="contact">
      <div className="relative overflow-hidden rounded-3xl">
        <div className="border-none bg-transparent shadow-none">
          <div className="p-0 rounded-3xl">
            <div className="relative z-10 p-8 md:p-14 lg:p-16">
              <div className="text-center mb-10">
                <BlurFade delay={0.2} inView>
                  <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">{t("contact.subtitle")}</p>
                </BlurFade>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
                  <BlurFade delay={0.3} inView>
                    <AnimatedGradientText>{t("contact.title")}</AnimatedGradientText>
                  </BlurFade>
                </h2>
                <BlurFade delay={0.4} inView>
                  <p className="text-default-500 text-base md:text-lg max-w-xl mx-auto">
                    {t("contact.description")}
                  </p>
                </BlurFade>
              </div>

              {/* Contact Form */}
              <BlurFade delay={0.5} inView>
                <div className="max-w-lg mx-auto space-y-4 mb-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label={t("contact.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} variant="bordered" radius="lg" />
                    <Input label={t("contact.email")} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} variant="bordered" radius="lg" />
                  </div>
                  <Input label={t("contact.subject")} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} variant="bordered" radius="lg" />
                  <Textarea label={t("contact.message")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} variant="bordered" radius="lg" minRows={4} />
                  <ShimmerButton className="shadow-xl w-full" shimmerColor="violet" onClick={handleSubmit} disabled={sending}>
                    <span className="flex items-center gap-2 text-white font-medium">
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {sending ? t("contact.sending") : t("contact.send")}
                    </span>
                  </ShimmerButton>
                </div>
              </BlurFade>

              {/* Phone / Email buttons */}
              <BlurFade delay={0.6} inView>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  {settings?.contact_phone && (
                    <a href={`tel:${settings.contact_phone}`}>
                      <ShimmerButton className="shadow-xl" shimmerColor="violet">
                        <span className="flex items-center gap-2 text-white font-medium">
                          <Phone className="w-4 h-4" /> {settings.contact_phone}
                        </span>
                      </ShimmerButton>
                    </a>
                  )}
                  {settings?.contact_email && (
                    <a href={`mailto:${settings.contact_email}`}>
                      <ShimmerButton className="shadow-xl" shimmerColor="violet">
                        <span className="flex items-center gap-2 text-white font-medium">
                          <Mail className="w-4 h-4" /> {settings.contact_email}
                        </span>
                      </ShimmerButton>
                    </a>
                  )}
                </div>
              </BlurFade>

              <BlurFade delay={0.7} inView>
                <div className="flex justify-center">
                  <Sosmed socialLinks={socialLinks} />
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== Subcomponents ====== */
function SkillDockSection({ icons }: { icons: SkillIconType[] }) {
  if (icons.length === 0) return null;
  return (
    <div className="relative">
      <Dock className="mt-0" direction="middle">
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        {icons.map((icon, i) => (
          <span key={icon.id} className="contents">
            <DockIcon>
              <img className="w-7 h-auto bg-amber-800" src={icon.icon_url} alt={icon.alt_text} />
            </DockIcon>
            {i < icons.length - 1 && <Divider orientation="vertical" />}
          </span>
        ))}
      </Dock>
    </div>
  );
}

function Sosmed({ socialLinks }: { socialLinks: SocialLinkType[] }) {
  return (
    <div className="flex gap-4 justify-center md:justify-start">
      {socialLinks.map((link) => {
        const Icon = iconMap[link.icon_name];
        return (
          <a key={link.id} href={link.url} rel="noopener noreferrer" target="_blank">
            <ShinyButton color="primary">
              {Icon ? <Icon className="w-5 h-5" /> : <span>{link.platform}</span>}
            </ShinyButton>
          </a>
        );
      })}
    </div>
  );
}

function ModalCV({ settings }: { settings: SiteSettings | null }) {
  const { t } = useI18n();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <RainbowButton color="primary" size="lg" variant="outline" onClick={onOpen}>
        <TextAnimate animation="scaleUp">{t("hero.document")}</TextAnimate>
      </RainbowButton>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-xl">
          {(onClose: any) => (
            <>
              <ModalHeader>{t("modal.downloadDocument")}</ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                {settings?.cv_url && (
                  <RainbowButton color="primary" size="lg" onClick={() => { window.open(settings.cv_url!, "_blank"); onClose(); }}>
                    <TextAnimate animation="scaleUp">{t("modal.downloadCV")}</TextAnimate>
                  </RainbowButton>
                )}
                {settings?.portfolio_pdf_url && (
                  <RainbowButton color="primary" size="lg" variant="outline" onClick={() => { window.open(settings.portfolio_pdf_url!, "_blank"); onClose(); }}>
                    <TextAnimate animation="scaleUp">{t("modal.downloadPortfolio")}</TextAnimate>
                  </RainbowButton>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="ghost" onPress={onClose}>{t("modal.close")}</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}