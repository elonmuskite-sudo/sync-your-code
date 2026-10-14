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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      auth_email_code_limits: {
        Row: {
          bucket_key: string
          count: number
          window_start: string
        }
        Insert: {
          bucket_key: string
          count?: number
          window_start?: string
        }
        Update: {
          bucket_key?: string
          count?: number
          window_start?: string
        }
        Relationships: []
      }
      identity_verifications: {
        Row: {
          created_at: string
          id: string
          id_document_path: string
          match_score: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_note: string | null
          selfie_path: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          id_document_path: string
          match_score?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_note?: string | null
          selfie_path: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          id_document_path?: string
          match_score?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_note?: string | null
          selfie_path?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          auth_user_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          email_verified: boolean
          first_name: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          last_name: string | null
          member_id: string
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          email_verified?: boolean
          first_name?: string | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          last_name?: string | null
          member_id: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean
          first_name?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          last_name?: string | null
          member_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          id: number
          network: string
          qr_image_url: string | null
          updated_at: string
          wallet_address: string
        }
        Insert: {
          id?: number
          network?: string
          qr_image_url?: string | null
          updated_at?: string
          wallet_address: string
        }
        Update: {
          id?: number
          network?: string
          qr_image_url?: string | null
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      payment_webhook_events: {
        Row: {
          error: string | null
          id: string
          order_id: string | null
          outcome: string
          payload: Json | null
          payment_id: string | null
          payment_status: string | null
          received_at: string
          signature_valid: boolean
        }
        Insert: {
          error?: string | null
          id?: string
          order_id?: string | null
          outcome?: string
          payload?: Json | null
          payment_id?: string | null
          payment_status?: string | null
          received_at?: string
          signature_valid?: boolean
        }
        Update: {
          error?: string | null
          id?: string
          order_id?: string | null
          outcome?: string
          payload?: Json | null
          payment_id?: string | null
          payment_status?: string | null
          received_at?: string
          signature_valid?: boolean
        }
        Relationships: []
      }
      storage_files: {
        Row: {
          chat_id: string | null
          created_at: string
          duration_seconds: number | null
          file_name: string
          file_type: string
          id: string
          mime_type: string | null
          size_bytes: number
          storage_path: string
          user_id: string
        }
        Insert: {
          chat_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_name: string
          file_type: string
          id?: string
          mime_type?: string | null
          size_bytes?: number
          storage_path: string
          user_id: string
        }
        Update: {
          chat_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_name?: string
          file_type?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      storage_purchases: {
        Row: {
          added_bytes: number
          amount_cents: number
          checkout_session_id: string | null
          created_at: string
          currency: string
          id: string
          invoice_number: number | null
          receipt_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          tier: string
          tx_reference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          added_bytes: number
          amount_cents: number
          checkout_session_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          invoice_number?: number | null
          receipt_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          tier: string
          tx_reference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          added_bytes?: number
          amount_cents?: number
          checkout_session_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          invoice_number?: number | null
          receipt_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          tier?: string
          tx_reference?: string | null
          updated_at?: string
          user_id?: string
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
      user_storage_quotas: {
        Row: {
          created_at: string
          quota_bytes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          quota_bytes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          quota_bytes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      admin_list_admins: {
        Args: never
        Returns: {
          user_id: string
        }[]
      }
      admin_set_admin_role: {
        Args: { _grant: boolean; _user_id: string }
        Returns: undefined
      }
      admin_update_member: {
        Args: {
          _bio: string
          _first_name: string
          _last_name: string
          _member_id: string
        }
        Returns: undefined
      }
      claim_first_admin: { Args: never; Returns: undefined }
      consume_auth_email_code_limit: {
        Args: {
          p_bucket_key: string
          p_limit: number
          p_window_seconds: number
        }
        Returns: boolean
      }
      get_verification_badge: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lookup_member_by_nexus_id: {
        Args: { p_member_id: string }
        Returns: {
          avatar_url: string
          first_name: string
          full_name: string
          id: string
          last_name: string
          member_id: string
        }[]
      }
      review_usdt_payment: {
        Args: { _approve: boolean; _purchase_id: string }
        Returns: undefined
      }
      submit_usdt_payment: {
        Args: { _tier: string; _tx_reference: string }
        Returns: string
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
      app_role: ["admin", "user"],
    },
  },
} as const
