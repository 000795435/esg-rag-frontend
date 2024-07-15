import React from 'react';

export default function MessageComponent({ character, time, avatar, message }) {
    return (
        <div className="card card-message">
            <div className="card-body">
                <img src={avatar} alt="Avatar" className="avatar" />
                <h5 className="card-title">{character}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{time}</h6>

                <div className='message-section'>
                    <p className="card-text" dangerouslySetInnerHTML={{ __html: message }}></p>
                </div>
            </div>
        </div>
    )
}
