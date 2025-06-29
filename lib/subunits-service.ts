import { supabase } from "./supabase"

export interface Subunit {
  subunit_id: number
  subunit_name: string
  description: string
  unit_id: number
  order: number
  content_type: string
  content_url?: string
  estimated_duration_minutes?: number
  created_at: string
  updated_at: string
}

export const subunitService = {
  // ✅ Get all subunits for a given unit ID (from the URL)
  async getSubunitsByUnitId(unitId: number): Promise<{ data: Subunit[] | null; error: any }> {
    const { data, error } = await supabase
      .from("sub_units")
      .select("*")
      .eq("unit_id", unitId)

    return { data, error }
  },

  // ✅ Get a specific subunit by its subunit ID
  async getSubunitById(subunitId: number): Promise<{ data: Subunit | null; error: any }> {
    const { data, error } = await supabase.from("sub_units").select("*").eq("sub_unit_id", subunitId).single()

    return { data, error }
  }
}
