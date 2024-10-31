'use client';


import React, { useState, useEffect } from 'react';
import { Bell, User, Menu, LayoutGrid, Hotel, Mail, MessageSquare, Users, Building, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


interface UserInfo {
  username: string ;
  id: string;
  email: string;
  avatar: string | null;
  role: string;
}
interface SidebarProps {
  user: UserInfo | null;
}
interface MetricCardProps {
  icon: React.ReactNode;
  count: string | number;
  label: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, count, label, color }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center space-x-4">
      <div className={`${color} p-3 rounded-full`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-semibold">{count}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
};

const Sidebar :React.FC<SidebarProps> = ({ user })=> {
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
            <div className="font-medium">{user ? user.username : 'Utilisateur'}</div>
            <div className="text-sm text-green-400">en ligne</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  const metrics = [
    {
      icon: <LayoutGrid className="text-white" size={24} />,
      count: "125",
      label: "Formulaires",
      color: "bg-purple-400"
    },
    {
      icon: <MessageSquare className="text-white" size={24} />,
      count: "40",
      label: "Messages",
      color: "bg-emerald-400"
    },
    {
      icon: <Users className="text-white" size={24} />,
      count: "600",
      label: "Utilisateurs",
      color: "bg-yellow-400"
    },
    {
      icon: <Mail className="text-white" size={24} />,
      count: "25",
      label: "E-mails",
      color: "bg-red-500"
    },
    {
      icon: <Hotel className="text-white" size={24} />,
      count: "40",
      label: "Hôtels",
      color: "bg-purple-600"
    },
    {
      icon: <Building className="text-white" size={24} />,
      count: "02",
      label: "Entités",
      color: "bg-blue-500"
    }
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        router.push('/auth');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token'); // Récupérez le token JWT s'il est stocké localement
  
        const response = await fetch('http://localhost:5000/api/auth/user', {
          method: 'GET',
          credentials: 'include', // Pour les cookies
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), // Ajouter l'en-tête Authorization si le token existe
          },
        });
  
        if (response.ok) {
          const userData = await response.json();

          console.log('Données utilisateur:', userData); // Ajoutez ceci pour voir les données
            // Ici, utilisez 'undefined' ou une autre variable pour afficher un message approprié
        setUser(userData.data.user); // Assurez-vous d'accéder correctement au nom d'utilisateur
   // Vérifiez le nom d'utilisateur après la mise à jour
   console.log('Nom dutilisateur:', userData.data.user.username || 'Nom dutilisateur indisponible'); // Affichez le nom d'utilisateur
        } else {
          console.error('Utilisateur non authentifié ou jeton invalide');

            const errorData = await response.json(); 
          console.error('Erreur:', response.status, errorData);
         

          
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserInfo();
  },[]);
  
  

  return (
    
    <div className="flex">
      <Sidebar user={user} />
      <div className="pl-64 w-full">
        <div className="bg-white p-4 flex justify-between items-center border-b">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Recherche"
                className="pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Bell className="text-gray-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-white">
                2
              </div>
            </div>
             <div className="flex items-center space-x-2">
      {loading ? (
        <div>Chargement...</div>
      ) : user ? (
        <>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <Image 
                src={user.avatar} 
                alt={user.username} 
                width={32} // Ajoutez ces propriétés requises
                height={32} // pour le composant Image de Next.js
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={20} className="text-gray-500" />
            )}
          </div>
          <div className="flex flex-col"> 
          <span className="text-sm font-medium">
  {user.username ? user.username : 'Nom dutilisateur indisponible'}
</span>
            {/* <span className="text-xs text-gray-500">{user.email}</span> */}
          </div>
        </>
      ) : (
        <div className="text-sm text-gray-500">Non connecté</div>
      )}
    </div>

            <button
              onClick={handleLogout}
              className=""
            >
              <LogOut size={18} />
              <span></span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Bienvenue sur RED Product</h2>
            <p className="text-gray-500">Lorem ipsum dolor sit amet consectetur</p>
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;