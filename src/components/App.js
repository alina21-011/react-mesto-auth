import '../index.css';
import React from "react";
import Header from './Header'
import Footer from './Footer'
import Main from './Main'

import ImagePopup from './ImagePopup'
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { AppContext } from "../contexts/AppContext";
import api from "../utils/Api";
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import {  Routes, Route, Navigate, useNavigate  } from 'react-router-dom'
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import * as auth from "../utils/auth.js";
import InfoTooltip from './InfoTooltip'


function App() {
  const [cards, setCards] = React.useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [selectedCard, setSelectedCard] = React.useState(null);
  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard;
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRegister, setRegister] = React.useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const navigate = useNavigate();


  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) setToken(jwt);
    api.getCards()
      .then((card) => {
        setCards(card);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      });
  }, []);

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) setToken(jwt);
    api
      .getUserData()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      });
  }, []);

  


  React.useEffect(() => {
    function closeByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isOpen) { 
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen]) 
 


  function onSignOut() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setEmail("");
    navigate("/sign-in", { replace: true });
  }

 

  const handleTokenCheck = () => {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      auth
        .getUser(jwt)
        .then((res) => {
          setEmail(res.data.email);
          setLoggedIn(true);
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
 
  React.useEffect(() => {
    handleTokenCheck();
  }, [token]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => c._id === card._id ? newCard : c)
        );
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      });
  }


  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard);
    console.log(selectedCard)
  }



  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setInfoTooltipPopupOpen(false);

  }

  function handleInfoTooltipClick() {
    setInfoTooltipPopupOpen(true);
  }



  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));

      })

      .catch((err) => {
        console.log(`Ошибка ${err}`);

      })
      .finally(() => {
        setIsLoading(false);
      });
  }




  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .setUserData(data.name, data.about)
      .then((serverData) => {
        setCurrentUser(serverData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api
      .editUserAvatar(data.avatar)
      .then((serverData) => {
        setCurrentUser(serverData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api
      .addNewCard(card.name, card.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  function registerUser({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        if (res.data) {
          setRegister({
            status: true,
            message: "Вы успешно зарегистрировались!",
          });
          navigate("/sign-in", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
        setRegister({
          status: false,
          message: "Что-то пошло не так! Попробуйте еще раз.",
        });
      });
  }

  function onLogin({ email, password }) {
    auth
      .authorization(email, password)
      .then((token) => {
        localStorage.setItem("token", token);
        setToken(token);
      })
      .catch((err) => console.log(err));
  }

  return (
    <AppContext.Provider value={{ closeAllPopups }}>
    <CurrentUserContext.Provider value={currentUser}>
    <div className="page">
     
        <Header userEmail={email} deleteToken={onSignOut} />
   
      <Routes>
      <Route
              path="*"
              element={
                isLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <Navigate to="/sign-in" replace />
                )
              }
            />
        <Route  path="/sign-up" element={ <Register
                  onRegister={registerUser}
                  onInfoTooltipClick={handleInfoTooltipClick}
                />}
          />
        <Route path="/sign-in" element={<Login  onLogin={onLogin}  />}  />
        <Route
              path="/"
              element={
                <ProtectedRoute
               
                  element={Main}
                  loggedIn={isLoggedIn}
                  cards={cards}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              }
            />
      </Routes>

     
        <Footer />

        <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
            isRegister={isRegister}
          />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onUpdateUser={handleUpdateUser}
          buttonText={isLoading ? "Сохранение..." : "Сохранить"}
        />


        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
          buttonText={isLoading ? "Сохранение..." : "Сохранить"}


        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onUpdateAvatar={handleUpdateAvatar}
          buttonText={isLoading ? "Сохранение..." : "Сохранить"}
        />

        <ImagePopup
          popup={'photo'}
          card={selectedCard}
        />
        </div>
      </CurrentUserContext.Provider>
      </AppContext.Provider>
 
    
  );
}

export default App;
