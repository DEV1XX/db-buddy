import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import UserDatabase from "./pages/UserDatabase";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import HistoryPage from "./pages/HistoryPage";
import PricingPage from "./pages/PricingPage";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar stays on all pages */}
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* Protected Database Page */}
        <Route
          path="/userdatabases/:connectionId"
          element={
            <>
              <SignedIn>
                <UserDatabase />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* Protected History Page */}
        <Route
          path="/history/:connectionId"
          element={
            <>
              <SignedIn>
                <HistoryPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
