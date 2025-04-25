import { HashRouter } from "react-router-dom";
import Layout from "@/components/layout";
import HomePage from "@/pages/home";
import GitlabPage from "@/pages/gitlab";
import DetectivePage from "@/pages/detective";
import NotesPage from "@/pages/notes";
import DiagramsPage from "@/pages/diagrams";
import SettingsPage from "@/pages/settings";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemedToaster } from "@/components/themed-toaster";

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Layout>
          <ThemedToaster />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gitlab" element={<GitlabPage />} />
            <Route path="/detective" element={<DetectivePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/diagrams" element={<DiagramsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
