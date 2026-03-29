import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/src/integrations/supabase/client";
import { Button, Card, CardBody, CardHeader, Input, Textarea, Chip, Divider, Tabs, Tab } from "@heroui/react";
import { toast } from "sonner";
import { Plus, Trash2, Save, LogOut, ArrowLeft, Settings, GraduationCap, Lightbulb, Palette, Rocket, Link2, LayoutDashboard, Image as ImageIcon, GripVertical, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MagicCard } from "@/components/magicui/magic-card";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShineBorder } from "@/components/magicui/shine-border";
import { useTheme } from "@/src/hooks/useTheme";
import { ImageUploadField } from "@/src/components/admin/ImageUploadField";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/** Bilingual input helper: shows ID and EN tabs */
function BilingualInput({ label, value, valueEn, onChange, onChangeEn, multiline = false }: {
  label: string; value: string; valueEn: string;
  onChange: (v: string) => void; onChangeEn: (v: string) => void;
  multiline?: boolean;
}) {
  const Comp = multiline ? Textarea : Input;
  return (
    <div className="space-y-2">
      <Tabs size="sm" variant="underlined" color="primary" classNames={{ tabList: "gap-2" }}>
        <Tab key="id" title="🇮🇩 ID">
          <Comp label={`${label} (ID)`} value={value} onChange={(e) => onChange(e.target.value)} variant="bordered" {...(multiline ? { minRows: 3 } : {})} />
        </Tab>
        <Tab key="en" title="🇬🇧 EN">
          <Comp label={`${label} (EN)`} value={valueEn} onChange={(e) => onChangeEn(e.target.value)} variant="bordered" {...(multiline ? { minRows: 3 } : {})} />
        </Tab>
      </Tabs>
    </div>
  );
}

