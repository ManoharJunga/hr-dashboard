"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface BookmarkContextType {
  bookmarks: number[]
  addBookmark: (id: number) => void
  removeBookmark: (id: number) => void
  isBookmarked: (id: number) => boolean
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined)

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<number[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("hr-bookmarks")
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("hr-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  const addBookmark = (id: number) => {
    setBookmarks((prev) => [...prev, id])
  }

  const removeBookmark = (id: number) => {
    setBookmarks((prev) => prev.filter((bookmarkId) => bookmarkId !== id))
  }

  const isBookmarked = (id: number) => {
    return bookmarks.includes(id)
  }

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarkContext)
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider")
  }
  return context
}
