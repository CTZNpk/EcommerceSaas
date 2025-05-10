import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { authRoutes } from "./routes/authRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { vendorRoutes } from "./routes/vendorRoutes";
import { userRoutes } from "./routes/userRoutes";
import { productRoutes } from "./routes/productRoutes";
import RoomsPage from "./pages/chat/RoomsPage";
import ChatScreen from "./pages/chat/ChatScreen";

function App() {
  return (
    <Router>
      <Routes>
        {...authRoutes}
        {...adminRoutes}
        {...vendorRoutes}
        {...userRoutes}
        {...productRoutes}
        <Route path="/rooms/" element={<RoomsPage />} />
        <Route path="/chat/:otherUserId" element={<ChatScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
