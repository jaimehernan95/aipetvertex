const InputBox = ({ input, onInputChange, onSend, disabled }) => (
    <div className="input-box">
      <input
        type="text"
        value={input}
        disabled={disabled}
        onChange={e => onInputChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSend()}
        placeholder={disabled ? 'Recommendation complete' : 'Type your answer...'}
      />
      <button onClick={onSend} disabled={disabled}>Send</button>
    </div>
  );
  