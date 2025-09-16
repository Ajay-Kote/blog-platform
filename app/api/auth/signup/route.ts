import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"
import type { AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Signup API called")
    const { email, username, password, name } = await request.json()
    console.log("[v0] Request data received:", { email, username, name })

    // Validate input
    if (!email || !username || !password || !name) {
      return NextResponse.json<AuthResponse>({ success: false, message: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 },
      )
    }

    console.log("[v0] Getting database connection...")
    const db = await getDatabase()
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "User with this email or username already exists" },
        { status: 409 },
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const newUser = {
      email,
      username,
      name,
      password: hashedPassword,
      bio: "",
      avatar: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(newUser)
    const userId = result.insertedId.toString()

    // Generate JWT token
    const token = generateToken({
      userId,
      email,
      username,
    })

    // Return user data (without password)
    const user = {
      _id: userId,
      email,
      username,
      name,
      bio: "",
      avatar: "",
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    }

    console.log("[v0] User created successfully:", userId)
    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: "User created successfully",
        user,
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
