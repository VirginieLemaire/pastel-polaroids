import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./features/user";
import { ContestProvider } from "./features/contests";
import HomePage from "./features/home/HomePage";
import ContestDetailPage from "./features/contests/ContestDetailPage";
import DevMenu from "./dev/DevMenu";
import BottomNav from "./shared/ui/components/BottomNav";

const App = () => (
  <UserProvider>
    <ContestProvider>
      <BrowserRouter>
        <DevMenu />
        <div className="min-h-[calc(100dvh-var(--bottom-nav-h))]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contest/:id" element={<ContestDetailPage />} />
          </Routes>
        </div>
        <BottomNav />
      </BrowserRouter>
    </ContestProvider>
  </UserProvider>
);

export default App;
