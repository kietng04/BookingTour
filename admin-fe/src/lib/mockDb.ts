import type { Database, User, Tour, Discount, Departure, Page } from './types'

const STORAGE_KEY = 'ADMIN_DB_V1'

const initialDb: Database = {
  users: [],
  tours: [],
  discounts: [],
  departures: [],
  seq: {
    users: 1,
    tours: 1,
    discounts: 1,
    departures: 1,
  },
}

export function loadDb(): Database {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return { ...initialDb }
    }
  }
  return { ...initialDb }
}

export function saveDb(db: Database): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export function nextId(entity: keyof Database['seq']): number {
  const db = loadDb()
  const id = db.seq[entity]++
  saveDb(db)
  return id
}

export function seedIfEmpty(): void {
  const db = loadDb()
  
  if (db.users.length === 0) {
    db.users = [
      {
        id: nextId('users'),
        username: 'admin',
        email: 'admin@bookingtour.vn',
        fullName: 'Administrator',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: nextId('users'),
        username: 'user1',
        email: 'user1@example.com',
        fullName: 'Nguyễn Văn A',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
    ]
  }
  
  if (db.tours.length === 0) {
    const tour1Id = nextId('tours')
    const tour2Id = nextId('tours')
    
    db.tours = [
      {
        id: tour1Id,
        tourName: 'Du lịch Hạ Long - Vịnh Di sản Thế giới',
        regionId: 1,
        provinceId: 1,
        description: 'Khám phá vẻ đẹp kỳ vĩ của Vịnh Hạ Long',
        days: 2,
        nights: 1,
        departurePoint: 'Hà Nội',
        mainDestination: 'Quảng Ninh',
        adultPrice: 2500000,
        childPrice: 1800000,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800'],
        createdAt: new Date().toISOString(),
      },
      {
        id: tour2Id,
        tourName: 'Sapa - Chinh phục Fansipan',
        regionId: 1,
        provinceId: 2,
        description: 'Chinh phục nóc nhà Đông Dương',
        days: 3,
        nights: 2,
        departurePoint: 'Hà Nội',
        mainDestination: 'Lào Cai',
        adultPrice: 3200000,
        childPrice: 2400000,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1583210214011-77608a03dae6?w=800'],
        createdAt: new Date().toISOString(),
      },
    ]
    
    db.discounts = [
      {
        id: nextId('discounts'),
        tourId: tour1Id,
        discountType: 'PERCENT',
        value: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active: true,
        createdAt: new Date().toISOString(),
      },
    ]
    
    db.departures = [
      {
        id: nextId('departures'),
        tourId: tour1Id,
        startDate: '2025-01-20',
        endDate: '2025-01-21',
        totalSlots: 30,
        remainingSlots: 12,
        status: 'ConCho',
        createdAt: new Date().toISOString(),
      },
      {
        id: nextId('departures'),
        tourId: tour2Id,
        startDate: '2025-01-25',
        endDate: '2025-01-27',
        totalSlots: 25,
        remainingSlots: 18,
        status: 'ConCho',
        createdAt: new Date().toISOString(),
      },
    ]
  }
  
  saveDb(db)
}

// Users CRUD
export const usersDb = {
  getAll: (): User[] => loadDb().users,
  
  getById: (id: number): User | undefined => {
    return loadDb().users.find(u => u.id === id)
  },
  
  create: (user: Omit<User, 'id' | 'createdAt'>): User => {
    const db = loadDb()
    const newUser: User = {
      ...user,
      id: nextId('users'),
      createdAt: new Date().toISOString(),
    }
    db.users.push(newUser)
    saveDb(db)
    return newUser
  },
  
  update: (id: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | null => {
    const db = loadDb()
    const index = db.users.findIndex(u => u.id === id)
    if (index === -1) return null
    db.users[index] = { ...db.users[index], ...updates }
    saveDb(db)
    return db.users[index]
  },
  
  delete: (id: number): boolean => {
    const db = loadDb()
    const index = db.users.findIndex(u => u.id === id)
    if (index === -1) return false
    db.users.splice(index, 1)
    saveDb(db)
    return true
  },
  
  search: (keyword: string, status?: string): User[] => {
    let users = loadDb().users
    if (keyword) {
      const term = keyword.toLowerCase()
      users = users.filter(u => 
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.fullName.toLowerCase().includes(term)
      )
    }
    if (status) {
      users = users.filter(u => u.status === status)
    }
    return users
  },
}

// Tours CRUD
export const toursDb = {
  getAll: (): Tour[] => loadDb().tours,
  
  getById: (id: number): Tour | undefined => {
    return loadDb().tours.find(t => t.id === id)
  },
  
  create: (tour: Omit<Tour, 'id' | 'createdAt'>): Tour => {
    const db = loadDb()
    const newTour: Tour = {
      ...tour,
      id: nextId('tours'),
      createdAt: new Date().toISOString(),
    }
    db.tours.push(newTour)
    saveDb(db)
    return newTour
  },
  
  update: (id: number, updates: Partial<Omit<Tour, 'id' | 'createdAt'>>): Tour | null => {
    const db = loadDb()
    const index = db.tours.findIndex(t => t.id === id)
    if (index === -1) return null
    db.tours[index] = { ...db.tours[index], ...updates }
    saveDb(db)
    return db.tours[index]
  },
  
  delete: (id: number): boolean => {
    const db = loadDb()
    const index = db.tours.findIndex(t => t.id === id)
    if (index === -1) return false
    
    // Cascade delete discounts and departures
    db.discounts = db.discounts.filter(d => d.tourId !== id)
    db.departures = db.departures.filter(d => d.tourId !== id)
    db.tours.splice(index, 1)
    saveDb(db)
    return true
  },
  
  search: (keyword: string, status?: string): Tour[] => {
    let tours = loadDb().tours
    if (keyword) {
      const term = keyword.toLowerCase()
      tours = tours.filter(t => 
        t.tourName.toLowerCase().includes(term) ||
        t.mainDestination.toLowerCase().includes(term) ||
        t.departurePoint.toLowerCase().includes(term)
      )
    }
    if (status) {
      tours = tours.filter(t => t.status === status)
    }
    return tours
  },
}

// Discounts CRUD
export const discountsDb = {
  getAll: (): Discount[] => loadDb().discounts,
  
  getByTourId: (tourId: number): Discount[] => {
    return loadDb().discounts.filter(d => d.tourId === tourId)
  },
  
  getById: (id: number): Discount | undefined => {
    return loadDb().discounts.find(d => d.id === id)
  },
  
  create: (discount: Omit<Discount, 'id' | 'createdAt'>): Discount => {
    const db = loadDb()
    const newDiscount: Discount = {
      ...discount,
      id: nextId('discounts'),
      createdAt: new Date().toISOString(),
    }
    db.discounts.push(newDiscount)
    saveDb(db)
    return newDiscount
  },
  
  update: (id: number, updates: Partial<Omit<Discount, 'id' | 'createdAt' | 'tourId'>>): Discount | null => {
    const db = loadDb()
    const index = db.discounts.findIndex(d => d.id === id)
    if (index === -1) return null
    db.discounts[index] = { ...db.discounts[index], ...updates }
    saveDb(db)
    return db.discounts[index]
  },
  
  delete: (id: number): boolean => {
    const db = loadDb()
    const index = db.discounts.findIndex(d => d.id === id)
    if (index === -1) return false
    db.discounts.splice(index, 1)
    saveDb(db)
    return true
  },
}

// Departures CRUD
export const departuresDb = {
  getAll: (): Departure[] => loadDb().departures,
  
  getByTourId: (tourId: number): Departure[] => {
    return loadDb().departures.filter(d => d.tourId === tourId)
  },
  
  getById: (id: number): Departure | undefined => {
    return loadDb().departures.find(d => d.id === id)
  },
  
  create: (departure: Omit<Departure, 'id' | 'createdAt'>): Departure => {
    const db = loadDb()
    const newDeparture: Departure = {
      ...departure,
      id: nextId('departures'),
      remainingSlots: departure.remainingSlots ?? departure.totalSlots,
      createdAt: new Date().toISOString(),
    }
    db.departures.push(newDeparture)
    saveDb(db)
    return newDeparture
  },
  
  update: (id: number, updates: Partial<Omit<Departure, 'id' | 'createdAt' | 'tourId'>>): Departure | null => {
    const db = loadDb()
    const index = db.departures.findIndex(d => d.id === id)
    if (index === -1) return null
    
    const updated = { ...db.departures[index], ...updates }
    
    // Validate remainingSlots
    if (updated.remainingSlots < 0) updated.remainingSlots = 0
    if (updated.remainingSlots > updated.totalSlots) updated.remainingSlots = updated.totalSlots
    
    db.departures[index] = updated
    saveDb(db)
    return db.departures[index]
  },
  
  delete: (id: number): boolean => {
    const db = loadDb()
    const index = db.departures.findIndex(d => d.id === id)
    if (index === -1) return false
    db.departures.splice(index, 1)
    saveDb(db)
    return true
  },
}

// Helper for pagination
export function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const start = page * size
  const end = start + size
  const content = items.slice(start, end)
  
  return {
    content,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
    size,
    number: page,
  }
}


