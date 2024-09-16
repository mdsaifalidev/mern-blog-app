import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Protected from "./components/Protected";
import ProtectedAdmin from "./components/ProtectedAdmin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateBlog from "./pages/blog/CreateBlog";
import MyBlog from "./pages/blog/MyBlog";
import AdminDashboard from "./pages/admin/AdminDashboard";
const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-blogs" element={<MyBlog />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
