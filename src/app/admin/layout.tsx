import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Relogate Admin',
  description: 'Admin panel for Relogate',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
