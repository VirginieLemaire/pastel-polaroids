import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./features/user";
import { ContestProvider } from "./features/contests";
import { PhotoProvider } from "./features/photos";
import { VoteProvider } from "./features/votes";
import HomePage from "./features/home/HomePage";
import ContestDetailPage from "./features/contests/ContestDetailPage";
import PhotosPage from "./features/photos/PhotosPage";
import AllResultsPage from "./features/photos/AllResultsPage";
import DemoScenarioPanel from "./features/demo/DemoScenarioPanel";
import BottomNav from "./shared/ui/components/BottomNav";

const App = () => (
  <UserProvider>
    <ContestProvider>
      <PhotoProvider>
        <VoteProvider>
          <BrowserRouter>
            <DemoScenarioPanel />
            <div className="min-h-dvh flex flex-col pb-[calc(var(--bottom-nav-h)+3px)]">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contest/:id" element={<ContestDetailPage />} />
                <Route path="/contest/:id/photos" element={<PhotosPage />} />
                <Route path="/photos" element={<AllResultsPage />} />
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
