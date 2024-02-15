import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Chat.module.scss";
import Message from "./Message/Message";
import ReactPlayer from "react-player";
import peer from "../../peer";

const Chat = ({ conversions, active, socket }) => {
    const [call, setCall] = useState(false)
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();

    const handleUserJoined = useCallback(({ email, id }) => {
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMyStream(stream);
        const offer = await peer.getOffer();
        socket.current.emit("user:call", { to: active, offer });
    }, [active, socket]);

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            // console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const handleIncommingCall = useCallback(
        async ({ from, offer }) => {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            // console.log(`Incoming Call`, from, offer);
            const ans = await peer.getAnswer(offer);
            socket?.current?.emit("call:accepted", { to: from, ans });
        },
        [socket]
    );

    const handleCallAccepted = useCallback(
        ({ from, ans }) => {
            peer.setLocalDescription(ans);
            // console.log("Call Accepted!");
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
            const ans = await peer.getAnswer(offer);
            socket.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        socket?.current?.on("user:joined", handleUserJoined);
        socket?.current?.on("incomming:call", handleIncommingCall);
        socket?.current?.on("call:accepted", handleCallAccepted);
        socket?.current?.on("peer:nego:needed", handleNegoNeedIncomming);
        socket?.current?.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket.current.off("user:joined", handleUserJoined);
            socket.current.off("incomming:call", handleIncommingCall);
            socket.current.off("call:accepted", handleCallAccepted);
            socket.current.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.current.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);

    return (
        call ?
            <div className="chat">
                <h1>Room Page</h1>
                <h4>{active ? "Connected" : "No one in room"}</h4>
                {myStream && <button onClick={sendStreams}>Send Stream</button>}
                {active && <button onClick={handleCallUser}>CALL</button>}
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
                    <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                        <h1>Remote Stream</h1>
                        <ReactPlayer
                            playing
                            muted={false}
                            height="600px"
                            width="800px"
                            url={remoteStream}
                        />
                    </div>
                )}
            </div>
            : <section className="chat">
                <div className="header-chat">
                    <i className="icon fa fa-user-o" aria-hidden="true"></i>
                    <p className="name">{conversions.find((c, i) => c.id === active).name}</p>
                    <i onClick={() => { setCall(true); console.log(active) }} className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
                </div>
                <div className="messages-chat">
                    <div className="message">
                        <div className="photo" style={{ backgroundImage: "url(" + conversions.find((c, i) => c.id === active).photo + ")" }}>
                            <div className="online"></div>
                        </div>
                        <p className="text"> Hi, how are you ? </p>
                    </div>
                    <div className="message text-only">
                        <p className="text"> What are you doing tonight ? Want to go take a drink ?</p>
                    </div>
                    <p className="time"> 14h58</p>
                    <div className="message text-only">
                        <div className="response">
                            <p className="text"> Hey Megan ! It&apos;s been a while 😃</p>
                        </div>
                    </div>
                    <div className="message text-only">
                        <div className="response">
                            <p className="text"> When can we meet ?</p>
                        </div>
                    </div>
                    <p className="response-time time"> 15h04</p>
                    <div className="message">
                        <div className="photo" style={{ backgroundImage: "url(" + conversions.find((c, i) => c.id === active).photo + ")" }}>
                            <div className="online"></div>
                        </div>
                        <p className="text"> 9 pm at the bar if possible 😳</p>
                    </div>
                    <p className="time"> 15h09</p>
                </div>
                <div className="footer-chat">
                    <i className="icon fa fa-smile-o clickable" style={{ fontSize: "25pt" }} aria-hidden="true"></i>
                    <input type="text" className="write-message" placeholder="Type your message here"></input>
                    <i className="icon send fa fa-paper-plane-o clickable" aria-hidden="true"></i>
                </div>
            </section>
    );
};

export default Chat;