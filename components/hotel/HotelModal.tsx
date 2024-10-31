"use client"
import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';

// Types
interface HotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: {
    name?: string;
    address?: string;
    price?: number;
    devise?: 'F XOF' | 'Euro' | 'Dollar';
  } | null;
  onSubmit: (formData: HotelFormData) => void;
}

interface HotelFormData {
  name: string;
  address: string;
  price: number;
  devise: 'F XOF' | 'Euro' | 'Dollar';
  images: File | null;
}
const Container = styled.div`
  position: fixed;
  inset: 0;
  background: white;
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #000;
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const ImageUploadContainer = styled.div`
  margin-top: 0.25rem;
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
`;

const ImageUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const UploadIcon = styled.svg`
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
`;

const UploadLabel = styled.label`
  cursor: pointer;
  color: #3b82f6;
  font-weight: 500;
  
  &:hover {
    color: #2563eb;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4B5563;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  align-self: flex-end;
  
  &:hover {
    background-color: #374151;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// Styled components restent les mêmes...
// ... (tous les styled components précédents)

const HotelModal: React.FC<HotelModalProps> = ({ isOpen, onClose, hotel, onSubmit }) => {
  const [formData, setFormData] = useState<HotelFormData>({
    name: hotel?.name || '',
    address: hotel?.address || '',
    price: hotel?.price || 0,
    devise: hotel?.devise || 'F XOF',
    images: null
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: Number(formData.price)
    };
    onSubmit(submitData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      <Content>
        <Header>
          <BackButton onClick={onClose}>
            <ArrowLeft size={24} />
          </BackButton>
          <Title>{hotel ? 'MODIFIER L\'HÔTEL' : 'CRÉER UN NOUVEAU HÔTEL'}</Title>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Grid>
            <FormGroup>
              <Label>Nom de l'hôtel</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="CAP Marniane"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Adresse</Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Les iles du saloum, Mar Lodj"
                required
              />
            </FormGroup>
          </Grid>

          <Grid>
            <FormGroup>
              <Label>Prix par nuit</Label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="25000"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Devise</Label>
              <Select
                name="devise"
                value={formData.devise}
                onChange={handleInputChange}
                required
              >
                <option value="F XOF">F XOF</option>
                <option value="Euro">Euro (€)</option>
                <option value="Dollar">Dollar ($)</option>
              </Select>
            </FormGroup>
          </Grid>

          <FormGroup>
            <Label>Ajouter une photo</Label>
            <ImageUploadContainer>
              <ImageUploadContent>
                <UploadIcon
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </UploadIcon>
                <UploadLabel>
                  Ajouter une photo
                  <HiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setFormData(prev => ({
                          ...prev,
                          images: files[0]
                        }));
                      }
                    }}
                  />
                </UploadLabel>
              </ImageUploadContent>
            </ImageUploadContainer>
          </FormGroup>

          <ButtonContainer>
            <SubmitButton type="submit">
              {hotel ? 'Modifier' : 'Enregistrer'}
            </SubmitButton>
          </ButtonContainer>
        </Form>
      </Content>
    </Container>
  );
};

export default HotelModal;