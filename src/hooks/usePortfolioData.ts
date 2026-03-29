import { useState, useEffect } from "react";
import { supabase } from "@/src/integrations/supabase/client";

export interface SiteSettings {
  id: string;
  hero_name: string;
  hero_name_en: string;
  hero_subtitle: string;
  hero_subtitle_en: string;
  hero_image_url: string | null;
  about_text: string | null;
  about_text_en: string | null;
  about_image_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  running_text: string | null;
  running_text_en: string | null;
  cv_url: string | null;
  portfolio_pdf_url: string | null;
}

export interface Education {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  extra_info: string | null;
  extra_info_en: string | null;
  sort_order: number;
}

export interface Skill {
  id: string;
  category: string;
  category_en: string;
  content: string;
  content_en: string;
  sort_order: number;
}

export interface SkillIcon {
  id: string;
  icon_url: string;
  alt_text: string;
  dock_group: number;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  link: string | null;
  cover_url: string | null;
  badge: string;
  sort_order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  sort_order: number;
}

export function usePortfolioData() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillIcons, setSkillIcons] = useState<SkillIcon[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    const [s, e, sk, si, p, sl] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).single(),
      supabase.from("education").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("skill_icons").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("social_links").select("*").order("sort_order"),
    ]);

    if (s.data) setSettings(s.data as unknown as SiteSettings);
    if (e.data) setEducation(e.data as unknown as Education[]);
    if (sk.data) setSkills(sk.data as unknown as Skill[]);
    if (si.data) setSkillIcons(si.data as unknown as SkillIcon[]);
    if (p.data) setProjects(p.data as unknown as Project[]);
    if (sl.data) setSocialLinks(sl.data as unknown as SocialLink[]);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  return {
    settings, education, skills, skillIcons, projects, socialLinks, loading,
    refetch: () => { setLoading(true); fetchAll(); },
  };
}
