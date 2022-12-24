const inputCategories = document.querySelector("#clicker");
const hidden = document.querySelector("#hidden-div");
const searchButton = document.querySelector("#search");
const section = document.querySelector(".index-section");
const footer = document.querySelector("footer");
// infinite Scrolling defind Listener place
const opition = {
	root: null,
	rootMargin: "0px 0px 0px 0px",
	threshold: 0,
};

const imgUpdate = document.querySelector(".img-update");
const homepageHeaderImage = document.querySelector(".homepage-header");
const loadImage = document.createElement("img");
const image = new Image();
image.classList.add("homepage-header-img");

image.onload = () => {
	if (image.complete) {
		homepageHeaderImage.appendChild(image);

		imgUpdate.style = "display:none";
	} else {
		homepageHeaderImage.appendChild(loadImage);
	}
};
image.src = `../images/welcome.png`;

///// * create container * /////
function createNawData(arr) {
	arr.forEach((item) => {
		// div-1
		const attractionsItem1 = document.createElement("div");
		attractionsItem1.classList.add("attractions-item-1");

		const imgUpdateItem1 = document.createElement("div");
		imgUpdateItem1.classList.add("img-update-item1");

		const divItem1 = document.createElement("div");
		const divItem2 = document.createElement("div");
		const divItem3 = document.createElement("div");

		const divItemh1 = document.createElement("p");
		divItemh1.innerText = "Loading..";

		imgUpdateItem1.appendChild(divItem1);
		imgUpdateItem1.appendChild(divItem2);
		imgUpdateItem1.appendChild(divItem3);
		imgUpdateItem1.appendChild(divItemh1);

		// // add url
		const urlHref = window.location + "attraction/" + item["id"];

		const aItme = document.createElement("a");
		aItme.classList.add("a-itme");
		aItme.href = urlHref;

		// Preload image
		const imgMainImgs = new Image();
		imgMainImgs.src = item["images"][0];

		// Wait for image to load before adding it to the DOM
		imgMainImgs.onload = function () {
			const imgItem1 = document.createElement("img");
			imgItem1.classList.add("main-imgs");
			imgItem1.src = item["images"][0];
			aItme.appendChild(imgItem1);

			if (imgMainImgs.complete) {
				imgUpdateItem1.style = "display:none";
			}
		};

		const pItem1 = document.createElement("p");
		pItem1.classList.add("main-name-p");
		pItem1.innerText = item["name"];

		// aItme.appendChild(imgItem1);
		aItme.appendChild(pItem1);
		attractionsItem1.appendChild(imgUpdateItem1);
		attractionsItem1.appendChild(imgUpdateItem1);
		attractionsItem1.appendChild(aItme);

		// div-2
		const attractionsItem2 = document.createElement("div");
		attractionsItem2.classList.add("attractions-item-2");

		const pLeftItem2 = document.createElement("p");
		pLeftItem2.innerText = item["mrt"];
		pLeftItem2.classList.add("p-left");

		const pRightItem2 = document.createElement("p");
		pRightItem2.classList.add("p-right");
		pRightItem2.innerText = item["category"];

		attractionsItem2.appendChild(pLeftItem2);
		attractionsItem2.appendChild(pRightItem2);

		// main-div
		const mainContainer = document.createElement("div");
		mainContainer.classList.add("main-container");

		mainContainer.appendChild(attractionsItem1);
		mainContainer.appendChild(attractionsItem2);

		// add to the section
		section.appendChild(mainContainer);
	});
}

///// * categories menu and click to hide or show  * /////
async function categoriesData() {
	// fetch categories url api and convert to json format
	let categoriesData = await fetch("/api/categories");
	let categoriesDataApi = await categoriesData.json();
	let categoriesApi = categoriesDataApi["data"];

	// add to the menu
	categoriesApi.forEach((item) => {
		// hidden-div-item
		let hiddenDivItem = document.createElement("div");
		hiddenDivItem.classList.add("hidden-div-item");
		hiddenDivItem.innerText = item;

		hidden.appendChild(hiddenDivItem);
	});

	// click elsewhere disappear
	window.addEventListener("mouseup", function (event) {
		inputCategories.addEventListener("click", (e) => {
			hidden.style = "display: grid;";
		});
		if (!event.target.closest("#clicker")) {
			hidden.style = "display: none;";
		}
	});

	// menu style
	let categoriesOptions = document.querySelectorAll(
		"#hidden-div .hidden-div-item"
	);

	// join each item
	for (let i = 0; i < categoriesOptions.length; i++) {
		categoriesOptions[i].addEventListener("click", (e) => {
			inputCategories.value = categoriesOptions[i].innerText;
			inputCategories.style = "color : #000000";
		});
	}
}
categoriesData();

///// * the data api is show to the browser and infinite scrolling * /////
let page = 0;
async function getFirtApi() {
	// fetch attractions url api and convert to json format
	let getData = await fetch(`/api/attractions?page=${page}`);
	let getParseData = await getData.json();
	let { data, nextPage } = getParseData;

	// use the function create_naw_data created data
	createNawData(data);

	// infinite Scrolling find the last item
	let lastApi = document.querySelector(".main-container:last-child");

	// iistener Scrolling
	let observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				if (nextPage != null) {
					page++;
					getFirtApi();
					nextPage = page;
				}
				observer.unobserve(lastApi);
			}
		});
	}, opition);

	// defind Listener last api place
	observer.observe(lastApi);
}
getFirtApi();

///// * click the button keyword search and infinite scrolling * /////
let keywordPage = 0;
searchButton.addEventListener("click", (e) => {
	// action after button click
	e.preventDefault();

	// get input text
	let keywordForm = e.target.parentElement;

	let text = keywordForm.children[0].value;

	// clear previous display
	const keywordMainContainer = document.querySelectorAll(".main-container");
	keywordMainContainer.forEach((e) => {
		e.remove();
	});

	// call keyword url api
	async function keywordApi() {
		// fetch attractions url api and convert to json format
		let url = await fetch(
			`/api/attractions?page=${keywordPage}&keyword=${text}`
		);
		let { data, nextPage } = await url.json();

		// use the function create_naw_data created data
		createNawData(data);

		// infinite scrolling find the last item
		let lastApi = document.querySelector(".main-container:last-child");

		// listener scrolling
		let observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// udging the number of pages
					if (nextPage != null) {
						keywordPage++;
						keywordApi();
						nextPage = keywordPage;
					} else if (nextPage == null) {
						keywordPage = 0;
					}
					observer.unobserve(lastApi);
				}
			});
		}, opition);

		// defind Listener last api place
		observer.observe(lastApi);
	}

	keywordApi();
});

////////////////////////////////////////////////////////////////

const bookingTrip = document.querySelector("#booking-trip");

bookingTrip.addEventListener("click", (e) => {
	const cookie = document.cookie.split("=");
	const parser = cookie[1];
	const url = "/api/user/auth";

	// send cookie info to server (GET)
	fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${parser}`,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (data == null) {
				login.style = flexStyle;
			} else {
				window.location.href = "/booking";
			}
		});
});
