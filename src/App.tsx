import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Correct import
import VacancyPage from "./pages/VacancyPage";

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/vacancy" element={<VacancyPage />} />
      <Route path="/" element={<div>Home Page</div>} />
    </Routes>
  );
};

export default App;
