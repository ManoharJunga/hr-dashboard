"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EmployeeCard } from "@/components/employee-card"
import { SearchFilter } from "@/components/search-filter"
import { CreateEmployeeModal } from "@/components/create-employee-modal"
import { Pagination } from "@/components/pagination"
import { LoginForm } from "@/components/login-form"
import type { Employee, PaginationData } from "@/lib/types"
import { fetchEmployees, paginateEmployees } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function HomePage() {
  const { user, isLoading: authLoading } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [currentPageEmployees, setCurrentPageEmployees] = useState<Employee[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true)
        const data = await fetchEmployees()
        setEmployees(data)
        setFilteredEmployees(data)
      } catch (err) {
        setError("Failed to load employees")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadEmployees()
    }
  }, [user])

  useEffect(() => {
    const { employees: paginatedEmployees, pagination: paginationData } = paginateEmployees(
      filteredEmployees,
      pagination.currentPage,
      pagination.itemsPerPage,
    )
    setCurrentPageEmployees(paginatedEmployees)
    setPagination(paginationData)
  }, [filteredEmployees, pagination.currentPage])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const handleEmployeeCreated = (newEmployee: Employee) => {
    setEmployees((prev) => [newEmployee, ...prev])
    setFilteredEmployees((prev) => [newEmployee, ...prev])
    setIsCreateModalOpen(false)
  }

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
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 p-6 border rounded-lg">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
            <p className="text-muted-foreground">Manage and track employee performance across your organization</p>
          </div>
          {(user.role === "admin" || user.role === "hr") && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </Button>
          )}
        </div>
      </div>

      <SearchFilter employees={employees} onFilter={setFilteredEmployees} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {currentPageEmployees.length} of {filteredEmployees.length} employees
          {filteredEmployees.length !== employees.length && ` (filtered from ${employees.length} total)`}
        </p>
      </div>

      {currentPageEmployees.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-muted-foreground text-lg">No employees found matching your criteria</p>
        </motion.div>
      ) : (
        <>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {currentPageEmployees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    layout: { duration: 0.3 },
                  }}
                >
                  <EmployeeCard employee={employee} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {pagination.totalPages > 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          )}
        </>
      )}

      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEmployeeCreated={handleEmployeeCreated}
      />
    </motion.div>
  )
}
