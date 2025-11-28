import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <nav className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-md z-50 sticky top-0 shadow-sm">
        {/* Hamburger menu on the left */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-r border-gray-200">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-6 border-b border-gray-100">
                <span className="text-2xl font-bold text-gray-900 font-martian cursor-pointer" onClick={() => navigate('/')}>
                  SheBuilds
                </span>
                <p className="text-sm text-gray-600 mt-1">Empowering Women in Tech</p>
              </div>
              
              {/* Navigation Links */}
              <div className="flex-1 py-4">
                <div className="space-y-1 px-4">
                  <button 
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                    onClick={() => navigate('/community')}
                  >
                    Community
                  </button>
                  {/* <button 
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                    onClick={() => navigate('/events')}
                  >
                    Events
                  </button> */}
                  {/* <button 
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                    onClick={() => navigate('/projects')}
                  >
                    Projects
                  </button> */}
                  <button 
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                    onClick={() => navigate('/grant-programs')}
                  >
                    Grant Programs
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                    onClick={() => navigate('/usergrants')}
                  >
                    Grants
                  </button>
                  {/* <button 
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                    onClick={() => navigate('/announcements')}
                  >
                    Announcements
                  </button> */}
                  {/* <button 
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                    onClick={() => navigate('/projects/create')}
                  >
                    Create Project
                  </button> */}
                </div>
              </div>
              
              {/* Actions */}
              <div className="border-t border-gray-100 p-4 space-y-3">
                {isAdmin && (
                  <Button 
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white font-inter rounded-lg h-10" 
                    onClick={() => navigate('/admin')}
                  >
                    Admin Panel
                  </Button>
                )}
                {!isLoggedIn ? (
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-inter rounded-lg h-10" 
                      onClick={() => navigate('/login')}
                    >
                      Sign in
                    </Button>
                    <Button 
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-inter rounded-lg h-10" 
                      onClick={() => navigate('/register')}
                    >
                      Get Started
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-amber-800 hover:bg-amber-900 text-white font-inter rounded-lg h-10" 
                      onClick={() => navigate('/profile')}
                    >
                      Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 font-inter rounded-lg h-10" 
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('is_admin');
                        navigate('/');
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Centered logo */}
        <span className="text-xl font-bold text-gray-900 font-martian cursor-pointer absolute left-1/2 -translate-x-1/2" onClick={() => navigate('/')}>
          SheBuilds
        </span>
      </nav>
    );
  }

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-md z-50 sticky top-0 shadow-sm">
      <div className="flex items-center space-x-8">
        <span className="text-2xl font-bold text-gray-900 font-martian cursor-pointer hover:text-amber-700 transition-colors" onClick={() => navigate('/')}>
          SheBuilds
        </span>
        
        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-1">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-inter rounded-lg transition-colors" onClick={() => navigate('/community')}>
            Community
          </button>
          {/* <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-inter rounded-lg transition-colors" onClick={() => navigate('/events')}>
            Events
          </button> */}
          {/* <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-inter rounded-lg transition-colors" onClick={() => navigate('/projects')}>
            Projects
          </button> */}
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-inter rounded-lg transition-colors" onClick={() => navigate('/grant-programs')}>
            Grant Programs
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-inter rounded-lg transition-colors" onClick={() => navigate('/usergrants')}>
            Grants
          </button>
          {/* <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-inter rounded-lg transition-colors" onClick={() => navigate('/announcements')}>
            Announcements
          </button> */}
          {/* <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-inter rounded-lg transition-colors" onClick={() => navigate('/projects/create')}>
            Create Project
          </button> */}
        </div>
      </div>
      
      {/* Desktop Actions */}
      <div className="flex items-center space-x-3">
        {isAdmin && (
          <Button className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 font-inter rounded-lg h-9" onClick={() => navigate('/admin')}>
            Admin
          </Button>
        )}
        
        {!isLoggedIn ? (
          <div className="hidden md:flex items-center space-x-3">
            <button className="text-gray-600 hover:text-gray-900 font-inter px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => navigate('/login')}>
              Sign in
            </button>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 font-inter rounded-lg h-9" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-3">
            <Button className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 font-inter rounded-lg h-9" onClick={() => navigate('/profile')}>
              Profile
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 font-inter rounded-lg h-9" 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('is_admin');
                navigate('/');
              }}
            >
              Logout
            </Button>
          </div>
        )}
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0 border-l border-gray-200">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="px-6 py-6 border-b border-gray-100">
                  <span className="text-xl font-bold text-gray-900 font-martian">
                    Menu
                  </span>
                </div>
                
                {/* Navigation Links */}
                <div className="flex-1 py-4">
                  <div className="space-y-1 px-4">
                    <button 
                      className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                      onClick={() => navigate('/community')}
                    >
                      Community
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                      onClick={() => navigate('/events')}
                    >
                      Events
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                      onClick={() => navigate('/projects')}
                    >
                      Projects
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                      onClick={() => navigate('/grant-programs')}
                    >
                      Grant Programs
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                      onClick={() => navigate('/usergrants')}
                    >
                      Grants
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                      onClick={() => navigate('/announcements')}
                    >
                      Announcements
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-inter transition-colors" 
                      onClick={() => navigate('/projects/create')}
                    >
                      Create Project
                    </button>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="border-t border-gray-100 p-4 space-y-3">
                  {!isLoggedIn ? (
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-inter rounded-lg h-10" 
                        onClick={() => navigate('/login')}
                      >
                        Sign in
                      </Button>
                      <Button 
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-inter rounded-lg h-10" 
                        onClick={() => navigate('/register')}
                      >
                        Get Started
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-amber-800 hover:bg-amber-900 text-white font-inter rounded-lg h-10" 
                        onClick={() => navigate('/profile')}
                      >
                        Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 font-inter rounded-lg h-10" 
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('is_admin');
                          navigate('/');
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 