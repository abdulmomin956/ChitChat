// pages/index.js
import Image from "next/image";
import WebRTC from "../../WebRTC";
import styles from '../styles/Index.module.css'
import { useRouter } from "next/router";
import dbConnect, { UserModel } from "../../db";
import { returnUsername, verifyJWT } from "@/utils/verifyJWT";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";


const Home = ({ isAuth, auth }) => {
  const socket = useRef()
  const router = useRouter()

  useEffect(() => {
    if (auth?._id && auth?.username) {
      socket.current = io('/', {
        path: '/api/socket',
        transports: ['websocket'],
        query: `username=${auth.username}&id=${auth._id}`
      })
    }
  }, [auth?._id, auth?.username])

  useEffect(() => {
    socket?.current?.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
    });
  }, [])

  // console.log(auth);

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

  // const AuthDiv = <div className="container">
  {/* <div className="row"> */ }


  const AuthDiv = <section className="w-75">
    <h1>Browse the website</h1>
  </section>
  {/* </div> */ }
  {/* </div> */ }
  // console.log(auth);
  return (
    isAuth ? AuthDiv : <div className={styles.cover}>
      <h1 id={styles.h1}>Welcome to our Communication Website</h1>
      <button onClick={() => { router.push('/login') }} id={styles.loginBtn}>Login</button>
    </div>

  );
};

export default Home;

export async function getServerSideProps({ req, res, params, query }) {
  await dbConnect();
  const { token } = await req.cookies;
  const verified = verifyJWT(token);

  if (!verified) {
    return {
      props: {
        isAuth: false
      }
    };
  }

  const username = returnUsername(token)
  const user = await UserModel.findOne({ username }).select({ name: 1, username: 1 })
  const data = await JSON.parse(JSON.stringify(user));
  return {
    props: {
      isAuth: true, auth: data
    },
  }
}
