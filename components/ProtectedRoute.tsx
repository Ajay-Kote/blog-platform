"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import { getCurrentUser } from "@/store/authSlice"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user, token, isLoading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    if (!user && token) {
      dispatch(getCurrentUser())
    }
  }, [token, user, dispatch, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!token || !user) {
    return null
  }

  return <>{children}</>
}
