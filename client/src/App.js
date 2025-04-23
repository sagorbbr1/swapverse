import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NotFound";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import ProfilePage from "./pages/ProfilePage";

import ItemForm from "./components/ItemForm/ItemForm";
import EditItemForm from "./components/EditItemForm/EditItemForm";
import ReceivedSwapRequests from "./components/ReceivedSwapRequests/ReceivedSwapRequests";
import SentSwapRequest from "./components/SentSwapRequest/SentSwapRequest";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import SwapItemDetail from "./components/SwapItemDetail/SwapItemDetail";

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
