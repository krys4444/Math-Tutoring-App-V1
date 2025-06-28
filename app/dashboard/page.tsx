"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Calendar,
  Heart,
  MessageCircle,
  Mic,
  CheckCircle,
  User,
  Settings,
  BarChart3,
  LogOut,
  Loader2,
  TestTube,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useInterests } from "@/hooks/use-interests"
import { PersonalizedLesson } from "@/components/personalized-lesson"

const sidebarItems = [
  {
    category: "MAIN",
    items: [
      { icon: BarChart3, label: "Dashboard", id: "dashboard" },
      { icon: BookOpen, label: "My Courses", id: "courses" },
      { icon: Calendar, label: "Study Schedule", id: "schedule" },
      { icon: Heart, label: "Your Interests", id: "interests" },
      { icon: TestTube, label: "Testing", id: "testing" },
    ],
  },
  {
    category: "AI TUTORS",
    items: [
      { icon: MessageCircle, label: "AI Chat Tutor", id: "chat" },
      { icon: Mic, label: "Voice Tutor", id: "voice" },
      { icon: CheckCircle, label: "Check My Work", id: "check" },
    ],
  },
  {
    category: "ACCOUNT",
    items: [
      { icon: User, label: "Profile", id: "profile" },
      { icon: Settings, label: "Settings", id: "settings" },
    ],
  },
]

const availableInterests = [
  { id: "physics", name: "Physics", icon: "⚡", description: "Mathematical applications in physics and mechanics" },
  { id: "finance", name: "Finance", icon: "💰", description: "Interest, investments, and economic calculations" },
  { id: "engineering", name: "Engineering", icon: "⚙️", description: "Applied mathematics for engineering problems" },
  { id: "computer-science", name: "Computer Science", icon: "💻", description: "Algorithms, programming, and logic" },
  { id: "art", name: "Art & Design", icon: "🎨", description: "Mathematical patterns in art and design" },
  { id: "music", name: "Music", icon: "🎵", description: "Mathematical relationships in music theory" },
  { id: "sports", name: "Sports", icon: "⚽", description: "Statistics and analysis in sports performance" },
  { id: "architecture", name: "Architecture", icon: "🏛️", description: "Mathematical principles in building design" },
  { id: "medicine", name: "Medicine", icon: "🩺", description: "Mathematics in healthcare and medical research" },
  { id: "environment", name: "Environmental Science", icon: "🌍", description: "Mathematical modeling of ecosystems" },
  { id: "astronomy", name: "Astronomy", icon: "🔭", description: "Mathematics of space and celestial bodies" },
  { id: "gaming", name: "Game Development", icon: "🎮", description: "Mathematics in game mechanics and design" },
]

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("courses")
  const {
    selectedInterests,
    loading: interestsLoading,
    saving,
    error,
    successMessage,
    toggleInterest,
    saveInterests,
    clearAllInterests,
  } = useInterests()

  const handleSignOut = async () => {
    await signOut()
  }

  const handleSaveInterests = async () => {
    const result = await saveInterests(availableInterests)
    if (result.success) {
      // Success message is handled by the hook
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">MathTutor</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {sidebarItems.map((section) => (
            <div key={section.category} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{section.category}</h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info & Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-medium text-sm">
                {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-gray-800"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === "courses" && "My Courses"}
                {activeTab === "interests" && "Your Interests"}
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "schedule" && "Study Schedule"}
                {activeTab === "testing" && "AI Lesson Personalization"}
                {activeTab === "chat" && "AI Chat Tutor"}
                {activeTab === "voice" && "Voice Tutor"}
                {activeTab === "check" && "Check My Work"}
                {activeTab === "profile" && "Profile"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-gray-600">
                {activeTab === "courses" && "Continue your mathematical journey"}
                {activeTab === "interests" && "Personalize your learning experience"}
                {activeTab === "dashboard" && "Overview of your learning progress"}
                {activeTab === "schedule" && "Plan your study sessions"}
                {activeTab === "testing" && "See how AI connects math lessons to your personal interests"}
                {activeTab === "chat" && "Get help from your AI tutor"}
                {activeTab === "voice" && "Practice with voice-guided lessons"}
                {activeTab === "check" && "Verify your work and get feedback"}
                {activeTab === "profile" && "Manage your account information"}
                {activeTab === "settings" && "Customize your preferences"}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {activeTab === "courses" && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Courses Yet</h3>
                <p className="text-gray-600 mb-4">You haven't enrolled in any courses</p>
                <Button className="bg-purple-500 hover:bg-purple-600">Browse Courses</Button>
              </div>
            </div>
          )}

          {activeTab === "interests" && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Select Your Interests</h2>
                <p className="text-gray-600">
                  Choose topics that interest you to personalize your learning experience and get course recommendations
                  tailored to your passions.
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {interestsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your interests...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {availableInterests.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        disabled={saving}
                        className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedInterests.includes(interest.id)
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{interest.icon}</span>
                          <div className="flex-1">
                            <h3
                              className={`font-semibold mb-1 ${
                                selectedInterests.includes(interest.id) ? "text-purple-700" : "text-gray-800"
                              }`}
                            >
                              {interest.name}
                            </h3>
                            <p className="text-sm text-gray-600">{interest.description}</p>
                          </div>
                          {selectedInterests.includes(interest.id) && (
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedInterests.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Your Selected Interests ({selectedInterests.length})
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedInterests.map((interestId) => {
                          const interest = availableInterests.find((i) => i.id === interestId)
                          return (
                            <span
                              key={interestId}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                              <span>{interest?.icon}</span>
                              <span>{interest?.name}</span>
                              <button
                                onClick={() => toggleInterest(interestId)}
                                disabled={saving}
                                className="hover:bg-purple-200 rounded-full p-0.5 disabled:opacity-50"
                              >
                                <span className="text-xs">×</span>
                              </button>
                            </span>
                          )
                        })}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveInterests}
                          disabled={saving}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Preferences"
                          )}
                        </Button>
                        <Button variant="outline" onClick={clearAllInterests} disabled={saving}>
                          Clear All
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedInterests.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        Select some interests above to get personalized course recommendations
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "testing" && <PersonalizedLesson />}

          {/* Placeholder for other tabs */}
          {activeTab !== "courses" && activeTab !== "interests" && activeTab !== "testing" && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h3>
                <p className="text-gray-600">This section is under development</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
