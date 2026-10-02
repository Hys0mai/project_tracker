import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { ToastProvider } from "./components/Toast";
import DashboardPage from "./pages/DashboardPage";
import ProjectFormPage from "./pages/ProjectFormPage";
import ProjectsPage from "./pages/ProjectsPage";

function NotFound() {
  return (
    <div className="state">
      <h3>Page not found</h3>
      <Link className="btn btn-primary" to="/">
        Go to dashboard
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<ProjectFormPage />} />
            <Route path="projects/:id/edit" element={<ProjectFormPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
