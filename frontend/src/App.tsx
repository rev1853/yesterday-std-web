import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ToastContainer';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AlbumDetail from './pages/AlbumDetail';
import InvitationPage from './pages/InvitationPage';
import CreateAlbum from './pages/CreateAlbum';
import SubmissionReview from './pages/SubmissionReview';
import ContactPage from './pages/ContactPage';
import AlbumsPage from './pages/AlbumsPage';

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/creator" element={<CreatorDashboard />} />
            <Route path="/creator/create-album" element={<CreateAlbum />} />
            <Route path="/creator/submission/:albumId" element={<SubmissionReview />} />
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/album/:albumId" element={<AlbumDetail />} />
            <Route path="/invitation/:inviteCode" element={<InvitationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}