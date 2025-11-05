import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Typography, Flex, Form, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import axios, { AxiosError } from "axios";
import { signIn } from "../../../shared/api";

const { Title } = Typography;

const LoginContainer = styled(Flex)`
  width: 300px;
  height: 80vh;
  margin: 0 auto;
  form {
    width: 100%;
  }
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 15px;
  .ant-form-item-explain {
    margin-top: 5px;
    margin-bottom: 5px;
  }
`;

interface LoginFormValues {
  username: string;
  password: string;
}

interface ApiErrorResponse {
  message?: string;
}

export const LoginPage: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ username, password }: LoginFormValues) => {
    setLoading(true);
    try {
      await signIn(username.trim(), password);
      navigate("/products");
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        message.error("Неизвестная ошибка. Попробуйте позже.");
        return;
      }

      const err = error as AxiosError<ApiErrorResponse>;

      if (!err.response) {
        message.error("Ошибка сети. Проверьте подключение к интернету.");
        return;
      }

      const status = err.response.status;

      if (status === 401) {
        form.setFields([
          { name: "username", errors: [""] },
          {
            name: "password",
            errors: ["Неверное имя пользователя или пароль"],
          },
        ]);
        return;
      }

      if (Math.floor(status / 100) === 5) {
        message.error("Ошибка сервера. Попробуйте позже.");
        return;
      }

      const apiMessage = err.response.data?.message;
      if (apiMessage) {
        message.error(apiMessage);
      } else {
        message.error("Произошла ошибка. Попробуйте еще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer vertical justify="center" align="center">
      <Title level={2}>Вход</Title>
      <Form form={form} onFinish={handleSubmit}>
        <StyledFormItem
          name="username"
          validateTrigger="onSubmit"
          rules={[
            { required: true, message: "Введите имя пользователя" },
            { min: 3, message: "Минимум 3 символа" },
            { max: 30, message: "Максимум 30 символов" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
        </StyledFormItem>

        <StyledFormItem
          name="password"
          validateTrigger="onSubmit"
          rules={[
            { required: true, message: "Введите пароль" },
            { min: 8, message: "Минимум 8 символов" },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
        </StyledFormItem>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </LoginContainer>
  );
};
