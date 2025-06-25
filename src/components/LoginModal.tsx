import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogIn, User, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner'; 
import { useUserStore } from '@/app/store/useUserStore'; 

export default function LoginModal({
  isLoginOpen,
  setIsLoginOpen,
}: {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
}) {
  const [userInput, setUserInput] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const {setIsAdmin}= useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://expresso-plum.vercel.app/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
        credentials: 'include',
      });

      if (response.status === 200) {
        setIsAdmin(true);
        toast.success('Login successfully');
        setIsLoginOpen(false);
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInput.password) {
      setShowPassword(false);
    }
  }, [userInput.password]);

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="p-0 max-w-md overflow-hidden rounded-3xl shadow-2xl">
        <div className="bg-rose-300/50 px-6 py-5">
          <DialogHeader className="p-0">
            <DialogTitle className="text-rose-400 flex items-center gap-2 text-xl font-extrabold tracking-wide">
              <User className="w-6 h-6" />
              Login
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleLogin} className="bg-white px-6 py-8">
          {/* Email */}
          <label htmlFor="email" className="block text-sm font-medium text-rose-400 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={userInput.email}
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800
                     focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
          />

          {/* Password */}
          <label htmlFor="password" className="block text-sm font-medium text-rose-400 mt-6 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={userInput.password}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              onChange={(e) => setUserInput({ ...userInput, password: e.target.value })}
            />
            {userInput.password && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsLoginOpen(false)}
              className="cursor-pointer rounded-full px-6 py-3 font-semibold text-gray-600
                         hover:text-gray-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="cursor-pointer group flex items-center gap-2 rounded-full bg-rose-300/50 px-8 py-3 font-semibold text-rose-400
                         hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              <LogIn className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 inline-block text-rose-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-label="Loading"
                >
                  <title>Loading spinner</title>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
