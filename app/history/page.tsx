"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface AnalysisRecord {
  id: string
  analysis_data: any
  created_at: string
}

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchAnalyses()
    }
  }, [user])

  const fetchAnalyses = async () => {
    try {
      const response = await fetch("/api/analyses")
      const data = await response.json()
      setAnalyses(data || [])
    } catch (error) {
      console.error("Error fetching analyses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAnalysis = async (id: string) => {
    try {
      await fetch(`/api/analyses/${id}`, { method: "DELETE" })
      setAnalyses(analyses.filter((a) => a.id !== id))
    } catch (error) {
      console.error("Error deleting analysis:", error)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Your Analysis History</h2>
            <p className="text-muted-foreground">View all your previous skin analyses</p>
          </div>

          {analyses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No analyses yet</p>
                <Button onClick={() => router.push("/")} className="gap-2">
                  Start Your First Analysis
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((analysis) => (
                <Card key={analysis.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Analysis</CardTitle>
                    <CardDescription>
                      {new Date(analysis.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Overall Health:</p>
                      <p className="font-semibold capitalize">{analysis.analysis_data.overallHealth}</p>
                    </div>

                    <div className="text-sm">
                      <p className="text-muted-foreground mb-2">Conditions Detected:</p>
                      <ul className="space-y-1">
                        {Object.entries(analysis.analysis_data.conditions).map(([key, condition]: [string, any]) => (
                          <li key={key} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted">
                              {condition.detected ? "✓" : "—"} {condition.severity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => deleteAnalysis(analysis.id)}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
