import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { Container } from './Container'
import { Moon, Sun, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navbar() {
  const { isAuthenticated, user, clearAuth } = useAuthStore()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
  

  
  
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }



  }, [])


  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    document.documentElement.classList.toggle('dark')
  }




  

  const handleLogout = () => {
    clearAuth()
  }


  

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>











        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-primary">
              BookingTour
            </Link>
            <Link to="/tours" className="text-sm font-medium hover:text-primary transition-colors">
              Tours
            </Link>
          </div>








          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-secondary">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>

            ) : (











              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Đăng ký</Link>
                </Button>
              </div>
































            )}
          </div>
        </div>
      </Container>
    </nav>
  )
}

