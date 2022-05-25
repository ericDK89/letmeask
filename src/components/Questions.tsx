import "../styles/questions.scss";

interface QuestionsProps {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
}

export function Questions({ content, author }: QuestionsProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="question-user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div></div>
      </footer>
    </div>
  );
}
