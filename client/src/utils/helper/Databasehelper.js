export class DatabaseHelper {
  newVideoEntry = ({ title, path, userID }) => {
    fetch(process.env.REACT_APP_API_BASE + "/video/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, path: path, userID: userID }),
    }).then((res) => res.json());
  };
}
