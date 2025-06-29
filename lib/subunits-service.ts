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
      .from("subunits")
      .select("*")
      .eq("unit_id", unitId)
      .order("order", { ascending: true })

    return { data, error }
  },

  // ✅ Get a specific subunit by its subunit ID
  async getSubunitById(subunitId: number): Promise<{ data: Subunit | null; error: any }> {
    const { data, error } = await supabase.from("subunits").select("*").eq("subunit_id", subunitId).single()

    return { data, error }
  },

  // ✅ Optional: Track user progress on a subunit
  async updateSubunitProgress(userId: string, subunitId: number, progress: number): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.from("user_subunit_progress").upsert([
      {
        user_id: userId,
        subunit_id: subunitId,
        progress: progress,
        completed_at: progress >= 100 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
    ])

    return { data, error }
  },
}
