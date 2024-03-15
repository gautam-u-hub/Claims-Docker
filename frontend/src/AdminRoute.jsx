import React from "react";
import {  Navigate,Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { user } = useSelector((state) => state.user.user);
  return user&&user.role!=='policyHolder' ? (
   <Outlet/>
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoute;
