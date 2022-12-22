const urlUser = window.location.origin + "/api/user/auth";
const cookie = document.cookie.split("=");
const parser = cookie[1];
const urlBook = window.location.origin + "/booking";
const urlBookApi = window.location.origin + "/api/booking";
const deleteButton = document.querySelector(".booking-attraction-info-delete");

///// * get member username * /////
fetch(urlUser, {
	method: "GET",
	headers: {
		"Content-type": "application/json;",
		Authorization: `Bearer ${parser}`,
	},
})
	.then((response) => response.json())
	.then((api) => {
		const userName = api.data["name"];
		const bookingUsername = document.querySelector(".booking-username");
		bookingUsername.innerText = userName;
	});

///// * check the user is login and get booking trip * /////
fetch(urlBookApi, {
	method: "GET",
	headers: {
		"Content-type": "application/json;",
		Authorization: `Bearer ${parser}`,
	},
})
	.then((response) => response.json())
	.then((api) => {
		// if not login move to homepage
		if (api.message == "未登入系統，拒絕存取") {
			location.href = "/";
		}
		// check member booking trip
		if (api.booking == false) {
			const notBooking = document.querySelector(".not-booking");
			const notBookingItme = document.createElement("div");
			notBookingItme.classList.add("not-booking-itme");
			notBookingItme.innerText = "目前沒有任何待預訂的行程";
			notBooking.appendChild(notBookingItme);
		} else {
			// get server booking api data
			const name = api.data["attraction"]["name"];
			const address = api.data["attraction"]["address"];
			const image = api.data["attraction"]["image"];
			const date = api.data["date"];
			const time = api.data["time"];
			const price = api.data["price"];

			///// * booking-attraction * /////
			const bookingAttractionSection = document.querySelector(
				".booking-attraction-section"
			);
			bookingAttractionSection.style = "display:flex";

			const bookingAttractionInfoImg = document.querySelector(
				".booking-attraction-info-img"
			);
			const imgUpdate = document.querySelector(".img-update");
			const bookingAttractionImg = document.createElement("img");
			bookingAttractionImg.classList.add("#booking-attraction-img");
			bookingAttractionImg.onload = () => {
				bookingAttractionInfoImg.appendChild(bookingAttractionImg);
				if (bookingAttractionImg.complete) {
					imgUpdate.style = "display:none";
				}
			};

			bookingAttractionImg.src = image;

			const infoTitleName = document.querySelector(".info-title-name");
			infoTitleName.innerText = name;
			const infoTitleData = document.querySelector(".info-title-data");
			infoTitleData.innerText = date;

			const infoTitleTime = document.querySelector(".info-title-time");
			infoTitleTime.innerText = time;

			const infoTitlePay = document.querySelector(".info-title-pay");
			infoTitlePay.innerText = price;

			const infoTitlePlace = document.querySelector(".info-title-place");
			infoTitlePlace.innerText = address;

			///// * booking-user * /////
			const bookingUserSection = document.querySelector(
				".booking-user-section"
			);
			bookingUserSection.style = "display:flex";

			///// * booking-credit-card * /////
			const bookingCreditCardSection = document.querySelector(
				".booking-credit-card-section"
			);
			bookingCreditCardSection.style = "display:flex";

			///// *  booking-info * /////
			const bookingInfoSection = document.querySelector(
				".booking-info-section"
			);
			bookingInfoSection.style = "display:flex";
			const priceTotal = document.querySelector("#price-total");
			priceTotal.innerText = price;

			///// *  all hr * /////
			const hrItme1 = document.querySelector(".hr-item-1");
			const hrItme2 = document.querySelector(".hr-item-2");
			const hrItme3 = document.querySelector(".hr-item-3");
			hrItme1.style = "display:flex";
			hrItme2.style = "display:flex";
			hrItme3.style = "display:flex";
		}
	});

///// * delete booking trip * /////
deleteButton.addEventListener("click", (e) => {
	e.preventDefault();
	const message = document.querySelector(".message");
	const messageContent = document.querySelector(".message-content");
	const userName = document.querySelector(".booking-username").innerText;

	fetch(urlBookApi, {
		method: "DELETE",
		body: JSON.stringify({
			userName: userName,
		}),
		headers: {
			"Content-type": "application/json;",
			Authorization: `Bearer ${parser}`,
		},
	})
		.then((response) => response.json())
		.then((api) => {
			if (api.ok) {
				message.style = "display :flex;";
				messageContent.innerText = "刪除成功";
				message.addEventListener("click", (e) => {
					if (message.style.display == "flex") {
						message.style = "display :none";
					}
				});
				setTimeout(() => (location.href = urlBook), 1000);
			}
		});
});
