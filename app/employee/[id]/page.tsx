"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Star, MapPin, Phone, Mail, Building, Calendar } from "lucide-react"
import type { Employee } from "@/lib/types"
import { fetchEmployees } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function EmployeeDetailPage() {
  const { user, isLoading: authLoading } = useAuth()
  const params = useParams()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true)
        const employees = await fetchEmployees()
        const emp = employees.find((e) => e.id === Number.parseInt(params.id as string))
        if (emp) {
          setEmployee(emp)
        } else {
          setError("Employee not found")
        }
      } catch (err) {
        setError("Failed to load employee details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadEmployee()
    }
  }, [params.id, user])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-4 p-6 border rounded-lg">
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <p className="text-red-500 text-lg">{error || "Employee not found"}</p>
        <Link href="/">
          <Button className="mt-4">Back to Dashboard</Button>
        </Link>
      </motion.div>
    )
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500"
    if (rating >= 3) return "text-yellow-500"
    return "text-red-500"
  }

  const getPerformanceBadge = (rating: number) => {
    if (rating >= 4) return { label: "Excellent", variant: "default" as const, className: "bg-green-500" }
    if (rating >= 3) return { label: "Good", variant: "secondary" as const, className: "bg-yellow-500" }
    return { label: "Needs Improvement", variant: "destructive" as const, className: "bg-red-500" }
  }

  const performanceBadge = getPerformanceBadge(employee.performance.rating)

  // Mock project data
  const projects = [
    { name: "Website Redesign", status: "Completed", completion: 100 },
    { name: "Mobile App Development", status: "In Progress", completion: 75 },
    { name: "Database Migration", status: "Planning", completion: 25 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center space-x-4"
      >
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Employee Details</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Image
                    src={employee.image || "/placeholder.svg"}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    width={128}
                    height={128}
                    className="rounded-full mx-auto object-cover"
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h2 className="text-xl font-semibold">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <p className="text-muted-foreground">{employee.company.title}</p>
                  <Badge className="mt-2">{employee.company.department}</Badge>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 text-left"
                >
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Age: {employee.age}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.company.name}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div>{employee.address.address}</div>
                      <div>
                        {employee.address.city}, {employee.address.state}
                      </div>
                      <div>
                        {employee.address.postalCode}, {employee.address.country}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <Separator />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Performance Rating</span>
                    <Badge className={performanceBadge.className}>{performanceBadge.label}</Badge>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + star * 0.1 }}
                      >
                        <Star
                          className={cn(
                            "h-5 w-5",
                            star <= employee.performance.rating
                              ? `fill-current ${getRatingColor(employee.performance.rating)}`
                              : "text-gray-300",
                          )}
                        />
                      </motion.div>
                    ))}
                    <span className={cn("text-lg font-bold ml-2", getRatingColor(employee.performance.rating))}>
                      {employee.performance.rating}/5
                    </span>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Details Tabs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{employee.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{employee.performance.projects}</div>
                        <div className="text-sm text-muted-foreground">Projects Completed</div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{employee.performance.rating}/5</div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Current Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projects.map((project, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.completion}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className="bg-primary h-2 rounded-full"
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">{project.completion}% Complete</div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {employee.performance.feedback.map((feedback, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-muted rounded-lg"
                      >
                        <p className="text-sm">{feedback}</p>
                        <div className="text-xs text-muted-foreground mt-2">- Manager Review</div>
                      </motion.div>
                    ))}
                    {employee.performance.feedback.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">No feedback available yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  )
}
