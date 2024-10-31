// components/auth/AuthLayout.tsx
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';


const StyledAuthContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #2D3748;
  padding: 1rem;
`;

const StyledLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const StyledAuthCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.25rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4A5568;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4A5568;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2D3748;
  }
`;

const StyledCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledLink = styled.a`
  color: #4A5568;
  text-decoration: none;
  text-align: center;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Props types for components
interface AuthLayoutProps {
  children: React.ReactNode;
}

interface FormInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

// Components
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <StyledAuthContainer>
    <StyledLogo>
      <Image src="/logo.svg" alt="RED PRODUCT" width={32} height={32} />
      RED PRODUCT
    </StyledLogo>
    <StyledAuthCard>
      {children}
    </StyledAuthCard>
  </StyledAuthContainer>
);

export const FormInput: React.FC<FormInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  required = true
}) => (
  <StyledInput
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
  />
);

export const FormButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StyledButton type="submit">
    {children}
  </StyledButton>
);

// Utilisez ces composants dans vos pages
export const AuthCheckbox: React.FC<{
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <StyledCheckbox>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      id="auth-checkbox"
    />
    <label htmlFor="auth-checkbox">{label}</label>
  </StyledCheckbox>
);
