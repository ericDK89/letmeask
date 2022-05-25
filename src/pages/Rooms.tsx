import { getDatabase, push, ref, remove } from "firebase/database";
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

  async function handleLikedQuestion(
    questionId: string,
    likedId: string | undefined
  ) {
    if (likedId) {
      await remove(
        ref(db, `rooms/${id}/questions/${questionId}/likes/${likedId}`)
      );
    } else
      await push(ref(db, `rooms/${id}/questions/${questionId}/likes`), {
        authorId: user?.id,
        authorEmail: user?.email,
        authorName: user?.name,
      });
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
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                <button
                  className={`like-button ${question.likeId ? "liked" : ""}`}
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={() =>
                    handleLikedQuestion(question.id, question.likeId)
                  }
                >
                  {question.likeCount > 0 && <span>{question.likeCount}</span>}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Questions>
            );
          })}
        </div>
      </main>
    </div>
  );
}
