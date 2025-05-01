import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NoPage from "./pages/NoPage/NotFound";
import { AuthProvider } from "./hooks/AuthContext/AuthContext";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ItemForm from "./pages/ItemForm/ItemForm";
import EditItemForm from "./pages/EditItemForm/EditItemForm";
import ReceivedSwapRequests from "./pages/ReceivedSwapRequests/ReceivedSwapRequests";
import SentSwapRequest from "./components/SentSwapRequest/SentSwapRequest";
import ChatRoom from "./pages/ChatRoom/ChatRoom";
import SwapItemDetail from "./pages/SwapItemDetail/SwapItemDetail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add_item" element={<ItemForm />} />
          <Route path="/edit_item/:id" element={<EditItemForm />} />
          <Route path="/received_request" element={<ReceivedSwapRequests />} />
          <Route path="/sent_request" element={<SentSwapRequest />} />
          <Route path="/chat/:chatId" element={<ChatRoom />} />
          <Route path="/item/:id" element={<SwapItemDetail />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
