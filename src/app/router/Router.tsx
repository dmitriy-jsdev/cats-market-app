import { FC } from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../../pages/home";
import { LoginPage } from "../../pages/login";
import { RegisterPage } from "../../pages/register";
import { ProductsPage } from "../../pages/products";
import { PrivateRoute } from "../../shared/lib";

export const Router: FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/products" element={<PrivateRoute />}>
      <Route index element={<ProductsPage />} />
    </Route>
  </Routes>
);