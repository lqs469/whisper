import React, { useEffect, useState } from 'react'

export default function List({ handleJoin }) {
    const [list, setList] = useState([]);

    useEffect(() => {
        window.socket.request('getMyRoomList').then(list => {
            setList(list);
        })
    }, [])

    return (
        <ul>
            {
                list.map(item => <li key={item.id} onClick={() => handleJoin(item.id)}>{item.id}</li>)
            }
        </ul>
    )
}