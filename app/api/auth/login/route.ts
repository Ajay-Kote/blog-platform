import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPassword, generateToken } from "@/lib/auth"
import type { AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      )
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Find user by email
    const user = await users.findOne({ email })

    if (!user) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    })

    // Return user data (without password)
    const userData = {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio || "",
      avatar: user.avatar || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: "Login successful",
        user: userData,
        token,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
