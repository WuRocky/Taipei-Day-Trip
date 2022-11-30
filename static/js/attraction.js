///// * get the id in the url * /////
const url_parse = window.location.pathname.split("/").pop();
///// * add the id to the URL of the api * /////
const url = "http://35.74.113.149:3000/api/attractions/" + url_parse;

///// * create attraction container * /////
async function attraction_data() {
	// fetch categories id url api and convert to json format
	let attraction_data = await fetch(url);
	let attraction_data_json = await attraction_data.json();
	let attraction_data_api = attraction_data_json["data"];

	// separate the content of each API
	let name_api = attraction_data_api["name"];
	let mrt_api = attraction_data_api["mrt"];
	let category_api = attraction_data_api["category"];
	let address_api = attraction_data_api["address"];
	let transport_api = attraction_data_api["transport"];
	let description_api = attraction_data_api["description"];
	let images_api = attraction_data_api["images"];

	///// * add api to content * /////
	let attractions_name = document.querySelector(".attractions-name");
	let attractions_name_h2 = document.createElement("h2");
	attractions_name_h2.innerText = name_api;
	attractions_name.appendChild(attractions_name_h2);

	let attractions_mrt = document.querySelector(".attractions-mrt");
	let attractions_mrt_p = document.createElement("p");
	attractions_mrt_p.innerText = category_api + " at " + mrt_api;
	attractions_mrt.appendChild(attractions_mrt_p);

	let attractions_describe_itme_1 = document.querySelector(
		".attractions-describe-itme-1"
	);
	attractions_describe_itme_1.innerText = description_api;

	let attractions_describe_itme_2 = document.querySelector(
		".attractions-describe-itme-2 p"
	);
	attractions_describe_itme_2.innerText = address_api;

	let ttractions_describe_itme_3 = document.querySelector(
		".attractions-describe-itme-3 p"
	);
	ttractions_describe_itme_3.innerText = transport_api;

	let attractions_img_div = document.querySelector(".attractions-img-div");

	// add css for each image separately
	images_api.forEach((item) => {
		// add carousel effect css
		let attractions_img_div_container = document.createElement("div");
		attractions_img_div_container.classList.add("slides");
		attractions_img_div_container.classList.add("effect");

		// add a few pictures
		let attractions_img_src_container = document.createElement("img");
		attractions_img_src_container.src = item;

		attractions_img_div_container.appendChild(attractions_img_src_container);
		attractions_img_div.appendChild(attractions_img_div_container);

		// decide how many dot
		let dot_item = document.querySelector(".dot-item");
		let dot_item_span = document.createElement("span");
		dot_item_span.classList.add("dot");
		dot_item.appendChild(dot_item_span);
	});

	///// * carousel function * /////

	// click prev "<" page to go back one step
	let prev = document.querySelector(".prev");
	prev.addEventListener("click", function () {
		plusSlides(-1);
	});

	// click next ">" page go in the next step
	let next = document.querySelector(".next");
	next.addEventListener("click", function () {
		plusSlides(1);
	});

	// control carousel function
	function showSlides(n) {
		let i;

		// check how many pictures
		let slides = document.querySelectorAll(
			".attractions-section .attractions-card .attractions-img-div .slides"
		);

		// check how many dot
		let dots = document.querySelectorAll(
			".attractions-section .attractions-card .attractions-img-div .dot-item .dot"
		);

		// when slideIndex more than the slides slideIndex change into 1
		if (n > slides.length) {
			slideIndex = 1;
		}

		// when slideIndex less than 1 slides go back last page
		if (n < 1) {
			slideIndex = slides.length;
		}

		// if the item is not in slides is none
		for (i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";
		}

		// if the item is not in dot is not active
		for (i = 0; i < dots.length; i++) {
			dots[i].className = dots[i].className.replace(" active", "");
		}

		// if the item is slides show block
		slides[slideIndex - 1].style.display = "block";

		// if the item is dot show active
		dots[slideIndex - 1].className += " active";
	}

	// When you click "<" ">" can change the slide index
	let slideIndex = 1;
	showSlides(slideIndex);

	// dot(css) at the bottom, click to switch  slides(css)
	function plusSlides(n) {
		showSlides((slideIndex += n));
	}
}

attraction_data();
