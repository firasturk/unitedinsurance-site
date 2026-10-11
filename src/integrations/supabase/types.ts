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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_news: {
        Row: {
          body_ar: string[]
          body_en: string[]
          created_at: string
          date: string
          id: string
          published: boolean
          sort_order: number
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          body_ar?: string[]
          body_en?: string[]
          created_at?: string
          date: string
          id?: string
          published?: boolean
          sort_order?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Update: {
          body_ar?: string[]
          body_en?: string[]
          created_at?: string
          date?: string
          id?: string
          published?: boolean
          sort_order?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          body_ar: string[]
          body_en: string[]
          category: string
          cover_url: string | null
          created_at: string
          date: string
          excerpt_ar: string
          excerpt_en: string
          id: string
          published: boolean
          slug: string
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          body_ar?: string[]
          body_en?: string[]
          category?: string
          cover_url?: string | null
          created_at?: string
          date?: string
          excerpt_ar?: string
          excerpt_en?: string
          id?: string
          published?: boolean
          slug: string
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          body_ar?: string[]
          body_en?: string[]
          category?: string
          cover_url?: string | null
          created_at?: string
          date?: string
          excerpt_ar?: string
          excerpt_en?: string
          id?: string
          published?: boolean
          slug?: string
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          id: string
          last_message_at: string
          page_url: string | null
          session_id: string
          started_at: string
          user_agent: string | null
        }
        Insert: {
          id?: string
          last_message_at?: string
          page_url?: string | null
          session_id: string
          started_at?: string
          user_agent?: string | null
        }
        Update: {
          id?: string
          last_message_at?: string
          page_url?: string | null
          session_id?: string
          started_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      chat_faqs: {
        Row: {
          active: boolean
          answer_ar: string
          answer_en: string
          created_at: string
          id: string
          question_ar: string
          question_en: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          answer_ar?: string
          answer_en?: string
          created_at?: string
          id?: string
          question_ar: string
          question_en: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          answer_ar?: string
          answer_en?: string
          created_at?: string
          id?: string
          question_ar?: string
          question_en?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          created_at: string
          email: string
          emailed: boolean
          full_name: string
          id: string
          kind: string
          lang: string
          message: string
          national_id: string
          phone: string
          policy_number: string
          reference: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          emailed?: boolean
          full_name: string
          id?: string
          kind?: string
          lang?: string
          message: string
          national_id: string
          phone: string
          policy_number?: string
          reference: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          emailed?: boolean
          full_name?: string
          id?: string
          kind?: string
          lang?: string
          message?: string
          national_id?: string
          phone?: string
          policy_number?: string
          reference?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          emailed: boolean
          full_name: string
          id: string
          insurance_type: string
          message: string
          phone: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          emailed?: boolean
          full_name: string
          id?: string
          insurance_type: string
          message: string
          phone: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          emailed?: boolean
          full_name?: string
          id?: string
          insurance_type?: string
          message?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
      forms: {
        Row: {
          category: string
          created_at: string
          file_url: string
          id: string
          label_ar: string
          label_en: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          file_url: string
          id?: string
          label_ar: string
          label_en: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          file_url?: string
          id?: string
          label_ar?: string
          label_en?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      insurance_services: {
        Row: {
          active: boolean
          covered_ar: string[]
          covered_en: string[]
          created_at: string
          emoji: string | null
          icon: string
          id: string
          image_url: string | null
          overview_ar: string
          overview_en: string
          slug: string
          sort_order: number
          summary_ar: string
          summary_en: string
          title_ar: string
          title_en: string
          tone: string
          updated_at: string
          why_ar: string
          why_en: string
        }
        Insert: {
          active?: boolean
          covered_ar?: string[]
          covered_en?: string[]
          created_at?: string
          emoji?: string | null
          icon?: string
          id?: string
          image_url?: string | null
          overview_ar?: string
          overview_en?: string
          slug: string
          sort_order?: number
          summary_ar?: string
          summary_en?: string
          title_ar: string
          title_en: string
          tone?: string
          updated_at?: string
          why_ar?: string
          why_en?: string
        }
        Update: {
          active?: boolean
          covered_ar?: string[]
          covered_en?: string[]
          created_at?: string
          emoji?: string | null
          icon?: string
          id?: string
          image_url?: string | null
          overview_ar?: string
          overview_en?: string
          slug?: string
          sort_order?: number
          summary_ar?: string
          summary_en?: string
          title_ar?: string
          title_en?: string
          tone?: string
          updated_at?: string
          why_ar?: string
          why_en?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_note: string
          created_at: string
          cv_path: string | null
          email: string
          full_name: string
          id: string
          phone: string
          status: string
          vacancy_id: string | null
          vacancy_title: string
        }
        Insert: {
          cover_note?: string
          created_at?: string
          cv_path?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string
          status?: string
          vacancy_id?: string | null
          vacancy_title?: string
        }
        Update: {
          cover_note?: string
          created_at?: string
          cv_path?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string
          status?: string
          vacancy_id?: string | null
          vacancy_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_vacancy_id_fkey"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "job_vacancies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_vacancies: {
        Row: {
          closing_date: string | null
          created_at: string
          department_ar: string
          department_en: string
          id: string
          level_ar: string
          level_en: string
          location_ar: string
          location_en: string
          published: boolean
          qualifications_ar: string[]
          qualifications_en: string[]
          responsibilities_ar: string[]
          responsibilities_en: string[]
          skills_ar: string[]
          skills_en: string[]
          slug: string
          sort_order: number
          summary_ar: string
          summary_en: string
          title_ar: string
          title_en: string
          type_ar: string
          type_en: string
          updated_at: string
        }
        Insert: {
          closing_date?: string | null
          created_at?: string
          department_ar?: string
          department_en?: string
          id?: string
          level_ar?: string
          level_en?: string
          location_ar?: string
          location_en?: string
          published?: boolean
          qualifications_ar?: string[]
          qualifications_en?: string[]
          responsibilities_ar?: string[]
          responsibilities_en?: string[]
          skills_ar?: string[]
          skills_en?: string[]
          slug: string
          sort_order?: number
          summary_ar?: string
          summary_en?: string
          title_ar: string
          title_en: string
          type_ar?: string
          type_en?: string
          updated_at?: string
        }
        Update: {
          closing_date?: string | null
          created_at?: string
          department_ar?: string
          department_en?: string
          id?: string
          level_ar?: string
          level_en?: string
          location_ar?: string
          location_en?: string
          published?: boolean
          qualifications_ar?: string[]
          qualifications_en?: string[]
          responsibilities_ar?: string[]
          responsibilities_en?: string[]
          skills_ar?: string[]
          skills_en?: string[]
          slug?: string
          sort_order?: number
          summary_ar?: string
          summary_en?: string
          title_ar?: string
          title_en?: string
          type_ar?: string
          type_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          active: boolean
          created_at: string
          id: string
          logo_url: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          logo_url: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          logo_url?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          name_ar: string
          name_en: string
          photo_url: string | null
          role_ar: string
          role_en: string
          section: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          photo_url?: string | null
          role_ar: string
          role_en: string
          section: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          photo_url?: string | null
          role_ar?: string
          role_en?: string
          section?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role: "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin"],
    },
  },
} as const
