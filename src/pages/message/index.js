import { useState } from "react"
import { returnUsername, verifyJWT } from "@/utils/verifyJWT";
import dbConnect, { UserModel } from "../../../db";
import Chat from "../../../Components/Chat/Chat";

export default function Message() {
    const [active, setActive] = useState(0)
    const conversions = [
        {
            photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            name: "Megan Leib",
            message: '9 pm at the bar if possible 😳',
            timer: '12 sec',
            online: true
        },
        {
            photo: "https://i.pinimg.com/originals/a9/26/52/a926525d966c9479c18d3b4f8e64b434.jpg",
            name: "Dave Corlew",
            message: "Let's meet for a coffee or something today ?",
            timer: '3 min',
            online: true
        },
        {
            photo: "https://images.unsplash.com/photo-1497551060073-4c5ab6435f12?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=667&q=80",
            name: "Jerome Seiber",
            message: "I&apos;ve sent you the annual report",
            timer: '42 min',
            online: false
        },
        {
            photo: "https://card.thomasdaubenton.com/img/photo.jpg",
            name: "Thomas Dbtn",
            message: 'See you tomorrow ! 🙂',
            timer: '2 hour',
            online: true
        },
        {
            photo: "https://images.unsplash.com/photo-1553514029-1318c9127859?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
            name: "Elsie Amador",
            message: 'What the f**k is going on ?',
            timer: '1 day',
            online: false
        },
        {
            photo: "https://images.unsplash.com/photo-1541747157478-3222166cf342?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80",
            name: "Billy Southard",
            message: 'Ahahah 😂',
            timer: '4 days',
            online: false
        },
        {
            photo: "https://images.unsplash.com/photo-1435348773030-a1d74f568bc2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
            name: "Paul Walker",
            message: "You can&apos;t see me",
            timer: '1 week',
            online: true
        }

    ]
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
                        <div onClick={() => setActive(i)} key={i} className={`discussion ${i === active ? 'message-active' : ''}`}>
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
            {/* <Chat conversions={conversions} active={active}></Chat> */}
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
        redirect: {
            destination: '/message/1',
            permanent: false,
        },
    }
}