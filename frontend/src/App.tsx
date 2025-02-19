import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignupForm } from "./pages/SignUpForm";
import { LoginForm } from "./pages/LoginForm";
import { EmailVerificationSent } from "./pages/EmailVerificationSent";
import { ProfileCreationForm } from "./pages/ProfileCreationForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/verification" element={<EmailVerificationSent />} />
        <Route path="/profile-creation" element={<ProfileCreationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
