import {React,useCallback,useEffect,useState} from "react";
import {useSocket} from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from '../service/peer'

const RoomPage = ()=>{

  const socket = useSocket();
  const [remoteSocketId,setRemoteSocketId] = useState(null);
  const [myStream,setMyStream] = useState();


  const handleCallUser = useCallback(async ()=>{
    const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
    const offer = await peer.getOffer();
    socket.emit("user:call",{
      to:remoteSocketId,
      offer
    })
    setMyStream(stream);
  },[remoteSocketId,socket]);

  const handleUserJoin = useCallback(({email,id})=>{
    console.log(`Email:${email} joined the rom with id:${id}`);
    setRemoteSocketId(id);
  },[])

  const handleIncomingCall = useCallback(async ({from,offer})=>{
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio:true,
      video:true

    });
    setMyStream(stream);
    console.log(`Incoming call from ${from} ${offer}`);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted",{
      to:from,
      ans
    })
  },[socket]
  )

  const handleCallAccepted = useCallback(({from,ans})=>{
    peer.setLocalDescription(ans);
    console.log(`Call accepted with answer ${ans}`);
  },[])
  // ),[]
  useEffect(()=>{
    socket.on("user:join",handleUserJoin);
    socket.on("incoming:call",handleIncomingCall);
    socket.on("call:accepted",handleCallAccepted);
    return ()=>{
      socket.off("user:join",handleUserJoin);
      socket.off("incoming:call",handleIncomingCall);
      socket.off("call:accepted",handleCallAccepted);
    }
  },[socket,handleUserJoin,handleIncomingCall,handleCallAccepted]);
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