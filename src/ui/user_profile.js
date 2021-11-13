import React from 'react'
import './index.css'


function UserProfile({ user }) {

    return (
        <div className="game-user">
            <div className="">
                <div className="name">{user.username}</div>
            </div>
            <div>
                <div className="clk" id={"time" + user.id}>0:00:00
                </div>
            </div>
        </div>
    )
}

export default UserProfile
