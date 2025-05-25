"use client"

import React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X } from "lucide-react"
import type { Employee } from "@/lib/types"

interface SearchFilterProps {
  employees: Employee[]
  onFilter: (filtered: Employee[]) => void
}

export function SearchFilter({ employees, onFilter }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  const departments = Array.from(new Set(employees.map((emp) => emp.company.department)))
  const ratings = [1, 2, 3, 4, 5]

  const applyFilters = () => {
    let filtered = employees

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.company.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Department filter
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter((emp) => selectedDepartments.includes(emp.company.department))
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((emp) => selectedRatings.includes(emp.performance.rating))
    }

    onFilter(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDepartments([])
    setSelectedRatings([])
    onFilter(employees)
  }

  const toggleDepartment = (department: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(department) ? prev.filter((d) => d !== department) : [...prev, department],
    )
  }

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) => (prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]))
  }

  // Apply filters whenever any filter changes
  React.useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedDepartments, selectedRatings])

  const hasActiveFilters = searchTerm || selectedDepartments.length > 0 || selectedRatings.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedDepartments.length + selectedRatings.length + (searchTerm ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Departments</h4>
                  <div className="flex flex-wrap gap-2">
                    {departments.map((dept) => (
                      <Badge
                        key={dept}
                        variant={selectedDepartments.includes(dept) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleDepartment(dept)}
                      >
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Performance Rating</h4>
                  <div className="flex gap-2">
                    {ratings.map((rating) => (
                      <Badge
                        key={rating}
                        variant={selectedRatings.includes(rating) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleRating(rating)}
                      >
                        {rating}★
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="flex items-center space-x-1">
              <X className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Search: {searchTerm}</span>
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
            </Badge>
          )}
          {selectedDepartments.map((dept) => (
            <Badge key={dept} variant="secondary" className="flex items-center space-x-1">
              <span>{dept}</span>
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleDepartment(dept)} />
            </Badge>
          ))}
          {selectedRatings.map((rating) => (
            <Badge key={rating} variant="secondary" className="flex items-center space-x-1">
              <span>{rating}★</span>
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleRating(rating)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
