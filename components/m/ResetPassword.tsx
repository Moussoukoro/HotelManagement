// "use client";

// import React, { useState, Suspense } from 'react';
// import styled from 'styled-components';
// import { useSearchParams } from 'next/navigation';

// const Container = styled.div`
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   background: #374151;
//   padding: 1rem;
// `;

// const Title = styled.h2`
//   font-size: 1.25rem;
//   font-weight: 600;
//   color: #111827;
//   margin-bottom: 0.5rem;
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 0.75rem;
//   border: 1px solid #D1D5DB;
//   border-radius: 0.375rem;
//   font-size: 0.875rem;
  
//   &:focus {
//     outline: none;
//     border-color: #3B82F6;
//     box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
//   }
// `;

// const Button = styled.button`
//   width: 100%;
//   padding: 0.75rem;
//   background-color: #4B5563;
//   color: white;
//   border: none;
//   border-radius: 0.375rem;
//   font-weight: 500;
//   cursor: pointer;
  
//   &:hover {
//     background-color: #374151;
//   }

//   &:disabled {
//     opacity: 0.7;
//     cursor: not-allowed;
//   }
// `;

// const ErrorMessage = styled.p`
//   color: #B91C1C;
//   font-size: 0.875rem;
//   margin-top: 0.5rem;
// `;

// const SuccessMessage = styled.p`
//   color: #059669;
//   font-size: 0.875rem;
//   margin-top: 0.5rem;
// `;

// const LoadingSpinner = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 200px;
// `;

// // Composant interne qui utilise useSearchParams
// const ResetPasswordForm = () => {
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');

//   const [formData, setFormData] = useState({
//     password: '',
//     passwordConfirm: ''
//   });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (formData.password !== formData.passwordConfirm) {
//       setError('Les mots de passe ne correspondent pas');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await fetch(process.env.NEXT_PUBLIC_API_URL+`/api/auth/reset-password/${token}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
      
//       const data = await response.json();
      
//       if (data.status === 'success') {
//         setMessage('Votre mot de passe a été réinitialisé avec succès');
//         setFormData({ password: '', passwordConfirm: '' });
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       console.error(err); 
//       setError('Une erreur est survenue. Veuillez réessayer.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       <Input
//         type="password"
//         value={formData.password}
//         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//         placeholder="Nouveau mot de passe"
//         required
//       />
//       <Input
//         type="password"
//         value={formData.passwordConfirm}
//         onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
//         placeholder="Confirmez le mot de passe"
//         required
//       />
//       <Button type="submit" disabled={isLoading}>
//         {isLoading ? 'Réinitialisation...' : 'Réinitialiser'}
//       </Button>
//       {error && <ErrorMessage>{error}</ErrorMessage>}
//       {message && <SuccessMessage>{message}</SuccessMessage>}
//     </Form>
//   );
// };

// // Composant principal avec Suspense
// export const ResetPassword = () => {
//   return (
//     <Container>
//       <Title>Réinitialisation du mot de passe</Title>
//       <Suspense fallback={<LoadingSpinner>Chargement...</LoadingSpinner>}>
//         <ResetPasswordForm />
//       </Suspense>
//     </Container>
//   );
// };