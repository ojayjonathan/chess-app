import React from 'react'

function GameControls({ undo, redo,replay }) {

    const openMenu = () => {
        document.querySelector(".menu").classList.toggle("menu__open")
    }

    return (
        <div>
            <div className="game-controls" onScroll={(e) => e.preventDefault()}>
                <div className="menu" onClick={openMenu}>
                    <span class="material-icons close">
                        close
                    </span>
                    <hr className="m-0"/>
                    <span onClick={undo}>
                        <i class="material-icons" title="undo">
                            undo
                        </i> Undo</span>
                    <span>
                        <i class="material-icons" title="undo">
                            flag
                        </i> Resign</span>
                    <span>
                        <i class="material-icons" title="undo">
                            undo
                        </i> Analyse</span>

                </div>
                <span class="material-icons" title="menu" onClick={openMenu}>
                    list
                </span>

                <span class="material-icons" title="starting position">
                    first_page
                </span>
                <span class="material-icons">
                    skip_previous
                </span>
                <span class="material-icons" title="replay" onClick={replay}>
                    play_arrow
                </span>
                <span class="material-icons">
                    skip_next
                </span>
                <span class="material-icons">
                    last_page
                </span>
                {/* <span onClick={redo}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" /></svg>
                </span>

                <span >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z" /></svg>
                </span>
                <span onClick={undo} style={{ transform: "rotateY(180deg)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" /></svg>
                </span>
                <span onClick={redo}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" /></svg>
                </span>

                <span >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z" /></svg>
                </span> */}
            </div>
        </div>

    )
}

export default GameControls
