
import { createContext, useContext, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FireBasePhoneVerifcationContext = createContext()

const firebaseConfig = {
  apiKey: "AIzaSyBCwxoi440vbHizgKyflw_inFKTC-OHPOA",
  authDomain: "workaflow-d2bf6.firebaseapp.com",
  projectId: "workaflow-d2bf6",
  storageBucket: "workaflow-d2bf6.firebasestorage.app",
  messagingSenderId: "830161939039",
  appId: "1:830161939039:web:1bd13193e7bc86bddf09ea",
  measurementId: "G-BXG7LBBVWL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth  = getAuth(app)


export  const FireBasePhoneVerificationProvider =({children})=>{

  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);


const setupRecaptcha = async() => {
  const recaptchaContainer = document.getElementById("recaptcha-container");
    if(!recaptchaContainer) {
   console.error("Recaptcha container not found");
   return false;
   }

  if (!window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("Recaptcha resolved");
          }
        },
        auth
      );
      await window.recaptchaVerifier.render();
    } catch (error) {
      toast.error("Recaptcha setup failed: " + error.message);
      console.log(error)
    }
  }
};

  const handleSendOtp = async (userPhone) => {
    setOtpLoading(true);
   const recaptchaSetup = await setupRecaptcha();
   if (!recaptchaSetup) {
    setOtpLoading(false);
    return;
  }
    const phone = userPhone.startsWith('+') ? userPhone : '+233' + userPhone;
    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      window.confirmationResult = confirmation;
      toast.success("OTP sent successfully!");
      setOtpStep(true);
    } catch (error) {
      toast.error(error.message);
      console.log(error)
    }
    setOtpLoading(false);
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      toast.success("Phone verified successfully!");
      setOtpStep(false);
    } catch (error) {
      toast.error("Incorrect OTP. Try again.");
    }
    setOtpLoading(false);
  };


return <FireBasePhoneVerifcationContext.Provider value={{otpStep,otpLoading,otp,setOtp,handleSendOtp,handleVerifyOtp,}}>
  {children}
</FireBasePhoneVerifcationContext.Provider>

}

export const usePhoneVerificationContext = ()=>useContext(FireBasePhoneVerifcationContext)