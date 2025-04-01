import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import { Link } from "react-router";
import "./login.css";
import { auth, signInWithEmailAndPassword } from "../../config/firebase";
const LoginPage = () => {
    // for displaying error on incorrect credentials
    let [errorMessage, setErrorMessage] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Welcome Back!',
        });
    };
    // runs when the form is submitted
    const onFinish = (values) => {
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
    return (_jsx("div", { className: "log-big-box", children: _jsxs("div", { className: "log-main-box", children: [contextHolder, _jsxs(Form, { name: "login", initialValues: { remember: true }, style: { maxWidth: 360 }, onFinish: onFinish, children: [errorMessage && _jsx("p", { style: {
                                color: "rgb(255 91 91)",
                                fontSize: "14px",
                            }, children: "Incorrect email or password" }), _jsx(Form.Item, { name: "email", rules: [
                                { required: true, message: "Please input your Email!" },
                                {
                                    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                    message: "Please input a valid Email!",
                                },
                            ], children: _jsx(Input, { prefix: _jsx(MailOutlined, {}), placeholder: "Email" }) }), _jsx(Form.Item, { name: "password", rules: [{ required: true, message: 'Please input your Password!' }], children: _jsx(Input, { prefix: _jsx(LockOutlined, {}), type: "password", placeholder: "Password" }) }), _jsx(Form.Item, { children: _jsx(Flex, { justify: "space-between", align: "center", children: _jsx(Form.Item, { name: "remember", noStyle: true, children: _jsx(Checkbox, { required: true, children: "Remember me" }) }) }) }), _jsxs(Form.Item, { children: [_jsx(Button, { block: true, type: "primary", htmlType: "submit", children: "Login" }), "or ", _jsx(Link, { to: "/register", children: "Register here!" })] })] })] }) }));
};
export default LoginPage;
