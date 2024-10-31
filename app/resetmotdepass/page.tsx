"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Configuration pour Next.js
export const dynamic = "force-dynamic";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #374151;
  padding: 1rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const LogoText = styled.span`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

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

const Description = styled.p`
  color: #6B7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
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

const BackLink = styled.a`
  display: block;
  text-align: center;
  color: #4B5563;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    color: #374151;
  }
`;

const Alert = styled.div<{ type: 'success' | 'error' }>`
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  background-color: ${props => props.type === 'success' ? '#DEF7EC' : '#FDE8E8'};
  color: ${props => props.type === 'success' ? '#03543F' : '#9B1C1C'};
`;

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: ''
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenFromQuery = searchParams.get('token');
    if (tokenFromQuery) {
      setToken(tokenFromQuery);
    } else {
      setAlert({
        type: 'error',
        message: 'Token de réinitialisation manquant'
      });
      setTimeout(() => {
        router.push('/auth');
      }, 2000);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      setAlert({
        type: 'error',
        message: 'Les mots de passe ne correspondent pas'
      });
      return;
    }

    if (!token) {
      setAlert({
        type: 'error',
        message: 'Token de réinitialisation manquant'
      });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      // Modification de la requête pour inclure le token dans le header Authorization
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Ajout du token dans le header
        },
        body: JSON.stringify({ 
          password: formData.password,
          passwordConfirm: formData.passwordConfirm 
        }),
        credentials: 'include' // Ajout pour gérer les cookies si nécessaire
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          type: 'success',
          message: 'Votre mot de passe a été réinitialisé avec succès'
        });
        
        // Redirection après 2 secondes
        setTimeout(() => {
          router.push('/auth');
        }, 10000);
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
    <Container>
      <LogoContainer>
        <LogoImage src="/red-product-logo.png" alt="RED PRODUCT" />
        <LogoText>RED PRODUCT</LogoText>
      </LogoContainer>
      <Content>
        <Title>Réinitialisation du mot de passe</Title>
        <Description>
          Veuillez entrer votre nouveau mot de passe ci-dessous.
        </Description>

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
          <BackLink>Revenir à la connexion</BackLink>
        </Link>
      </Content>
    </Container>
  );
}





