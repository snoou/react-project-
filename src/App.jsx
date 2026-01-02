import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TransactionTable from './components/TransactionTable/TransactionTable';
import Layout from './Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import NotFound from './components/NotFound/NotFound';
import Login from './components/Login/Login'; 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; 
import { TransactionProvider } from './context/TransactionContext';
import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TransactionProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="expenses" element={<TransactionTable />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </TransactionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;