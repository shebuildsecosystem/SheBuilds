
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Logo and Tagline */}
          <div className="md:col-span-4">
            <div className="mb-4">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 font-martian">SheBuilds</span>
              </Link>
            </div>
            <p className="text-gray-600 font-inter mb-4">
              An inclusive community and fellowship program dedicated to empowering women in technology and entrepreneurship.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/shebuildseco?igsh=OWFtdDBhZjI3MGQ5" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/shebuildsecosystem" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://x.com/SheBuildsEco" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.youtube.com/@SheBuildsEcosystem" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 font-martian">Company</h4>
              <ul>
                <li className="mb-2"><Link to="/" className="text-gray-600 hover:text-gray-900 font-inter">About</Link></li>
                <li className="mb-2"><Link to="/events" className="text-gray-600 hover:text-gray-900 font-inter">Events</Link></li>
                <li className="mb-2"><Link to="/community" className="text-gray-600 hover:text-gray-900 font-inter">Community</Link></li>
                {/* <li className="mb-2"><Link to="/grant-programs" className="text-gray-600 hover:text-gray-900 font-inter">Resources</Link></li> */}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 font-martian">Initiatives</h4>
              <ul>
                <li className="mb-2"><Link to="/events" className="text-gray-600 hover:text-gray-900 font-inter">Code N Connect</Link></li>
                <li className="mb-2"><Link to="/challenges" className="text-gray-600 hover:text-gray-900 font-inter">Code N Challenge</Link></li>
                <li className="mb-2"><Link to="/events" className="text-gray-600 hover:text-gray-900 font-inter">Code N Candid</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 font-martian">Build</h4>
              <ul>
                <li className="mb-2"><Link to="/projects" className="text-gray-600 hover:text-gray-900 font-inter">Projects</Link></li>
                <li className="mb-2"><Link to="/projects/create" className="text-gray-600 hover:text-gray-900 font-inter">Create Project</Link></li>
                <li className="mb-2"><Link to="/grant-programs" className="text-gray-600 hover:text-gray-900 font-inter">Grant Programs</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 font-inter">
            &copy; {new Date().getFullYear()} SheBuilds. All rights reserved.
          </p>
          <p className="text-sm text-orange-600 font-medium font-martian mt-4 sm:mt-0">
            "Built by her. Backed by boldness."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
