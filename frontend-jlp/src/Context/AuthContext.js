import { createContext,useState,useContext } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{
    const [token,setToken] = useState(null)

    const login =(userToken)=>{
        setToken(userToken)
    }

    const logout=()=>{
        setToken(null)
    }

    const isAuthenticated = !!token

    return(
        <AuthContext.Provider value={{login,logout,isAuthenticated}}>
            {children}

        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };

