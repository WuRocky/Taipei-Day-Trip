const input_categories = document.querySelector("#clicker");
const hidden = document.querySelector("#hidden-div");
const form = document.querySelector("form");
const search_button = document.querySelector("#search");
const section = document.querySelector("section");
const footer = document.querySelector("footer");
// const last_api = document.querySelector("#last-api");

let opition = {
	root: null,
	rootMargin: "0px 0px 0px 0px",
	threshold: 0,
};

///// * create container * /////
function create_naw_data(arr) {
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

		// add to the section
		section.appendChild(main_container);
	});
}

///// * categories menu and click to hide or show  * /////
async function categories_data() {
	// fetch categories url api and convert to json format
	let categories_data = await fetch("http://35.74.113.149:3000/api/categories");
	let categories_data_api = await categories_data.json();
	let categories_api = categories_data_api["data"];

	// add to the menu
	categories_api.forEach((item) => {
		// hidden-div-item
		let hidden_div_item = document.createElement("div");
		hidden_div_item.classList.add("hidden-div-item");
		hidden_div_item.innerText = item;

		hidden.appendChild(hidden_div_item);
	});

	// click elsewhere disappear
	window.addEventListener("mouseup", function (event) {
		input_categories.addEventListener("click", (e) => {
			hidden.style = "display: grid;";
		});
		if (!event.target.closest("#clicker")) {
			hidden.style = "display: none;";
		}
	});

	// menu style
	let categories_options = document.querySelectorAll(
		"#hidden-div .hidden-div-item"
	);

	// join each item
	for (let i = 0; i < categories_options.length; i++) {
		categories_options[i].addEventListener("click", (e) => {
			input_categories.value = categories_options[i].innerText;
			input_categories.style = "color : #000000";
		});
	}
}
categories_data();

///// * the data api is show to the browser and infinite scrolling * /////
let page = 0;
async function get_other_api() {
	// fetch attractions url api and convert to json format
	let get_data = await fetch(
		`http://35.74.113.149:3000/api/attractions?page=${page}`
	);
	let get_parse_data = await get_data.json();
	let { data, nextPage } = get_parse_data;

	// use the function create_naw_data created data
	create_naw_data(data);

	// infinite Scrolling find the last item
	let last_api = document.querySelector(".main-container:last-child");

	// infinite Scrolling defind Listener place

	// iistener Scrolling
	let observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				if (nextPage != null) {
					page++;
					get_other_api();
					nextPage = page;
				}
				observer.unobserve(last_api);
			}
		});
	}, opition);

	// defind Listener last api place
	observer.observe(last_api);
}
get_other_api();

///// * click the button keyword search and infinite scrolling * /////
let keyword_page = 0;
search_button.addEventListener("click", (e) => {
	// action after button click
	e.preventDefault();

	// get input text
	let keyword_form = e.target.parentElement;
	let text = keyword_form.children[0].value;

	// clear previous display
	const keyword_main_container = document.querySelectorAll(".main-container");
	keyword_main_container.forEach((e) => {
		e.remove();
	});

	// call keyword url api
	async function keyword_api() {
		// fetch attractions url api and convert to json format
		let url = await fetch(
			`http://35.74.113.149:3000/api/attractions?page=${keyword_page}&keyword=${text}`
		);
		let { data, nextPage } = await url.json();

		// use the function create_naw_data created data
		create_naw_data(data);

		// infinite scrolling find the last item
		let last_api = document.querySelector(".main-container:last-child");

		// infinite Scrolling defind Listener place
		let opition = {
			root: null,
			rootMargin: "0px 0px 0px 0px",
			threshold: 0,
		};

		// listener scrolling
		let observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// udging the number of pages
					if (nextPage != null) {
						keyword_page++;
						keyword_api();
						nextPage = keyword_page;
					} else if (nextPage == null) {
						keyword_page = 0;
					}
					observer.unobserve(last_api);
				}
			});
		}, opition);

		// defind Listener last api place
		observer.observe(last_api);
	}

	keyword_api();
});
