///// * get the id in the url * /////
const urlParse = window.location.pathname.split("/").pop();
///// * add the id to the URL of the api * /////
const url = "/api/attractions/" + urlParse;

///// * create attraction container * /////
async function attractionData() {
	// fetch categories id url api and convert to json format
	let attractionData = await fetch(url);
	let attractionDataJson = await attractionData.json();
	let attractionDataApi = attractionDataJson["data"];

	// separate the content of each API
	let nameApi = attractionDataApi["name"];
	let mrtApi = attractionDataApi["mrt"];
	let categoryApi = attractionDataApi["category"];
	let addressApi = attractionDataApi["address"];
	let transportApi = attractionDataApi["transport"];
	let descriptionApi = attractionDataApi["description"];
	let imagesApi = attractionDataApi["images"];

	///// * add api to content * /////
	let attractionsName = document.querySelector(".attractions-name");
	let attractionsNameH2 = document.createElement("h2");
	attractionsNameH2.innerText = nameApi;
	attractionsName.appendChild(attractionsNameH2);

	let attractionsMrt = document.querySelector(".attractions-mrt");
	let attractionsMrtP = document.createElement("p");
	attractionsMrtP.innerText = categoryApi + " at " + mrtApi;
	attractionsMrt.appendChild(attractionsMrtP);

	let attractionsDescribeItme1 = document.querySelector(
		".attractions-describe-itme-1"
	);
	attractionsDescribeItme1.innerText = descriptionApi;

	let attractionsDescribeItme2 = document.querySelector(
		".attractions-describe-itme-2 p"
	);
	attractionsDescribeItme2.innerText = addressApi;

	let ttractionsDescribeItme3 = document.querySelector(
		".attractions-describe-itme-3 p"
	);
	ttractionsDescribeItme3.innerText = transportApi;

	let attractionsImgDiv = document.querySelector(".attractions-img-div");

	// add css for each image separately
	imagesApi.forEach((item) => {
		// add carousel effect css
		let attractionsImgDivContainer = document.createElement("div");
		attractionsImgDivContainer.classList.add("slides");
		attractionsImgDivContainer.classList.add("effect");

		// add a few pictures
		let attractionsImgSrcContainer = document.createElement("img");
		attractionsImgSrcContainer.src = item;
		// attractionsImgSrcContainer.rel = "preload";

		attractionsImgDivContainer.appendChild(attractionsImgSrcContainer);
		attractionsImgDiv.appendChild(attractionsImgDivContainer);

		// decide how many dot
		let dotItem = document.querySelector(".dot-item");
		let dotItemSpan = document.createElement("span");
		dotItemSpan.classList.add("dot");
		dotItem.appendChild(dotItemSpan);
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

attractionData();
