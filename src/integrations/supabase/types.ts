export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          description: string
          description_en: string | null
          extra_info: string | null
          extra_info_en: string | null
          id: string
          sort_order: number
          title: string
          title_en: string | null
        }
        Insert: {
          created_at?: string
          description: string
          description_en?: string | null
          extra_info?: string | null
          extra_info_en?: string | null
          id?: string
          sort_order?: number
          title: string
          title_en?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          description_en?: string | null
          extra_info?: string | null
          extra_info_en?: string | null
          id?: string
          sort_order?: number
          title?: string
          title_en?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          badge: string
          cover_url: string | null
          created_at: string
          description: string
          description_en: string | null
          id: string
          link: string | null
          sort_order: number
          title: string
          title_en: string | null
        }
        Insert: {
          badge?: string
          cover_url?: string | null
          created_at?: string
          description: string
          description_en?: string | null
          id?: string
          link?: string | null
          sort_order?: number
          title: string
          title_en?: string | null
        }
        Update: {
          badge?: string
          cover_url?: string | null
          created_at?: string
          description?: string
          description_en?: string | null
          id?: string
          link?: string | null
          sort_order?: number
          title?: string
          title_en?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_image_url: string | null
          about_text: string | null
          about_text_en: string | null
          contact_email: string | null
          contact_phone: string | null
          cv_url: string | null
          hero_image_url: string | null
          hero_name: string
          hero_name_en: string | null
          hero_subtitle: string
          hero_subtitle_en: string | null
          id: string
          portfolio_pdf_url: string | null
          running_text: string | null
          running_text_en: string | null
          updated_at: string
        }
        Insert: {
          about_image_url?: string | null
          about_text?: string | null
          about_text_en?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cv_url?: string | null
          hero_image_url?: string | null
          hero_name?: string
          hero_name_en?: string | null
          hero_subtitle?: string
          hero_subtitle_en?: string | null
          id?: string
          portfolio_pdf_url?: string | null
          running_text?: string | null
          running_text_en?: string | null
          updated_at?: string
        }
        Update: {
          about_image_url?: string | null
          about_text?: string | null
          about_text_en?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cv_url?: string | null
          hero_image_url?: string | null
          hero_name?: string
          hero_name_en?: string | null
          hero_subtitle?: string
          hero_subtitle_en?: string | null
          id?: string
          portfolio_pdf_url?: string | null
          running_text?: string | null
          running_text_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skill_icons: {
        Row: {
          alt_text: string
          created_at: string
          dock_group: number
          icon_url: string
          id: string
          sort_order: number
        }
        Insert: {
          alt_text: string
          created_at?: string
          dock_group?: number
          icon_url: string
          id?: string
          sort_order?: number
        }
        Update: {
          alt_text?: string
          created_at?: string
          dock_group?: number
          icon_url?: string
          id?: string
          sort_order?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          category_en: string | null
          content: string
          content_en: string | null
          created_at: string
          id: string
          sort_order: number
        }
        Insert: {
          category: string
          category_en?: string | null
          content: string
          content_en?: string | null
          created_at?: string
          id?: string
          sort_order?: number
        }
        Update: {
          category?: string
          category_en?: string | null
          content?: string
          content_en?: string | null
          created_at?: string
          id?: string
          sort_order?: number
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          icon_name: string
          id: string
          platform: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          icon_name: string
          id?: string
          platform: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          icon_name?: string
          id?: string
          platform?: string
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
