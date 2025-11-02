
import { Github, Linkedin, Twitter } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Logo and Tagline */}
          <div className="md:col-span-4">
            <div className="mb-4">
              <a href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 font-martian">SheBuilds</span>
              </a>
            </div>
            <p className="text-gray-600 font-inter mb-4">
              Bridging Gaps, Building Futures. An inclusive community and fellowship program dedicated to empowering women in technology and entrepreneurship.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 font-martian">Company</h4>
              <ul>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-900 font-inter">About</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-900 font-inter">Events</a></li>
                <li className="mb-2"><a href="/community" className="text-gray-600 hover:text-gray-900 font-inter">Community</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-900 font-inter">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 font-martian">Initiatives</h4>
              <ul>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-900 font-inter">Code N Connect</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-900 font-inter">Code N Challenge</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-900 font-inter">Code N Candid</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 font-martian">Build</h4>
              <ul>
                <li className="mb-2"><a href="/projects" className="text-gray-600 hover:text-gray-900 font-inter">Projects</a></li>
                <li className="mb-2"><a href="/projects/create" className="text-gray-600 hover:text-gray-900 font-inter">Create Project</a></li>
                <li className="mb-2"><a href="/grant-programs" className="text-gray-600 hover:text-gray-900 font-inter">Grant Programs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 font-martian">Support</h4>
              <ul>
                <li className="mb-2"><a href="/contact" className="text-gray-600 hover:text-gray-900 font-inter">Contact Us</a></li>
                <li className="mb-2"><a href="#" className="text-gray-600 hover:text-gray-900 font-inter">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 font-martian">Legal</h4>
              <ul>
                <li className="mb-2"><a href="/privacy" className="text-gray-600 hover:text-gray-900 font-inter">Privacy Policy</a></li>
                <li className="mb-2"><a href="/terms" className="text-gray-600 hover:text-gray-900 font-inter">Terms of Service</a></li>
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
