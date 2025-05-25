"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookmarkCheck, Eye, TrendingUp, Briefcase, X } from "lucide-react"
import type { Employee } from "@/lib/types"
import { fetchEmployees } from "@/lib/data"
import { useBookmarks } from "@/lib/bookmark-context"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

export default function BookmarksPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [bookmarkedEmployees, setBookmarkedEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const { bookmarks, removeBookmark } = useBookmarks()

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true)
        const data = await fetchEmployees()
        setEmployees(data)
      } catch (err) {
        console.error("Failed to load employees:", err)
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [])

  useEffect(() => {
    const bookmarked = employees.filter((emp) => bookmarks.includes(emp.id))
    setBookmarkedEmployees(bookmarked)
  }, [employees, bookmarks])

  const handleRemoveBookmark = (id: number) => {
    removeBookmark(id)
  }

  const handlePromote = (employee: Employee) => {
    // Mock promotion action
    alert(`${employee.firstName} ${employee.lastName} has been promoted!`)
  }

  const handleAssignProject = (employee: Employee) => {
    // Mock project assignment action
    alert(`New project assigned to ${employee.firstName} ${employee.lastName}!`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bookmarked Employees</h1>
        <p className="text-muted-foreground">Manage your bookmarked employees and take quick actions</p>
      </div>

      {bookmarkedEmployees.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookmarkCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookmarked employees</h3>
            <p className="text-muted-foreground mb-4">
              Start bookmarking employees from the dashboard to see them here.
            </p>
            <Link href="/">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {bookmarkedEmployees.length} bookmarked employee{bookmarkedEmployees.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedEmployees.map((employee) => (
              <Card key={employee.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={employee.image || "/placeholder.svg"}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">
                          {employee.firstName} {employee.lastName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{employee.company.title}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBookmark(employee.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Department:</span>
                      <Badge variant="secondary">{employee.company.department}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Performance:</span>
                      <Badge
                        variant={employee.performance.rating >= 4 ? "default" : "secondary"}
                        className={employee.performance.rating >= 4 ? "bg-green-500" : ""}
                      >
                        {employee.performance.rating}/5 ⭐
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Projects:</span>
                      <span className="font-medium">{employee.performance.projects}</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Link href={`/employee/${employee.id}`} className="w-full">
                      <Button variant="outline" className="w-full flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Button>
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handlePromote(employee)}
                        className="flex items-center space-x-1"
                      >
                        <TrendingUp className="h-4 w-4" />
                        <span>Promote</span>
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAssignProject(employee)}
                        className="flex items-center space-x-1"
                      >
                        <Briefcase className="h-4 w-4" />
                        <span>Assign</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
