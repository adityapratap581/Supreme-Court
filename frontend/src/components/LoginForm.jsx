import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
} from "@material-tailwind/react";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const LoginForm = () => {
  const [open, setOpen] = useState(false); // State for login form
  const [signUp, setSignUp] = useState(false) // State for signup form
  const [formData, setFormData] = useState({ // State for storing email and password
    email: "",
    password: "",
  });
  const [error, setError] = useState({}); // State for stroing error 
  const [loading, setLoading] = useState(false); // State for laoding animation

  const navigate = useNavigate();

  // Function for login form
  const handleLoginForm = () => {
    setOpen(!open);
  };

  // Function for getting the values from input field and setting in state
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // Function for creating the validation for form
  const validateForm = Yup.object({
    email: Yup.string()
      .email("Invalid Email Format")
      .required("Email is required"),
    password: Yup.string().required("Password is Required"),
  });

  // Function for validating and submitting of form
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      await validateForm.validate(formData, { abortEarly: false });
      setError('')
      console.log("Form submitted");
      setLoading(true);
      setTimeout(() => {
        setTimeout(() => {
          navigate("/file_upload");
          setLoading(false);
        }, 2500);
        toast.success("Login Successfull");
        setLoading(false);
      }, 1500);
    } catch (error) {
      const newError = {};

      error.inner.forEach((err) => {
        newError[err.path] = err.message;
      });
      console.log(error);
      setError(newError);
    }
  };

  const openSignUp = () => {
    setSignUp(!signUp)
    setOpen(false)

  }

  // console.log(formData);

  return (
    <section>
      <button
        className="bg-dark-blue text-white px-6 shadow-lg shadow-[#1e1d5c96] py-2 mt-4 rounded-md text-base font-semibold hover:shadow-none hover:cursor-pointer duration-100 "
        onClick={handleLoginForm}
      >
        Get Started
      </button>

      {/* Sign */}
      <Dialog
        open={signUp}
        handler={openSignUp}
        size="sm"
        className="font-inter"
      >
        <Toaster />
        <DialogHeader className="flex-col justify-center font-inter">
          <div className="flex flex-col w-full ">
            <h2 className="mb-3 text-[35px] font-extrabold text-dark-blue text-center font-inter">
              Sign Up
            </h2>
            <hr className="border-[0.6px] w-full" />
          </div>
        </DialogHeader>

        <DialogBody className="-mt-3">
          <div>
            <h2 className="text-[26px] font-bold text-dark-blue ">
              Welcome to JuriAssist
            </h2>
            <p className="text-[17px] font-medium font-inter text-dark-grey">
              Please enter your details to signUp
            </p>
          </div>
          <form className="mt-3" onSubmit={handleOnSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border-[1px] border-gray-500 rounded-md focus:outline-none text-dark-grey"
              value={formData.email}
              name="email"
              onChange={handleOnChange}
            />
            {error.email && (
              <p className="mt-1 mb-3 text-red-400">{error.email}</p>
            )}
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-2 border-[1px] border-gray-500 rounded-md focus:outline-none text-dark-grey ${
                error.password ? "mt-3" : "mt-5"
              }`}
              value={formData.password}
              name="password"
              onChange={handleOnChange}
            />
            {error.password && (
              <p className="mt-1 mb-3 text-red-400">{error.password}</p>
            )}
            {loading ? (
              <Button
                loading={true}
                className={`w-full flex justify-center py-3 text-center font-semibold text-white rounded-md bg-dark-blue mt-3 text-base capitalize tracking-wide`}
              >
                Loading ...
              </Button>
            ) : (
              <button
                type="submit"
                className={`w-full py-2  font-semibold text-white rounded-md bg-dark-blue ${
                  error.password ? "mt-3" : "mt-6"
                }`}
                onClick={handleOnSubmit}
              >
                Signup
              </button>
            )}
           
          </form>
        </DialogBody>
      </Dialog>
      
      {/* Login Form */}
      <Dialog
        open={open}
        handler={handleLoginForm}
        size="sm"
        className="font-inter"
      >
        <Toaster />
        <DialogHeader className="flex-col justify-center font-inter">
          <div className="flex flex-col w-full ">
            <h2 className="mb-3 text-[35px] font-extrabold text-dark-blue text-center font-inter">
              Login
            </h2>
            <hr className="border-[0.6px] w-full" />
          </div>
        </DialogHeader>

        <DialogBody className="-mt-3">
          <div>
            <h2 className="text-[26px] font-bold text-dark-blue ">
              Welcome to JuriAssist
            </h2>
            <p className="text-[17px] font-medium font-inter text-dark-grey">
              Please enter your details to login
            </p>
          </div>
          <form className="mt-3" onSubmit={handleOnSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border-[1px] border-gray-500 rounded-md focus:outline-none text-dark-grey"
              value={formData.email}
              name="email"
              onChange={handleOnChange}
            />
            {error.email && (
              <p className="mt-1 mb-3 text-red-400">{error.email}</p>
            )}
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-2 border-[1px] border-gray-500 rounded-md focus:outline-none text-dark-grey ${
                error.password ? "mt-0" : "mt-5"
              }`}
              value={formData.password}
              name="password"
              onChange={handleOnChange}
            />
            {error.password && (
              <p className="mt-1 mb-3 text-red-400">{error.password}</p>
            )}
            {loading ? (
              <Button
                loading={true}
                className={`w-full flex justify-center py-3 text-center font-semibold text-white rounded-md bg-dark-blue mt-3 text-base capitalize tracking-wide`}
              >
                Loading ...
              </Button>
            ) : (
              <button
                type="submit"
                className={`w-full py-2  font-semibold text-white rounded-md bg-dark-blue ${
                  error.password ? "mt-3" : "mt-6"
                }`}
                onClick={handleOnSubmit}
              >
                Login
              </button>
            )}
             <p className="mt-3 text-center text-dark-blue">Don't have Account <span className="font-semibold hover:underline hover:cursor-pointer underline-offset-2" onClick={openSignUp}>Click here!</span></p>
          </form>
        </DialogBody>
      </Dialog>
    </section>
  );
};

export default LoginForm;
