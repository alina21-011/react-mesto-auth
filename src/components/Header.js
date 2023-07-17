import logo from '../images/Vector.svg';
import { BrowserRouter,Route, Routes } from "react-router-dom";
import { NavLink } from "react-router-dom";
function Header({userEmail}) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип"></img>
      <div className="header__info">
          <p className="header__text">{userEmail}</p>

          <Routes>
            <Route
              path="/"
              element={
                <NavLink
                  className="header__text header__link"
                  to="/sign-in"

                >
                  Выйти
                </NavLink>
              }
            />
            <Route
              path="/sign-up"
              element={
                <NavLink
                  className="header__text header__link"
                  to="/sign-in"
                >
                  Войти
                </NavLink>
              }
            />
            <Route
              path="/sign-in"
              element={
                <NavLink
                  className="header__text header__link"
                  to="/sign-up"
                >
                  Регистрация
                </NavLink>
              }
            />
          </Routes>
         
        </div>
    </header>
  );
}

export default Header;