const sections = [
  { key: "settings", label: "Site Settings", icon: Settings, color: "from-violet-500 to-purple-600" },
  { key: "education", label: "Education", icon: GraduationCap, color: "from-blue-500 to-cyan-500" },
  { key: "skills", label: "Skills", icon: Lightbulb, color: "from-amber-500 to-orange-500" },
  { key: "skill-icons", label: "Skill Icons", icon: Palette, color: "from-pink-500 to-rose-500" },
  { key: "projects", label: "Projects", icon: Rocket, color: "from-emerald-500 to-teal-500" },
  { key: "social", label: "Social Links", icon: Link2, color: "from-indigo-500 to-blue-600" },
  { key: "messages", label: "Messages", icon: MessageSquare, color: "from-red-500 to-pink-500" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("settings");

  const [settings, setSettings] = useState<any>(null);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [skillIcons, setSkillIcons] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => { checkAuth(); }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/login"); return; }
    setUser(session.user);
    const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single();
    if (roleData?.role !== "admin") { toast.error("Anda bukan admin!"); navigate("/"); return; }
    setIsAdmin(true);
    await fetchAll();
    setLoading(false);
  }

  async function fetchAll() {
    const [s, e, sk, si, p, sl, m] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).single(),
      supabase.from("education").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("skill_icons").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("social_links").select("*").order("sort_order"),
      (supabase.from("contact_messages" as any).select("*").order("created_at", { ascending: false }) as any),
    ]);
    if (s.data) setSettings(s.data);
    if (e.data) setEducation(e.data);
    if (sk.data) setSkills(sk.data);
    if (si.data) setSkillIcons(si.data);
    if (p.data) setProjects(p.data);
    if (sl.data) setSocialLinks(sl.data);
    if (m.data) setMessages(m.data);
  }

  async function handleLogout() { await supabase.auth.signOut(); navigate("/login"); }

  async function saveSettings() {
    if (!settings) return;
    const { error } = await supabase.from("site_settings").update({
      hero_name: settings.hero_name, hero_name_en: settings.hero_name_en,
      hero_subtitle: settings.hero_subtitle, hero_subtitle_en: settings.hero_subtitle_en,
      hero_image_url: settings.hero_image_url, about_text: settings.about_text,
      about_text_en: settings.about_text_en, about_image_url: settings.about_image_url,
      contact_phone: settings.contact_phone, contact_email: settings.contact_email,
      running_text: settings.running_text, running_text_en: settings.running_text_en,
      cv_url: settings.cv_url, portfolio_pdf_url: settings.portfolio_pdf_url,
      updated_at: new Date().toISOString(),
    } as any).eq("id", settings.id);
    if (error) toast.error(error.message); else toast.success("Settings saved!");
  }

  async function addItem(table: string, defaults: any, setter: (fn: (prev: any[]) => any[]) => void) {
    const { data, error } = await (supabase.from(table as any).insert(defaults as any).select().single() as any);
    if (error) { toast.error(error.message); return; }
    setter((prev) => [...prev, data]);
    toast.success("Item ditambahkan!");
  }

  async function updateItem(table: string, id: string, updates: any) {
    const { error } = await (supabase.from(table as any).update(updates as any).eq("id", id) as any);
    if (error) toast.error(error.message); else toast.success("Tersimpan!");
  }

  async function deleteItem(table: string, id: string, setter: (fn: (prev: any[]) => any[]) => void) {
    const { error } = await (supabase.from(table as any).delete().eq("id", id) as any);
    if (error) { toast.error(error.message); return; }
    setter((prev) => prev.filter((item) => item.id !== id));
    toast.success("Dihapus!");
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );
  if (!isAdmin) return null;

  const gradientColor = resolvedTheme === "light" ? "violet" : "#e9e9e9ff";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-default-200/50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="light" size="sm" isIconOnly onPress={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold">
                <AnimatedGradientText>Admin Dashboard</AnimatedGradientText>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Chip variant="flat" color="primary" size="sm" className="hidden sm:flex">{user?.email}</Chip>
            <Button variant="bordered" size="sm" color="danger" onPress={handleLogout} startContent={<LogOut className="w-4 h-4" />}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Section Navigation */}
        <BlurFade delay={0.1} inView>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
            {sections.map((s, i) => (
              <motion.button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                className={`relative rounded-2xl p-4 text-center transition-all duration-300 border ${
                  activeSection === s.key
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                    : "border-default-200 bg-default-50/50 hover:border-primary/50"
                }`}
              >

                <p className={`text-xs font-semibold ${activeSection === s.key ? "text-primary" : "text-default-600"}`}>
                  {s.label}
                </p>
                {activeSection === s.key && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                )}
              </motion.button>
            ))}
          </div>
        </BlurFade>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === "settings" && (
              <SettingsSection settings={settings} setSettings={setSettings} saveSettings={saveSettings} gradientColor={gradientColor} />
            )}
            {activeSection === "education" && (
              <CrudSection
                title="Education" icon={<GraduationCap className="w-5 h-5" />} items={education}
                onAdd={() => addItem("education", { title: "New Education", title_en: "", description: "Description", description_en: "", sort_order: education.length }, setEducation)}
                onSave={(item) => updateItem("education", item.id, { title: item.title, title_en: item.title_en, description: item.description, description_en: item.description_en, extra_info: item.extra_info, extra_info_en: item.extra_info_en, sort_order: item.sort_order })}
                onDelete={(id) => deleteItem("education", id, setEducation)}
                gradientColor={gradientColor}
                renderFields={(item, update) => (
                  <>
                    <BilingualInput label="Title" value={item.title} valueEn={item.title_en || ""} onChange={(v) => update("title", v)} onChangeEn={(v) => update("title_en", v)} />
                    <BilingualInput label="Description" value={item.description} valueEn={item.description_en || ""} onChange={(v) => update("description", v)} onChangeEn={(v) => update("description_en", v)} multiline />
                    <BilingualInput label="Extra Info" value={item.extra_info || ""} valueEn={item.extra_info_en || ""} onChange={(v) => update("extra_info", v)} onChangeEn={(v) => update("extra_info_en", v)} />
                    <Input label="Sort Order" type="number" value={String(item.sort_order)} onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)} variant="bordered" />
                  </>
                )}
                setItems={setEducation}
                tableName="education"
              />
            )}
            {activeSection === "skills" && (
              <CrudSection
                title="Skills" icon={<Lightbulb className="w-5 h-5" />} items={skills}
                onAdd={() => addItem("skills", { category: "New Category", category_en: "", content: "Skill list", content_en: "", sort_order: skills.length }, setSkills)}
                onSave={(item) => updateItem("skills", item.id, { category: item.category, category_en: item.category_en, content: item.content, content_en: item.content_en, sort_order: item.sort_order })}
                onDelete={(id) => deleteItem("skills", id, setSkills)}
                gradientColor={gradientColor}
                renderFields={(item, update) => (
                  <>
                    <BilingualInput label="Category" value={item.category} valueEn={item.category_en || ""} onChange={(v) => update("category", v)} onChangeEn={(v) => update("category_en", v)} />
                    <BilingualInput label="Content" value={item.content} valueEn={item.content_en || ""} onChange={(v) => update("content", v)} onChangeEn={(v) => update("content_en", v)} multiline />
                    <Input label="Sort Order" type="number" value={String(item.sort_order)} onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)} variant="bordered" />
                  </>
                )}
                setItems={setSkills}
                tableName="skills"
              />
            )}
            {activeSection === "skill-icons" && (
              <CrudSection
                title="Skill Icons" icon={<Palette className="w-5 h-5" />} items={skillIcons}
                onAdd={() => addItem("skill_icons", { icon_url: "/icons/new.png", alt_text: "New Icon", dock_group: 1, sort_order: skillIcons.length }, setSkillIcons)}
                onSave={(item) => updateItem("skill_icons", item.id, { icon_url: item.icon_url, alt_text: item.alt_text, dock_group: item.dock_group, sort_order: item.sort_order })}
                onDelete={(id) => deleteItem("skill_icons", id, setSkillIcons)}
                gradientColor={gradientColor}
                renderFields={(item, update) => (
                  <>
                    {item.icon_url && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-default-50 border border-default-200">
                        <img src={item.icon_url} alt={item.alt_text} className="w-12 h-12 object-contain" />
                        <Chip color={item.dock_group === 1 ? "primary" : "secondary"} size="sm" variant="flat">Dock {item.dock_group}</Chip>
                      </div>
                    )}
                    <ImageUploadField label="Icon URL" value={item.icon_url} onChange={(url) => update("icon_url", url)} folder="icons" />
                    <Input label="Alt Text" value={item.alt_text} onChange={(e) => update("alt_text", e.target.value)} variant="bordered" />
                    <Input label="Dock Group (1 or 2)" type="number" value={String(item.dock_group)} onChange={(e) => update("dock_group", parseInt(e.target.value) || 1)} variant="bordered" />
                    <Input label="Sort Order" type="number" value={String(item.sort_order)} onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)} variant="bordered" />
                  </>
                )}
                setItems={setSkillIcons}
                tableName="skill_icons"
              />
            )}
            {activeSection === "projects" && (
              <CrudSection
                title="Projects" icon={<Rocket className="w-5 h-5" />} items={projects}
                onAdd={() => addItem("projects", { title: "New Project", title_en: "", description: "Description", description_en: "", badge: "Web", sort_order: projects.length }, setProjects)}
                onSave={(item) => updateItem("projects", item.id, { title: item.title, title_en: item.title_en, description: item.description, description_en: item.description_en, link: item.link, cover_url: item.cover_url, badge: item.badge, sort_order: item.sort_order })}
                onDelete={(id) => deleteItem("projects", id, setProjects)}
                gradientColor={gradientColor}
                renderFields={(item, update) => (
                  <>
                    <ImageUploadField label="Cover Image" value={item.cover_url || ""} onChange={(url) => update("cover_url", url)} folder="projects" />
                    <BilingualInput label="Title" value={item.title} valueEn={item.title_en || ""} onChange={(v) => update("title", v)} onChangeEn={(v) => update("title_en", v)} />
                    <BilingualInput label="Description" value={item.description} valueEn={item.description_en || ""} onChange={(v) => update("description", v)} onChangeEn={(v) => update("description_en", v)} multiline />
                    <Input label="Link" value={item.link || ""} onChange={(e) => update("link", e.target.value)} variant="bordered" />
                    <div className="flex gap-3">
                      <Input label="Badge" value={item.badge} onChange={(e) => update("badge", e.target.value)} variant="bordered" className="flex-1" />
                      <Input label="Sort Order" type="number" value={String(item.sort_order)} onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)} variant="bordered" className="w-32" />
                    </div>
                  </>
                )}
                setItems={setProjects}
                tableName="projects"
              />
            )}
            {activeSection === "social" && (
              <CrudSection
                title="Social Links" icon={<Link2 className="w-5 h-5" />} items={socialLinks}
                onAdd={() => addItem("social_links", { platform: "New Platform", url: "https://", icon_name: "Mail", sort_order: socialLinks.length }, setSocialLinks)}
                onSave={(item) => updateItem("social_links", item.id, { platform: item.platform, url: item.url, icon_name: item.icon_name, sort_order: item.sort_order })}
                onDelete={(id) => deleteItem("social_links", id, setSocialLinks)}
                gradientColor={gradientColor}
                renderFields={(item, update) => (
                  <>
                    <Input label="Platform" value={item.platform} onChange={(e) => update("platform", e.target.value)} variant="bordered" />
                    <Input label="URL" value={item.url} onChange={(e) => update("url", e.target.value)} variant="bordered" />
                    <Input label="Icon Name (Linkedin/Github/Instagram/Mail)" value={item.icon_name} onChange={(e) => update("icon_name", e.target.value)} variant="bordered" />
                    <Input label="Sort Order" type="number" value={String(item.sort_order)} onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)} variant="bordered" />
                  </>
                )}
                setItems={setSocialLinks}
                tableName="social_links"
              />
            )}
            {activeSection === "messages" && (
              <MessagesSection messages={messages} gradientColor={gradientColor} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ====== Settings Section ====== */
function SettingsSection({ settings, setSettings, saveSettings, gradientColor }: any) {
  if (!settings) return null;
  const upd = (key: string, val: string) => setSettings((s: any) => ({ ...s, [key]: val }));
  return (
    <div className="space-y-6">
      <BlurFade delay={0.1} inView>
        <Card isBlurred className="overflow-hidden">
          <MagicCard className="p-0 rounded-2xl" gradientColor={gradientColor} gradientOpacity={0.08}>
            <CardHeader className="px-6 pt-6 pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Hero Section</h2>
                  <p className="text-xs text-default-400">Atur tampilan utama portfolio</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 flex flex-col gap-4">
              <BilingualInput label="Hero Name" value={settings.hero_name || ""} valueEn={settings.hero_name_en || ""} onChange={(v) => upd("hero_name", v)} onChangeEn={(v) => upd("hero_name_en", v)} />
              <BilingualInput label="Hero Subtitle" value={settings.hero_subtitle || ""} valueEn={settings.hero_subtitle_en || ""} onChange={(v) => upd("hero_subtitle", v)} onChangeEn={(v) => upd("hero_subtitle_en", v)} multiline />
              <BilingualInput label="Running Text" value={settings.running_text || ""} valueEn={settings.running_text_en || ""} onChange={(v) => upd("running_text", v)} onChangeEn={(v) => upd("running_text_en", v)} />
              <ImageUploadField label="Hero Image" value={settings.hero_image_url || ""} onChange={(url) => upd("hero_image_url", url)} folder="hero" />
            </CardBody>
            <BorderBeam duration={12} size={200} />
          </MagicCard>
        </Card>
      </BlurFade>

      <BlurFade delay={0.2} inView>
        <Card isBlurred className="overflow-hidden">
          <MagicCard className="p-0 rounded-2xl" gradientColor={gradientColor} gradientOpacity={0.08}>
            <CardHeader className="px-6 pt-6 pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">About Section</h2>
                  <p className="text-xs text-default-400">Atur bagian tentang diri</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 flex flex-col gap-4">
              <BilingualInput label="About Text" value={settings.about_text || ""} valueEn={settings.about_text_en || ""} onChange={(v) => upd("about_text", v)} onChangeEn={(v) => upd("about_text_en", v)} multiline />
              <ImageUploadField label="About Image" value={settings.about_image_url || ""} onChange={(url) => upd("about_image_url", url)} folder="about" />
            </CardBody>
            <BorderBeam duration={12} size={200} />
          </MagicCard>
        </Card>
      </BlurFade>

      <BlurFade delay={0.3} inView>
        <Card isBlurred className="overflow-hidden">
          <MagicCard className="p-0 rounded-2xl" gradientColor={gradientColor} gradientOpacity={0.08}>
            <CardHeader className="px-6 pt-6 pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Contact & Documents</h2>
                  <p className="text-xs text-default-400">Atur informasi kontak dan dokumen</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Contact Phone" value={settings.contact_phone || ""} onChange={(e) => upd("contact_phone", e.target.value)} variant="bordered" />
                <Input label="Contact Email" value={settings.contact_email || ""} onChange={(e) => upd("contact_email", e.target.value)} variant="bordered" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="CV URL" value={settings.cv_url || ""} onChange={(e) => upd("cv_url", e.target.value)} variant="bordered" />
                <Input label="Portfolio PDF URL" value={settings.portfolio_pdf_url || ""} onChange={(e) => upd("portfolio_pdf_url", e.target.value)} variant="bordered" />
              </div>
            </CardBody>
            <BorderBeam duration={12} size={200} />
          </MagicCard>
        </Card>
      </BlurFade>

      <BlurFade delay={0.4} inView>
        <Button color="primary" size="lg" onPress={saveSettings} startContent={<Save className="w-5 h-5" />} className="w-full font-semibold">
          Save All Settings
        </Button>
      </BlurFade>
    </div>
  );
}

/* ====== Messages Section ====== */
function MessagesSection({ messages, gradientColor }: { messages: any[]; gradientColor: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10"><MessageSquare className="w-5 h-5" /></div>
        <div>
          <h2 className="text-2xl font-bold">Contact Messages</h2>
          <p className="text-xs text-default-400">{messages.length} messages received</p>
        </div>
      </div>
      <Divider />
      {messages.length === 0 ? (
        <div className="text-center py-16">
          <div className="p-4 rounded-full bg-default-100 inline-flex mb-4"><MessageSquare className="w-6 h-6 text-default-400" /></div>
          <p className="text-default-400">Belum ada pesan masuk.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages.map((msg) => (
            <Card key={msg.id} isBlurred className="overflow-hidden">
              <MagicCard className="p-0 rounded-2xl" gradientColor={gradientColor} gradientOpacity={0.06}>
                <CardBody className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{msg.name}</p>
                      <p className="text-xs text-default-400">{msg.email}</p>
                    </div>
                    <Chip size="sm" variant="flat" color="default">
                      {new Date(msg.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </Chip>
                  </div>
                  {msg.subject && <p className="text-sm font-semibold text-primary">{msg.subject}</p>}
                  <p className="text-default-500 text-sm">{msg.message}</p>
                </CardBody>
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
              </MagicCard>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ====== Generic CRUD Section ====== */
function CrudSection({ title, icon, items, onAdd, onSave, onDelete, gradientColor, renderFields, setItems, tableName }: {
  title: string; icon: React.ReactNode; items: any[]; onAdd: () => void;
  onSave: (item: any) => void; onDelete: (id: string) => void;
  gradientColor: string; renderFields: (item: any, update: (key: string, val: any) => void) => React.ReactNode;
  setItems: (fn: (prev: any[]) => any[]) => void;
  tableName: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({ ...item, sort_order: idx }));

    setItems(() => reordered);

    const updates = reordered.map((item) =>
      (supabase.from(tableName as any).update({ sort_order: item.sort_order } as any).eq("id", item.id) as any)
    );
    await Promise.all(updates);
    toast.success("Urutan diperbarui!");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">{icon}</div>
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-xs text-default-400">{items.length} items · Drag to reorder</p>
          </div>
        </div>
        <Button color="primary" onPress={onAdd} startContent={<Plus className="w-4 h-4" />} className="font-semibold">
          Add New
        </Button>
      </div>

      <Divider />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                gradientColor={gradientColor}
                renderFields={renderFields}
                setItems={setItems}
                onSave={onSave}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <div className="text-center py-16">
          <div className="p-4 rounded-full bg-default-100 inline-flex mb-4">{icon}</div>
          <p className="text-default-400">Belum ada data. Klik "Add New" untuk memulai.</p>
        </div>
      )}
    </div>
  );
}

/* ====== Sortable Item ====== */
function SortableItem({ item, gradientColor, renderFields, setItems, onSave, onDelete }: {
  item: any; gradientColor: string;
  renderFields: (item: any, update: (key: string, val: any) => void) => React.ReactNode;
  setItems: (fn: (prev: any[]) => any[]) => void;
  onSave: (item: any) => void; onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card isBlurred className={`overflow-hidden ${isDragging ? "shadow-2xl ring-2 ring-primary/30" : ""}`}>
        <MagicCard className="p-0 rounded-2xl" gradientColor={gradientColor} gradientOpacity={0.06}>
          <CardBody className="p-5 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <button
                {...attributes}
                {...listeners}
                className="mt-1 p-1.5 rounded-lg hover:bg-primary/10 cursor-grab active:cursor-grabbing transition-colors touch-none"
                aria-label="Drag to reorder"
              >
                <GripVertical className="w-5 h-5 text-default-400" />
              </button>
              <div className="flex-1 flex flex-col gap-4">
                {renderFields(item, (key, val) => setItems((prev) => prev.map((it) => it.id === item.id ? { ...it, [key]: val } : it)))}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" color="primary" onPress={() => onSave(item)} startContent={<Save className="w-4 h-4" />} className="font-semibold">
                    Save
                  </Button>
                  <Button size="sm" color="danger" variant="bordered" onPress={() => onDelete(item.id)} startContent={<Trash2 className="w-4 h-4" />}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        </MagicCard>
      </Card>
    </div>
  );
}
