const urlUser = window.location.origin + "/api/user/auth";
const cookie = document.cookie.split("=");
const parser = cookie[1];
const urlBook = window.location.origin + "/booking";
const urlBookApi = window.location.origin + "/api/booking";

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
		} else if (api.booking == false) {
			// check member booking trip
			const notBooking = document.querySelector(".not-booking");
			const notBookingItme = document.createElement("div");
			notBookingItme.classList.add("not-booking-itme");
			notBookingItme.innerText = "目前沒有任何待預訂的行程";
			notBooking.appendChild(notBookingItme);
		} else {
			const bookingAttractionSection = document.querySelector(
				".booking-attraction-section"
			);
			let total = 0;
			api.forEach((item) => {
				const name = item.data["attraction"]["name"];
				const address = item.data["attraction"]["address"];
				const image = item.data["attraction"]["image"];
				const date = item.data["date"];
				const time = item.data["time"];
				const price = item.data["price"];

				total += Math.floor(price);

				const bookingAttractionDiv = document.createElement("div");
				bookingAttractionDiv.classList.add("booking-attraction-div");

				const bookingAttractionInfo = document.createElement("div");
				bookingAttractionInfo.classList.add(
					"booking-attraction-info"
				);

				const bookingAttractionInfoImg =
					document.createElement("div");
				bookingAttractionInfoImg.classList.add(
					"booking-attraction-info-img"
				);

				const imgUpdate = document.createElement("div");
				imgUpdate.classList.add("img-update");
				const divItme1 = document.createElement("div");
				const divItme2 = document.createElement("div");
				const divItme3 = document.createElement("div");
				const imgUpdateP = document.createElement("p");
				imgUpdateP.innerText = "Loading..";
				imgUpdate.appendChild(divItme1);
				imgUpdate.appendChild(divItme2);
				imgUpdate.appendChild(divItme3);
				imgUpdate.appendChild(imgUpdateP);

				bookingAttractionInfoImg.appendChild(imgUpdate);

				const bookingAttractionInfoDiv =
					document.createElement("div");
				bookingAttractionInfoDiv.classList.add(
					"booking-attraction-info-div"
				);

				const bookingAttractionInfoTitle =
					document.createElement("div");
				bookingAttractionInfoTitle.classList.add(
					"booking-attraction-info-title"
				);
				const bookingAttractionInfoTitleP =
					document.createElement("p");
				bookingAttractionInfoTitleP.innerText = "台北一日遊：";
				const infoTitleName = document.createElement("p");
				infoTitleName.classList.add("info-title-name");
				infoTitleName.innerText = name;
				bookingAttractionInfoTitle.appendChild(
					bookingAttractionInfoTitleP
				);
				bookingAttractionInfoTitle.appendChild(infoTitleName);

				const bookingAttractionInfoItme1 =
					document.createElement("div");
				bookingAttractionInfoItme1.classList.add(
					"booking-attraction-info-itme"
				);
				const bookingAttractionInfoItme1P =
					document.createElement("p");
				bookingAttractionInfoItme1P.innerText = "日期：";
				const infoTitleDate = document.createElement("p");
				infoTitleDate.classList.add("info-title-data");
				infoTitleDate.classList.add("info-itme-1");
				infoTitleDate.innerText = date;
				bookingAttractionInfoItme1.appendChild(
					bookingAttractionInfoItme1P
				);
				bookingAttractionInfoItme1.appendChild(infoTitleDate);

				const bookingAttractionInfoItme2 =
					document.createElement("div");
				bookingAttractionInfoItme2.classList.add(
					"booking-attraction-info-itme"
				);
				const bookingAttractionInfoItme2P =
					document.createElement("p");
				bookingAttractionInfoItme2P.innerText = "時間：";
				const infoTitleTime = document.createElement("p");
				infoTitleTime.classList.add("info-title-time");
				infoTitleTime.classList.add("info-itme-1");
				infoTitleTime.innerText = time;
				bookingAttractionInfoItme2.appendChild(
					bookingAttractionInfoItme2P
				);
				bookingAttractionInfoItme2.appendChild(infoTitleTime);

				const bookingAttractionInfoItme3 =
					document.createElement("div");
				bookingAttractionInfoItme3.classList.add(
					"booking-attraction-info-itme"
				);
				const bookingAttractionInfoItme3P =
					document.createElement("p");
				bookingAttractionInfoItme3P.innerText = "費用：";
				const infoTitlePay = document.createElement("p");
				infoTitlePay.classList.add("info-title-pay");
				infoTitlePay.classList.add("info-itme-1");
				infoTitlePay.innerText = price;
				bookingAttractionInfoItme3.appendChild(
					bookingAttractionInfoItme3P
				);
				bookingAttractionInfoItme3.appendChild(infoTitlePay);

				const bookingAttractionInfoItme4 =
					document.createElement("div");
				bookingAttractionInfoItme4.classList.add(
					"booking-attraction-info-itme"
				);
				const bookingAttractionInfoItme4P =
					document.createElement("p");
				bookingAttractionInfoItme4P.innerText = "地點：";
				const infoTitlePlace = document.createElement("p");
				infoTitlePlace.classList.add("info-title-place");
				infoTitlePlace.classList.add("info-itme-1");
				infoTitlePlace.innerText = address;
				bookingAttractionInfoItme4.appendChild(
					bookingAttractionInfoItme4P
				);
				bookingAttractionInfoItme4.appendChild(infoTitlePlace);

				bookingAttractionInfoDiv.appendChild(
					bookingAttractionInfoTitle
				);
				bookingAttractionInfoDiv.appendChild(
					bookingAttractionInfoItme1
				);
				bookingAttractionInfoDiv.appendChild(
					bookingAttractionInfoItme2
				);
				bookingAttractionInfoDiv.appendChild(
					bookingAttractionInfoItme3
				);
				bookingAttractionInfoDiv.appendChild(
					bookingAttractionInfoItme4
				);

				const bookingAttractionInfoDelete =
					document.createElement("div");
				bookingAttractionInfoDelete.classList.add(
					"booking-attraction-info-delete"
				);
				const bookingAttractionInfoDeleteImg =
					document.createElement("img");
				bookingAttractionInfoDeleteImg.src =
					"../images/icon_delete.png";
				bookingAttractionInfoDelete.appendChild(
					bookingAttractionInfoDeleteImg
				);

				bookingAttractionInfo.appendChild(bookingAttractionInfoImg);
				bookingAttractionInfo.appendChild(bookingAttractionInfoDiv);
				bookingAttractionInfo.appendChild(
					bookingAttractionInfoDelete
				);
				bookingAttractionDiv.appendChild(bookingAttractionInfo);
				bookingAttractionSection.appendChild(bookingAttractionDiv);

				const bookingAttractionImg = document.createElement("img");
				bookingAttractionImg.classList.add("#booking-attraction-img");
				bookingAttractionImg.onload = () => {
					bookingAttractionInfoImg.appendChild(bookingAttractionImg);
					if (bookingAttractionImg.complete) {
						imgUpdate.style = "display:none";
					}
				};

				bookingAttractionImg.src = image;
			});

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
			priceTotal.innerText = total;

			///// *  all hr * /////
			const hrItme1 = document.querySelector(".hr-item-1");
			const hrItme2 = document.querySelector(".hr-item-2");
			const hrItme3 = document.querySelector(".hr-item-3");
			hrItme1.style = "display:flex";
			hrItme2.style = "display:flex";
			hrItme3.style = "display:flex";
		}

		const deleteButtons = document.querySelectorAll(
			".booking-attraction-info-delete"
		);

		///// * delete booking trip * /////
		deleteButtons.forEach((button) => {
			button.addEventListener("click", (e) => {
				e.preventDefault();
				const message = document.querySelector(".message");
				const messageContent = document.querySelector(
					".message-content"
				);
				const deleteDiv = e.target.parentElement;
				const attractionsName =
					deleteDiv.parentElement.children[1].children[0].children[1]
						.innerText;

				const attractionsdate =
					deleteDiv.parentElement.children[1].children[1].children[1]
						.innerText;

				const attractionsTime =
					deleteDiv.parentElement.children[1].children[2].children[1]
						.innerText;

				const attractionsPay =
					deleteDiv.parentElement.children[1].children[3].children[1]
						.innerText;

				fetch(urlBookApi, {
					method: "DELETE",
					body: JSON.stringify({
						attractionsName: attractionsName,
						attractionsdate: attractionsdate,
						attractionsTime: attractionsTime,
						attractionsPay: attractionsPay,
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
		});
	});

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

		const bookingUsername = document.querySelector(
			".booking-username"
		);
		bookingUsername.innerText = userName;
		const userNameDefault = document.querySelector("#user-name");
		userNameDefault.defaultValue = userName;
	});
