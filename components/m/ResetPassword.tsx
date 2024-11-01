// components/ResetPasswordForm.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';

const Content = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4B5563;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #374151;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Alert = styled.div<{ type: 'success' | 'error' }>`
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  background-color: ${props => props.type === 'success' ? '#DEF7EC' : '#FDE8E8'};
  color: ${props => props.type === 'success' ? '#03543F' : '#9B1C1C'};
`;

interface ResetPasswordFormProps {
  token: string | null;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: ''
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <Content>
        <Alert type="error">
          Token de réinitialisation manquant. Veuillez vérifier votre lien.
        </Alert>
        <Link href="/auth" passHref legacyBehavior>
          <a className="block text-center text-gray-600 hover:text-gray-800 text-sm mt-4">
            Revenir à la connexion
          </a>
        </Link>
      </Content>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      setAlert({
        type: 'error',
        message: 'Les mots de passe ne correspondent pas'
      });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password/${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          type: 'success',
          message: 'Votre mot de passe a été réinitialisé avec succès'
        });
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      } else {
        throw new Error(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Content>
      <Title>Réinitialisation du mot de passe</Title>

      {alert && (
        <Alert type={alert.type}>
          {alert.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Nouveau mot de passe"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Confirmez le mot de passe"
          value={formData.passwordConfirm}
          onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
          required
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
        </Button>
      </Form>

      <Link href="/auth" passHref legacyBehavior>
        <a className="block text-center text-gray-600 hover:text-gray-800 text-sm mt-4">
          Revenir à la connexion
        </a>
      </Link>
    </Content>
  );
}