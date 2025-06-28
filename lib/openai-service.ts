// WARNING: This exposes the API key on the client side
// In production, move this to a server-side API route
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export interface LessonRequest {
  grade: string
  interests: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
}

export interface LessonResponse {
  topic: string
  explanation: string
  examples: string[]
  practice_problems: {
    question: string
    answer: string
    explanation: string
  }[]
}

export const openaiService = {
  async generatePersonalizedLesson(request: LessonRequest): Promise<LessonResponse> {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured")
    }

    const prompt = `Create a personalized math lesson for a ${request.grade} student with interests in ${request.interests.join(", ")}. 
    The difficulty level should be ${request.difficulty}.
    
    Please provide:
    1. A relevant topic that connects to their interests
    2. A clear explanation of the concept
    3. 2-3 practical examples
    4. 3 practice problems with solutions and explanations
    
    Format the response as JSON with the following structure:
    {
      "topic": "string",
      "explanation": "string", 
      "examples": ["string"],
      "practice_problems": [
        {
          "question": "string",
          "answer": "string", 
          "explanation": "string"
        }
      ]
    }`

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful math tutor that creates personalized lessons.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error("No content received from OpenAI")
      }

      return JSON.parse(content)
    } catch (error) {
      console.error("Error generating lesson:", error)
      throw error
    }
  },
}
