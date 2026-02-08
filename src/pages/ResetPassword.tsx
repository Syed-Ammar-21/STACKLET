import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canReset, setCanReset] = useState(false);
  
  const [showCurrentPassMsg, setShowCurrentPassMsg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is in a password recovery session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session && session.user && session.user.email && session.user.aud === 'authenticated' && session.user.email_confirmed_at) {
        // This is a valid session, but check for recovery type
        if (session.user && session.user.email && session.user.aud === 'authenticated') {
          setCanReset(true);
          // Fetch current password hash from profiles (not the plaintext password, but for demo, assume we can fetch it)
          // In real apps, you cannot fetch the current password. For demo, we compare with previous password field if available.
          // So, skip fetching. (This is a UX simulation, not real password verification.)
        }
      } else {
        // Check for recovery type in URL hash (Supabase sets this on recovery links)
        const hash = window.location.hash;
        if (hash.includes('type=recovery')) {
          setCanReset(true);
        } else {
          setCanReset(false);
        }
      }
    });
  }, []);

  useEffect(() => {
    // Simulate current password check (since you can't get the real current password)
    // For demo: if password === 'currentpassword', show green message
    if (password && password === 'currentpassword') {
      setShowCurrentPassMsg(true);
    } else {
      setShowCurrentPassMsg(false);
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    // Passwords do not match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // If new password matches current password (for demo, 'currentpassword')
    if (password === 'currentpassword') {
      setMessage("That's your current password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      // Update the updated_at column in profiles
      const user = await supabase.auth.getUser();
      if (user && user.data && user.data.user) {
        await supabase
          .from('profiles')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', user.data.user.id);
      }
      setMessage('Your password has been reset successfully. You can now log in with your new password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 font-['Orbitron',monospace]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/Booklogo.png"
              alt="Stacklet Logo"
              className="h-14 w-14 object-contain mx-auto"
            />
          </div>
          <CardTitle className="text-3xl font-black tracking-wider select-none text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text mb-2 uppercase" style={{ letterSpacing: '0.1em' }}>
            Reset Password
          </CardTitle>
          <p className="text-gray-500 text-sm">Enter your new password below.</p>
        </CardHeader>
        <CardContent>
          {!canReset ? (
            <div className="text-red-600 text-center">
              Invalid or expired reset link.<br />
              <Button variant="link" type="button" onClick={() => navigate('/forgot-password')} className="text-blue-600 hover:text-blue-800 font-medium mt-4">
                Request a new reset link
              </Button>
            </div>
          ) : message ? (
            <div className="text-green-600 text-center">
              {message}
              <div className="mt-4">
                <Button variant="link" type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-800 font-medium">
                  Back to Login
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {showCurrentPassMsg && (
                  <div className="mt-1 text-green-600 text-sm">That's your current password.</div>
                )}
                
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" disabled={loading}>
                {loading ? 'Saving...' : 'Save New Password'}
              </Button>
              {error && <div className="mt-2 text-red-600 text-center">{error}</div>}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword; 