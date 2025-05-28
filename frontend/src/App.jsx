import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        {/* Protected Route - Begin Dash */}
        <Route path="dash" element={<DashLayout />}>
          {/* index page for dashboard would be welcome page */}
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NotesList/>} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList/>} />
          </Route>
        </Route> {/* End Dash */}
      </Route>
    </Routes>
  )
}

export default App;
