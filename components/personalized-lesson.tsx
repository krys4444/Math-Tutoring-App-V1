"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Lightbulb } from "lucide-react"

interface Problem {
  id: number
  question: string
  answer: string
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

export function PersonalizedLesson() {
  const [currentProblem, setCurrentProblem] = useState<Problem>({
    id: 1,
    question: "Solve for x: 2x + 5 = 13",
    answer: "4",
    explanation: "To solve 2x + 5 = 13, first subtract 5 from both sides: 2x = 8. Then divide both sides by 2: x = 4.",
    difficulty: "easy",
  })

  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const checkAnswer = () => {
    setLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const correct = userAnswer.trim().toLowerCase() === currentProblem.answer.toLowerCase()
      setIsCorrect(correct)
      setShowResult(true)
      setLoading(false)
    }, 1000)
  }

  const nextProblem = () => {
    // Generate next problem (in real app, this would come from AI)
    const problems: Problem[] = [
      {
        id: 2,
        question: "What is the slope of the line passing through points (2, 3) and (4, 7)?",
        answer: "2",
        explanation: "Using the slope formula: m = (y₂ - y₁)/(x₂ - x₁) = (7 - 3)/(4 - 2) = 4/2 = 2",
        difficulty: "medium",
      },
      {
        id: 3,
        question: "Factor: x² - 5x + 6",
        answer: "(x-2)(x-3)",
        explanation:
          "To factor x² - 5x + 6, find two numbers that multiply to 6 and add to -5. Those numbers are -2 and -3, so the factored form is (x-2)(x-3).",
        difficulty: "medium",
      },
    ]

    const nextProb = problems[Math.floor(Math.random() * problems.length)]
    setCurrentProblem(nextProb)
    setUserAnswer("")
    setShowResult(false)
    setShowHint(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Problem #{currentProblem.id}</CardTitle>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentProblem.difficulty)}`}
            >
              {currentProblem.difficulty}
            </span>
          </div>
          <CardDescription>Solve the following problem step by step</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium bg-gray-50 p-4 rounded-lg">{currentProblem.question}</div>

          {!showResult && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="answer">Your Answer</Label>
                <Input
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim() || loading}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Answer"
                  )}
                </Button>

                <Button variant="outline" onClick={() => setShowHint(!showHint)} disabled={loading}>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Hint
                </Button>
              </div>

              {showHint && (
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    Start by isolating the variable. What operation can you perform on both sides of the equation?
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {showResult && (
            <div className="space-y-4">
              <Alert className={isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={isCorrect ? "text-green-800" : "text-red-800"}>
                    {isCorrect ? "Correct! Well done." : `Incorrect. The correct answer is: ${currentProblem.answer}`}
                  </AlertDescription>
                </div>
              </Alert>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                <p className="text-blue-800">{currentProblem.explanation}</p>
              </div>

              <Button onClick={nextProblem} className="w-full bg-purple-500 hover:bg-purple-600">
                Next Problem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Lesson Progress</span>
            <span>3 of 10 problems completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "30%" }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
