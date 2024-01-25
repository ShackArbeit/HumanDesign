import { useContext } from "react";
import { SignInContext } from "../../ContextComponents/SignInContext";
import { Route, Navigate, useNavigate } from "react-router-dom";

const ProtectRoute = ({ element, path }) => {
  const negative = useNavigate();
  const { isLoggin, StorageEmail, StoragePassword } = useContext(SignInContext);

  if (isLoggin && StorageEmail && StoragePassword) {
    return <Route path={path} element={element} />;
  } else {
    negative('signup');
    window.alert('請先註冊會員並登入!!');
    // 如果使用者未登入，你可能想要導向登入頁面，或者使用 Navigate 來導向其他地方
    return <Navigate to="/signin" />;
  }
};

export default ProtectRoute;
