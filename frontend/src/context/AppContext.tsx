import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
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
  isPublic?: boolean;
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

export interface Testimonial {
  id: string;
  albumId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  albums: Album[];
  addAlbum: (album: NewAlbumInput) => Promise<Album>;
  updateAlbum: (id: string, album: Partial<Album>) => Promise<Album>;
  deleteAlbum: (id: string) => Promise<void>;
  getAlbum: (id: string) => Album | undefined;
  generateInviteLink: (albumId: string) => Promise<string>;
  submissions: Submission[];
  submitSelection: (albumId: string, photoIds: string[]) => Promise<Submission>;
  testimonials: Testimonial[];
  addTestimonial: (albumId: string, rating: number, comment: string) => Promise<Testimonial>;
  updateTestimonial: (id: string, updates: Partial<Pick<Testimonial, 'rating' | 'comment'>>) => Promise<Testimonial>;
  deleteTestimonial: (id: string) => Promise<void>;
  fetchAlbumByInvite: (code: string) => Promise<Album>;
  users: User[];
  addUser: (user: { name: string; email: string; password: string; role: 'admin' | 'creator' | 'client' }) => Promise<User>;
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

const mapPhoto = (photo: any): Photo => {
  const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') ?? 'http://localhost:8000';
  const raw = photo.url ?? photo.path;
  // Prefer server-provided full URL; fallback to constructing if only relative is given.
  const url =
    raw && raw.startsWith('http')
      ? raw
      : raw
        ? `${base}/storage/${raw}`
        : '';

  return {
    id: photo.id,
    url,
    albumId: photo.album_id,
  };
};

const mapUser = (apiUser: any): User => ({
  id: apiUser.id?.toString?.() ?? apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  role: apiUser.role ?? null,
  avatar: apiUser.avatar_url,
});

const mapAlbum = (album: any): Album => {
  const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') ?? 'http://localhost:8000';
  const cover = album.cover_image_url || album.cover_image_full_url;
  const coverImage = cover?.startsWith('http') ? cover : cover ? `${base}/storage/${cover}` : '';

  return {
    id: album.id,
    title: album.title,
    description: album.description ?? '',
    date: album.event_date ?? '',
    coverImage,
    creatorId: album.creator_id?.toString?.() ?? '',
    creatorName: album.creator?.name ?? '',
    photos: (album.photos ?? []).map(mapPhoto),
    inviteCode: album.invite_code ?? undefined,
    status: (album.status as Album['status']) ?? 'active',
    isPublic: Boolean(album.is_public),
  };
};

const mapSubmission = (submission: any): Submission => ({
  id: submission.id,
  albumId: submission.album_id,
  clientId: submission.client_id?.toString?.() ?? '',
  clientName: submission.client?.name ?? '',
  selectedPhotos: (submission.photos ?? []).map((p: any) => p.id),
  submittedAt: submission.submitted_at ?? '',
  status: submission.status as Submission['status'],
});

const mapTestimonial = (testimonial: any): Testimonial => ({
  id: testimonial.id,
  albumId: testimonial.album_id,
  clientId: testimonial.client_id?.toString?.() ?? '',
  clientName: testimonial.client?.name ?? '',
  rating: testimonial.rating,
  comment: testimonial.comment ?? '',
  createdAt: testimonial.created_at ?? new Date().toISOString(),
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchCurrentUser();
    }
  }, []);

  const fetchAll = useCallback(async (currentUser: User | null = user) => {
    setLoading(true);
    try {
      const [albumRes, submissionRes, testimonialRes] = await Promise.all([
        api.get('/albums'),
        api.get('/submissions'),
        api.get('/testimonials'),
      ]);

      setAlbums(albumRes.data.map(mapAlbum));
      setSubmissions(submissionRes.data.map(mapSubmission));
      setTestimonials(testimonialRes.data.map(mapTestimonial));

      if (currentUser?.role === 'admin') {
        const { data: usersRes } = await api.get('/users');
        setUsers(usersRes.map(mapUser));
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      const mappedUser = mapUser(data);
      setUser(mappedUser);
      await fetchAll(mappedUser);
    } catch (error) {
      setAuthToken(undefined);
      setUser(null);
    }
  }, [fetchAll]);

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { email, password });
    setAuthToken(data.token);
    const mappedUser = mapUser(data.user);
    setUser(mappedUser);
    await fetchAll(mappedUser);
    return mappedUser;
  };

  const signUp = async (name: string, email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/register', { name, email, password, role: 'client' });
    setAuthToken(data.token);
    const mappedUser = mapUser(data.user);
    setUser(mappedUser);
    await fetchAll(mappedUser);
    return mappedUser;
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
    setTestimonials([]);
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
      is_public: album.isPublic ?? false,
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
    if (album.isPublic !== undefined) payload.is_public = album.isPublic;

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

  const fetchAlbumByInvite = useCallback(async (code: string) => {
    const { data } = await api.get(`/albums/code/${code}`);
    const mapped = mapAlbum(data);
    setAlbums(prev => {
      const exists = prev.some(a => a.id === mapped.id);
      return exists ? prev.map(a => (a.id === mapped.id ? mapped : a)) : [...prev, mapped];
    });
    return mapped;
  }, []);

  const submitSelection = async (albumId: string, photoIds: string[]) => {
    const existing = submissions.find(
      s => s.albumId === albumId && s.clientId === user?.id
    );

    if (existing) {
      const { data } = await api.put(`/submissions/${existing.id}`, {
        selected_photos: photoIds,
      });
      const mapped = mapSubmission(data);
      setSubmissions(prev => prev.map(s => (s.id === existing.id ? mapped : s)));
      return mapped;
    } else {
      const { data } = await api.post('/submissions', {
        album_id: albumId,
        selected_photos: photoIds,
      });
      const mapped = mapSubmission(data);
      setSubmissions(prev => [...prev, mapped]);
      return mapped;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    const { data } = await api.put(`/users/${id}`, updates);
    setUsers(prev => prev.map(u => (u.id === id ? data : u)));
    return data;
  };

  const addUser = async (userInput: { name: string; email: string; password: string; role: 'admin' | 'creator' | 'client' }) => {
    const { data } = await api.post('/users', userInput);
    const mapped = mapUser(data);
    setUsers(prev => [...prev, mapped]);
    return mapped;
  };

  const deleteUser = async (id: string) => {
    await api.delete(`/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addTestimonial = async (albumId: string, rating: number, comment: string) => {
    const { data } = await api.post(`/albums/${albumId}/testimonials`, {
      rating,
      comment,
    });
    const mapped = mapTestimonial(data);
    setTestimonials(prev => {
      const filtered = prev.filter(
        t => !(t.albumId === mapped.albumId && t.clientId === mapped.clientId)
      );
      return [...filtered, mapped];
    });
    return mapped;
  };

  const updateTestimonial = async (
    id: string,
    updates: Partial<Pick<Testimonial, 'rating' | 'comment'>>
  ) => {
    const { data } = await api.put(`/testimonials/${id}`, updates);
    const mapped = mapTestimonial(data);
    setTestimonials(prev => prev.map(t => (t.id === id ? mapped : t)));
    return mapped;
  };

  const deleteTestimonial = async (id: string) => {
    await api.delete(`/testimonials/${id}`);
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const refreshData = useCallback(async () => {
    await fetchAll();
  }, [fetchAll]);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        signUp,
        logout,
        albums,
        addAlbum,
        updateAlbum,
        deleteAlbum,
        getAlbum,
        generateInviteLink,
        fetchAlbumByInvite,
        submissions,
        submitSelection,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        users,
        addUser,
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
