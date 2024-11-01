// app/resetPass/page.tsx
"use client";

import { Suspense } from 'react';
import styled from 'styled-components';
import { ResetPasswordForm } from '@/components/m/ResetPassword';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #374151;
  padding: 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
`;

export default function ResetPasswordPage() {
  // Utilisation de window.location.search dans un composant client
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('token');
    }
    return null;
  };

  return (
    <Container>
      <Suspense fallback={<LoadingSpinner>Chargement...</LoadingSpinner>}>
        <ResetPasswordForm token={getToken()} />
      </Suspense>
    </Container>
  );
}