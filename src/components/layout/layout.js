import React from 'react'
import "./layout.css"

function Layout({ children }) {
    const openSideBar = () => {
        document.querySelector(".side__bar").classList.toggle("open")
    }
    return (
        <div className="layout">
            <div className="side__bar">
            </div>
            <div className="side__bar__offset main">
                <nav className="navar">
                    <div className="sidebar__open">
                        <i class="material-icons" onClick={openSideBar}>menu</i>
                    </div>
                </nav>
                {children}
            </div>
        </div>
    )
}


export default Layout
