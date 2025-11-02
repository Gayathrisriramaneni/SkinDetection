"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"

interface HeaderProps {
  onReset?: () => void
  showReset?: boolean
}

export default function Header({ onReset, showReset = false }: HeaderProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { user, signOut, loading } = useAuth()

  return (
    <>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg">
              ✨
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SkinAnalyze</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Skin Detection</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {showReset && onReset && (
              <Button onClick={onReset} variant="outline" className="gap-2 bg-transparent">
                New Analysis
              </Button>
            )}

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <Button onClick={() => signOut()} variant="outline" className="bg-transparent">
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setAuthModalOpen(true)} className="gap-2">
                    Sign In
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  )
}
