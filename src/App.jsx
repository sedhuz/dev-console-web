import { HashRouter } from "react-router-dom";
import Layout from "@/components/layout";
import HomePage from "@/pages/home";
import GitlabPage from "@/pages/gitlab";
import DetectivePage from "@/pages/detective";
import NotesPage from "@/pages/notes";
import SettingsPage from "@/pages/settings";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Toaster
          theme="dark"
          position="bottom-right"
          closeButton
          richColors
          toastOptions={{
            style: {
              color: "var(--foreground)",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gitlab" element={<GitlabPage />} />
          <Route path="/detective" element={<DetectivePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
