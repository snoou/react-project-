import { NavLink, Outlet } from "react-router-dom";
import Logo from "../assets/icon/monlogo.png";
import TextLogo from "../assets/icon/textLogo.png";
import "./Layout.css";
import { useAuth } from "../context/AuthContext"; 

const Layout = () => {
    const { logout } = useAuth();
    return (
        <>
            <header className="head-layout">
                <div className="logo-layout">
                    <img src={Logo} alt="logo" />
                    <img src={TextLogo} alt="text logo" />
                </div>
                
                <div className="title-page-layout" style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `title-head-layout ${isActive ? "click-layout" : ""}`
                        }
                    >
                        داشبورد
                    </NavLink>

                    <NavLink
                        to="/expenses"
                        className={({ isActive }) =>
                            `title-head-layout ${isActive ? "click-layout" : ""}`
                        }
                    >
                        لیست هزینه‌ها
                    </NavLink>

                    <button 
                        onClick={logout} 
                        style={{
                            background: 'transparent',
                            border: '1px solid #EF4E4E',
                            color: '#EF4E4E',
                            padding: '5px 15px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '14px'
                        }}
                    >
                        خروج
                    </button>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
};
export default Layout;