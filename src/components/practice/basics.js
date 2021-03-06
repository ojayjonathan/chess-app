import React from "react";
import data from "../../assets/data/basics.json";
import "./index.css";
import { useNavigate } from "react-router-dom";
import pieceTheme from "../../utils/pieceTheme";
import {APP_ROUTES} from '../../utils/constants'

function Basics() {
  const nagigator = useNavigate();
  return (
    <div className="practice basic">
      <h2 className="text_center">Practice</h2>
      <div className="text_center text_muted">
        Improve your chess by solving puzzles
      </div>
      <div className="practice__categories">
        {Object.keys(data).map((key, i) => {
          return (
            <React.Fragment key={i}>
              <h2 className="category_name text_muted">{key}</h2>
              <div className={`category__items c${i}`}>
                {data[key].map((item, i) => (
                  <Card
                    item={item}
                    onClick={() => {
                      nagigator({
                        pathname: APP_ROUTES.lessons,
                        search: "",
                        hash: "",
                        state: { fromPopup: true },
                      });
                    }}
                  />
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Basics;

const Card = ({ item, onClick }) => {
  return (
    <div className="col-lg-3 col-md-2 col-12" onClick={onClick}>
      <div className="practice__card ">
        <div>
          <img src={pieceTheme(item.icon)} alt={item.name} className="practice_icon" />
        </div>
        <div className="expand">
          <div className="practice__card__title">{item.name}</div>
          <div className="text_muted">{item.description}</div>
        </div>
        <span className="material-icons">arrow_forward_ios</span>
      </div>
    </div>
  );
};
