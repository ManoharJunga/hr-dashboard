"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Bookmark, BookmarkCheck, Eye, TrendingUp } from "lucide-react"
import type { Employee } from "@/lib/types"
import { useBookmarks } from "@/lib/bookmark-context"
import { cn } from "@/lib/utils"

interface EmployeeCardProps {
  employee: Employee
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks()
  const [isPromoted, setIsPromoted] = useState(false)
  const bookmarked = isBookmarked(employee.id)

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(employee.id)
    } else {
      addBookmark(employee.id)
    }
  }

  const handlePromote = () => {
    setIsPromoted(true)
    setTimeout(() => setIsPromoted(false), 2000)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500"
    if (rating >= 3) return "text-yellow-500"
    return "text-red-500"
  }

  const getDepartmentColor = (department: string) => {
    const colors = {
      Engineering: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Marketing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Sales: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      HR: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Finance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Operations: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      Design: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Product: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Legal: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      Support: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    }
    return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="group hover:shadow-lg transition-all duration-200 h-full">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Image
                  src={employee.image || "/placeholder.svg"}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </motion.div>
              {isPromoted && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                >
                  <TrendingUp className="h-3 w-3" />
                </motion.div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg truncate">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{employee.email}</p>
                  <p className="text-sm text-muted-foreground">Age: {employee.age}</p>
                </div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBookmark}
                    className={cn("shrink-0", bookmarked && "text-yellow-500")}
                  >
                    {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </Button>
                </motion.div>
              </div>

              <div className="mt-3 space-y-2">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Badge className={getDepartmentColor(employee.company.department)}>
                    {employee.company.department}
                  </Badge>
                </motion.div>

                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">Performance:</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: star * 0.05 }}
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            star <= employee.performance.rating
                              ? `fill-current ${getRatingColor(employee.performance.rating)}`
                              : "text-gray-300",
                          )}
                        />
                      </motion.div>
                    ))}
                    <span className={cn("text-sm font-medium ml-1", getRatingColor(employee.performance.rating))}>
                      ({employee.performance.rating}/5)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-muted/50 flex justify-between">
          <Link href={`/employee/${employee.id}`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </Button>
            </motion.div>
          </Link>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="default"
              size="sm"
              onClick={handlePromote}
              disabled={isPromoted}
              className="flex items-center space-x-1"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{isPromoted ? "Promoted!" : "Promote"}</span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
