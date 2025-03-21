import React, {useContext, useEffect} from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import { Link, useNavigate } from "react-router";
import "./login.css"
import { auth, signInWithEmailAndPassword } from "../../config/firebase";
import User from "../../config/context/UserContext";



const LoginPage: React.FC = () => {

    let navigate = useNavigate();

    const {userID, setUser} = useContext(User);

  const onFinish = (values: any) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("user ==> ", user);
      // ...
      setUser(user);
      navigate("/chat");
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error====> ", error);
    });
  };

  return (
    <div className="big-box">
    <div className="main-box">
    <Form
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={onFinish}
    >
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
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
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
                     Login
                   </Button>
                   or <Link to="/register">Register here!</Link>
                 </Form.Item>
    </Form>
    </div>
    </div>
  );
};

export default LoginPage;