import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const EnollComponent = ({ currentUser, setCurrentUser }) => {
  //找到學生id，確認學生身分，搜尋學生註冊課程
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  //搜尋課程的state，一個是觀察input變動的值，一個是儲存search的值。
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);

  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        // console.log(data);
        setSearchResult(data.data); //將搜尋到的課程資料，存進SearchResult裡
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id) // <a>的id，我們已經在JSX讓它裡面裝著課程id了
      .then(() => {
        window.alert("課程註冊成功！重新導向到課程頁面。");
        navigate("/course");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能開始註冊課程</p>
          <button
            onClick={handleTakeToLogin}
            className="btn btn-primary btn-lg"
          >
            回到登入頁面
          </button>
        </div>
      )}

      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>只有學生才能夠註冊課程</h1>
        </div>
      )}

      {currentUser && currentUser.user.role == "student" && (
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            onChange={handleChangeInput}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            搜尋課程
          </button>
        </div>
      )}

      {currentUser && searchResult && searchResult.length != 0 && (
        <div>
          <p>這是我們從API返回的數據:</p>
          {searchResult.map((course) => {
            return (
              <div key={course._id} className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱:{course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數: {course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格: {course.price}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    講師: {course.instructor.username}
                  </p>

                  <a
                    href="#"
                    id={course._id}
                    className="card-text btn btn-primary"
                    onClick={handleEnroll}
                  >
                    註冊課程
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnollComponent;
