import React, { useEffect, useState } from 'react'

export default function List({ name, handleJoin }) {
    const [list, setList] = useState([]);

    useEffect(() => {
        window.socket.request('getMyRoomList').then(list => {
            console.log(list);
            setList(list);
        })
    }, [])

    return (
        <div>
            {
                list.map(item => <div key={item.id} onClick={() => handleJoin(name, item.id)}>{item.id}</div>)
            }
        </div>
    )
}