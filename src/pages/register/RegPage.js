import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, message } from "antd";
import { Link } from "react-router";
import "./register.css";
import { auth, createUserWithEmailAndPassword, setDoc, doc, db } from "../../config/firebase";
const RegPage = () => {
    // for displaying error due to incorrect credentials
    let [errorMessage, setErrorMessage] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Welcome Aboard!',
        });
    };
    // runs when the form is submitted
    const onFinish = async (values) => {
        createUserWithEmailAndPassword(auth, values.email, values.password)
            .then(async (userCredential) => {
            // Signed up
            const user = userCredential.user;
            // ...
            success();
            console.log("user =======> ", user);
            await setDoc(doc(db, "users", user.uid), {
                full_name: values.full_name,
                email: values.email,
                uid: user.uid
            });
        })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            console.log("error ==========>", error);
            setErrorMessage(true);
        });
    };
    return (_jsx("div", { className: "reg-big-box", children: _jsxs("div", { className: "reg-main-box", children: [contextHolder, _jsxs(Form, { name: "login", initialValues: { remember: true }, style: { maxWidth: 360 }, onFinish: onFinish, children: [errorMessage && _jsx("p", { style: {
                                color: "rgb(255 91 91)",
                                fontSize: "14px",
                            }, children: "Please try another email" }), _jsx(Form.Item, { name: "full_name", rules: [
                                { required: true, message: "Please input your full name!" },
                            ], children: _jsx(Input, { prefix: _jsx(UserOutlined, {}), placeholder: "Full Name" }) }), _jsx(Form.Item, { name: "email", rules: [
                                { required: true, message: "Please input your Email!" },
                                {
                                    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                    message: "Please input a valid Email!",
                                },
                            ], children: _jsx(Input, { prefix: _jsx(MailOutlined, {}), placeholder: "Email" }) }), _jsx(Form.Item, { name: "password", rules: [
                                { required: true, message: "Please input your Password!" },
                                {
                                    min: 6,
                                    message: "Password must be at least 6 characters!",
                                },
                            ], hasFeedback: true, children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "Password" }) }), _jsx(Form.Item, { name: "confirm", dependencies: ["password"], hasFeedback: true, rules: [
                                {
                                    required: true,
                                    message: "Please confirm your password!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("The new password that you entered do not match!"));
                                    },
                                }),
                            ], children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "Confirm Password" }) }), _jsx(Form.Item, { children: _jsx(Flex, { justify: "space-between", align: "center", children: _jsx(Form.Item, { name: "remember", noStyle: true, children: _jsx(Checkbox, { required: true, children: "Remember me" }) }) }) }), _jsxs(Form.Item, { children: [_jsx(Button, { block: true, type: "primary", htmlType: "submit", children: "Register" }), "or ", _jsx(Link, { to: "/", children: "Login here!" })] })] })] }) }));
};
export default RegPage;
