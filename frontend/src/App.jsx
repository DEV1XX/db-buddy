import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar stays on all pages */}
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
