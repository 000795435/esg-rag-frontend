import React, { useRef, useState, useEffect } from 'react';
import file_avatar from '../static/pdf_images.png';
import APIs from '../configs/API_URL';
import axios from 'axios';

import person_avatar from '../static/person_avatar.png';
import bot_avatar from '../static/bot_avatar.jpg';

import MessageComponent from '../component/MessageComponent';

export default function PDF() {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showUploadSection, setShowUploadSection] = useState(true);
    const [pdfChatList, setPdfChatList] = useState([]);
    const [PDFurl, setPDFurl] = useState("");
    const [fileId, setFileId] = useState("");
    const messagesEndRef = useRef(null);
    const fileRef = useRef();
    const inputRef = useRef();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [pdfChatList]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleAddFile = (e) => {
        fileRef.current.click();
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            return alert("Please Add PDF file!");
        }

        setIsUploading(true);
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        let data = await axios({ method: 'post', url: APIs.upload_file, data: formData });

        setPDFurl(data.data.file_location);
        setFileId(data.data.file_id);

        setIsUploading(false);
        setShowUploadSection(false);
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

    const getPDFreaderRespond = async (e) => {
        ////////////////////////////
        //Change Here
        ////////////////////////////

        try {
            let input_value = inputRef.current.value;
            inputRef.current.value = "";

            if (input_value === '') {
                return alert("Search text can't be blank!");
            }


            let temp_chatlist = [...pdfChatList];
            temp_chatlist.push({ character: 'You', time: getDate(), avatar: person_avatar, message: handleNextLine(input_value) });
            setPdfChatList(temp_chatlist);

            setIsLoading(true);
            let form_data = new FormData();
            input_value = input_value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
            form_data.append('user_input', input_value);
            form_data.append("file_id", fileId)
            let data = (await axios({ method: 'post', url: APIs.get_pdf_respond, data: form_data })).data.message;
            setIsLoading(false);

            temp_chatlist.push({ character: 'Phi3', time: getDate(), avatar: bot_avatar, message: handleNextLine(data) });
            setPdfChatList([...temp_chatlist]);

        } catch (e) {
            alert("Sorry! Fail to get LLM respond.");
        }





    }

    return (
        <div className='content'>
            <h3>PDF Reader</h3>

            {
                showUploadSection ?
                    <div className='upload-section'>
                        <div className='upload-box' onClick={handleAddFile}>
                            <img className='png-file-icon' src={file_avatar} alt='png_avatar' />
                            <br />
                            <label> {file ? file.name : "Upload Your PDF File Here"}</label>
                            <input type='file' className='files' accept="application/pdf" ref={fileRef} onChange={handleFileChange} disabled={isUploading} />
                        </div>
                        <button className="btn btn-outline-primary btn-upload" type="button" onClick={handleUpload} disabled={isUploading}>
                            Upload File
                            {isUploading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : null}
                        </button>
                    </div>
                    : <></>}


            {!showUploadSection ?
                <div className='display-section'>
                    <div className='display-pdf-section'>
                        <object width="100%" height="100%" data={PDFurl} type="application/pdf">  </object>
                    </div>

                    <div className='pdf-chat-section'>
                        <div className='pdf-chat'>
                            <div className='pdf-chat-history'>
                                {
                                    pdfChatList.map((value, index) => (
                                        <MessageComponent key={index} character={value.character} time={value.time} avatar={value.avatar} message={value.message} />
                                    ))
                                }

                                <div ref={messagesEndRef} />
                                {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : null}
                                <br />
                            </div>
                        </div>
                        <div className='pdf-input-section'>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="Text here..." aria-describedby="basic-addon2" ref={inputRef} onKeyDown={(e) => { if (e.key === 'Enter') { getPDFreaderRespond(); } }} disabled={isLoading} />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-primary" type="button" onClick={getPDFreaderRespond} disabled={isLoading} >Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <></>}
        </div>
    )
}

