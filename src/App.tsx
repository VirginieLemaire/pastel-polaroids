import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContestProvider } from "@/context/ContestContext";
import Index from "./pages/Index";
import CreateContest from "./pages/CreateContest";
import SubmitPhoto from "./pages/SubmitPhoto";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ContestProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateContest />} />
            <Route path="/submit" element={<SubmitPhoto />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ContestProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
