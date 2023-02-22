import './avatars.scss';

const Avatars = ({ random, getAvatar, avatarAnimation, selectedAvatar }) => {
    const avatars = [];
    for (let i = 1; i <= 6; i++) { //Store all avatar icon paths into const avatars
        const path = `/avatars/avatar${i}.png`;
        avatars.push(path);
    }

    const renderAvatars = (avatar, index) => { //Receives mapped avatar/index
        const image_alt = `avatar${index}`; //Image alt 
        return (
            <li
                className={
                    random
                        ? "avatar avatar__disabled" //If random is true, disable avatars
                        : selectedAvatar === image_alt 
                        ? "avatar avatar__selected" //If selected avatar is equal to alt then add selected class
                        : avatarAnimation 
                        ? "avatar avatar__animation" //If avatarAnimation is true, trigger avatar animation
                        : "avatar"
                }
                key={index}
            >
                <img src={avatar} alt={image_alt} onClick={getAvatar} /> {/*getAvatar func is passed from input*/}
            </li>
        );
    };

    return (
        <ul className="login-form__avatar-list">
            {avatars.map((avatar, index) => renderAvatars(avatar, index))} {/*Map all avatar paths from the const*/}
        </ul>
    );
}

export default Avatars;
