import React from "react";
import io from "socket.io-client";
import { useEffect } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

import icon from "../images/emoji.svg";
import styles from "../styles/Chat.module.css";
import Messages from "./Messages";

const socket = io.connect("https://messenger-326s.onrender.com"); // подключение сокета к серверу

const Chat = () => {
  const { search } = useLocation(); // Получение параметров URL в виде строки
  const navigate = useNavigate(); //использование навигатора по URL приложения

  const [params, setParams] = useState({ room: "", name: "" });
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search)); // преобразование параметров URL из строки в объект, через извлечение в URLSearchParams
    setParams(searchParams);
    socket.emit("join", searchParams); // отправка параметров URL по сокету на сервер с событием "присоединение" (join)
  }, [search]);

  useEffect(() => {
    socket.on("message", ({ data }) => { // при получении события "сообщение" с сервера
      setMessages((messages) => [...messages, data]); // добавляем в список сообщений пришедшее сообщение
    });
  }, []);

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      setUsers(users.length);
    });
  }, []);

  const leftRoom = () => {
    socket.emit("leftRoom", { params });
    navigate("/"); // перемещение на страницу входа
  };

  const handleChange = (e) => setMessage(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message) return;

    socket.emit("sendMessage", { message, params });

    setMessage("");
  };

  const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>{params.room}</div>
        <div className={styles.users}>{users} пользователь в чате. <br />Вы: {params.name}</div>
        <button className={styles.left} onClick={leftRoom}>
          Выйти
        </button>
      </div>

      <div className={styles.messages}>
        <Messages messages={messages} name={params.name} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            placeholder="Напишите тут..."
            value={message}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.emoji}>
          <img src={icon} alt="" onClick={() => setOpen(!isOpen)} />

          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <div className={styles.button}>
          <input type="submit" onSubmit={handleSubmit} value="Отправить" />
        </div>
      </form>
    </div>
  );
};

export default Chat;
