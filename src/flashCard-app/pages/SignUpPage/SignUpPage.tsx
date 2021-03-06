import React from "react";
import Form from "../../components/Form/Form";
import Layout from "../../components/Layout/Layout";
import "./SignUpPage.css";
import { firebaseAuth, firebaseDb } from "../../utils/firebase";

const onClickHandler = (
  formData: {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
  },
  errorHandler: (message: string) => void,
  setIsLogging: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  firebaseAuth
    .createUserWithEmailAndPassword(formData.email, formData.password)
    .then((user) => {
      firebaseAuth.currentUser?.sendEmailVerification();
      const userId = firebaseAuth.currentUser?.uid!;
      firebaseDb.ref(`users/${userId}`).set(
        {
          name: formData.name,
          email: formData.email,
        },
        (err) => {
          if (err) {
            setIsLogging(false);
            errorHandler(err.message);
          } else {
            alert("verification link has been sent your email.");
            window.location.pathname = "/";
            setIsLogging(false);
          }
        },
      );
    })
    .catch((err) => {
      errorHandler(err.message);
    });
};
const SignUpPage = () => {
  return (
    <Layout>
      <Form onClick={onClickHandler} isSignUp={true} />
    </Layout>
  );
};

export default SignUpPage;
