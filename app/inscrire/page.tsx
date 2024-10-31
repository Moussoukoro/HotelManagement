"use client";  // Marque ce fichier comme un composant client
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: rgb(55, 65, 81);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
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

const RegisterCard = styled.div`
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

const RegisterForm = styled.form`
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
    cursor: pointer;
  }

  label {
    font-size: 0.875rem;
    color: rgb(55, 65, 81);
    cursor: pointer;
  }
`;

const RegisterButton = styled.button`
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
`;

const LoginLinkContainer = styled.div`
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

interface FormData {
  username: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    acceptTerms: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'admin',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        router.push('/auth');
      }
    } catch (error) {
      console.error('Error during registration:', error);
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
    <RegisterContainer>
      <Logo>
        <img src="red-product-logo.png" alt="RED PRODUCT" />
        RED PRODUCT
      </Logo>
      <RegisterCard>
        <Title>Inscrivez-vous en tant que Admin</Title>
        <RegisterForm onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            placeholder="Nom"
            value={formData.username}
            onChange={handleInputChange}
          />
          <Input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleInputChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleInputChange}
          />
          <CheckboxContainer>
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
            />
            <label htmlFor="acceptTerms">
              Accepter les termes et la politique
            </label>
          </CheckboxContainer>
          <RegisterButton type="submit">
            S'inscrire
          </RegisterButton>
        </RegisterForm>
      </RegisterCard>
      <LoginLinkContainer>
        Vous avez déjà un compte?
        <Link href="/auth">Se connecter</Link>
      </LoginLinkContainer>
    </RegisterContainer>
  );
};

export default Register;