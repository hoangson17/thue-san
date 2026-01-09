import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginWithFacebook } from "../../stores/actions/authActions";

const Facebook = () => {
  const [searchParams] = useSearchParams();
  const accessTokenFromFacebook = searchParams.get("accessToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!accessTokenFromFacebook) return;
    const handleFacebookLogin = async () => {
      try {
        // Gọi action loginWithFacebook
        await dispatch<any>(loginWithFacebook(accessTokenFromFacebook));

        // Nếu thành công, chuyển hướng
        navigate("/");
      } catch (error) {
        console.error("Facebook login failed:", error);
        alert("Đăng nhập Facebook thất bại!");
      }
    };

    handleFacebookLogin();
  }, [accessTokenFromFacebook, dispatch, navigate]);

  return null;
};

export default Facebook;