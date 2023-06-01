import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState([]);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  }
  
  const getMessages = async () => {
    const options = {
      method: 'POST',
      url: 'http://localhost:8000/completions',
      data: {
        message: value
      },
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await axios(options);
      const data = response.data;
      console.log(data);
      setMessage(data.choices[0].message);  
    } catch (error) {
      console.error(error);
    }
  }
   
  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats, 
        {
          title: currentTitle,
          role: "user",
          content: value
        },
        {
          title: currentTitle,
          role: message.role, 
          content: message.content
        }]
      ))
    }
  }, [message, value, currentTitle]);

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)));

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p> Made by Tyler</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>Be Awesome GPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value) }/>
            <div id="submit" onClick={getMessages}>👉</div>
          </div>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview. Our goal is to make AI
            systems more natural and safe to interact with. Your feedback will
            help us improve.
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
