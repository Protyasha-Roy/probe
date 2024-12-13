import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/supabase/auth'
import { Button } from '../common/Button'

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="sticky top-0 z-50 border-b-3 border-primary-black bg-primary-white">
      <div className="container h-16">
        <div className="flex h-full justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-black tracking-tighter hover:text-primary-orange transition-colors font-space-grotesk"
          >
            PROBE
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/about" className="hover:text-primary-orange transition-colors">
              About
            </Link>
            <Link to="/features" className="hover:text-primary-orange transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="hover:text-primary-orange transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="hover:text-primary-orange transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">Profile</Button>
                </Link>
                <Button onClick={() => signOut()} size="sm">Sign Out</Button>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 