import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
// import io from "socket.io-client";
import styles from "../styles/Main.module.css";
// import Chat from "./Chat";

// const socket = io.connect("http://localhost:5006"); 

const Main = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  useEffect(()=>{
    
  })

  const controlClick = async (e)=>{
    const active = Boolean(room && name);
    if (!active) {
      e.preventDefault();
    }
    const user = {
      room: room,
      name: name
    }
    // Chat.socket.emit("lol", "hello");
    // console.log(JSON.stringify(user));
    const response = await fetch("http://localhost:5007", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({room: room, name: name}),
    });
    console.log(response);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Войти в чат</h1>

        <form className={styles.form}>
          <div className={styles.group}>
            <input
              type="text"
              value={name}
              placeholder="Имя пользователя"
              className={styles.input}
              onChange={(e)=>{
                setName(e.target.value);
              }}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.group}>
            <input
              type="text"
              placeholder="Название комнаты"
              value={room}
              className={styles.input}
              onChange={(e)=>{
                setRoom(e.target.value);
              }}
              autoComplete="off"
              required
            />
          </div>

          <Link
            className={styles.group}
            onClick={controlClick}
            to={`/chat?name=${name}&room=${room}`}
          >
            <button type="submit" className={styles.button}>
              Войти
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Main;
