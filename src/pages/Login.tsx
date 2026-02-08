import React, { useState } from 'react';
import ReactBitsLoader from '@/components/ReactBitsLoader';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';


async function ensureProfileExists() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (!data) {
    await supabase.from('profiles').insert([{
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || ''
    }]);
  }
}

const Login: React.FC = () => {
  const [showBitsLoader, setShowBitsLoader] = useState(false);
  const [googleLoginComplete, setGoogleLoginComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [phase, setPhase] = useState(1); // 1: Welcome, 2: Loading
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // First, check if email exists in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (!profile) {
      toast({
        title: 'Email Not Registered',
        description: 'No account found with this email. Please sign up first!',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Try to sign in
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) {
        if (error.message && error.message.toLowerCase().includes('invalid login credentials')) {
          toast({
            title: 'Incorrect Password',
            description: 'The password you entered is incorrect. Please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error!',
            description: error.message,
            variant: 'destructive',
          });
        }
        setLoading(false);
        return;
      }

      // Check if the user's profile exists (should always exist here)
      let fullName = '';
      let hasProfile = false;
      if (data && data.user && data.user.id) {
        try {
          hasProfile = await authService.profileExists(data.user.id);
          if (!hasProfile) {
            throw new Error('No profile found for this user. Please sign up first.');
          }
          fullName = await authService.getProfile(data.user.id);
        } catch (profileError: any) {
          toast({
            title: 'Error!',
            description: profileError.message ? profileError.message.endsWith('!') || profileError.message.endsWith('.') ? profileError.message : profileError.message + '!' : 'No profile found for this user. Please sign up first!',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
      }

      // Show loading overlay
      setShowLoadingOverlay(true);
      setPhase(1);
      setTimeout(() => {
        toast({
          title: fullName ? `Welcome, ${fullName}!` : 'Welcome!',
          description: "You're now signed in to Stacklet!",
        });
        sessionStorage.setItem('fromLogin', 'true');
        navigate('/');
      }, 3000);

    } catch (error: any) {
      toast({
        title: 'Error!',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };
  // --- Google Login Handler ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/oauth-callback',
      },
    });
    if (error) {
      toast({
        title: 'Error!',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }
    // After redirect, handle profile creation in useEffect
  };

  // --- Google Auth Profile Creation (runs on mount if user is logged in with Google) ---
  // Google loader and profile logic
  // If redirected from Google OAuth, immediately show only the loading overlay and skip rendering login form
  const [googleUserChecked, setGoogleUserChecked] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  // Always render the login form. Google profile/overlay logic runs after mount, causing overlays to appear after login form flashes.
  React.useEffect(() => {
    async function handleGoogleLoginFlow() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.app_metadata?.provider === 'google') {
        // Check if profile exists by id or email
        const { data: profileById } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('id', user.id)
          .single();
        const { data: profileByEmail } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', user.email)
          .single();
        if (profileById) {
          // Profile exists for this user id, do nothing
        } else if (profileByEmail) {
          // Merge: update existing profile row's id to current user id
          await supabase.from('profiles')
            .update({ id: user.id })
            .eq('email', user.email);
        } else {
          // Create new profile row
          await supabase.from('profiles').insert([{
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || ''
          }]);
        }
        // Show welcome overlay, then navigate to library
        setShowLoadingOverlay(true);
        setTimeout(() => {
          sessionStorage.setItem('fromLogin', 'true');
          navigate('/');
        }, 1500);
        return;
      }
    }
    handleGoogleLoginFlow();
    // eslint-disable-next-line
  }, []);

  // --- Google Auth Profile Check (runs on mount if user is logged in) ---
  React.useEffect(() => {
    async function checkGoogleProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.app_metadata?.provider === 'google') {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        if (!profile) {
          // Show standard loading overlay, sign out, and navigate back to login page
          setShowLoadingOverlay(true);
          setPhase(1);
          setTimeout(async () => {
            await supabase.auth.signOut();
            setShowLoadingOverlay(false);
            navigate('/login');
          }, 2000);
        }
      }
    }
    checkGoogleProfile();
    // eslint-disable-next-line
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative font-['Orbitron',monospace]">
      {/* Loading Overlay */}
      {showLoadingOverlay && (
        <>
          {phase === 1 && (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-['Orbitron',monospace]">
              <img
                src="/translogo.png"
                alt="Stacklet Logo"
                className="w-20 h-20 object-contain animate-bounce mb-4"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <h2 className="text-3xl font-black tracking-wider select-none text-white font-['Orbitron',monospace] uppercase mb-2 text-center" style={{ letterSpacing: '0.1em' }}>
                Welcome to Stacklet
              </h2>
              <p className="text-white text-lg font-['Orbitron',monospace] text-center">We are logging you in...</p>
            </div>
          )}
          {phase === 2 && (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-['Orbitron',monospace]">
              <img
                src="/translogo.png"
                alt="Stacklet Logo"
                className="w-20 h-20 object-contain animate-bounce mb-4"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <h2 className="text-3xl font-black tracking-wider select-none text-white font-['Orbitron',monospace] uppercase mb-2" style={{ letterSpacing: '0.1em' }}>
                Loading your personal library
              </h2>
            </div>
          )}
        </>
      )}

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/Booklogo.png"
              alt="Stacklet Logo"
              className="h-14 w-14 object-contain mx-auto"
            />
          </div>
          <CardTitle
            className="text-3xl font-black tracking-wider select-none text-black font-['Orbitron',monospace]"
            style={{ lineHeight: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', letterSpacing: '0.1em', justifyContent: 'center' }}
          >
            STACKLET
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={0}
                >
                  {showPassword ? (
                    // Eye-off SVG
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.09 0 2.13.18 3.09.51m3.48 2.49A9.956 9.956 0 0121 12c0 1.386-.35 2.695-.97 3.825M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  ) : (
                    // Eye SVG
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-1 text-right">
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 flex items-center justify-center gap-2 font-['Orbitron',monospace] mt-2"
              style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700 }}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
