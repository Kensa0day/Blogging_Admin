import {useLocation, Navigate, Outlet, Routes, Route} from "react-router-dom";
import StartPage from "./pages/StartPage";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard"
import OTPVerification from "./pages/OTPVerification";
import Analytic from "./pages/Analytics"
import Content from "./pages/Content"
import Followers from "./pages/Followers"
import WritePost from "./pages/WritePost"
import useStore from "./store/index";

function Layout() {
  // const user = {}
  const { user } = useStore((state) => state)

  const location = useLocation();

  return user?.token ? (
  <div className="w-full h-screen">
    <Navbar />
    <div className="w-full h-full flex border-t pt-16">
      <div className="hidden lg:flex">
        {/* SideBar */}
        <Sidebar/>
      </div>

      <div className="w-full flex-1 px-8 py-6 overflow-y-auto">
        <Outlet/>
      </div>

    </div>
  </div>
    )  : (
    <Navigate to="/auth" state={{from: location}} replace/>
)}



function App() {
  return (
    <main className="w-full min-h-screen">
      <Routes>
        <Route element={<Layout/>}>
          <Route index path="/" element={<Navigate to='/dashboard'/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytic />} />
          <Route path="/contents" element={<Content />} />
          <Route path="/followers" element={<Followers />} />
          <Route path="/write/:postId?" element={<WritePost />} />
        </Route>

          <Route path="/auth" element={<StartPage/>} />
          <Route path="/otp-verification" element={<OTPVerification/>} />
      </Routes>
    </main>
  )
}

export default App;
