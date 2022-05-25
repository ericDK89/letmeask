import { getDatabase, push, ref } from "firebase/database";
import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Questions } from "../components/Questions";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function Rooms() {
  const { user } = useAuth();
  const { id } = useParams<RoomParams>();
  const db = getDatabase();
  const { questions, title } = useRoom(id);
  const [newQuestion, setNewQuestion] = useState("");

  async function handleSendQuestion(e: FormEvent) {
    e.preventDefault();

    if (!user) {
      return toast.error("É preciso estar logado para enviar uma pergunta", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (newQuestion.trim() === "") {
      return toast.warn("A pergunta não pode estar vazio", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    await push(ref(db, `rooms/${id}/questions`), {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      },
      isHighlighted: false,
      isAnswered: false,
    });

    toast.success("Pergunta enviada", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setNewQuestion("");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask" />
          </Link>
          <RoomCode code={id!} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span className="number-of-questions">
              {questions.length} pergunta(s)
            </span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(e) => setNewQuestion(e.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {!user ? (
              <span>
                Para enviar uma perguntar, <button>faça seu login.</button>
              </span>
            ) : (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            )}
            <Button type="submit" disabled={!user}>
              Enviar perguntar
            </Button>
          </div>
        </form>
        <div className="questions-list">
          {questions.map((question) => {
            return (
              <Questions
                key={question.id}
                content={question.content}
                author={question.author}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
