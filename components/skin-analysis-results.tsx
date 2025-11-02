"use client"

import { Card } from "@/components/ui/card"

interface AnalysisResult {
  conditions: {
    pimples: { detected: boolean; severity: string; count?: number }
    acne: { detected: boolean; severity: string }
    scars: { detected: boolean; severity: string }
    darkCircles: { detected: boolean; severity: string }
  }
  overallHealth: string
  recommendations: string[]
  error?: string
}

interface SkinAnalysisResultsProps {
  results: AnalysisResult | null
  uploadedImage: string | null
}

export default function SkinAnalysisResults({ results, uploadedImage }: SkinAnalysisResultsProps) {
  if (!results) return null

  if (results.error) {
    return (
      <Card className="p-8 bg-destructive/10 border-destructive/20">
        <div className="flex gap-4">
          <div className="text-2xl flex-shrink-0">⚠️</div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Analysis Error</h3>
            <p className="text-muted-foreground">{results.error}</p>
          </div>
        </div>
      </Card>
    )
  }

  const conditions = results.conditions || {}
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "severe":
        return "text-destructive"
      case "moderate":
        return "text-accent"
      case "mild":
        return "text-secondary"
      default:
        return "text-muted-foreground"
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "severe":
        return "bg-destructive/10"
      case "moderate":
        return "bg-accent/10"
      case "mild":
        return "bg-secondary/10"
      default:
        return "bg-muted/10"
    }
  }

  return (
    <div className="space-y-6">
      {/* Uploaded Image */}
      {uploadedImage && (
        <Card className="p-4 bg-card border-border overflow-hidden">
          <img
            src={uploadedImage || "/placeholder.svg"}
            alt="Uploaded skin analysis"
            className="w-full h-auto rounded-lg object-cover max-h-96"
          />
        </Card>
      )}

      {/* Overall Health */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-2">Overall Skin Health</h3>
        <p className="text-2xl font-bold text-primary capitalize">{results.overallHealth || "Analyzing..."}</p>
      </Card>

      {/* Detected Conditions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Detected Conditions</h3>

        <div className="grid grid-cols-1 gap-4">
          {/* Pimples */}
          <Card
            className={`p-4 border-border ${conditions.pimples?.detected ? getSeverityBg(conditions.pimples?.severity) : "bg-card"}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  {conditions.pimples?.detected ? "🔴" : "✅"} Pimples
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {conditions.pimples?.detected
                    ? `${conditions.pimples?.severity} - ${conditions.pimples?.count || "Multiple"} detected`
                    : "No pimples detected"}
                </p>
              </div>
              {conditions.pimples?.detected && (
                <span className={`text-sm font-semibold ${getSeverityColor(conditions.pimples?.severity)}`}>
                  {conditions.pimples?.severity}
                </span>
              )}
            </div>
          </Card>

          {/* Acne */}
          <Card
            className={`p-4 border-border ${conditions.acne?.detected ? getSeverityBg(conditions.acne?.severity) : "bg-card"}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  {conditions.acne?.detected ? "🔴" : "✅"} Acne
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {conditions.acne?.detected ? `${conditions.acne?.severity} acne detected` : "No acne detected"}
                </p>
              </div>
              {conditions.acne?.detected && (
                <span className={`text-sm font-semibold ${getSeverityColor(conditions.acne?.severity)}`}>
                  {conditions.acne?.severity}
                </span>
              )}
            </div>
          </Card>

          {/* Scars */}
          <Card
            className={`p-4 border-border ${conditions.scars?.detected ? getSeverityBg(conditions.scars?.severity) : "bg-card"}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  {conditions.scars?.detected ? "🔴" : "✅"} Scars
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {conditions.scars?.detected ? `${conditions.scars?.severity} scarring detected` : "No scars detected"}
                </p>
              </div>
              {conditions.scars?.detected && (
                <span className={`text-sm font-semibold ${getSeverityColor(conditions.scars?.severity)}`}>
                  {conditions.scars?.severity}
                </span>
              )}
            </div>
          </Card>

          {/* Dark Circles */}
          <Card
            className={`p-4 border-border ${conditions.darkCircles?.detected ? getSeverityBg(conditions.darkCircles?.severity) : "bg-card"}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  {conditions.darkCircles?.detected ? "🔴" : "✅"} Dark Circles
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {conditions.darkCircles?.detected
                    ? `${conditions.darkCircles?.severity} dark circles detected`
                    : "No dark circles detected"}
                </p>
              </div>
              {conditions.darkCircles?.detected && (
                <span className={`text-sm font-semibold ${getSeverityColor(conditions.darkCircles?.severity)}`}>
                  {conditions.darkCircles?.severity}
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
          <ul className="space-y-3">
            {results.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-muted-foreground">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
