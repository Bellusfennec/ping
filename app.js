const pingList = [
  { id: 1, url: "https://help.ezdrav.ru/", name: "help.ezdrav.ru" },
  { id: 2, url: "https://gist.rmis.ezdrav.ru/", name: "gist.rmis.ezdrav.ru" },
  { id: 3, url: "http://192.168.8.139:85/", name: "АИС ТФОМС РТ" },
  { id: 4, url: "https://www.google.com/", name: "Google" }
];
const root = document.querySelector("#root");

function createPage() {
  if (root) {
    const title = document.createElement("h1");
    title.textContent = "Проверка пинга";
    root.append(title);
    pingList.forEach(({ id, url, name }) => {
      const item = document.createElement("div");
      item.setAttribute("id", "id-" + id);
      root.append(item);
      const titleItem = document.createElement("h2");
      titleItem.textContent = name;
      item.append(titleItem);
      const graph = document.createElement("div");
      graph.setAttribute("id", "graph-" + id);
      graph.style.height = "25px";
      graph.style.border = "1px solid grey";
      graph.style.display = "flex";
      graph.style.gap = "10px";
      graph.style.padding = "5px";

      item.append(graph);
    });
  }
}

const ping = (url, timeout = 6000) => {
  return new Promise((resolve, reject) => {
    const urlRule = new RegExp("(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]");
    if (!urlRule.test(url)) reject("invalid url");
    try {
      fetch(url, {
        method: "GET",
        mode: "no-cors",
        cache: "no-cache",
        referrerPolicy: "no-referrer"
      })
        .then(() => resolve(true))
        .catch(() => resolve(false));
      setTimeout(() => {
        resolve(false);
      }, timeout);
    } catch (e) {
      reject(e);
    }
  });
};

function checkPing({ timeout }) {
  for (let i = 0; i < pingList.length; i++) {
    const element = pingList[i];
    const item = document.querySelector(`#graph-${element.id}`);

    // console.log(item);
    setTimeout(function run() {
      const startTime = new Date();
      ping(element.url, timeout)
        .then(res => console.log(element.name, "- no error."))
        .catch(e => console.log(e))
        .finally(() => {
          const endTime = new Date();
          const difference = +((endTime - startTime) / 1000).toFixed(3);
          console.log(element.name, difference);
          const unit = document.createElement("div");
          unit.textContent = difference;
          console.log(difference);
          unit.style.background = difference.toFixed(3) < timeout / 1000 ? "green" : "red";
          unit.style.color = "white";
          unit.style.padding = "5px";
          if (item.childElementCount > 5) {
            item.removeChild(item.children[0]);
          }
          item.append(unit);
        });
      // setTimeout(run, 1000);
    }, 1000);
  }
}

function start() {
  const timeout = 20000;
  // const intervalId = setInterval(checkPing({ timeout }), 1000);
  // setInterval(checkPing({ timeout }), 1000);
  // console.log(intervalId);
  // setInterval(function () {
  checkPing({ timeout });

  // }, 1000);
}
createPage();
start();
