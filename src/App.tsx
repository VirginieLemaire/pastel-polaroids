import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./features/user";
import { ContestProvider } from "./features/contests";
import Home from "./pages/Home";
import Contest from "./pages/Contest";
import DevMenu from "./dev/DevMenu";
import BottomNav from "./shared/ui/components/BottomNav";

const App = () => (
  <UserProvider>
    <ContestProvider>
      <BrowserRouter>
        <DevMenu />
        <div className="pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contest/:id" element={<Contest />} />
          </Routes>
        </div>
        <BottomNav />
      </BrowserRouter>
    </ContestProvider>
  </UserProvider>
);

export default App;
