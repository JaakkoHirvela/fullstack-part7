import { useParams } from "react-router-dom";
import "../style.css";

export const Anecdote = ({ anecdotes }) => {
  const id = useParams().id;
  const anecdote = anecdotes.find((anecdote) => {
    return anecdote.id === Number(id);
  });

  console.log(anecdotes);
  console.log(id);
  console.log(anecdote);
  return (
    <div>
      <h2>{anecdote?.content}</h2>
      <div>has {anecdote?.votes} votes</div>
      <div>
        for more info see <a href={anecdote?.info}>{anecdote?.info}</a>
      </div>
    </div>
  );
};
