import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import BookDetails from './pages/BookDetails/BookDetails';
import Layout from './components/Layout/Layout';
import Borrowed from './pages/Borrowed/Borrowed';
import FillUpForm from './components/FillUpForm/FillUpForm';
import Dashboard from './pages/Dashboad/Dashboad';
import UploadBookPage from './components/Upload/UploadBookPage';
import AllGenres from './pages/AllGenres/AllGenres';

function App() {
  return (
    <BrowserRouter>
    < Navbar />
          <main className="flex-grow">
      <Routes>
                <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
                  <Route path="/book/:id" element={<BookDetails />} /> {/* <-- ADD THE NEW ROUTE */}
                  <Route path="/borrowed" element={<Borrowed />} />
                  <Route path="/fill-up-form/:id" element={<FillUpForm />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadBookPage />} />
                  <Route path="/all-genres" element={<AllGenres />} />
                          </Route>
      </Routes>
            </main>
    </BrowserRouter>
  );
}

export default App;

