import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../api";
import { Spinner } from "../../ui/Spinner/Spinner";

export const PrivateRoute: React.FC = () => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        await getCurrentUser();
        if (!cancelled) {
          setIsAuth(true);
        }
      } catch {
        if (!cancelled) {
          setIsAuth(false);
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  if (checking) {
    return <Spinner />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
