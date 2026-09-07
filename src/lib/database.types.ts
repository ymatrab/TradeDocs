export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          cancelled_at: string | null
          purge_after: string
          requested_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          purge_after: string
          requested_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          purge_after?: string
          requested_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          correlation_id: string
          created_at: string
          id: string
          metadata: Json
          org_id: string | null
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          correlation_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          org_id?: string | null
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          correlation_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          org_id?: string | null
          target_id?: string | null
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country_code: string | null
          created_at: string
          email: string | null
          id: string
          kind: string
          legal_name: string | null
          name: string
          org_id: string
          phone: string | null
          postal_code: string | null
          region: string | null
          registration_number: string | null
          tax_number: string | null
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          kind?: string
          legal_name?: string | null
          name: string
          org_id: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          registration_number?: string | null
          tax_number?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          kind?: string
          legal_name?: string | null
          name?: string
          org_id?: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          registration_number?: string | null
          tax_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          kind: string
          number: string
          org_id: string
          shipment_id: string
          shipment_revision: number
          snapshot: Json
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind: string
          number: string
          org_id: string
          shipment_id: string
          shipment_revision: number
          snapshot: Json
          status?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          number?: string
          org_id?: string
          shipment_id?: string
          shipment_revision?: number
          snapshot?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          org_id: string
          revoked_at: string | null
          role: string
          token_hash: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by: string
          org_id: string
          revoked_at?: string | null
          role: string
          token_hash: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          org_id?: string
          revoked_at?: string | null
          role?: string
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          org_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          org_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      numbering_sequences: {
        Row: {
          next_value: number
          org_id: string
          period: string
          scope: string
        }
        Insert: {
          next_value?: number
          org_id: string
          period: string
          scope: string
        }
        Update: {
          next_value?: number
          org_id?: string
          period?: string
          scope?: string
        }
        Relationships: [
          {
            foreignKeyName: "numbering_sequences_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          locale: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          locale?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          locale?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipment_items: {
        Row: {
          country_of_origin: string | null
          created_at: string
          description: string
          gross_weight_kg: number | null
          hs_code: string | null
          id: string
          net_weight_kg: number | null
          org_id: string
          package_count: number | null
          package_kind: string | null
          position: number
          quantity: number
          shipment_id: string
          unit: string
          unit_price: number
        }
        Insert: {
          country_of_origin?: string | null
          created_at?: string
          description: string
          gross_weight_kg?: number | null
          hs_code?: string | null
          id?: string
          net_weight_kg?: number | null
          org_id: string
          package_count?: number | null
          package_kind?: string | null
          position?: number
          quantity: number
          shipment_id: string
          unit?: string
          unit_price?: number
        }
        Update: {
          country_of_origin?: string | null
          created_at?: string
          description?: string
          gross_weight_kg?: number | null
          hs_code?: string | null
          id?: string
          net_weight_kg?: number | null
          org_id?: string
          package_count?: number | null
          package_kind?: string | null
          position?: number
          quantity?: number
          shipment_id?: string
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "shipment_items_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_items_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          consignee_id: string | null
          country_of_destination: string | null
          country_of_origin: string | null
          created_at: string
          created_by: string | null
          currency: string
          exporter_id: string | null
          id: string
          incoterm: string | null
          incoterm_place: string | null
          marks_and_numbers: string | null
          notify_id: string | null
          org_id: string
          port_of_discharge: string | null
          port_of_loading: string | null
          reference: string
          revision: number
          shipped_on: string | null
          status: string
          updated_at: string
        }
        Insert: {
          consignee_id?: string | null
          country_of_destination?: string | null
          country_of_origin?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          exporter_id?: string | null
          id?: string
          incoterm?: string | null
          incoterm_place?: string | null
          marks_and_numbers?: string | null
          notify_id?: string | null
          org_id: string
          port_of_discharge?: string | null
          port_of_loading?: string | null
          reference: string
          revision?: number
          shipped_on?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          consignee_id?: string | null
          country_of_destination?: string | null
          country_of_origin?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          exporter_id?: string | null
          id?: string
          incoterm?: string | null
          incoterm_place?: string | null
          marks_and_numbers?: string | null
          notify_id?: string | null
          org_id?: string
          port_of_discharge?: string | null
          port_of_loading?: string | null
          reference?: string
          revision?: number
          shipped_on?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_consignee_id_fkey"
            columns: ["consignee_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_exporter_id_fkey"
            columns: ["exporter_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_notify_id_fkey"
            columns: ["notify_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: { Args: { token: string }; Returns: string }
      cancel_account_deletion: { Args: never; Returns: undefined }
      create_invitation: {
        Args: {
          invitee_email: string
          invitee_role: string
          target_org: string
          valid_for?: string
        }
        Returns: string
      }
      create_organization: {
        Args: { organization_name: string }
        Returns: string
      }
      export_account_data: { Args: never; Returns: Json }
      generate_document: {
        Args: { document_kind: string; target_shipment: string }
        Returns: string
      }
      request_account_deletion: { Args: { grace?: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

