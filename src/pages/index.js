// pages/index.js
import Image from "next/image";
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

  // const AuthDiv = <div className="container">
  {/* <div className="row"> */ }


  const AuthDiv = <section className="w-75">
    <h1>Browse the website 0.1.1</h1>
  </section>
  {/* </div> */ }
  {/* </div> */ }
  // console.log(auth);
  return (
    isAuth ? AuthDiv : <div className={styles.cover}>
      <h1 id={styles.h1}>Welcome to our Communication Website 0.1.1</h1>
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
