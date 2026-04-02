import { ArrowRight, Shield, BookOpen, Heart, Sparkles, MessageCircle, Star, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 container mx-auto flex flex-col md:flex-row items-center gap-12 min-h-[90vh]">
                <div className="md:w-1/2 space-y-8 text-center md:text-left z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold mx-auto md:mx-0"
                    >
                        <Sparkles size={18} className="text-yellow-500" />
                        <span>The Safest AI for Kids</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-indigo-950"
                    >
                        An AI friend that helps children <span className="text-indigo-600 relative inline-block">
                            learn and explore
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute bottom-1 left-0 h-4 bg-yellow-300 -z-10 rounded-full"
                            ></motion.div>
                        </span> safely.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 font-medium max-w-xl mx-auto md:mx-0"
                    >
                        SafeChat Kids explains things in simple words, encourages curiosity, and never uses scary language.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="pt-4 flex justify-center md:justify-start"
                    >
                        <button
                            onClick={() => navigate('/app')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-2xl py-5 px-10 rounded-full shadow-[0_8px_0_0_rgba(67,56,202,1)] hover:translate-y-[2px] hover:shadow-[0_6px_0_0_rgba(67,56,202,1)] active:translate-y-[8px] active:shadow-none transition-all flex items-center gap-3 w-full md:w-auto justify-center group"
                        >
                            Start Chatting
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* Demo Chat Preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="md:w-1/2 w-full max-w-lg z-10"
                >
                    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border-4 border-slate-100 relative group">
                        {/* Decorative dots */}
                        <div className="absolute top-4 right-4 flex gap-1.5 opacity-30">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                        </div>

                        <div className="bg-indigo-500 px-4 sm:px-6 py-4 flex items-center gap-3 relative z-10">
                            <div className="bg-white/20 p-2 rounded-full"><Shield size={20} className="text-white" /></div>
                            <div>
                                <span className="text-white font-bold text-lg block leading-tight">SafeChat Kids</span>
                                <span className="text-indigo-200 text-xs font-medium">Online, ready to help</span>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50 h-[22rem] sm:h-80 flex flex-col justify-end relative">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
                                className="self-end bg-blue-500 text-white p-3 sm:p-4 rounded-3xl rounded-tr-sm shadow-sm max-w-[85%]"
                            >
                                <p className="font-medium text-sm sm:text-base">Why is the sky blue?</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }}
                                className="self-start flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[90%]"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                                    <Shield size={16} className="text-white sm:h-5 sm:w-5" />
                                </div>
                                <div className="bg-white text-slate-800 p-3 sm:p-4 rounded-3xl rounded-tl-sm shadow-sm border border-slate-100">
                                    <p className="font-medium text-sm sm:text-base leading-relaxed">Great question! 🌟 The sky looks blue because sunlight scatters in the atmosphere like tiny bouncy balls! Want to know what color it is on Mars?</p>
                                </div>
                            </motion.div>
                        </div>
                        <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                            <div className="bg-slate-100 rounded-full h-12 flex-1 flex items-center px-4 text-slate-400 font-medium border border-slate-200">
                                Ask a question...
                            </div>
                            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Background blobs */}
                <div className="absolute top-20 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-40 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 bg-white relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-indigo-950 mb-6 tracking-tight">How It Works</h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Four simple steps to start an amazing learning adventure.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Star, title: "1. Enter your age", desc: "So we can adjust the words just for you!", color: "text-yellow-600", bg: "bg-yellow-500", light: "bg-yellow-50", border: "border-yellow-200" },
                            { icon: MessageCircle, title: "2. Ask questions", desc: "Type or use your voice to ask anything.", color: "text-blue-600", bg: "bg-blue-500", light: "bg-blue-50", border: "border-blue-200" },
                            { icon: Sparkles, title: "3. AI explains things", desc: "In simple, fun words that are easy to get.", color: "text-rose-600", bg: "bg-rose-500", light: "bg-rose-50", border: "border-rose-200" },
                            { icon: ThumbsUp, title: "4. Learn safely", desc: "Have fun without scary words or topics.", color: "text-emerald-600", bg: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-200" }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className={`${step.light} border-2 ${step.border} p-8 rounded-[2.5rem] text-center hover:shadow-xl transition-all duration-300 relative group`}
                            >
                                <div className={`absolute top-0 right-0 w-16 h-16 opacity-10 bg-current ${step.color} rounded-bl-[100%] rounded-tr-[2rem] transition-all group-hover:w-full group-hover:h-full group-hover:rounded-[2.5rem] group-hover:opacity-5`} />

                                <div className={`w-20 h-20 ${step.bg} text-white rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:-rotate-6 transition-transform`}>
                                    <step.icon size={40} className="drop-shadow-sm" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">{step.title}</h3>
                                <p className="text-slate-600 font-medium text-lg leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-slate-50 border-t border-slate-200/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-indigo-950 mb-6 drop-shadow-sm">Why Parents Love It</h2>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">Built from the ground up to be the perfect, distraction-free digital companion.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            { icon: Shield, title: "100% Kid Safe", desc: "No bad words, no scary topics. We filter everything so you don't have to worry.", color: "text-blue-500", bg: "bg-blue-500" },
                            { icon: BookOpen, title: "Adaptive Learning", desc: "The AI adjusts its vocabulary based on your child's age automatically.", color: "text-emerald-500", bg: "bg-emerald-500" },
                            { icon: Heart, title: "Promotes Creativity", desc: "Instead of doing homework for them, the AI asks guiding questions to help them think!", color: "text-orange-500", bg: "bg-orange-500" }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] text-center h-full group hover:shadow-2xl hover:border-indigo-100 transition-all shadow-sm"
                            >
                                <div className={`w-24 h-24 ${feature.bg} text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Layer */}
            <section className="py-24 bg-white pb-32">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-rose-600 rounded-[3rem] p-10 md:p-16 shadow-2xl text-center relative overflow-hidden">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 relative z-10">Ready to start the journey?</h2>
                        <p className="text-indigo-100 text-xl md:text-2xl mb-10 font-medium tracking-wide relative z-10">Join thousands of kids already exploring safely.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/app')}
                            className="relative z-10 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black text-2xl py-5 px-12 rounded-full shadow-[0_8px_0_0_rgba(202,138,4,1)] transition-transform inline-flex items-center gap-2"
                        >
                            Start Chatting Now
                            <ArrowRight size={24} />
                        </motion.button>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </div>
            </section>
        </div>
    );
}
