import { getDatabase, onValue, push, ref } from "firebase/database";
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import "../styles/room.scss";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      avatar: string;
      email: string;
      name: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

interface Questions {
  id: string;
  author: {
    avatar: string;
    email: string;
    name: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

type RoomParams = {
  id: string;
};

export function Rooms() {
  const { user } = useAuth();
  const { id } = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState("");
  const db = getDatabase();

  useEffect(() => {
    const roomRef = ref(db, `rooms/${id}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      setTitle(data.title);
      const firebase: FirebaseQuestions = data.questions ?? {};
      const parsedQuestions = Object.entries(firebase).map(([key, value]) => {
        return {
          id: key,
          author: {
            avatar: value.author.avatar,
            email: value.author.email,
            name: value.author.name,
          },
          content: value.content,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
        };
      });
      setQuestions(parsedQuestions);
    });
  }, [id]);

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
      </main>
    </div>
  );
}
