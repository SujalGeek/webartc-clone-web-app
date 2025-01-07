import {React,useCallback,useEffect,useState} from "react";
import {useSocket} from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from '../service/peer'

const RoomPage = ()=>{

  const socket = useSocket();
  const [remoteSocketId,setRemoteSocketId] = useState(null);
  const [myStream,setMyStream] = useState();
  const [remoteStream,setRemoteStream] = useState();

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
const sendStream = useCallback(() =>{
  for(const track of myStream.getTracks())
    {
      peer.peer.addTrack(track,myStream);
    }
},[myStream])
  const handleCallAccepted = useCallback(({from,ans})=>{
    peer.setLocalDescription(ans);
    console.log(`Call accepted with answer ${ans}`);
    sendStream();
  },[sendStream])

  const handleNegoNeeded = useCallback(async() =>{
    const offer = await peer.getOffer();
    socket.emit('peer:nego:needed',{
      offer,
      to:remoteSocketId
    }
  )},[remoteSocketId,socket])

  // ),[]
  useEffect(()=>{
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)
    return () =>{
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
    }
  },[handleNegoNeeded]);
  
  const handleNegoIncoming = useCallback(async ({from,offer})=>{
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done",{
      to:from,
      ans
    })
  },[socket])

  const handleNegoNeedFinal = useCallback(async({ans})=>{
   await peer.setLocalDescription(ans);
  },[])
  useEffect(()=>{
    peer.peer.addEventListener('track',async (ev) =>{
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0])
    })
  })
  useEffect(()=>{
    socket.on("user:join",handleUserJoin);
    socket.on("incoming:call",handleIncomingCall);
    socket.on("call:accepted",handleCallAccepted);
    socket.on("peer:nego:needed",handleNegoIncoming);
    socket.on("peer:nego:final",handleNegoNeedFinal);

    return ()=>{
      socket.off("user:join",handleUserJoin);
      socket.off("incoming:call",handleIncomingCall);
      socket.off("call:accepted",handleCallAccepted);
      socket.off("peer:nego:needed",handleNegoIncoming);
      socket.off("peer:nego:final",handleNegoNeedFinal);
    }
  },[socket,handleUserJoin,handleIncomingCall,handleCallAccepted,handleNegoIncoming,handleNegoNeedFinal]);
  return (

    <div>
            <h1>Room Page</h1>
            <h4>{remoteSocketId ? 'Connected' : 'No one in room'}</h4>
            { myStream && <button onClick={sendStream}>Send Stream</button>}
           {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
          
           {myStream && (
            <>
            <h1>My Stream</h1>
            <ReactPlayer
              playing
              muted
              height="100px"
              width="200px"
              url={myStream}
            />
          </>
        )}
    {remoteStream && (
      <>
        <h1>Remote Stream</h1>
        <ReactPlayer
          playing
          muted
          height="100px"
          width="200px"
          url={remoteStream}
        />
      </>
    )}
  </div>
);
};    
    
    
    export default RoomPage;