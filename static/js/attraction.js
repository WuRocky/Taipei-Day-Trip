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
		attractionsImgDivContainer.id = "booking-img";

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

///// * change event for radio buttons * /////
const attrctionForm = document.querySelector(".attractions-travel-form");
const timePanel = document.querySelector(".panel-style");
attrctionForm.addEventListener("change", function (e) {
	let attributes = e.target.attributes;
	let target = e.target;
	let message;
	if (attributes["name"].value == "data-time") {
		switch (target.id) {
			case "morning-panel":
				message = "新台幣2000元";
				id = "morning";
				break;
			case "afternoon-panel":
				message = "新台幣2500元";
				id = "afternoon";
				break;
		}
		timePanel.innerText = message;
		timePanel.id = id;
	}
});

///// * chick book trip is there a login * /////
const bookingTrip = document.querySelector("#booking-trip");
const attractionsBookingForm = document.querySelector(
	"#attractions-booking-button"
);

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

///// * check out book trip and book  trip * /////
// get price the amount
const numbersRegex = /\d+/g;

attractionsBookingForm.addEventListener("click", (e) => {
	e.preventDefault();

	// get cookie data
	const cookie = document.cookie.split("=");
	const parser = cookie[1];
	const urlBook = window.location.origin + "/booking";
	const urlBookApi = window.location.origin + "/api/booking";

	// get form info
	const form = e.target.parentElement;
	const date = form.children[3].value;
	const price = form.children[12].innerText;
	const time = form.children[12].id;
	const id = window.location.pathname.split("/").pop();
	const img = document.querySelector("#booking-img img").src;

	// get booking server data
	fetch(urlBookApi, {
		method: "POST",
		body: JSON.stringify({
			// get server data
			date: date,
			price: price,
			time: time,
			id: id,
			img: img,
		}),
		headers: {
			"Content-type": "application/json;",
			Authorization: `Bearer ${parser}`,
		},
	})
		.then((response) => response.json())
		.then((api) => {
			// if not login show login div
			if (api.message == "未登入系統，拒絕存取") {
				login.style = flexStyle;
			} else if (date == "") {
				// if not choose date remind
				alert(api.message);
			} else {
				// if booked successfully move to booking page
				alert("預定成功");
				setTimeout(() => (location.href = urlBook), 1000);
			}
		});
});
