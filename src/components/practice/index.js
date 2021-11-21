import React from "react";
import data from "../../assets/data/category.json";
import "./index.css";
import { useNavigate } from "react-router-dom";

function Practice() {
  const nagigator = useNavigate();
  return (
    <div className="practice">
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
                        pathname: "/puzzles",
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

export default Practice;

const Card = ({ item, onClick }) => {
  return (
    <div className="col-lg-3 col-md-2 col-12" onClick={onClick}>
      <div className="practice__card ">
        <div>
          <div className="practice__card__title">{item.name}</div>
          <div className="text_muted">{item.description}</div>
        </div>
        <div>
          <span className="material-icons">arrow_forward_ios</span>
        </div>
      </div>
    </div>
  );
};
