import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PreviewsPage from "./pages/PreviewsPage.jsx";
import ThemeList from "./pages/ThemeList.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/previewpage",
    element: <PreviewsPage />,
  },
  {
    path: "/themelist",
    element: <ThemeList/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
