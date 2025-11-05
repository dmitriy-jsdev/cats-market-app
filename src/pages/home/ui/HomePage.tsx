import { Link } from "react-router-dom";
import { FC } from "react";
import { Button, Typography, Flex } from "antd";
import styled from "styled-components";

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
