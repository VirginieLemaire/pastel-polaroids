import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./features/user";
import { ContestProvider } from "./features/contests";
import { PhotoProvider } from "./features/photos";
import HomePage from "./features/home/HomePage";
import ContestDetailPage from "./features/contests/ContestDetailPage";
import PhotosPage from "./features/photos/PhotosPage";
import DevMenu from "./dev/DevMenu";
import BottomNav from "./shared/ui/components/BottomNav";

const App = () => (
  <UserProvider>
    <ContestProvider>
      <PhotoProvider>
      <BrowserRouter>
        <DevMenu />
        <div className="min-h-dvh flex flex-col pb-[calc(var(--bottom-nav-h)+3px)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contest/:id" element={<ContestDetailPage />} />
            <Route path="/contest/:id/photos" element={<PhotosPage />} />
          </Routes>
        </div>

        <BottomNav />
      </BrowserRouter>
      </PhotoProvider>
    </ContestProvider>
  </UserProvider>
);

export default App;
