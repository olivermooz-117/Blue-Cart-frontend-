import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login, register } from "../store/authSlice";
import "../styles/auth.css";