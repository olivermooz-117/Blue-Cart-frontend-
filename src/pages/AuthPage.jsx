import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login, register } from "../store/authSlice";
import "../styles/auth.css";

export default function AuthPage() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const isSignIn = mode === "signin";
  const isLoading = status === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = isSignIn ? login : register;
    const result = await dispatch(action({ email, password }));
    if (action.fulfilled.match(result)) {
      navigate("/");
    }
  };