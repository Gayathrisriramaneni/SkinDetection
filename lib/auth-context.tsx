"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Session } from "@supabase/supabase-js"

interface AuthContextType {
  session: Session | null
  user: any
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const supabaseClient = createClient()

  useEffect(() => {
    if (!supabaseClient) {
      setLoading(false)
      return
    }

    const getSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [supabaseClient])

  const signUp = async (email: string, password: string) => {
    if (!supabaseClient) throw new Error("Supabase client not available")
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    if (!supabaseClient) throw new Error("Supabase client not available")
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (!supabaseClient) throw new Error("Supabase client not available")
    const { error } = await supabaseClient.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
