// let input_categories = document.querySelector("#clicker");
// let hidden = document.querySelector("#hidden-div");
// let form = document.querySelector("form");
// let search_button = document.querySelector("#search");
// const add = document.querySelector(".main-container");
// const section = document.querySelector("section");
// const footer = document.querySelector("footer");
// let currentPage = 0;

// ////////////// categories_api //////////////////
// async function categories_api() {
//   let url = await fetch("http://35.74.113.149:3000/api/categories");
//   let api_data = await url.json();
//   let api_array = api_data["data"];

//   api_array.forEach((item) => {
//     // hidden-div-item
//     let hidden_div_item = document.createElement("div");
//     hidden_div_item.classList.add("hidden-div-item");
//     hidden_div_item.innerText = item;

//     hidden.appendChild(hidden_div_item);
//   });
//   let categories_options = document.querySelectorAll(
//     "#hidden-div .hidden-div-item"
//   );
//   window.addEventListener("mouseup", function (event) {
//     input_categories.addEventListener("click", (e) => {
//       hidden.style = "display: grid;";
//     });
//     if (!event.target.closest("#clicker")) {
//       hidden.style = "display: none;";
//     }
//   });

//   for (let i = 0; i < categories_options.length; i++) {
//     categories_options[i].addEventListener("click", (e) => {
//       input_categories.value = categories_options[i].innerText;
//       input_categories.style = "color : #000000";
//     });
//   }
// }
// categories_api();
// /////////////////////////////////////////////////
// ///////////////////// index_api /////////////////
// // take api and create screen content
// async function fetch_data() {
//   let url = await fetch(
//     `http://35.74.113.149:3000/api/attractions?page=${currentPage}`
//   );
//   let { data, nextPage } = await url.json();

//   data.forEach((item) => {
//     // div-1
//     let attractions_item_1 = document.createElement("div");
//     attractions_item_1.classList.add("attractions-item-1");

//     let img_item_1 = document.createElement("img");
//     img_item_1.classList.add("main-imgs");
//     img_item_1.src = item["images"][0];

//     let p_item_1 = document.createElement("p");
//     p_item_1.classList.add("main-name-p");
//     p_item_1.innerText = item["name"];

//     attractions_item_1.appendChild(img_item_1);
//     attractions_item_1.appendChild(p_item_1);
//     // div-2
//     let attractions_item_2 = document.createElement("div");
//     attractions_item_2.classList.add("attractions-item-2");

//     let p_left_item_2 = document.createElement("p");
//     p_left_item_2.innerText = item["mrt"];
//     p_left_item_2.classList.add("p-left");

//     let p_right_item_2 = document.createElement("p");
//     p_right_item_2.classList.add("p-right");
//     p_right_item_2.innerText = item["category"];

//     attractions_item_2.appendChild(p_left_item_2);
//     attractions_item_2.appendChild(p_right_item_2);

//     // main-div
//     let main_container = document.createElement("div");
//     main_container.classList.add("main-container");

//     main_container.appendChild(attractions_item_1);
//     main_container.appendChild(attractions_item_2);

//     section.appendChild(main_container);
//   });

//   //Infinite Scrolling
//   let last_api = document.querySelector(".main-container:last-child");

//   // defind Listener place
//   const opition = {
//     root: null,
//     rootMargin: "0px 0px 0px 0px",
//     threshold: 0,
//   };
//   // Listener Scrolling
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         if (nextPage != null) {
//           currentPage++;
//           fetch_data();
//           nextPage = nextPage;
//         }
//         observer.unobserve(last_api);
//       }
//     });
//   }, opition);

//   // defind Listener last api place
//   observer.observe(last_api);
// }
// fetch_data();
// /////////////////////////////////////////////////
// ///////////////////// keyword ///////////////////
// search_button.addEventListener("click", (e) => {
//   // e.preventDefault();
//   let form = e.target.parentElement;
//   let text = form.children[0].value;
//   async function fetch_text() {
//     let url = await fetch(
//       `http://35.74.113.149:3000/api/attractions?keyword=${text}`
//     );

//     let { data, nextPage } = await url.json();

//     data.forEach((item) => {
//       // div-1
//       let attractions_item_1 = document.createElement("div");
//       attractions_item_1.classList.add("attractions-item-1");

//       let img_item_1 = document.createElement("img");
//       img_item_1.classList.add("main-imgs");
//       img_item_1.src = item["images"][0];

//       let p_item_1 = document.createElement("p");
//       p_item_1.classList.add("main-name-p");
//       p_item_1.innerText = item["name"];

//       attractions_item_1.appendChild(img_item_1);
//       attractions_item_1.appendChild(p_item_1);
//       // div-2
//       let attractions_item_2 = document.createElement("div");
//       attractions_item_2.classList.add("attractions-item-2");

//       let p_left_item_2 = document.createElement("p");
//       p_left_item_2.innerText = item["mrt"];
//       p_left_item_2.classList.add("p-left");

//       let p_right_item_2 = document.createElement("p");
//       p_right_item_2.classList.add("p-right");
//       p_right_item_2.innerText = item["category"];

//       attractions_item_2.appendChild(p_left_item_2);
//       attractions_item_2.appendChild(p_right_item_2);

//       // main-div
//       let main_container = document.createElement("div");
//       main_container.classList.add("main-container");

//       main_container.appendChild(attractions_item_1);
//       main_container.appendChild(attractions_item_2);

//       section.appendChild(main_container);
//     });

//     //Infinite Scrolling
//     let last_api = document.querySelector(".main-container:last-child");

//     // defind Listener place
//     const opition = {
//       root: null,
//       rootMargin: "0px 0px 0px 0px",
//       threshold: 0,
//     };
//     // Listener Scrolling
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           if (nextPage != null) {
//             currentPage++;
//             fetch_data();
//             nextPage = nextPage;
//           }
//           observer.unobserve(last_api);
//         }
//       });
//     }, opition);

//     // defind Listener last api place
//     observer.observe(last_api);
//   }
//   fetch_text();
// });
