import { Link, useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { Button, Typography, Flex } from "antd";
import styled from "styled-components";
import { getCurrentUser } from "../../../shared/api";
import { Spinner } from "../../../shared/ui";

const { Title } = Typography;

const HomeContainer = styled(Flex)`
  height: 70vh;
  padding: 24px;
  text-align: center;
`;

const ButtonsContainer = styled(Flex)`
  margin-top: 30px;
`;

export const HomePage: FC = () => (
  <HomePageContent />
);

const HomePageContent: FC = () => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const justLoggedOut = sessionStorage.getItem("just_logged_out") === "1";

    if (justLoggedOut) {
      sessionStorage.removeItem("just_logged_out");
      setIsCheckingAuth(false);
      return () => {
        cancelled = true;
      };
    }

    const checkAuth = async () => {
      let isAuthenticated = false;

      try {
        await getCurrentUser();
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }

      if (cancelled) {
        return;
      }

      if (isAuthenticated) {
        navigate("/products", { replace: true });
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (isCheckingAuth) {
    return <Spinner />;
  }

  return (
    <HomeContainer vertical align="center" justify="center">
      <Title level={1}>Добро пожаловать!</Title>
      <Title level={5}>
        Войдите или создайте аккаунт, чтобы просматривать товары.
      </Title>
      <ButtonsContainer justify="center" gap="middle">
        <Link to="/login">
          <Button type="primary">Вход</Button>
        </Link>
        <Link to="/register">
          <Button>Регистрация</Button>
        </Link>
      </ButtonsContainer>
    </HomeContainer>
  );
};
