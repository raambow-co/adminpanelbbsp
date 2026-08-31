import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(adminId || 'sudheer.reddy@bbsp.in', password || 'admin');
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EBEBEB] p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#10367D]/12 shadow-[0_15px_45px_-10px_rgba(16,54,125,0.08)]">
          {/* Logo on Top */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-28 h-28 flex items-center justify-center">
              <img
                src="/build-bharat-logo.png"
                alt="Build Bharat Logo"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Login Heading */}
            <h1 className="font-sora font-extrabold text-2xl text-[#10367D] mt-3 tracking-tight">
              Login
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="ID / Email"
                className="w-full px-4 py-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-sm font-semibold text-[#10367D] placeholder:text-[#1A4594]/45 focus:bg-white focus:outline-none focus:border-[#10367D] focus:ring-2 focus:ring-[#10367D]/10 transition-all"
              />
            </div>

            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-4 pr-11 py-3 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-sm font-semibold text-[#10367D] placeholder:text-[#1A4594]/45 focus:bg-white focus:outline-none focus:border-[#10367D] focus:ring-2 focus:ring-[#10367D]/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#1A4594]/50 hover:text-[#10367D] transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#10367D] hover:bg-[#1A4594] text-white font-sora font-bold text-sm shadow-md shadow-[#10367D]/25 transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 text-[#A5CEE0]" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
