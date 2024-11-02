"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
// import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';



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

const ErrorMessage = styled.p`
  color: #B91C1C;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.p`
  color: #059669;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;


// export default function ForgotPassword() {
 
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setAlert(null);

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Une erreur est survenue');
//       }

//       setAlert({
//         type: 'success',
//         message: 'Les instructions de réinitialisation ont été envoyées à votre adresse email',
//       });
//       setEmail('');

//       // // Rediriger vers la page de réinitialisation
//       // router.push(`/resetmotdepass?token=${data.token}`); // Remplace `data.token` par la valeur réelle que tu as pour le token

//     } catch (error) {
//       console.error(error); 
//       setAlert({
//         type: 'error',
//         message: error instanceof Error ? error.message : 'Une erreur est survenue',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <Container>
//       <LogoContainer>
//         <LogoImage src="/red-product-logo.png" alt="RED PRODUCT" />
//         <LogoText>RED PRODUCT</LogoText>
//       </LogoContainer>
//       <Content>
//         <Title>Mot de passe oublié?</Title>
//         <Description>
//           Entrez votre adresse e-mail ci-dessous et nous vous enverrons des instructions sur la façon de modifier votre mot de passe.
//         </Description>

//         {alert && (
//           <Alert type={alert.type}>
//             {alert.message}
//           </Alert>
//         )}

//         <Form onSubmit={handleSubmit}>
//           <Input
//             type="email"
//             placeholder="Votre e-mail"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             disabled={isLoading}
//           />
//           <Button type="submit" disabled={isLoading}>
//             {isLoading ? 'Envoi en cours...' : 'Envoyer'}
//           </Button>
//         </Form>

//         <Link href="/auth" passHref legacyBehavior>
//           <BackLink>Revenir à la connexion</BackLink>
//         </Link>
//       </Content>
//     </Container>
//   );
// }

// Component pour réinitialiser le mot de passe


export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query; // Obtenir le token directement de l'URL

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setMessage('Votre mot de passe a été réinitialisé avec succès');
        setFormData({ password: '', passwordConfirm: '' });
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err); 
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Réinitialisation du mot de passe</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Nouveau mot de passe"
          required
        />
        <Input
          type="password"
          value={formData.passwordConfirm}
          onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
          placeholder="Confirmez le mot de passe"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Réinitialisation...' : 'Réinitialiser'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <SuccessMessage>{message}</SuccessMessage>}
      </Form>
    </Container>
  );
}


// // Component pour la mise à jour du mot de passe
// export const UpdatePassword = () => {
//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     passwordConfirm: ''
//   });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (formData.newPassword !== formData.passwordConfirm) {
//       setError('Les nouveaux mots de passe ne correspondent pas');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/update-password', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Assurez-vous d'avoir le token
//         },
//         body: JSON.stringify({
//           currentPassword: formData.currentPassword,
//           newPassword: formData.newPassword,
//         })
//       });
      
//       const data = await response.json();
      
//       if (data.status === 'success') {
//         setMessage('Votre mot de passe a été mis à jour avec succès');
//         setFormData({
//           currentPassword: '',
//           newPassword: '',
//           passwordConfirm: ''
//         });
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       setError('Une erreur est survenue. Veuillez réessayer.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container>
//       <Title>Modification du mot de passe</Title>
//       <Form onSubmit={handleSubmit}>
//         <Input
//           type="password"
//           value={formData.currentPassword}
//           onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
//           placeholder="Mot de passe actuel"
//           required
//         />
//         <Input
//           type="password"
//           value={formData.newPassword}
//           onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
//           placeholder="Nouveau mot de passe"
//           required
//         />
//         <Input
//           type="password"
//           value={formData.passwordConfirm}
//           onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
//           placeholder="Confirmez le nouveau mot de passe"
//           required
//         />
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? 'Modification...' : 'Modifier'}
//         </Button>
//         {error && <ErrorMessage>{error}</ErrorMessage>}
//         {message && <SuccessMessage>{message}</SuccessMessage>}
//       </Form>
//     </Container>
//   );
// };
