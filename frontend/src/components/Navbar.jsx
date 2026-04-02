import { Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false); // Close menu after clicking
    };

    const handleHomeClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b-2 border-indigo-50 shadow-sm transition-all py-4 px-6 md:px-12">
            <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group cursor-pointer" onClick={handleHomeClick}>
                    <div className="bg-indigo-500 p-2.5 rounded-full text-white group-hover:rotate-12 transition-transform shadow-md">
                        <Shield size={24} />
                    </div>
                    <span className="text-2xl font-black text-indigo-950 tracking-tight">
                        SafeChat <span className="bg-yellow-400 text-yellow-900 text-sm px-2 py-0.5 rounded-full -rotate-3 inline-block ml-1">Kids</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 font-bold text-slate-500 items-center">
                    <button onClick={handleHomeClick} className="hover:text-indigo-600 transition-colors">Home</button>
                    <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 transition-colors">Features</button>
                    <button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-600 transition-colors">How It Works</button>
                    <Link to="/parents" className="hover:text-indigo-600 transition-colors">Parents</Link>
                </div>

                <Link
                    to="/app"
                    className="hidden md:inline-block bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-extrabold px-6 py-3 rounded-full shadow-[0_4px_0_0_rgba(202,138,4,1)] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_rgba(202,138,4,1)] active:translate-y-[4px] active:shadow-none transition-all"
                >
                    Start Chat
                </Link>

                {/* Mobile Menu Toggle Button */}
                <button 
                    className="md:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-2 border-indigo-50 shadow-lg py-4 px-6 flex flex-col gap-4 font-bold text-slate-600 animate-fade-in-down">
                    <button onClick={handleHomeClick} className="text-left py-2 hover:text-indigo-600 transition-colors">Home</button>
                    <button onClick={() => scrollToSection('features')} className="text-left py-2 hover:text-indigo-600 transition-colors">Features</button>
                    <button onClick={() => scrollToSection('how-it-works')} className="text-left py-2 hover:text-indigo-600 transition-colors">How It Works</button>
                    <Link to="/parents" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600 transition-colors">Parents</Link>
                    <Link
                        to="/app"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-extrabold px-6 py-3 rounded-full shadow-[0_4px_0_0_rgba(202,138,4,1)] flex justify-center mt-2 transition-all"
                    >
                        Start Chat
                    </Link>
                </div>
            )}
        </nav>
    );
}
