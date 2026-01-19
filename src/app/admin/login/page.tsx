"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, TextInput } from '@/components/shared';
import { siteContent } from '@/content/he';
import { login, getCurrentUser } from '@/services/auth';

const content = siteContent.admin.login;

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if already logged in as admin
  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (user?.role === 'admin') {
        router.replace('/admin/users');
      }
      setIsCheckingAuth(false);
    }
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, error: loginError } = await login(email, password);

      if (loginError || !user) {
        setError(loginError || content.errors.invalidCredentials);
        setIsLoading(false);
        return;
      }

      // Check if user is admin
      if (user.role !== 'admin') {
        setError(content.errors.accessDenied);
        setIsLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push('/admin/users');
    } catch {
      setError(content.errors.networkError);
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#215388]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#215388]">Relogate</h1>
            <p className="text-[#706F6F] mt-2">{content.subtitle}</p>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-[#1D1D1B] text-center mb-6">
            {content.title}
          </h2>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <TextInput
              label={content.emailLabel}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder={content.emailPlaceholder}
            />

            <TextInput
              label={content.passwordLabel}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder={content.passwordPlaceholder}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                </span>
              ) : (
                content.submitButton
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
