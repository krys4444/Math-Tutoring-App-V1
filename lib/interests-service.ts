import { supabase } from "./supabase"

export interface Interest {
  id: number
  interest_name: string
  created_at: string
}

export interface UserInterest {
  interest_id: string
  interest_name: string
}

export const interestsService = {
  // Get user's interests
  async getUserInterests(): Promise<{ data: Interest[] | null; error: any }> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    const { data, error } = await supabase
      .from("user_interests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    return { data, error }
  },

  // Add a new interest for the user
  async addUserInterest(interestName: string): Promise<{ data: any; error: any }> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    const { data, error } = await supabase
      .from("user_interests")
      .insert([
        {
          user_id: user.id,
          interest_name: interestName,
        },
      ])
      .select()

    return { data, error }
  },

  // Remove an interest
  async removeUserInterest(interestId: number): Promise<{ data: any; error: any }> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    const { data, error } = await supabase.from("user_interests").delete().eq("id", interestId).eq("user_id", user.id)

    return { data, error }
  },
}

// Save user interests to database
export async function saveUserInterests(interests: Interest[]): Promise<{ error: Error | null }> {
  try {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { error: new Error("User not authenticated") }
    }

    // First, delete existing interests for this user
    const { error: deleteError } = await supabase.from("user_interests").delete().eq("user_id", user.user.id)

    if (deleteError) {
      console.error("Error deleting existing interests:", deleteError)
      return { error: deleteError }
    }

    // If no interests to save, we're done
    if (interests.length === 0) {
      return { error: null }
    }

    // Insert new interests
    const interestsToInsert = interests.map((interest) => ({
      user_id: user.user.id,
      interest_name: interest.interest_name,
    }))

    const { error: insertError } = await supabase.from("user_interests").insert(interestsToInsert)

    if (insertError) {
      console.error("Error inserting interests:", insertError)
      return { error: insertError }
    }

    return { error: null }
  } catch (error) {
    console.error("Error in saveUserInterests:", error)
    return { error: error as Error }
  }
}

// Load user interests from database
export async function loadUserInterests(): Promise<{ data: string[] | null; error: Error | null }> {
  try {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: new Error("User not authenticated") }
    }

    const { data, error } = await supabase.from("user_interests").select("interest_id").eq("user_id", user.user.id)

    if (error) {
      console.error("Error loading interests:", error)
      return { data: null, error }
    }

    // Return array of interest IDs
    const interestIds = data?.map((item) => item.interest_id) || []
    return { data: interestIds, error: null }
  } catch (error) {
    console.error("Error in loadUserInterests:", error)
    return { data: null, error: error as Error }
  }
}

// Get user interests with full details
export async function getUserInterestsWithDetails(): Promise<{ data: UserInterest[] | null; error: Error | null }> {
  try {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: new Error("User not authenticated") }
    }

    const { data, error } = await supabase
      .from("user_interests")
      .select("interest_id, interest_name")
      .eq("user_id", user.user.id)
      .order("created_at")

    if (error) {
      console.error("Error loading interests:", error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getUserInterestsWithDetails:", error)
    return { data: null, error: error as Error }
  }
}
