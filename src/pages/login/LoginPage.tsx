import React, { useState} from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import { Link} from "react-router";
import "./login.css"
import { auth, signInWithEmailAndPassword } from "../../config/firebase";



const LoginPage: React.FC = () => {

  // for displaying error on incorrect credentials
    let [errorMessage, setErrorMessage] = useState<boolean>(false);
      const [messageApi, contextHolder] = message.useMessage();
    
      const success = () => {
        messageApi.open({
          type: 'success',
          content: 'Welcome Back!',
        });
      };

    // runs when the form is submitted
  const onFinish = (values: any) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      success();
      console.log("user ==> ", user);
      // ...
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error====> ", error);
      setErrorMessage(true);
    });
  };

    return (
      <div className="log-big-box">
      <div className="log-main-box">
        {contextHolder}
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360 }}
        onFinish={onFinish}
      >

        {errorMessage && <p style={{ 
      color: "rgb(255 91 91)", 
      fontSize: "14px", 
    }}>Incorrect email or password</p>}

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