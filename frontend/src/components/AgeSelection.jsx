import { Shield, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AgeSelection({ onSelectAge }) {
    const [loading, setLoading] = useState(false);

    const handleSelect = async (ageLabel) => {
        setLoading(true);
        let numericalAge = 7;
        if (ageLabel === '3-5') numericalAge = 4;
        else if (ageLabel === '6-8') numericalAge = 7;
        else if (ageLabel === '9-12') numericalAge = 10;
        else if (ageLabel === '13+') numericalAge = 14;

        await onSelectAge(numericalAge, ageLabel);
        setLoading(false);
    };

    const ageGroups = [
        { label: '3-5', bg: 'bg-green-500', hover: 'hover:bg-green-400', shadowColor: 'rgba(21, 128, 61, 1)' }, // green-700
        { label: '6-8', bg: 'bg-blue-500', hover: 'hover:bg-blue-400', shadowColor: 'rgba(29, 78, 216, 1)' }, // blue-700
        { label: '9-12', bg: 'bg-orange-500', hover: 'hover:bg-orange-400', shadowColor: 'rgba(194, 65, 12, 1)' }, // orange-700
        { label: '13+', bg: 'bg-rose-500', hover: 'hover:bg-rose-400', shadowColor: 'rgba(225, 29, 72, 1)' } // rose-600
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-rose-500 to-pink-500 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-10 right-10 opacity-20"><Star size={100} className="text-white animate-spin-slow" /></div>
            <div className="absolute bottom-10 left-10 opacity-20"><Sparkles size={120} className="text-white animate-pulse" /></div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/95 backdrop-blur-xl rounded-[3rem] p-10 md:p-14 max-w-2xl w-full shadow-2xl text-center relative z-10"
            >
                <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce-slow border-4 border-white">
                    <Shield size={56} className="text-indigo-500" />
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">How old are you?</h1>
                <p className="text-xl text-slate-500 mb-10 font-medium">Select your age so I can explain things perfectly for you!</p>

                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-8 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-2xl font-bold text-indigo-500 animate-pulse">Setting up your safe learning space...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {ageGroups.map((group) => (
                            <motion.button
                                key={group.label}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSelect(group.label)}
                                className={`${group.bg} ${group.hover} text-white font-black text-4xl py-12 rounded-[2rem] transition-colors shadow-none active:translate-y-[8px] active:shadow-none flex items-center justify-center group relative overflow-hidden`}
                                style={{ boxShadow: `0 8px 0 0 ${group.shadowColor}` }}
                            >
                                <span className="relative z-10">{group.label}</span>
                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-shimmer"></div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
