import React from "react";
import AdminPage from "./pages/AdminPage";
import { Route, Routes } from "react-router-dom";
import PriceTable from "./pages/UserPricingPage";
import PriceManager from "./pages/AdminPlanEditor";
import UserTable from "./components/UserTable";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PriceTable />} />
      <Route path="/admin123" element={<AdminPage />}>
        <Route index element={<UserTable />} />
        <Route path="prices" element={<PriceManager />} />
      </Route>
    </Routes>
  );
}
