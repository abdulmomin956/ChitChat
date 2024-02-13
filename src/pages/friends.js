import { returnUsername, verifyJWT } from "@/utils/verifyJWT";
import dbConnect, { UserModel } from "../../db";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/router";

export default function FriendsPage({ users, auth }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter()
    const socket = useRef()
    useEffect(() => {
        setIsHydrated(true)
        if (auth?._id && auth?.username && isHydrated) {
            socket.current = io('/', {
                path: '/api/socket',
                query: `username=${auth.username}&id=${auth._id}`
            })
        }
    }, [auth?._id, auth?.username, isHydrated])



    const sendRequest = async (id) => {
        socket?.current?.emit('sendrequest', { myId: auth._id, otherId: id })
    }

    const acceptRequest = (id) => {
        socket?.current?.emit('acceptrequest', { myId: auth._id, otherId: id })
    }

    // console.log(auth.friends.map(f => f.type === "ask" && f.id));
    return (
        <section className="w-75">
            <h1 className="text-center">Friends</h1>
            {auth.friends.filter(f => f.type === "friend").length > 0 ?
                <>
                    {auth.friends.map((f, i) => <div key={f.id + i}>
                        <p>{users.find(u => u._id === f.id).name}</p>
                        <button onClick={() => router.push(`/message/${f.id}`)}>message</button>
                    </div>)}
                </> : ""
            }
            {users.filter(u => u._id !== auth._id && auth.friends.map(f => f.type === "req" || f.type === "friend" && f.id).indexOf(u._id) === -1).map(u => <div key={u._id + 'f'}>
                <p>{u.name}</p>
                {auth.friends.map(f => f.type === "ask" && f.id).indexOf(u._id) !== -1 ?
                    <button disabled>Request sent</button> :
                    <button onClick={() => sendRequest(u._id)}>Add Friend</button>
                }
            </div>)}
            {auth.friends.filter(f => f.type === "req").length > 0 ?
                <>
                    <h1 className="mt-5">Requests</h1>
                    {auth.friends.map((f, i) => <div key={f.id + i}>
                        <p>{users.find(u => u._id === f.id).name}</p>
                        <button onClick={() => acceptRequest(f.id)}>Accept</button>
                    </div>)}
                </> : ""
            }
        </section>
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