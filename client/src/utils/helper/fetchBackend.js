import Axios from "axios";

const getUser = async () => {
  return new Promise((resolve, reject) => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_BASE + "/user",
    })
      .then((res) => {
        resolve(res.data.username);
      })
      .catch((err) => reject(err));
  });
};

const isLoggedIn = async () => {
  return new Promise((resolve, reject) => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_BASE + "/user",
    })
      .then((res) => {
        localStorage.setItem("logedIn", res.data.username !== undefined);
        resolve(res.data.username !== undefined);
      })
      .catch((err) => reject(err));
  });
};

export { getUser, isLoggedIn };
