import Axios from "axios";
import DotENV from "dotenv";

DotENV.config();

const URL_QUERY = "https://alcat.pu.edu.tw/choice/q_person.html";
const URL_NOTIFICATION = process.env.URL_NOTIFICATION;
const QUERY_COURSES = process.env.CORSES.split(",");
const QUERY_INTERVAL_MIN = 2 * 60 * 1000;
const QUERY_INTERVAL_MAX = 10 * 60 * 1000;
let lastAmounts = {};

(function fetch(timeout) {
  setTimeout(() => {
    QUERY_COURSES.forEach(async (courseId) => {
      const course = await getCourseInformation(courseId);
      const lastAmount = lastAmounts[courseId] ?? 0;
      console.log(course, lastAmounts);

      if (lastAmount !== course.remains) {
        sendNotification(course.id, course.name, course.remains).then(
          console.log,
          console.error
        );
        console.log(
          `${course.id} ${course.name} changed from ${lastAmount} to ${course.remains}`
        );
        lastAmounts[courseId] = course.remains;
      }

      const pending =
        QUERY_INTERVAL_MIN +
        Math.random() * (QUERY_INTERVAL_MAX - QUERY_INTERVAL_MIN);
      return fetch(pending);
    });
  }, timeout);
})();

function getCourseInformation(courseId) {
  return Axios.post(URL_QUERY, `selectno=${courseId}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.47",
    },
  }).then((response) => {
    const content = response.data.replace(/\s/g, "");
    const name = /<h2>科目名稱：(.+?)<\/h2>/.exec(content)[1];
    const amountsMax = /<td>人數上限<\/td><td>(\d*)<\/td>/.exec(content)[1];
    const amountsNow =
      /<td>(修課人數|一階加選人數|一階選上人數)<\/td><td>(\d*)<\/td>/.exec(
        content
      )[2];
    const remains = Number(amountsMax) - Number(amountsNow);

    return {
      id: courseId,
      name,
      remains,
    };
  });
}

function sendNotification(courseId, courseName, remains) {
  return Axios.post(
    URL_NOTIFICATION,
    {
      courseId,
      courseName,
      remains,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
