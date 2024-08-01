"use client";

import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Link from "next/link";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup, 
} from "firebase/auth";
import { auth } from "../../firebase/firebase.js";
import { useRouter } from 'next/navigation';
import { useAuth } from "@firebase/auth.js";
import Loading from "../loading.js";
import "./styles.css";

const Login = () => {
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const { authUser, isLoading } = useAuth();

  // Redirect to home if authenticated
  useEffect(() => {
    if (!isLoading && authUser) {
      router.push('/');
    }
  }, [authUser, isLoading]);

  // Handle input change
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      console.log(user);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle form submission for email/password sign-in
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = values;

    if (!email || !password) {
      return;
    }

    console.log(email, password);

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);

      setValues({
        email: "",
        password: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    isLoading || (!isLoading && authUser) ? (
      <><Loading /></>
    ) : (
      <main className="flex flex-col lg:flex-row lg:h-screen">
        {/* Left side with form */}
        <div className="w-full lg:w-3/5 p-8 md:p-14 flex items-center justify-center">
          <div className="w-full lg:w-4/5 xl:w-3/5">
            <h1 className="text-4xl md:text-6xl font-semibold">Login</h1>
            <p className="mt-6 ml-1">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="underline hover:text-blue-400 cursor-pointer"
              >
                Sign Up
              </Link>
            </p>

            {/* Google sign-in button */}
            <div
              onClick={handleGoogleSignIn}
              className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
            >
              <FcGoogle size={22} />
              <span className="font-medium text-black group-hover:text-white">
                Login with Google
              </span>
            </div>

            {/* Email input */}
            <div className="mt-10 pl-1 flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                required
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
              />
            </div>

            {/* Password input */}
            <div className="mt-10 pl-1 flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                required
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
              />
            </div>

            {/* Sign-in button */}
            <button
              onClick={handleSubmit}
              className="bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90"
            >
              Sign in
            </button>
          </div>
        </div>
      </main>
    )
  );
};

export default Login;
