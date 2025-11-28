import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TransactionTable from './components/TransactionTable/TransactionTable';
import Layout from './Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import NotFound from './components/NotFound/NotFound';
import { TransactionProvider } from './context/TransactionContext';

function App() {
  return (
    <BrowserRouter>
      <TransactionProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="expenses" element={<TransactionTable />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </TransactionProvider>
    </BrowserRouter>
  );
}
export default App;
