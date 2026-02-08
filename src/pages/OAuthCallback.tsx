import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ReactBitsLoader from '@/components/ReactBitsLoader';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<'success' | 'welcome' | 'loading'>('success');

  let content;
  if (step === 'success') {
    content = (
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-lg rounded-xl p-8 max-w-md w-full text-center bg-white">
          <CardHeader className="flex flex-col items-center justify-center text-center bg-transparent">
            <img
              src="/Booklogo.png"
              alt="Stacklet Logo"
              className="h-14 w-14 object-contain mb-4 mx-auto"
            />
            <CardTitle className="text-3xl font-black tracking-wider select-none text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text mb-2 uppercase mx-auto text-center" style={{ letterSpacing: '0.1em' }}>
              Successfully Registered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">Your email has been registered with Stacklet via Google.</p>
            <Button
              onClick={async () => {
                setStep('welcome');
              }}
              className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 flex items-center justify-center gap-2 font-['Orbitron',monospace] mt-2"
              style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700 }}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  } else if (step === 'welcome') {
    content = (
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
    );
    setTimeout(() => setStep('loading'), 2500);
  } else if (step === 'loading') {
    setTimeout(() => {
      sessionStorage.setItem('fromLogin', 'true');
      navigate('/');
    }, 0);
    content = null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 font-['Orbitron',monospace]">
      {/* Only show the Card above the gradient, no extra white box wrapper */}
      {content}
    </div>
  );
};

export default OAuthCallback;
