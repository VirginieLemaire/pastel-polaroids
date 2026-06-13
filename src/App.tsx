import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./features/user";
import { ContestProvider } from "./features/contests";
import { PhotoProvider } from "./features/photos";
import { VoteProvider } from "./features/votes";
import HomePage from "./features/home/HomePage";
import ContestDetailPage from "./features/contests/ContestDetailPage";
import PhotosPage from "./features/photos/PhotosPage";
import ResultsPage from "./features/contests/ResultsPage";
import DevMenu from "./dev/DevMenu";
import BottomNav from "./shared/ui/components/BottomNav";

const App = () => (
  <UserProvider>
    <ContestProvider>
      <PhotoProvider>
        <VoteProvider>
          <BrowserRouter>
            <DevMenu />
            <div className="min-h-dvh flex flex-col pb-[calc(var(--bottom-nav-h)+3px)]">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contest/:id" element={<ContestDetailPage />} />
                <Route path="/contest/:id/photos" element={<PhotosPage />} />
                <Route path="/contest/:id/results" element={<ResultsPage />} />
              </Routes>
            </div>

            <BottomNav />
          </BrowserRouter>
        </VoteProvider>
      </PhotoProvider>
    </ContestProvider>
  </UserProvider>
);

export default App;
