import { getUserInterestsWithDetails } from "./interests-service"

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export interface PersonalizedLessonResponse {
  selectedInterest: string
  connection: string
  error?: string
}

export async function generatePersonalizedLesson(): Promise<PersonalizedLessonResponse> {
  try {
    // Check if API key is available
    if (!OPENAI_API_KEY) {
      return {
        selectedInterest: "",
        connection: "",
        error: "OpenAI API key not configured. Please check your environment variables.",
      }
    }

    // Get user's interests from Supabase
    const { data: userInterests, error: interestsError } = await getUserInterestsWithDetails()

    if (interestsError) {
      return {
        selectedInterest: "",
        connection: "",
        error: `Failed to load user interests: ${interestsError.message}`,
      }
    }

    if (!userInterests || userInterests.length === 0) {
      return {
        selectedInterest: "",
        connection: "",
        error: "No interests found. Please select some interests first.",
      }
    }

    // Format interests for the prompt
    const interestsList = userInterests.map((interest) => interest.interest_name).join(", ")

    const lessonConcept = `Lesson Concept: Introduction to Quadratic Functions
A quadratic function is any function that can be written in the form f(x) = ax² + bx + c, where a, b, and c are constants and a ≠ 0, and its graph creates a U-shaped curve called a parabola. The coefficient 'a' determines whether the parabola opens upward (when a > 0) or downward (when a < 0), while the vertex represents the minimum point (if opening upward) or maximum point (if opening downward) of the function. You can find the x-coordinate of the vertex using the formula x = -b/(2a), and substituting this value back into the original equation gives you the y-coordinate of the vertex.`

    const prompt = `This student is interested in ${interestsList}. Select one of these interests to describe how the interest is related to the lesson concept: ${lessonConcept}`

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful math tutor who connects mathematical concepts to students' personal interests. Always start your response by clearly stating which interest you selected, then explain the connection in an engaging and educational way.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        selectedInterest: "",
        connection: "",
        error: `OpenAI API error: ${errorData.error?.message || response.statusText}`,
      }
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || ""

    // Try to extract the selected interest from the response
    const selectedInterest =
      userInterests.find((interest) => aiResponse.toLowerCase().includes(interest.interest_name.toLowerCase()))
        ?.interest_name || "Unknown"

    return {
      selectedInterest,
      connection: aiResponse,
    }
  } catch (error) {
    console.error("Error generating personalized lesson:", error)
    return {
      selectedInterest: "",
      connection: "",
      error: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
