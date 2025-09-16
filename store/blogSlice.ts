import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Blog } from "@/lib/types"

interface BlogState {
  blogs: Blog[]
  currentBlog: Blog | null
  isLoading: boolean
  error: string | null
}

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchBlogs = createAsyncThunk("blog/fetchBlogs", async () => {
  const response = await fetch("/api/blogs")
  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message)
  }

  return data.blogs
})

export const fetchBlogById = createAsyncThunk("blog/fetchBlogById", async (id: string) => {
  const response = await fetch(`/api/blogs/${id}`)
  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message)
  }

  return data.blog
})

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false
        state.blogs = action.payload
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch blogs"
      })
      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentBlog = action.payload
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch blog"
      })
  },
})

export const { clearCurrentBlog, clearError } = blogSlice.actions
export default blogSlice.reducer
