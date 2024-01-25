
import { useContext } from "react"
import { SignInContext } from "../../ContextComponents/SignInContext"
import {  Route,useNavigate } from "react-router-dom";
import SignUp from "./SignUp";

const ProtectRoute = ({element,path}) => {
    const negative=useNavigate()
    const {isLoggin,StorageEmail,StoragePassword}=useContext(SignInContext)
    if(isLoggin&& StorageEmail&& StoragePassword){
        <Route path={path} element={element}/>
    }else{
        negative('signup')
        window.alert('請先註冊會員並登入!!')
    }
}

export default ProtectRoute

