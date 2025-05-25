import type { Employee, CreateEmployeeData, PaginationData } from "./types"

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Design",
  "Product",
  "Legal",
  "Support",
]

const feedbackTemplates = [
  "Excellent team player with strong communication skills",
  "Consistently delivers high-quality work on time",
  "Shows great initiative and problem-solving abilities",
  "Needs improvement in time management",
  "Outstanding leadership qualities",
  "Very collaborative and helpful to colleagues",
  "Could benefit from additional training in technical skills",
  "Demonstrates strong analytical thinking",
  "Excellent customer service orientation",
  "Shows potential for advancement",
]

const bioTemplates = [
  "Experienced professional with a passion for innovation and team collaboration.",
  "Detail-oriented individual with strong analytical and problem-solving skills.",
  "Creative thinker who brings fresh perspectives to challenging projects.",
  "Results-driven professional with excellent communication and leadership abilities.",
  "Dedicated team member with a commitment to continuous learning and improvement.",
]

let cachedEmployees: Employee[] = []

export async function fetchEmployees(): Promise<Employee[]> {
  if (cachedEmployees.length > 0) {
    return cachedEmployees
  }

  try {
    const response = await fetch("https://dummyjson.com/users?limit=20")
    const data = await response.json()

    cachedEmployees = data.users.map((user: any, index: number) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      phone: user.phone,
      address: user.address,
      company: {
        department: departments[Math.floor(Math.random() * departments.length)],
        name: user.company?.name || "TechCorp Inc.",
        title: user.company?.title || "Employee",
      },
      image: user.image,
      performance: {
        rating: Math.floor(Math.random() * 5) + 1,
        projects: Math.floor(Math.random() * 10) + 1,
        feedback: Array.from(
          { length: Math.floor(Math.random() * 3) + 1 },
          () => feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)],
        ),
      },
      bio: bioTemplates[Math.floor(Math.random() * bioTemplates.length)],
    }))

    return cachedEmployees
  } catch (error) {
    console.error("Failed to fetch employees:", error)
    return []
  }
}

export function paginateEmployees(
  employees: Employee[],
  page: number,
  itemsPerPage = 9,
): { employees: Employee[]; pagination: PaginationData } {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEmployees = employees.slice(startIndex, endIndex)

  const pagination: PaginationData = {
    currentPage: page,
    totalPages: Math.ceil(employees.length / itemsPerPage),
    totalItems: employees.length,
    itemsPerPage,
  }

  return { employees: paginatedEmployees, pagination }
}

export function createEmployee(data: CreateEmployeeData): Employee {
  const newId = Math.max(...cachedEmployees.map((emp) => emp.id)) + 1

  const newEmployee: Employee = {
    id: newId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    age: data.age,
    phone: data.phone,
    address: {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    },
    company: {
      department: data.department,
      name: "TechCorp Inc.",
      title: data.title,
    },
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}${data.lastName}`,
    performance: {
      rating: 3,
      projects: 0,
      feedback: [],
    },
    bio: data.bio,
  }

  cachedEmployees.push(newEmployee)
  return newEmployee
}

export function generateAnalyticsData(employees: Employee[]) {
  const departmentStats = departments
    .map((dept) => {
      const deptEmployees = employees.filter((emp) => emp.company.department === dept)
      const averageRating =
        deptEmployees.length > 0
          ? deptEmployees.reduce((sum, emp) => sum + emp.performance.rating, 0) / deptEmployees.length
          : 0

      return {
        name: dept,
        count: deptEmployees.length,
        averageRating: Math.round(averageRating * 10) / 10,
      }
    })
    .filter((dept) => dept.count > 0)

  return { departmentStats }
}

export { departments }
