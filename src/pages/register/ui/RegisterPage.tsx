import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../../shared/api";
import { Input, Button, Typography, Flex, Form, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Title } = Typography;

const RegisterContainer = styled(Flex)`
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

interface RegisterFormValues {
  username: string;
  fullName: string;
  password: string;
}

export const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<RegisterFormValues>();
  const navigate = useNavigate();

  const handleSubmit = async ({
    username,
    fullName,
    password,
  }: RegisterFormValues) => {
    setLoading(true);

    try {
      const response = await signUp(username.trim(), fullName || "", password);

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error: any) {
      if (!error.response) {
        message.error("Ошибка сети. Проверьте подключение к интернету.");
        return;
      }

      message.error(error.response?.data?.message || "Ошибка регистрации");
      form.setFieldsValue({ password: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer vertical justify="center" align="center">
      <Title level={2}>Регистрация</Title>
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

        <StyledFormItem name="fullName">
          <Input
            prefix={<UserOutlined />}
            placeholder="Полное имя (необязательно)"
            allowClear
          />
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
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </RegisterContainer>
  );
};
