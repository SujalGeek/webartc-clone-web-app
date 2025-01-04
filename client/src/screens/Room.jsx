import {React,useEffect} from "react";
import {useSocket} from "../context/SocketProvider";

const RoomPage = ()=>{

  const socket = useSocket();
  const handleUserJoin = (({email,id})=>{
    console.log(`Email:${email} joined the rom with id:${id}`);
  },[])
  // ),[]
  useEffect(()=>{
    socket.on("user:join",handleUserJoin);

    return ()=>{
      socket.off("user:join",handleUserJoin);
    }
  },[socket,handleUserJoin]);
  return (

    <div>
            <h1>Room Page</h1>
        </div>
    );
  }
    
    
    
    export default RoomPage;