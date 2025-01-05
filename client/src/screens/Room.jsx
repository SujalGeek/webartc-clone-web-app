import {React,useCallback,useEffect,useState} from "react";
import {useSocket} from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from '../service/peer'

const RoomPage = ()=>{

  const socket = useSocket();
  const [remoteSocketId,setRempteSocketId] = useState(null);
  const [myStream,setMyStream] = useState(null);
  const handleCallUser = useCallback(async ()=>{
    const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
    const offer = await peer.getOffer();
    socket.emit("user:call",{
      to:remoteSocketId,
      offer
    })
    setMyStream(stream);
  },[])
  const handleUserJoin = useCallback(({email,id})=>{
    console.log(`Email:${email} joined the rom with id:${id}`);
    setRempteSocketId(id);
  },[])

  const handleIncomingCall = useCallback(()=>{},[]
  )
  // ),[]
  useEffect(()=>{
    socket.on("user:join",handleUserJoin);
    socket.on("incoming:call",handleIncomingCall);
    return ()=>{
      socket.off("user:join",handleUserJoin);
      socket.off("incoming:call",handleIncomingCall);
    }
  },[socket,handleUserJoin,handleIncomingCall]);
  return (

    <div>
            <h1>Room Page</h1>
            <h4>{remoteSocketId ? 'Connected' : 'No one in room'}</h4>
           {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
           <>
           <h1>My Stream</h1>
           {
            myStream && <ReactPlayer  playing muted height="100px" width="200px" url={myStream}></ReactPlayer>
           }
        </>
        </div>
    );
  }
    
    
    
    export default RoomPage;