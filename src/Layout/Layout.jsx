import { NavLink, Outlet } from "react-router-dom";
import Logo from "../assets/icon/monlogo.png";
import TextLogo from "../assets/icon/textLogo.png";
import "./Layout.css";

const Layout = () => {
    return (
        <>
            <header className="head-layout">
                <div className="logo-layout">
                    <img src={Logo} alt="logo" />
                    <img src={TextLogo} alt="text logo" />
                </div>
                <div className="title-page-layout">
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
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
};
export default Layout;
