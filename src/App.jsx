import "./App.scss";
import { useEffect, useState } from "react";
import Login from "./Login";
import { CHANNEL_ID } from "./util/channel";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

const App = () => {
    const initChatState = {
        member: {
            username: "",
            color: "",
            avatar: "",
        },
        messages: [],
    };

    const [chat, setChat] = useState(initChatState);
    const [members, setMembers] = useState({ online: [] });
    const [drone, setDrone] = useState(null);

    useEffect(() => {
        if (chat.member.username !== "") {
            const drone = new window.Scaledrone(CHANNEL_ID, { //Instance of scaledrone - establishing a single connection
                data: chat.member //Pass user data
            });
            setDrone(drone);
        }
    }, [chat.member]); //Triggers when member data changes

    //The on() method attaches event handlers for the selected elements and child elements

    useEffect(() => {
        const droneEvent = () => {
            drone.on("open", (error) => { //Event when connection opens
                if (error) {
                    return console.error(error);
                }
                chat.member.id = drone.clientId; //Setting member ID
                roomEvents();
            });
        };

        const roomEvents = () => {
            const room = drone.subscribe("observable-room"); //Subscribing to a room - observable adds functionality for member and messages tracking - each subsribed user receives a message in the chat
            room.on("open", (error) => { //Connected to the room
                if (error) {
                    console.error(error);
                } else {
                    console.log("Connected to the room");
                }
            });
            room.on("members", (m) => { //Triggered once after connecting to the room, emits an array of members who have joined
                setMembers({ online: m });
            });

            room.on("member_join", (newMember) => { //Emitted when a new member joins, newMember object
                setMembers((prevMembers) => ({
                    ...prevMembers,
                    online: [...prevMembers.online, newMember],
                }));
            });

            room.on("member_leave", ({ id }) => { //Emitted when a member leaves, member object - decstructed to id property
                setMembers((prevMembers) => { 
                    const index = prevMembers.online.findIndex( //Find member with that id
                      (member) => member.id === id
                    );
                    return {
                      ...prevMembers,
                      online: [
                        ...prevMembers.online.slice(0, index), //Get array of members up to that index
                        ...prevMembers.online.slice(index + 1) //And after that index
                      ]
                    }; 
                  });
            });

            room.on("message", (message) => { //Data event - when a new message is sent
                setChat((prevChat) => ({
                    ...prevChat,
                    messages: [...prevChat.messages, message],
                }));
            });
        };

        if (drone && !chat.member.id) {
            droneEvent();
        }
    }, [chat, drone, members]);

    const publishMessage = (object) => { //Sends/publishes the message to the chat
        drone.publish(object);
    };


    return (
        <>
            {!chat.member.username ? ( //If username is falsey, load login
                <div>
                    <Login setChat={setChat} /> 
                </div>
            ) : ( //Else load chat
                <div className="chat">
                    <ChatHeader members={members.online} />
                    <Messages
                        messages={chat.messages}
                        thisMember={chat.member}
                    />
                    <MessageInput sendMessage={publishMessage} />
                </div>
            )}
        </>
    );
};

export default App;
