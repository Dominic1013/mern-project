import axios from "axios";
const API_URL = "http://127.0.0.1:8080/api/courses";

class CourseService {
  //講師新增課程
  post(title, description, price) {
    //確認是否有登入及token
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    //傳送http請求並return
    return axios.post(
      API_URL,
      {
        title,
        description,
        price,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    ); // url, data, config
  }

  //使用學生id，找到學生註冊的課程
  getEnrolledCourses(_id) {
    //確認是否有登入及token
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/student/" + _id, {
      headers: { Authorization: token },
    });
  }

  //學生用課程id註冊課程
  enroll(_id) {
    //確認是否有登入及token
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.post(
      API_URL + "/enroll/" + _id,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  //用課程名稱來找到課程
  getCourseByName(name) {
    //確認是否有登入及token
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/findByName/" + name, {
      headers: {
        Authorization: token,
      },
    });
  }

  //用講者id找到講師擁有的課程
  get(_id) {
    //確認是否有登入及token
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    //傳送http請求並return
    return axios.get(API_URL + "/instructor/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new CourseService();
