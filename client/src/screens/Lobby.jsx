import React, {useState, useEffect} from "react";
import { useCallback } from "react";
import {useSocket} from "../context/SocketProvider";
import {useNavigate} from "react-router-dom";   

const LobbyScreen = () => {
    const [email,setEmail] = useState("");
    const [room,setRoom] = useState("");
    const socket = useSocket();
    const navigate = useNavigate();


    console.log(socket);
    const handleSubmit = useCallback((e)=>{
        e.preventDefault();
        socket.emit("room:join",{email,room});
    },[email,room,socket]);

    const handleJoinRoom = useCallback((data) => {
        const {email,room} = data;  
        // console.log(email,room);
        navigate(`/room/${room}`);
    })
    useEffect(()=>{
        socket.on("room:join",handleJoinRoom);
        return ()=>{
            socket.off("room:join",handleJoinRoom);
        }

    },[socket, handleJoinRoom]);

    return (
        <div className="lobby-screen">
           <h1>
                Lobby Screen
           </h1>
           {/* <form onSubmit={}> */}
           <form onSubmit={handleSubmit}>
           <label htmlFor="email">Email ID</label>
           <input type="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} ></input>
           <br />
           <label htmlFor="room">Room Number</label>
           <input type="text" id="room" value={room} onChange={(e)=>setRoom(e.target.value)}></input>
              <br />
           <button type="submit">Join Room</button>
           <br/>
           </form>
        </div>
    );
    };
export default LobbyScreen;