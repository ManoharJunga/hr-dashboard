export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  phone: string
  address: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  company: {
    department: string
    name: string
    title: string
  }
  image: string
  performance: {
    rating: number
    projects: number
    feedback: string[]
  }
  bio: string
}

export interface Department {
  name: string
  count: number
  averageRating: number
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "hr" | "manager"
  avatar?: string
}

export interface CreateEmployeeData {
  firstName: string
  lastName: string
  email: string
  age: number
  phone: string
  department: string
  title: string
  bio: string
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}
