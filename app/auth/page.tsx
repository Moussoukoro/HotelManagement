"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';

const LoginContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  /* Remplacer la couleur de fond avec une image */
  background-image: url('/imageFond.jpeg'); /* Chemin de l'image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  /* Ajout d'un overlay noir */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000; /* Overlay complètement noir */
    z-index: 1;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  position: relative;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  color: white;
  font-size: 1.25rem;
  font-weight: 500;

  img {
    width: 24px;
    height: 24px;
  }
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1rem;
  color: rgb(17, 24, 39);
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 1px solid rgb(209, 213, 219);
  font-size: 0.875rem;
  color: rgb(55, 65, 81);
  background-color: transparent;

  &::placeholder {
    color: rgb(156, 163, 175);
  }

  &:focus {
    outline: none;
    border-bottom-color: rgb(107, 114, 128);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    border: 1px solid rgb(209, 213, 219);
    border-radius: 2px;
  }

  label {
    font-size: 0.875rem;
    color: rgb(55, 65, 81);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: rgb(55, 65, 81);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgb(75, 85, 99);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ForgotPasswordLink = styled.a`
  display: block;
  text-align: center;
  color: rgb(234, 179, 8);
  font-size: 0.875rem;
  text-decoration: none;
  margin-top: 1.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SignUpContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: white;
  font-size: 0.875rem;

  a {
    color: rgb(234, 179, 8);
    text-decoration: none;
    margin-left: 0.25rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #FEE2E2;
  color: #DC2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('userEmail');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (rememberMe && rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userEmail', formData.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('userEmail');
        }

        router.push('/dashboard');
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <LoginContainer>
      <Logo>
        <Image src="/red-product-logo.png" alt="RED PRODUCT" width={50} height={50} />
        RED PRODUCT
      </Logo>
      <LoginCard>
        <Title>Connectez-vous en tant que Admin</Title>
        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}
        <LoginForm onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <CheckboxContainer>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <label htmlFor="rememberMe">Gardez-moi connecte</label>
          </CheckboxContainer>
          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </LoginButton>
        </LoginForm>
      </LoginCard>
      <ForgotPasswordLink href="/md">
        Mot de passe oublie?
      </ForgotPasswordLink>
      <SignUpContainer>
        Vous navez pas de compte?
        <Link href="/inscrire">Sinscrire</Link>
      </SignUpContainer>
    </LoginContainer>
  );
};

export default Login;