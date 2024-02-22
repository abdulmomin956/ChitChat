import { usePathname } from "next/navigation";
import Chat from "../../../Components/Chat/Chat";
import dbConnect, { UserModel } from "../../../db";
import { returnUsername, verifyJWT } from "@/utils/verifyJWT";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function SinglePersonMsg({ auth, users }) {
    const router = useRouter()
    const { id } = router.query
    const socket = useRef()

    useEffect(() => {
        if (auth?._id && auth?.username) {
            socket.current = io('/', {
                path: '/api/socket',
                query: `username=${auth.username}&id=${auth._id}`
            })
        }
    }, [auth?._id, auth?.username])

    const [conversions, setConversions] = useState([
        {
            id: '1',
            photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            name: "Megan Leib",
            message: '9 pm at the bar if possible 😳',
            timer: '12 sec',
            online: true
        },
        {
            id: '2',
            photo: "https://i.pinimg.com/originals/a9/26/52/a926525d966c9479c18d3b4f8e64b434.jpg",
            name: "Dave Corlew",
            message: "Let's meet for a coffee or something today ?",
            timer: '3 min',
            online: true
        },
        {
            id: '3',
            photo: "https://images.unsplash.com/photo-1497551060073-4c5ab6435f12?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=667&q=80",
            name: "Jerome Seiber",
            message: "I&apos;ve sent you the annual report",
            timer: '42 min',
            online: false
        },
        {
            id: '4',
            photo: "https://card.thomasdaubenton.com/img/photo.jpg",
            name: "Thomas Dbtn",
            message: 'See you tomorrow ! 🙂',
            timer: '2 hour',
            online: true
        },
        {
            id: '5',
            photo: "https://images.unsplash.com/photo-1553514029-1318c9127859?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
            name: "Elsie Amador",
            message: 'What the f**k is going on ?',
            timer: '1 day',
            online: false
        },
        {
            id: '6',
            photo: "https://images.unsplash.com/photo-1541747157478-3222166cf342?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80",
            name: "Billy Southard",
            message: 'Ahahah 😂',
            timer: '4 days',
            online: false
        },
        {
            id: '7',
            photo: "https://images.unsplash.com/photo-1435348773030-a1d74f568bc2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
            name: "Paul Walker",
            message: "You can&apos;t see me",
            timer: '1 week',
            online: true
        }

    ])

    useEffect(() => {
        auth.friends.filter(f => f.type === "friend").map(f =>
            setConversions(prev => [{ id: f.id, name: users.find(u => u._id === f.id).name, message: "new message" }, ...prev])
        )
    }, [auth.friends, users])

    // console.log(conversions, auth);
    return (
        <>
            <section className="discussions">
                <div className="discussion search">
                    <div className="searchbar">
                        <i className="fa fa-search" aria-hidden="true"></i>
                        <input type="text" placeholder="Search..."></input>
                    </div>
                </div>
                {
                    conversions.map((c, i) =>
                        <div onClick={() => router.push(c.id)} key={i} className={`discussion ${i === id[0] ? 'message-active' : ''}`}>
                            <div className="photo" style={{ backgroundImage: "url(" + c.photo + ")" }}>
                                {c.online && <div className="online"></div>}
                            </div>
                            <div className="desc-contact">
                                <p className="name">{c.name}</p>
                                <p className="message">{c.message}</p>
                            </div>
                            <div className="timer">{c.timer}</div>
                        </div>
                    )
                }

            </section>
            {conversions.find(c => c.id === id[0]) && <Chat conversions={conversions} active={id[0]} socket={socket}></Chat>}
        </>
    )
}

export async function getServerSideProps({ req, res, params, query }) {
    await dbConnect();
    const { token } = await req.cookies;
    const verified = verifyJWT(token);

    if (!verified) {
        return {
            redirect: {
                destination: '/login',
                permanent: true,
            },
        };
    }

    const username = returnUsername(token)
    const user = await UserModel.findOne({ username }).select({ name: 1, username: 1, friends: 1 })
    const data = await JSON.parse(JSON.stringify(user));
    const usersRes = await UserModel.find().select({ name: 1, username: 1 })
    const users = await JSON.parse(JSON.stringify(usersRes))
    return {
        props: {
            isAuth: true, auth: data, users
        },
    }
}