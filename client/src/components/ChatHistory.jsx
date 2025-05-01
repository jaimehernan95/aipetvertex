const ChatHistory = ({ answers, questions, step, recommendation, isFetching, chatRef }) => (
    <div ref={chatRef} className="chat-box">
      {answers.map((ans, i) => (
        <div key={i} className="chat-message user">
          <div>{questions[i]}</div>
          <strong>{ans}</strong>
        </div>
      ))}
      {!recommendation && !isFetching && (
        <div className="chat-message ai">{questions[step]}</div>
      )}
      {isFetching && <div className="chat-message ai">Analyzing your responses...</div>}
    </div>
  );
  