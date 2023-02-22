import { useState } from "react";
import Avatars from "../Avatars/index.jsx";
import {
    generateRandomColor,
    generateRandomName,
} from "../util/helperFunctions.js";
import "./login.scss";

const Login = ({ setChat }) => {
    const [avatar, setAvatar] = useState(""); //Set path to selected avatar
    const [username, setUsername] = useState("");
    const [avatarAnimation, setAvatarAnimation] = useState(false); //Used to trigger avatar animation in Avatar.jsx
    const [selectedAvatar, setSelectedAvatar] = useState(""); //Alt icon name value
    const [random, setRandom] = useState(false);

    const getAvatar = (e) => { //If randomization is not selected, set selected avatar
        if (!random) {
            setAvatar(e.target.src);
            setSelectedAvatar(e.target.alt);
        }
    };

    const getUsername = (e) => { //Store username input
        setUsername(e.target.value);
    };

    const getRandom = (e) => {
        if (e.target.checked) {
            setRandom(true); //Set randomization to true 
            setUsername(""); //And all other data to falsey
            setAvatar("");
            setSelectedAvatar("");
        } else {
            setRandom(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (random) { //If randomization, call the generating functions
            setChat((prevChat) => ({
                ...prevChat,
                member: {
                    ...prevChat.member,
                    username: generateRandomName(),
                    color: generateRandomColor(),
                },
            }));
        } else if (avatar === "") { //Else start avatar animation
                setAvatarAnimation(true);
        } else { //And set inputed values
            setChat((prevChat) => ({
                ...prevChat,
                member: {
                    ...prevChat.member,
                    username: username,
                    avatar: avatar,
                },
            }));
        }
    };

    return (
        <div className="form-container">
            <form className="login-form" onSubmit={handleFormSubmit}>
                <figure>
                    <figcaption id="figcaption1">Customize profile</figcaption>
                    <div className="customizeUser">
                        <label
                            htmlFor="login-input"
                            className={
                                random
                                    ? "login-form__input-label-disabled"
                                    : "login-form__input-label"
                            }
                        >
                            Enter username:
                        </label>
                        <input
                            id="login-input"
                            className={
                                random
                                    ? "login-form__input-disabled"
                                    : "login-form__input"
                            }
                            type="text"
                            pattern="[^' ']+"
                            placeholder="No spaces allowed"
                            maxLength="15"
                            required
                            value={username}
                            onChange={getUsername}
                            disabled={random ? "disabled" : false}
                        />
                        <br />
                        <span
                            className={
                                random
                                    ? "login-form__span login-form__span--disabled"
                                    : "login-form__span"
                            }
                        >
                            Choose your avatar:
                        </span>
                        <Avatars
                            random={random}
                            getAvatar={getAvatar}
                            avatarAnimation={avatarAnimation}
                            selectedAvatar={selectedAvatar}
                        />
                    </div>
                </figure>
                <div className="orDiv">OR</div>
                <figure>
                    <div className="randomizeUser">
                        <figcaption id="figcaption2">
                            Randomize profile
                        </figcaption>
                        <div className="login-form__random-checkbox">
                            <input
                                type="checkbox"
                                id="randomizeUser"
                                onClick={getRandom}
                            />
                            <label
                                htmlFor="randomizeUser"
                                className="checkbox-text"
                            >
                                Generate username & color
                            </label>
                        </div>
                    </div>
                </figure>
                <button id="login-form__submit-button">Start chatting</button>
            </form>
        </div>
    );
};

export default Login;
