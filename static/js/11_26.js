let input_categories = document.querySelector("#clicker");
let hidden = document.querySelector("#hidden-div");
let form = document.querySelector("form");
let search_button = document.querySelector("#search");
const add = document.querySelector(".main-container");
const section = document.querySelector("section");
const footer = document.querySelector("footer");

function createNawData(arr) {
	arr.forEach((item) => {
		// div-1
		let attractions_item_1 = document.createElement("div");
		attractions_item_1.classList.add("attractions-item-1");

		let img_item_1 = document.createElement("img");
		img_item_1.classList.add("main-imgs");
		img_item_1.src = item["images"][0];

		let p_item_1 = document.createElement("p");
		p_item_1.classList.add("main-name-p");
		p_item_1.innerText = item["name"];

		attractions_item_1.appendChild(img_item_1);
		attractions_item_1.appendChild(p_item_1);
		// div-2
		let attractions_item_2 = document.createElement("div");
		attractions_item_2.classList.add("attractions-item-2");

		let p_left_item_2 = document.createElement("p");
		p_left_item_2.innerText = item["mrt"];
		p_left_item_2.classList.add("p-left");

		let p_right_item_2 = document.createElement("p");
		p_right_item_2.classList.add("p-right");
		p_right_item_2.innerText = item["category"];

		attractions_item_2.appendChild(p_left_item_2);
		attractions_item_2.appendChild(p_right_item_2);

		// main-div
		let main_container = document.createElement("div");
		main_container.classList.add("main-container");

		main_container.appendChild(attractions_item_1);
		main_container.appendChild(attractions_item_2);

		section.appendChild(main_container);
	});
}
//////////////////////////first///////////////
// async function get_api() {
// 	let first_data = await fetch("http://35.74.113.149:3000/api/attractions");
// 	let first_parse_data = await first_data.json();
// 	let first_data_api = first_parse_data["data"];

// 	createNawData(first_data_api);
// }
// get_api();
// ///////////////////////////////////////////////
///////////////////// keyword ///////////////////

// async function keyword_api() {
// 	let categories_data = await fetch(
// 		"http://35.74.113.149:3000/api/categories"
// 	);
// 	let categories_data_api = await categories_data.json();
// 	let categories_api = categories_data_api["data"];

// 	categories_api.forEach((item) => {
// 		// hidden-div-item
// 		let hidden_div_item = document.createElement("div");
// 		hidden_div_item.classList.add("hidden-div-item");
// 		hidden_div_item.innerText = item;

// 		hidden.appendChild(hidden_div_item);
// 	});
// 	let categories_options = document.querySelectorAll(
// 		"#hidden-div .hidden-div-item"
// 	);
// 	window.addEventListener("mouseup", function (event) {
// 		input_categories.addEventListener("click", (e) => {
// 			hidden.style = "display: grid;";
// 		});
// 		if (!event.target.closest("#clicker")) {
// 			hidden.style = "display: none;";
// 		}
// 	});

// 	for (let i = 0; i < categories_options.length; i++) {
// 		categories_options[i].addEventListener("click", (e) => {
// 			input_categories.value = categories_options[i].innerText;
// 			input_categories.style = "color : #000000";
// 		});
// 	}
// }
// keyword_api();
// search_button.addEventListener("click", (e) => {
// 	e.preventDefault();
// 	// e.stopPropagation();
// 	let form = e.target.parentElement;
// 	let text = form.children[0].value;
// 	async function fetch_text() {
// 		let url = await fetch(
// 			`http://35.74.113.149:3000/api/attractions?keyword=${text}`
// 		);

// 		let { data, nextPage } = await url.json();
// 		createNawData(data);
// 	}
// 	fetch_text();
// });
// section.document.location.reload();
/////////////////

///////////////////////////////
// let currentPage = 1;
// async function get_other_api() {
// 	let page = 1;
// 	let other_pages = await fetch(
// 		`http://35.74.113.149:3000/api/attractions?page=${currentPage}`
// 	);

// 	let other_pages_data = await other_pages.json();
// 	let { data, nextPage } = other_pages_data;
// 	createNawData(data);
// 	//Infinite Scrolling
// 	let last_api = document.querySelector(".main-container:last-child");

// 	// defind Listener place
// 	const opition = {
// 		root: null,
// 		rootMargin: "0px 0px 0px 0px",
// 		threshold: 0,
// 	};

// 	// Listener Scrolling
// 	const observer = new IntersectionObserver((entries) => {
// 		entries.forEach((entry) => {
// 			if (entry.isIntersecting) {
// 				if (nextPage != null) {
// 					currentPage++;
// 					get_other_api();
// 					nextPage = currentPage;
// 				}
// 				observer.unobserve(last_api);
// 			}
// 		});
// 	}, opition);

// 	// defind Listener last api place
// 	observer.observe(last_api);
// }
// get_other_api();
