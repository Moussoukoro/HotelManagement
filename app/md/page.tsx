// app/md/page.tsx
'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/m/ResetPassword';

const Page = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return <div>Invalid or missing reset token</div>;
  }

  return (
    <div>
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default Page;