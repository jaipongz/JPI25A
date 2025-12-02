import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import './styles/App.css';

// Component สำหรับตรวจสอบว่าเป็นหน้าไหน
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {/* แสดง Header เฉพาะหน้า Home เท่านั้น */}
      {!isAdminPage && !isLoginPage && <Header />}
      
      <main className={isAdminPage || isLoginPage ? 'full-page' : ''}>
        {children}
      </main>
      
      {/* แสดง Footer เฉพาะหน้า Home เท่านั้น */}
      {!isAdminPage && !isLoginPage && <Footer />}
    </>
  );
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={
                        <LayoutWrapper>
                            <Home />
                        </LayoutWrapper>
                    } />
                    <Route path="/admin" element={
                        <LayoutWrapper>
                            <AdminPanel />
                        </LayoutWrapper>
                    } />
                    <Route path="/login" element={
                        <LayoutWrapper>
                            <Login />
                        </LayoutWrapper>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;