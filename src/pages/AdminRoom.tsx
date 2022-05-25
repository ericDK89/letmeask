import { getDatabase, ref, remove, update } from "firebase/database";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import deleteImg from "../assets/images/delete.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Questions } from "../components/Questions";
import { RoomCode } from "../components/RoomCode";
import { useRoom } from "../hooks/useRoom";
import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { id } = useParams<RoomParams>();
  const { questions, title } = useRoom(id);
  const [adminToolsIsTrue, setAdminToolsIsTrue] = useState(false);
  const db = getDatabase();
  const navigate = useNavigate();

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await remove(ref(db, `rooms/${id}/questions/${questionId}`));
    }
  }

  async function handleEndRoom() {
    if (window.confirm("Tem certeza que você deseja encerrar a sala?")) {
      await update(ref(db, `rooms/${id}`), {
        closedAt: new Date(),
      });

      navigate("/");
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    setAdminToolsIsTrue(!adminToolsIsTrue);
    await update(ref(db, `rooms/${id}/questions/${questionId}`), {
      isAnswered: adminToolsIsTrue,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    setAdminToolsIsTrue(!adminToolsIsTrue);
    await update(ref(db, `rooms/${id}/questions/${questionId}`), {
      isHighlighted: adminToolsIsTrue,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask" />
          </Link>
          <div>
            <RoomCode code={id!} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
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
                  type="button"
                  className={`answerButton ${question.isAnswered ? "answeredButton" : ""} 
                  `}
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12.0003"
                      cy="11.9998"
                      r="9.00375"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`highlightButton ${question.isHighlighted ? "highlightedButton" : ""}`}
                  onClick={() => handleHighlightQuestion(question.id)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img
                    src={deleteImg}
                    alt="Excluir pergunta"
                    aria-label="Excluir pergunta"
                  />
                </button>
              </Questions>
            );
          })}
        </div>
      </main>
    </div>
  );
}
