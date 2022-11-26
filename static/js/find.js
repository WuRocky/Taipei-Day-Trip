let input_categories = document.querySelector("#clicker");
let hidden = document.querySelector("#hidden-div");
let form = document.querySelector("form");
let search_button = document.querySelector("#search");
const add = document.querySelector(".main-container");
const section = document.querySelector("section");
const footer = document.querySelector("footer");
let currentPage = 0;

async function get_api() {
	let data_api = await fetch("http://35.74.113.149:3000/api/attractions");
	let parse_data = await data_api.json();
	let { data, nextPage } = parse_data;
	data.forEach((item) => {
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
get_api();
