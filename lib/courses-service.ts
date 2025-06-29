import { supabase } from "./supabase"

export interface Course {
  course_id: number
  course_name: string
  course_code: string
  description: string
  grade: number
  subject: string
  duration_weeks: number
  difficulty_level: string
  prerequisites: string[]
  learning_objectives: string[]
  created_at: string
  updated_at: string
}

export interface UserCourse {
  user_id: string
  course_id: number
  enrollment_date: string
  progress: number
  status: "enrolled" | "completed" | "dropped"
}

export const courseService = {
  // Get all courses for the user's selected grade
  async getCoursesForUserGrade(): Promise<{ data: Course[] | null; error: any }> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    // First get the user's selected grade
    const { data: userGradeData, error: gradeError } = await supabase
      .from("grades")
      .select("grade_id")
      .eq("user_id", session.user.id)

    if (gradeError) {
      return { data: null, error: { message: "No grade selected. Please select a grade first." } }
    }

    // Then get courses for that grade level
    const { data: coursesData, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .eq("grade", userGradeData.grades.grade)
      .order("course_name", { ascending: true })

    return { data: coursesData, error: coursesError }
  },

  // Get all courses regardless of grade (for admin/browse purposes)
  async getAllCourses(): Promise<{ data: Course[] | null; error: any }> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("grade", { ascending: true })
      .order("course_name", { ascending: true })

    return { data, error }
  },

  // Get courses by specific grade level
  async getCoursesByGrade(gradeLevel: number): Promise<{ data: Course[] | null; error: any }> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("grade", gradeLevel)
      .order("course_name", { ascending: true })

    return { data, error }
  },

  // Get a specific course by ID
  async getCourseById(courseId: number): Promise<{ data: Course | null; error: any }> {
    const { data, error } = await supabase.from("courses").select("*").eq("course_id", courseId).single()

    return { data, error }
  },

  // Get user's enrolled courses
  async getUserEnrolledCourses(): Promise<{ data: any[] | null; error: any }> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        courses (
          course_id,
          course_name,
          course_description
        )
      `)
      .eq("user_id", session.user.id)
      .order("enrollment_date", { ascending: false })

    return { data, error }
  },

  // Enroll user in a course
  async enrollInCourse(courseId: number): Promise<{ data: any; error: any }> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from("courses")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("course_id", courseId)
      .single()

    if (existingEnrollment) {
      return { data: null, error: { message: "Already enrolled in this course" } }
    }

    // Enroll the user
    const { data, error } = await supabase
      .from("user_courses")
      .insert({
        user_id: session.user.id,
        course_id: courseId,
        progress: 0,
        status: "enrolled",
      })
      .select()

    return { data, error }
  },

  // Update course progress
  async updateCourseProgress(courseId: number, progress: number): Promise<{ data: any; error: any }> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { data: null, error: { message: "User not authenticated" } }
    }

    const status = progress >= 100 ? "completed" : "enrolled"

    const { data, error } = await supabase
      .from("user_courses")
      .update({
        progress: progress,
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", session.user.id)
      .eq("course_id", courseId)
      .select()

    return { data, error }
  },
}
