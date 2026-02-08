
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      verifyEmail(token);
    } else {
      setIsVerifying(false);
      toast({
        title: "Error!",
        description: "No verification token found!",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const { data, error } = await authService.verifyEmail(token);
      if (error) throw error;

      // After verification, get the current user and create profile if missing
      const user = await authService.getCurrentUser();
      if (user && user.id) {
        const exists = await authService.profileExists(user.id);
        if (!exists) {
          await authService.createProfile({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || null,
          });
        }
      }

      setIsVerified(true);
      toast({
        title: "Success!",
        description: "Your email has been verified successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message ? error.message.endsWith('!') || error.message.endsWith('.') ? error.message : error.message + '!' : "Email verification failed!",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="verification-success center-box bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        {isVerified ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">✅ Your account has been verified</h2>
            <p className="text-gray-600 mb-6">You can now log in using your credentials</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">❌ Verification Failed</h2>
            <p className="text-gray-600 mb-6">There was an issue verifying your email. Please try again.</p>
          </>
        )}
        <button 
          className="btn-login w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl" 
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
