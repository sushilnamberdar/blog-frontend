import React from 'react';
import { Link } from 'react-router-dom';
import { IconTwitter, IconGithub, IconLinkedin } from '../ui/icons';

const Footer = () => (
  <footer className="bg-gray-800 text-gray-300 mt-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h5 className="text-lg font-bold text-white mb-2">MyBlog</h5>
          <p className="text-sm">A modern, clean, and fast blog frontend built with React and Tailwind CSS.</p>
          {/* --- ADDED SOCIALS --- */}
          <div className="flex space-x-4 mt-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <IconTwitter />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <span className="sr-only">GitHub</span>
              <IconGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <span className="sr-only">LinkedIn</span>
              <IconLinkedin />
            </a>
          </div>
          {/* --- END OF ADDED SOCIALS --- */}
        </div>
        <div>
          <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</h5>
          <ul className="space-y-2">
            <li><Link to="/" className="text-sm hover:text-white">Home</Link></li>
            <li><Link to="/about" className="text-sm hover:text-white">About</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Legal</h5>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="text-sm hover:text-white">Privacy Policy</Link></li>
            <li><button className="text-sm hover:text-white">Terms of Service</button></li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Get Started</h5>
          <ul className="space-y-2">
            <li><Link to="/login" className="text-sm hover:text-white">Sign In</Link></li>
            <li><Link to="/register" className="text-sm hover:text-white">Sign Up</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
