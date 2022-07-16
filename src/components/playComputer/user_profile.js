import React from 'react'
import './index.css'


function UserProfile({ user }) {

    return (
        <div className="game__user d_flex align_items_center">
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
