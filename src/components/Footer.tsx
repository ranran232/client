import { Twitter, Github, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="mt-20 bg-white/80 backdrop-blur-sm rounded-t-3xl shadow-inner">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-rose-950">
        
        {/* Logo / Tagline */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-rose-600 tracking-wide">Maby</h2>
          <p className="text-xs text-rose-700">Ylana Rayne Dumas Olais</p>
        </div>

        {/* Navigation / Links */}
        <div className="flex space-x-6">
          <a href="#" className="hover:text-rose-600 transition">Home</a>
          <a href="#" className="hover:text-rose-600 transition">About</a>
          <a href="#" className="hover:text-rose-600 transition">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a
            href="#"
            aria-label="Twitter"
            className="bg-rose-100 hover:bg-rose-200 p-2 rounded-full text-rose-500 hover:text-rose-600 transition"
          >
            <Twitter size={18} />
          </a>
          <a
            href="#"
            aria-label="GitHub"
            className="bg-rose-100 hover:bg-rose-200 p-2 rounded-full text-rose-500 hover:text-rose-600 transition"
          >
            <Github size={18} />
          </a>
          <a
            href="#"
            aria-label="Contact"
            className="bg-rose-100 hover:bg-rose-200 p-2 rounded-full text-rose-500 hover:text-rose-600 transition"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-4 text-xs text-rose-400 border-t border-rose-100">
        &copy; 2025 Maby. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
