import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/icon/monlogo.png"; 
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      navigate("/dashboard", { replace: true });
    } else {
      alert("لطفا ایمیل و رمز عبور را وارد کنید");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
            <img src={Logo} alt="Logo" className="login-logo" />
            <h2>جیب‌تو</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label>رمز ورود</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          <button type="submit" className="login-btn">
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;