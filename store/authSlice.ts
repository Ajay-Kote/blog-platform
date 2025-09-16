import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { User } from "@/lib/types"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isLoading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message)
    }

    return data
  },
)

export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({
    email,
    username,
    password,
    name,
  }: {
    email: string
    username: string
    password: string
    name: string
  }) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, name }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message)
    }

    return data
  },
)

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { getState }) => {
  const state = getState() as { auth: AuthState }
  const token = state.auth.token

  if (!token) {
    throw new Error("No token found")
  }

  const response = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message)
  }

  return data
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token)
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Login failed"
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token)
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Signup failed"
      })
      // Get current user
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null
        state.token = null
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
        }
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
