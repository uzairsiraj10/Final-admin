
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";

// Pages
import LanguageSelector from "./pages/LanguageSelector";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import CategoryList from "./pages/CategoryList";
import LabourDetail from "./pages/LabourDetail";
import LabourDashboard from "./pages/LabourDashboard";
import ReferFriend from "./pages/ReferFriend";
import SearchPage from "./components/SearchPage";
import TopRated from "./pages/TopRated";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LanguageSelector />} />
            <Route path="/language" element={<LanguageSelector />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/category/:categoryId" element={<CategoryList />} />
            <Route path="/labour/:id" element={<LabourDetail />} />
            <Route path="/labour-dashboard" element={<LabourDashboard />} />
            <Route path="/refer-friend" element={<ReferFriend />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
