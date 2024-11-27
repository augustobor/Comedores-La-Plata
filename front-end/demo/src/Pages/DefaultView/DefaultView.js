import React, { useState } from 'react';
import "./DefaultView.css";

import POST from '../../Components/POST/POST';
import GET from '../../Components/GET/GET';
import DELETE from '../../Components/DELETE/DELETE';
import Console from '../../Components/Console/Console';

function DefaultView() {
    const [messages, setMessages] = useState([]);

    const handleMessage = (newMessage) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    return (

        <div>
            <h1>Default View</h1>

            <div className='defaultView'>
                
                <div className='defaultViewComponent'>
                    <POST onMessage={handleMessage} />
                </div>

                <div className='defaultViewComponent'>
                    <GET onMessage={handleMessage} />
                </div>

                <div className='defaultViewComponent'>
                    <DELETE onMessage={handleMessage} />
                </div>

            </div>

            <div className='defaultView'>
                <Console messages={messages} />
            </div>

        </div>
    );
}

export default DefaultView;
