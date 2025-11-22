import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api, { setAuthToken } from '../lib/api';

type UserRole = 'admin' | 'creator' | 'client' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Album {
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

export interface Photo {
  id: string;
  url: string;
  albumId: string;
  selected?: boolean;
}

export interface Submission {
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
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  albums: Album[];
  addAlbum: (album: NewAlbumInput) => Promise<Album>;
  updateAlbum: (id: string, album: Partial<Album>) => Promise<Album>;
  deleteAlbum: (id: string) => Promise<void>;
  getAlbum: (id: string) => Album | undefined;
  generateInviteLink: (albumId: string) => Promise<string>;
  submissions: Submission[];
  submitSelection: (albumId: string, photoIds: string[]) => Promise<Submission>;
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  uploadPhotos: (albumId: string, files: File[]) => Promise<Photo[]>;
  loading: boolean;
}

export type NewAlbumPhotoInput = { url: string; file?: File };
export type NewAlbumInput = Omit<Album, 'id' | 'photos'> & {
  photos?: NewAlbumPhotoInput[];
  files?: File[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const mapPhoto = (photo: any): Photo => ({
  id: photo.id,
  url: photo.path,
  albumId: photo.album_id,
});

const mapAlbum = (album: any): Album => ({
  id: album.id,
  title: album.title,
  description: album.description ?? '',
  date: album.event_date ?? '',
  coverImage: album.cover_image_url ?? '',
  creatorId: album.creator_id?.toString?.() ?? '',
  creatorName: album.creator?.name ?? '',
  photos: (album.photos ?? []).map(mapPhoto),
  inviteCode: album.invite_code ?? undefined,
  status: (album.status as Album['status']) ?? 'active',
});

const mapSubmission = (submission: any): Submission => ({
  id: submission.id,
  albumId: submission.album_id,
  clientId: submission.client_id?.toString?.() ?? '',
  clientName: submission.client?.name ?? '',
  selectedPhotos: (submission.photos ?? []).map((p: any) => p.id),
  submittedAt: submission.submitted_at ?? '',
  status: submission.status as Submission['status'],
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      await fetchAll(data);
    } catch (error) {
      setAuthToken(undefined);
      setUser(null);
    }
  };

  const fetchAll = async (currentUser: User | null = user) => {
    setLoading(true);
    try {
      const [albumRes, submissionRes] = await Promise.all([
        api.get('/albums'),
        api.get('/submissions'),
      ]);

      setAlbums(albumRes.data.map(mapAlbum));
      setSubmissions(submissionRes.data.map(mapSubmission));

      if (currentUser?.role === 'admin') {
        const { data: usersRes } = await api.get('/users');
        setUsers(usersRes);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { email, password });
    setAuthToken(data.token);
    setUser(data.user);
    await fetchAll(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // ignore
    }
    setAuthToken(undefined);
    setUser(null);
    setAlbums([]);
    setSubmissions([]);
    setUsers([]);
  };

  const uploadPhotos = async (albumId: string, files: File[]) => {
    if (!files.length) return [];

    const formData = new FormData();
    files.forEach(file => formData.append('files[]', file));

    const { data } = await api.post(`/albums/${albumId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.map(mapPhoto) as Photo[];
  };

  const addAlbum = async (album: NewAlbumInput) => {
    const payload = {
      title: album.title,
      description: album.description,
      event_date: album.date,
      cover_image_url: album.coverImage,
      status: album.status,
    };
    const { data } = await api.post('/albums', payload);
    let mapped = mapAlbum(data);

    const remotePhotos = album.photos
      ?.filter(p => !p.file && p.url)
      ?.map(p => ({
        path: p.url,
      }));

    const filesFromPhotos = album.photos?.filter(p => p.file).map(p => p.file as File);
    const allFiles = [...(album.files || []), ...(filesFromPhotos || [])];

    if (remotePhotos?.length) {
      const { data: createdPhotos } = await api.post(`/albums/${mapped.id}/photos`, {
        photos: remotePhotos,
      });
      mapped = { ...mapped, photos: createdPhotos.map(mapPhoto) };
    }

    if (allFiles.length) {
      const uploaded = await uploadPhotos(mapped.id, allFiles);
      mapped = { ...mapped, photos: [...(mapped.photos || []), ...uploaded] };
    }

    if (!mapped.coverImage && mapped.photos[0]) {
      const coverUrl = mapped.photos[0].url;
      const { data: updatedAlbum } = await api.put(`/albums/${mapped.id}`, {
        cover_image_url: coverUrl,
      });
      mapped = mapAlbum(updatedAlbum);
    }

    setAlbums(prev => [...prev, mapped]);
    return mapped;
  };

  const updateAlbum = async (id: string, album: Partial<Album>) => {
    const payload: Record<string, any> = {};
    if (album.title !== undefined) payload.title = album.title;
    if (album.description !== undefined) payload.description = album.description;
    if (album.date !== undefined) payload.event_date = album.date;
    if (album.coverImage !== undefined) payload.cover_image_url = album.coverImage;
    if (album.status !== undefined) payload.status = album.status;

    const { data } = await api.put(`/albums/${id}`, payload);
    const mapped = mapAlbum(data);
    setAlbums(prev => prev.map(a => (a.id === id ? mapped : a)));
    return mapped;
  };

  const deleteAlbum = async (id: string) => {
    await api.delete(`/albums/${id}`);
    setAlbums(prev => prev.filter(a => a.id !== id));
  };

  const getAlbum = (id: string) => {
    return albums.find(album => album.id === id);
  };

  const generateInviteLink = async (albumId: string) => {
    const { data } = await api.post(`/albums/${albumId}/invite`);
    setAlbums(prev =>
      prev.map(a => (a.id === albumId ? { ...a, inviteCode: data.invite_code } : a)),
    );
    return data.invite_code as string;
  };

  const submitSelection = async (albumId: string, photoIds: string[]) => {
    const { data } = await api.post('/submissions', {
      album_id: albumId,
      selected_photos: photoIds,
    });
    const mapped = mapSubmission(data);
    setSubmissions(prev => [...prev, mapped]);
    return mapped;
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    const { data } = await api.put(`/users/${id}`, updates);
    setUsers(prev => prev.map(u => (u.id === id ? data : u)));
    return data;
  };

  const deleteUser = async (id: string) => {
    await api.delete(`/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const refreshData = async () => {
    await fetchAll();
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
        refreshData,
        uploadPhotos,
        loading,
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
