import React, { useState, useRef, useEffect } from 'react';
import APIs from '../configs/API_URL';
import axios from 'axios';

import person_avatar from '../static/person_avatar.png';
import bot_avatar from '../static/bot_avatar.jpg';

import MessageComponent from '../component/MessageComponent';

export default function Chatbot() {
    const [chatList, setChatList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatList]);

    const getBotRespond = async (e) => {
        try {
            let input_value = inputRef.current.value;
            inputRef.current.value = "";

            if (input_value === '') {
                return alert("Search text can't be blank!");
            }


            let temp_chatlist = [...chatList];
            temp_chatlist.push({ character: 'You', time: getDate(), avatar: person_avatar, message: handleNextLine(input_value) });
            setChatList(temp_chatlist);

            setIsLoading(true);
            let form_data = new FormData();
            input_value = input_value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
            form_data.append('user_input', input_value);
            let data = (await axios({ method: 'post', url: APIs.get_chatbot_respond, data: form_data })).data.message;
            setIsLoading(false);

            temp_chatlist.push({ character: 'Phi3', time: getDate(), avatar: bot_avatar, message: handleNextLine(data) });
            setChatList([...temp_chatlist]);

        } catch (e) {
            alert("Sorry! Fail to get LLM respond.");
        }
    }

    const handleNextLine = (text) => {
        let output = text.replaceAll("\n", "</br>");
        return output;
    }

    const getDate = () => {
        function addZero(num) {
            if (num < 10)
                return '0' + num;
            return num;
        }

        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        let hh = today.getHours();
        let ms = today.getMinutes();
        let ss = today.getSeconds();


        const formattedToday = yyyy + '/' + addZero(mm) + '/' + addZero(dd) + '\t' + addZero(hh) + ":" + addZero(ms) + ":" + addZero(ss);
        return formattedToday;
    }

    return (
        <div className='content'>
            <h3>LLM Chatbox</h3>
            <div className='chat'>
                <div className='chat-history'>
                    {
                        chatList.map((value, index) => (
                            <MessageComponent key={index} character={value.character} time={value.time} avatar={value.avatar} message={value.message} />
                        ))
                    }

                    <div ref={messagesEndRef} />
                    {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : null}
                    <br />
                </div>
            </div>
            <div className='input-section'>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Text here..." aria-describedby="basic-addon2" ref={inputRef} onKeyDown={(e) => { if (e.key === 'Enter') { getBotRespond(); } }} disabled={isLoading} />
                    <div className="input-group-append">
                        <button className="btn btn-outline-primary" type="button" onClick={getBotRespond} disabled={isLoading} >Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


