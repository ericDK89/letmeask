import cx from "classnames";
import "../styles/questions.scss";

interface QuestionsProps {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: React.ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Questions({
  content,
  author,
  children,
  isAnswered = false,
  isHighlighted = false,
}: QuestionsProps) {
  return (
    <div
      className={cx(
        "question",
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="question-user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div className="question-children"> {children} </div>
      </footer>
    </div>
  );
}
