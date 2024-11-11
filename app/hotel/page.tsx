"use client"
import React, { useState, useEffect,useCallback  } from 'react';
import { Bell, Menu, LayoutGrid, Hotel, Search, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import HotelModal from '@/components/hotel/HotelModal';


// Mise à jour de l'interface pour correspondre exactement à celle de HotelModal
interface HotelFormData {
  name: string;
  address: string;
  price: number;
  devise: 'F XOF' | 'Euro' | 'Dollar';
  images: File | null;
}

interface Hotel {
  _id: string;
  name: string;
  address: string;
  devise: 'F XOF' | 'Euro' | 'Dollar';
  price: number;
  images: string[];
  contactInfo: string;
  status: 'Active' | 'Closed' | 'Renovating';
  createdAt?: string;
  updatedAt?: string;
}

interface AlertState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

// ... (Sidebar component reste inchangé) ...
const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 min-h-screen fixed left-0 top-0">
      <div className="p-4">
        <div className="flex items-center space-x-2 text-white mb-8">
          <Menu size={24} />
          <span className="font-bold text-lg">RED PRODUCT</span>
        </div>
        
        <div className="text-gray-400 text-sm mb-4">Principal</div>
        
        <div className="space-y-2">
          <Link href="/dashboard">
            <div className="flex items-center space-x-3 text-gray-300 p-3 rounded hover:bg-gray-700">
              <LayoutGrid size={20} />
              <span>Dashboard</span>
            </div>
          </Link>
          
          <Link href="/hotel">
            <div className="flex items-center space-x-3 bg-blue-500 text-white p-3 rounded">
              <Hotel size={20} />
              <span>Liste des hôtels</span>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center space-x-3 text-white">
          <div className="w-10 h-10 bg-gray-600 rounded-full" />
          <div>
            <div className="font-medium">Mouhamet </div>
            <div className="text-sm text-green-400">en ligne</div>
          </div>
        </div>
      </div>
    </div>
  );
}
const Alert: React.FC<{ type: 'success' | 'error'; message: string }> = ({ type, message }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-lg z-50 animate-slideIn
    ${type === 'error' 
      ? 'bg-red-100 border border-red-500 text-red-900'
      : 'bg-green-100 border border-green-500 text-green-900'
    }`}>
    {message}
  </div>
);

const HotelsList = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [alert, setAlert] = useState<AlertState>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  };
  // ... (autres fonctions utilitaires restent inchangées) ...
  const formatPrice = (price: number, devise: string) => {
    return `${price.toLocaleString()} ${devise}`;
  };
  const formatImageUrl = (imagePath: string): string => {
    // Décoder l'URL pour gérer les caractères spéciaux
    try {
      // Remplacer les caractères spéciaux dans le nom du fichier
      const cleanPath = imagePath.replace('tÃ©lÃ©chargement', 'telechargement');
      return `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
    } catch (error) {
      console.error('Erreur lors du formatage de l\'URL de l\'image:', error);
      return '/hotel.jpg'; // Image par défaut en cas d'erreur
    }
  };


  const showAlert = (message: string, type: 'success' | 'error' = 'success'): void => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchHotels  = useCallback(async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/hotels', {
        headers: getAuthHeaders(), // Ajout des headers d'authentification
         credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      showAlert('Erreur lors du chargement des hôtels', 'error');
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleCreateHotel = async (formData: HotelFormData): Promise<void> => {
    try {
      const actualFormData = new FormData();
      
      actualFormData.append('name', formData.name);
      actualFormData.append('address', formData.address);
      actualFormData.append('devise', formData.devise);
      actualFormData.append('price', formData.price.toString());
      if (formData.images) actualFormData.append('images', formData.images);

      // Ajout des valeurs par défaut car elles ne sont pas dans le formulaire
      actualFormData.append('status', 'Active');
      actualFormData.append('contactInfo', '');

    // Récupération des headers d'authentification
    const headers = getAuthHeaders();
    

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/hotels', {
        method: 'POST',
        body: actualFormData,
        headers: headers,
      credentials: 'include' // Ajouter ceci si vous utilisez des cookies
      });

      if (response.ok) {
        showAlert('Hôtel créé avec succès');
        fetchHotels();
        setIsModalOpen(false);
      } else {
        showAlert('Erreur lors de la création de l\'hôtel', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'hôtel:', error);
      showAlert('Erreur lors de la création de l\'hôtel', 'error');
    }
  };

  const handleUpdateHotel = async (formData: HotelFormData): Promise<void> => {
    if (!selectedHotel) return;
    
    try {
      const actualFormData = new FormData();
      
      actualFormData.append('name', formData.name);
      actualFormData.append('address', formData.address);
      actualFormData.append('devise', formData.devise);
      actualFormData.append('price', formData.price.toString());
      if (formData.images) actualFormData.append('images', formData.images);

      // Conserver les valeurs existantes qui ne sont pas dans le formulaire
      actualFormData.append('status', selectedHotel.status);
      actualFormData.append('contactInfo', selectedHotel.contactInfo);

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+`/api/hotels/${selectedHotel._id}`, {
        method: 'PUT',
        body: actualFormData
      });
      
      if (response.ok) {
        showAlert('Hôtel mis à jour avec succès');
        fetchHotels();
        setIsModalOpen(false);
      } else {
        showAlert('Erreur lors de la mise à jour de l\'hôtel', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'hôtel:', error);
      showAlert('Erreur lors de la mise à jour de l\'hôtel', 'error');
    }
  };
  const handleDeleteHotel = async (hotelId: string): Promise<void> => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL+`/api/hotels/${hotelId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(), // Ajout des headers d'authentification
           credentials: 'include'
        });

        if (response.ok) {
          showAlert('Hôtel supprimé avec succès');
          fetchHotels();
        } else {
          
          showAlert('Erreur lors de la suppression de l\'hôtel', 'error');
        }
      } catch (error) {
        console.error('Erreur lors de la création de l\'hôtel:', error);
        showAlert('Erreur lors de la suppression de l\'hôtel', 'error');
      }
    }
  };
  
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>): void => {
    event.currentTarget.src = '/hotel.jpg';
  };




  return (
    <div className="flex">
      <Sidebar />
      <div className="pl-64 w-full">
        {/* ... (reste du JSX inchangé) ... */}
        <div className="bg-white p-4 flex justify-between items-center border-b">
          <div>
            <h1 className="text-gray-500 text-sm">Liste des hôtels</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Rechercher un hôtel..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <Bell className="text-gray-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-white">
                2
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
        </div>

        <div className="flex justify-between items-center p-6 bg-white border-b">
          <div className="flex items-center space-x-2">
            <span>Hôtels</span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {hotels.length}
            </span>
          </div>

          <button 
            onClick={() => {
              setSelectedHotel(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Créer un nouveau hôtel</span>
          </button>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48">
                <img
                    src={hotel.images && hotel.images.length > 0 
                      ? formatImageUrl(hotel.images[0])
                      : '/hotel.jpg'}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Edit size={16} className="text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteHotel(hotel._id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-gray-500 text-sm mb-1">{hotel.address}</div>
                  <h3 className="font-medium text-lg mb-2">{hotel.name}</h3>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      {formatPrice(hotel.price, hotel.devise)}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      hotel.status === 'Active' ? 'bg-green-100 text-green-800' :
                      hotel.status === 'Closed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {hotel.status}
                    </div>
                  </div>
                  {hotel.contactInfo && (
                    <div className="text-sm text-gray-500 mt-2">
                      {hotel.contactInfo}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {alert.show && (
          <Alert type={alert.type} message={alert.message} />
        )}


        
        <HotelModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedHotel(null);
          }}
          hotel={selectedHotel ? {
            name: selectedHotel.name,
            address: selectedHotel.address,
            price: selectedHotel.price,
            devise: selectedHotel.devise
          } : null}
          onSubmit={selectedHotel ? handleUpdateHotel : handleCreateHotel}
        />
      </div>
    </div>
  );
};

export default HotelsList;