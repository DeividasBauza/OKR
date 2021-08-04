import React from "react";
import Button from "../components/Button";
import { useMsal } from "@azure/msal-react";
import "../styles/pages/login-page.scss";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "../redux/reducers/toastCardSlice.js";
import "../styles/pages/login-page.scss";

export default function Login() {
  const { instance } = useMsal();
  const dispatch = useDispatch();

  const handleLogin = () => {
    instance.loginPopup()
    .catch((e) => {
      if (e.errorCode !== "user_cancelled") {
        dispatch(
          enqueueSnackbar({
            message: "Please finish login with already opened prompt",
            options: {
            variant: "error",
            },
        }));
      }
    })
  };

  return (
    <div className="login-page">
      <div className="login-page__title">
        OKR
      </div>
      <div className="login-page__small-description">
        TRACKING SYSTEM
      </div>
      <div className="login-page__description">
      OKR (Objectives and Key Results) is a goal tracking system to create alignment and engagement around measurable goals.
      </div>
        <Button style={{ borderRadius: "30px", width: "200px", fontSize: "20px", backgroundColor: "#ff3454", color: "#fff" }} label="Enter" onClick={handleLogin}></Button>
        <table className="login-page__table">
          <td className="login-page__column">
            <tr className="login-page__header">
              TECH-WIZZ TEAM
            </tr>
            <tr>
              Naglis Kneižys
            </tr>
            <tr>
              Deividas Bauža
            </tr>
            <tr>
              Karolis Trinkūnas
            </tr>
            <tr>
              Ernestas Ščevinskas
            </tr>
            <tr>
              Gustas Gedminas
            </tr>
            <tr>
              Dautartas Valvonis
            </tr>
          </td>
        </table>
    </div>
  );
}