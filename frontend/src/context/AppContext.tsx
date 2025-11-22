import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'creator' | 'client' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface Album {
  id: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  creatorId: string;
  creatorName: string;
  photos: Photo[];
  inviteCode?: string;
  status: 'active' | 'archived' | 'pending';
}

interface Photo {
  id: string;
  url: string;
  albumId: string;
  selected?: boolean;
}

interface Submission {
  id: string;
  albumId: string;
  clientId: string;
  clientName: string;
  selectedPhotos: string[];
  submittedAt: string;
  status: 'pending' | 'downloaded' | 'completed';
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  albums: Album[];
  addAlbum: (album: Omit<Album, 'id'>) => void;
  updateAlbum: (id: string, album: Partial<Album>) => void;
  deleteAlbum: (id: string) => void;
  getAlbum: (id: string) => Album | undefined;
  generateInviteLink: (albumId: string) => string;
  submissions: Submission[];
  submitSelection: (albumId: string, photoIds: string[]) => void;
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: '2', name: 'John Photographer', email: 'john@example.com', role: 'creator' },
    { id: '3', name: 'Jane Client', email: 'jane@example.com', role: 'client' },
  ]);

  const [albums, setAlbums] = useState<Album[]>([
    {
      id: '1',
      title: 'Wedding Day - Arthur & Sadie',
      description: 'Beautiful wedding ceremony',
      date: '29 October 2025',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      creatorId: '2',
      creatorName: 'John Photographer',
      inviteCode: 'WEDDING2025',
      status: 'active',
      photos: [
        { id: 'p1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', albumId: '1' },
        { id: 'p2', url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80', albumId: '1' },
        { id: 'p3', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', albumId: '1' },
        { id: 'p4', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', albumId: '1' },
        { id: 'p5', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80', albumId: '1' },
        { id: 'p6', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80', albumId: '1' },
        { id: 'p7', url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80', albumId: '1' },
        { id: 'p8', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80', albumId: '1' },
      ],
    },
    {
      id: '2',
      title: 'Graduation - Claire',
      description: 'Graduation ceremony memories',
      date: '20/11/2025',
      coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      creatorId: '2',
      creatorName: 'John Photographer',
      inviteCode: 'GRAD2025',
      status: 'active',
      photos: [
        { id: 'p9', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', albumId: '2' },
        { id: 'p10', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', albumId: '2' },
        { id: 'p11', url: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&q=80', albumId: '2' },
        { id: 'p12', url: 'https://images.unsplash.com/photo-1513223564736-60e4e563f82d?w=800&q=80', albumId: '2' },
      ],
    },
    {
      id: '3',
      title: 'Birthday Party - Emma',
      description: 'Sweet 16 celebration',
      date: '15/11/2025',
      coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      creatorId: '2',
      creatorName: 'John Photographer',
      status: 'active',
      photos: [
        { id: 'p13', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', albumId: '3' },
        { id: 'p14', url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80', albumId: '3' },
        { id: 'p15', url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80', albumId: '3' },
      ],
    },
  ]);

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 's1',
      albumId: '1',
      clientId: '3',
      clientName: 'Jane Client',
      selectedPhotos: ['p1', 'p3', 'p5'],
      submittedAt: '2025-11-20T10:30:00Z',
      status: 'pending',
    },
  ]);

  const login = (email: string, password: string, role: UserRole) => {
    const mockUser: User = {
      id: role === 'admin' ? '1' : role === 'creator' ? '2' : '3',
      name: role === 'admin' ? 'Admin User' : role === 'creator' ? 'John Photographer' : 'Jane Client',
      email,
      role,
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const addAlbum = (album: Omit<Album, 'id'>) => {
    const newAlbum: Album = {
      ...album,
      id: `album-${Date.now()}`,
    };
    setAlbums([...albums, newAlbum]);
  };

  const updateAlbum = (id: string, updates: Partial<Album>) => {
    setAlbums(albums.map(album => album.id === id ? { ...album, ...updates } : album));
  };

  const deleteAlbum = (id: string) => {
    setAlbums(albums.filter(album => album.id !== id));
  };

  const getAlbum = (id: string) => {
    return albums.find(album => album.id === id);
  };

  const generateInviteLink = (albumId: string) => {
    const inviteCode = `INVITE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    updateAlbum(albumId, { inviteCode });
    return inviteCode;
  };

  const submitSelection = (albumId: string, photoIds: string[]) => {
    if (!user) return;
    
    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      albumId,
      clientId: user.id,
      clientName: user.name,
      selectedPhotos: photoIds,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setSubmissions([...submissions, newSubmission]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        albums,
        addAlbum,
        updateAlbum,
        deleteAlbum,
        getAlbum,
        generateInviteLink,
        submissions,
        submitSelection,
        users,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
