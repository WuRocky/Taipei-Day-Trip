///// * get the id in the url * /////
const urlParse = window.location.pathname.split("/").pop();
///// * add the id to the URL of the api * /////
const url = "/api/attractions/" + urlParse;
// const imgUpdate = document.querySelector(".img-update");

///// * create attraction container * /////
async function attractionData() {
	// fetch categories id url api and convert to json format
	const attractionData = await fetch(url);
	const attractionDataJson = await attractionData.json();
	const attractionDataApi = attractionDataJson["data"];
	if (!attractionDataApi) {
		location.href = "/404";
	} else {
		// separate the content of each API
		const nameApi = attractionDataApi["name"];
		const mrtApi = attractionDataApi["mrt"];
		const categoryApi = attractionDataApi["category"];
		const addressApi = attractionDataApi["address"];
		const transportApi = attractionDataApi["transport"];
		const descriptionApi = attractionDataApi["description"];
		const imagesApi = attractionDataApi["images"];

		///// * add api to content * /////
		const attractionsName = document.querySelector(".attractions-name");
		const attractionsNameH2 = document.createElement("h2");
		attractionsNameH2.innerText = nameApi;
		attractionsName.appendChild(attractionsNameH2);

		const attractionsMrt = document.querySelector(".attractions-mrt");
		const attractionsMrtP = document.createElement("p");
		attractionsMrtP.innerText = categoryApi + " at " + mrtApi;
		attractionsMrt.appendChild(attractionsMrtP);

		const attractionsDescribeItme1 = document.querySelector(
			".attractions-describe-itme-1"
		);
		attractionsDescribeItme1.innerText = descriptionApi;

		const attractionsDescribeItme2 = document.querySelector(
			".attractions-describe-itme-2 p"
		);
		attractionsDescribeItme2.innerText = addressApi;

		const tractionsDescribeItme3 = document.querySelector(
			".attractions-describe-itme-3 p"
		);
		tractionsDescribeItme3.innerText = transportApi;

		const attractionsImgDiv = document.querySelector(".attractions-img-div");

		// add css for each image separately
		imagesApi.forEach((item) => {
			// add carousel effect css
			const attractionsImgDivContainer = document.createElement("div");
			attractionsImgDivContainer.classList.add("slides");
			attractionsImgDivContainer.classList.add("effect");
			attractionsImgDivContainer.id = "booking-img";

			const imgUpdate = document.createElement("div");
			imgUpdate.classList.add("img-update");
			const imgUpdateItem1 = document.createElement("div");
			const imgUpdateItem2 = document.createElement("div");
			const imgUpdateItem3 = document.createElement("div");
			const imgUpdateItemP = document.createElement("P");
			imgUpdateItemP.innerText = "Loading..";
			imgUpdate.appendChild(imgUpdateItem1);
			imgUpdate.appendChild(imgUpdateItem2);
			imgUpdate.appendChild(imgUpdateItem3);
			imgUpdate.appendChild(imgUpdateItemP);
			attractionsImgDivContainer.appendChild(imgUpdate);

			// Preload image
			const attractionsImgs = new Image();
			attractionsImgs.src = item;

			attractionsImgs.onload = function () {
				attractionsImgDivContainer.appendChild(attractionsImgs);
				if (attractionsImgs.complete) {
					imgUpdate.style = "display:none";
				}
			};

			attractionsImgDiv.appendChild(attractionsImgDivContainer);

			// decide how many dot
			const dotItem = document.querySelector(".dot-item");
			const dotItemSpan = document.createElement("span");
			dotItemSpan.classList.add("dot");
			dotItem.appendChild(dotItemSpan);
		});

		///// * carousel function * /////

		// click prev "<" page to go back one step
		const prev = document.querySelector(".prev");
		prev.addEventListener("click", function () {
			plusSlides(-1);
		});

		// click next ">" page go in the next step
		const next = document.querySelector(".next");
		next.addEventListener("click", function () {
			plusSlides(1);
		});

		// control carousel function
		function showSlides(n) {
			let i;

			// check how many pictures
			const slides = document.querySelectorAll(
				".attractions-section .attractions-card .attractions-img-div .slides"
			);

			// check how many dot
			const dots = document.querySelectorAll(
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
}

attractionData();

///// * change event for radio buttons * /////
const attrctionForm = document.querySelector(".attractions-travel-form");
const timePanel = document.querySelector(".panel-style");
attrctionForm.addEventListener("change", function (e) {
	const attributes = e.target.attributes;
	const target = e.target;
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

///// * check out book trip and book  trip * /////
const attractionsBookingForm = document.querySelector(
	"#attractions-booking-button"
);

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

	const message = document.querySelector(".message");
	const messageContent = document.querySelector(".message-content");

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
				message.style = "display :flex;";
				messageContent.innerText = api.message;
				message.addEventListener("click", (e) => {
					if (message.style.display == "flex") {
						message.style = "display :none";
					}
				});
			} else if (api.error) {
				// if repeat booking show error
				message.style = "display :flex;";
				messageContent.innerText = api.message;
				message.addEventListener("click", (e) => {
					if (message.style.display == "flex") {
						message.style = "display :none";
					}
				});
			} else {
				// if booked successfully move to booking page
				message.style = "display :flex;";
				messageContent.innerText = "預定成功";
				messageContent.style = "color : #666666";
				message.addEventListener("click", (e) => {
					if (message.style.display == "flex") {
						message.style = "display :none";
					}
				});
				setTimeout(() => (location.href = urlBook), 1000);
			}
		});
});
