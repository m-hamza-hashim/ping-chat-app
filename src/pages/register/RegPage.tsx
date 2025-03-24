import React, {useState} from "react";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import { Link } from "react-router";
import "./register.css";
import { auth, createUserWithEmailAndPassword, setDoc, doc, db } from "../../config/firebase";


const RegPage: React.FC = () => {

  let [errorMessage, setErrorMessage] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        // ...
        console.log("user =======> ", user);

        await setDoc(doc(db, "users", user.uid), {
          full_name: values.full_name,
          email: values.email,
          password: values.password,
        });

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log("error ==========>", error);

        setErrorMessage(true)
      });
  };

  return (
    <div className="reg-big-box">
      <div className="reg-main-box">
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
        >
          {errorMessage && <p style={{ 
      color: "rgb(255 91 91)", 
      fontSize: "14px", 
    }}>Please try another email</p>}
          <Form.Item
            name="full_name"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              {
                pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                message: "Please input a valid Email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters!",
              },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" noStyle>
                <Checkbox required>Remember me</Checkbox>
              </Form.Item>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Register
            </Button>
            or <Link to="/">Login here!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegPage;
