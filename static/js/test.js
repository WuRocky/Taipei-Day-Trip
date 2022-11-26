let pageNumber = 1;
let pageSize = 10;
let isPageLoad = true;
const userContainer = document.querySelector(".users__container");
const loadingEle = document.querySelector("#loading");

const toggleLoading = (isLoading) => {
  loadingEle.classList.toggle("show", isLoading);
};

const renderUser = (user) => {
  let {
    name: { first, last },
    location: { country },
    email,
    picture: { medium: userImage },
  } = user;
  let htmlStr = `  <div class="user">
          <div class="user-logo item">
            <img src="${userImage}" alt="user" />
          </div>
          <div class="user-name item">${first} ${last}</div>
          <div class="user-country item">${country}</div>
          <div class="user-email item">${email}</div>
        </div>`;
  userContainer.insertAdjacentHTML("beforeend", htmlStr);
};

async function getRandomUsers(pageNumber, pageSize) {
  let url = `https://randomuser.me/api/?page=${pageNumber}&results=${pageSize}&seed=abc`;
  // fetch(url)
  //   .then((resp) => resp.json())
  //   .then((data) => {
  //     data && data.results && data.results.forEach((user) => renderUser(user));
  //   });
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
}

const getLastUseEle = () =>
  document.querySelector(".users__container > .user:last-child");

const loadUsers = (pageNumber, pageSize) => {
  return new Promise((resolve, reject) => {
    getRandomUsers(pageNumber, pageSize)
      .then((data) => {
        data &&
          data.results &&
          data.results.forEach((user) => renderUser(user));
        if (isPageLoad) {
          obseveLastUser();
          isPageLoad = false;
        }
        resolve("Completed Rendering");
      })
      .catch((error) => {
        reject(error);
      });
  });
};
toggleLoading(true);
loadUsers(pageNumber, pageSize)
  .then((data) => {
    toggleLoading(false);
  })
  .catch((error) => toggleLoading(false));

const infScrollCallback = (entries, observer) => {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  pageNumber += 1;
  toggleLoading(true);
  loadUsers(pageNumber, pageSize)
    .then((resp) => {
      obseveLastUser();
      toggleLoading(false);
    })
    .catch((error) => toggleLoading(false));
  observer.unobserve(entry.target);
};

const infScrollObserver = new IntersectionObserver(infScrollCallback, {});

const obseveLastUser = () => {
  infScrollObserver.observe(getLastUseEle());
};