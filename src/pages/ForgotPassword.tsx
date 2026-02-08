import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage('A password reset link has been sent to your email address.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative font-['Orbitron',monospace]">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <img
            src="/Booklogo.png"
            alt="Stacklet Logo"
            className="h-14 w-14 object-contain mb-4 mx-auto"
          />
          <CardTitle className="text-3xl font-black tracking-wider select-none text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text mb-2 uppercase mx-auto text-center" style={{ letterSpacing: '0.1em' }}>
            Forgot Password
          </CardTitle>
          <p className="text-gray-500 text-sm">Enter your email to receive a password reset link.</p>
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
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
          {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
          <div className="mt-4 text-center">
            <Button variant="link" type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-800 font-medium">
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword; 