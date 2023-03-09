const cookie = document.cookie.split("=");
const parser = cookie[1];
const urlMember = window.location.origin + "/member";

const memnerName = document.querySelector("#member-name");
const memnerEmail = document.querySelector("#member-email");

const memberBookingInfo = document.querySelector(
	".member-booking-info"
);

const memberOrderInfo = document.querySelector(".member-order-info");

const bookingControl = document.querySelector(".booking-control");
const orderControl = document.querySelector(".order-control");

const bookingControl1 = document.querySelector(".booking-control-1");
const bookingControl2 = document.querySelector(".booking-control-2");
const orderControl1 = document.querySelector(".order-control-1");
const orderControl2 = document.querySelector(".order-control-2");

const memberBookingNum = document.querySelector("#member-booking");
const memberOrdersNum = document.querySelector("#member-orders");
const calendarTitle = document.querySelector(".calendar-title");
const bookingTitle = document.querySelector(".booking-title");
const orderTitle = document.querySelector(".order-title");

const calendarControl = document.querySelector(".calendar-control");
const calendar = document.querySelector("#calendar");

const urlMemberApi = window.location.origin + "/api/member";
fetch(urlMemberApi, {
	method: "GET",
	headers: {
		"Content-type": "application/json;",
		Authorization: `Bearer ${parser}`,
	},
})
	.then((response) => response.json())
	.then((api) => {
		if (api.error) {
			location.href = "/";
		} else if (api.message == "找無資料") {
			bookingControl.style = "display :none";
			orderControl.style = "display :none";

			// calendarControl.style = "display :none";
			// calendar.style = "display : none";
			// const notDatamessage1 = document.createElement("div");
			// notDatamessage1.classList.add("not-data-message");
			// notDatamessage1.innerText = api.message;
			// calendarTitle.appendChild(notDatamessage1);
			const notDatamessage2 = document.createElement("div");
			notDatamessage2.classList.add("not-data-message");
			notDatamessage2.innerText = api.message;
			bookingTitle.appendChild(notDatamessage2);
			const notDatamessage3 = document.createElement("div");
			notDatamessage3.classList.add("not-data-message");
			notDatamessage3.innerText = api.message;
			orderTitle.appendChild(notDatamessage3);
		} else {
			const bookingNum = api.data.booking.length;
			const orderNum = api.data.order_done.length;

			memberBookingNum.innerText = bookingNum;
			memberOrdersNum.innerText = orderNum;

			const member = api.data.member;
			const booking = api.data.booking;
			const orders = api.data.order_done;
			memnerName.innerText = member.name;
			memnerEmail.innerText = member.email;

			if (!booking.length) {
				bookingControl.style = "display :none";
			}
			if (!orders.length) {
				orderControl.style = "display :none";
			}

			booking.forEach((item) => {
				const bookingName = item.data.attraction.name;
				const bookingAddress = item.data.attraction.address;
				const bookingDate = item.data.date;
				const bookingTime = item.data.time;
				const bookingPrice = item.data.price;
				const bookingImage = item.data.attraction.image;

				const memberBookingInfoItme = document.createElement("div");
				memberBookingInfoItme.classList.add(
					"member-booking-info-itme"
				);

				const memberBookingInfoItme1 = document.createElement("div");
				memberBookingInfoItme1.classList.add(
					"member-booking-info-itme-1"
				);

				const divItme1 = document.createElement("div");
				const divItme1P = document.createElement("p");
				divItme1P.classList.add("booking-attraction-itme");
				divItme1P.innerText = "景點名稱:";
				const divItme1PName = document.createElement("p");
				divItme1PName.classList.add("booking-attraction-itme-p");
				divItme1PName.innerText = bookingName;
				divItme1.appendChild(divItme1P);
				divItme1.appendChild(divItme1PName);

				const divItme2 = document.createElement("div");
				const divItme2P = document.createElement("p");
				divItme2P.classList.add("booking-attraction-itme");
				divItme2P.innerText = "地點:";
				const divItme2PAddress = document.createElement("p");
				divItme2PAddress.classList.add("booking-attraction-itme-p");
				divItme2PAddress.innerText = bookingAddress;
				divItme2.appendChild(divItme2P);
				divItme2.appendChild(divItme2PAddress);

				const divItme3 = document.createElement("div");
				const divItme3P = document.createElement("p");
				divItme3P.classList.add("booking-attraction-itme");
				divItme3P.innerText = "日期:";
				const divItme3PDate = document.createElement("p");
				divItme3PDate.classList.add("booking-attraction-itme-p");
				divItme3PDate.innerText = bookingDate;
				divItme3.appendChild(divItme3P);
				divItme3.appendChild(divItme3PDate);

				const divItme4 = document.createElement("div");
				const divItme4P = document.createElement("p");
				divItme4P.classList.add("booking-attraction-itme");
				divItme4P.innerText = "時間:";
				const divItme4PTime = document.createElement("p");
				divItme4PTime.classList.add("booking-attraction-itme-p");
				divItme4PTime.innerText = bookingTime;
				divItme4.appendChild(divItme4P);
				divItme4.appendChild(divItme4PTime);

				const divItme5 = document.createElement("div");
				const divItme5P = document.createElement("p");
				divItme5P.classList.add("booking-attraction-itme");
				divItme5P.innerText = "價格:";
				const divItme5PPrice = document.createElement("p");
				divItme5PPrice.classList.add("booking-attraction-itme-p");
				divItme5PPrice.innerText = bookingPrice;
				divItme5.appendChild(divItme5P);
				divItme5.appendChild(divItme5PPrice);

				memberBookingInfoItme1.appendChild(divItme1);
				memberBookingInfoItme1.appendChild(divItme2);
				memberBookingInfoItme1.appendChild(divItme3);
				memberBookingInfoItme1.appendChild(divItme4);
				memberBookingInfoItme1.appendChild(divItme5);

				const memberBookingInfoItme2 = document.createElement("div");
				memberBookingInfoItme2.classList.add(
					"member-booking-info-itme-2"
				);

				const divItme6 = document.createElement("div");
				const divItmeImage = document.createElement("img");
				divItmeImage.src = bookingImage;
				divItme6.appendChild(divItmeImage);

				memberBookingInfoItme2.appendChild(divItme6);

				memberBookingInfoItme.appendChild(memberBookingInfoItme1);
				memberBookingInfoItme.appendChild(memberBookingInfoItme2);

				memberBookingInfo.appendChild(memberBookingInfoItme);
			});

			orders.forEach((item) => {
				const ordersAddress = item.address;
				const ordersAttraction = item.attraction_name;
				const ordersDate = item.date;
				const ordersEmail = item.email;
				const ordersImage = item.image;
				const ordersName = item.name;
				const ordersNumber = item.order_number;
				const ordersPhone = item.phone;
				const ordersPrice = item.price;
				const ordersTime = item.time;

				const memberOrderInfoItme = document.createElement("div");
				memberOrderInfoItme.classList.add("member-order-info-itme");

				const memberOrderInfoItme1 = document.createElement("div");
				memberOrderInfoItme1.classList.add(
					"member-order-info-itme-1"
				);

				const divItme1 = document.createElement("div");
				const divItme1P = document.createElement("p");
				divItme1P.classList.add("member-order-info-p");
				divItme1P.innerText = "訂單編號:";
				const divItme1PName = document.createElement("p");
				divItme1PName.classList.add("member-order-info-itme-p");
				divItme1PName.innerText = ordersNumber;
				divItme1.appendChild(divItme1P);
				divItme1.appendChild(divItme1PName);

				const divItme2 = document.createElement("div");
				const divItme2P = document.createElement("p");
				divItme2P.classList.add("member-order-info-p");
				divItme2P.innerText = "訂購景點:";
				const divItme2PAddress = document.createElement("p");
				divItme2PAddress.classList.add("member-order-info-itme-p");
				divItme2PAddress.innerText = ordersAttraction;
				divItme2.appendChild(divItme2P);
				divItme2.appendChild(divItme2PAddress);

				const divItme3 = document.createElement("div");
				const divItme3P = document.createElement("p");
				divItme3P.classList.add("member-order-info-p");
				divItme3P.innerText = "訂購地點:";
				const divItme3PDate = document.createElement("p");
				divItme3PDate.classList.add("member-order-info-itme-p");
				divItme3PDate.innerText = ordersAddress;
				divItme3.appendChild(divItme3P);
				divItme3.appendChild(divItme3PDate);

				const divItme4 = document.createElement("div");
				const divItme4P = document.createElement("p");
				divItme4P.classList.add("member-order-info-p");
				divItme4P.innerText = "訂購日期:";
				const divItme4PTime = document.createElement("p");
				divItme4PTime.classList.add("member-order-info-itme-p");
				divItme4PTime.innerText = ordersDate;
				divItme4.appendChild(divItme4P);
				divItme4.appendChild(divItme4PTime);

				const divItme5 = document.createElement("div");
				const divItme5P = document.createElement("p");
				divItme5P.classList.add("member-order-info-p");
				divItme5P.innerText = "訂購時間:";
				const divItme5PPrice = document.createElement("p");
				divItme5PPrice.classList.add("member-order-info-itme-p");
				divItme5PPrice.innerText = ordersTime;
				divItme5.appendChild(divItme5P);
				divItme5.appendChild(divItme5PPrice);

				const divItme6 = document.createElement("div");
				const divItme6P = document.createElement("p");
				divItme6P.classList.add("member-order-info-p");
				divItme6P.innerText = "訂購金額:";
				const divItme6PPrice = document.createElement("p");
				divItme6PPrice.classList.add("member-order-info-itme-p");
				divItme6PPrice.innerText = ordersPrice;
				divItme6.appendChild(divItme6P);
				divItme6.appendChild(divItme6PPrice);

				const divItme7 = document.createElement("div");
				const divItme7P = document.createElement("p");
				divItme7P.classList.add("member-order-info-p");
				divItme7P.innerText = "聯絡人姓名:";
				const divItme7PPrice = document.createElement("p");
				divItme7PPrice.classList.add("member-order-info-itme-p");
				divItme7PPrice.innerText = ordersName;
				divItme7.appendChild(divItme7P);
				divItme7.appendChild(divItme7PPrice);

				const divItme8 = document.createElement("div");
				const divItme8P = document.createElement("p");
				divItme8P.classList.add("member-order-info-p");
				divItme8P.innerText = "聯絡人電話:";
				const divItme8PPrice = document.createElement("p");
				divItme8PPrice.classList.add("member-order-info-itme-p");
				divItme8PPrice.innerText = ordersPhone;
				divItme8.appendChild(divItme8P);
				divItme8.appendChild(divItme8PPrice);

				const divItme9 = document.createElement("div");
				const divItme9P = document.createElement("p");
				divItme9P.classList.add("member-order-info-p");
				divItme9P.innerText = "聯絡人信箱:";
				const divItme9PPrice = document.createElement("p");
				divItme9PPrice.classList.add("member-order-info-itme-p");
				divItme9PPrice.innerText = ordersEmail;
				divItme9.appendChild(divItme9P);
				divItme9.appendChild(divItme9PPrice);

				memberOrderInfoItme1.appendChild(divItme1);
				memberOrderInfoItme1.appendChild(divItme2);
				memberOrderInfoItme1.appendChild(divItme3);
				memberOrderInfoItme1.appendChild(divItme4);
				memberOrderInfoItme1.appendChild(divItme5);
				memberOrderInfoItme1.appendChild(divItme6);
				memberOrderInfoItme1.appendChild(divItme7);
				memberOrderInfoItme1.appendChild(divItme8);
				memberOrderInfoItme1.appendChild(divItme9);

				const memberOrderInfoItme2 = document.createElement("div");
				memberOrderInfoItme2.classList.add(
					"member-order-info-itme-2"
				);

				const divItme10 = document.createElement("div");
				const divItmeImage = document.createElement("img");
				divItmeImage.src = ordersImage;
				divItme10.appendChild(divItmeImage);

				memberOrderInfoItme2.appendChild(divItme10);

				memberOrderInfoItme.appendChild(memberOrderInfoItme1);
				memberOrderInfoItme.appendChild(memberOrderInfoItme2);

				const memberOrderInfoItmeHr = document.createElement("hr");
				memberOrderInfoItmeHr.classList.add("order-hr");

				memberOrderInfo.appendChild(memberOrderInfoItme);
				memberOrderInfo.appendChild(memberOrderInfoItmeHr);
			});

			bookingControl.addEventListener("click", (e) => {
				if (memberBookingInfo.style.display === "block") {
					memberBookingInfo.style.display = "none";
					bookingControl1.style.display = "block";
					bookingControl2.style.display = "none";
				} else {
					memberBookingInfo.style.display = "block";
					bookingControl1.style.display = "none";
					bookingControl2.style.display = "block";
				}
			});

			orderControl.addEventListener("click", (e) => {
				if (memberOrderInfo.style.display === "block") {
					memberOrderInfo.style.display = "none";
					orderControl1.style.display = "block";
					orderControl2.style.display = "none";
				} else {
					memberOrderInfo.style.display = "block";
					orderControl1.style.display = "none";
					orderControl2.style.display = "block";
				}
			});
		}
	});

const calendarControl1 = document.querySelector(
	".calendar-control-1"
);
const calendarControl2 = document.querySelector(
	".calendar-control-2"
);
calendarControl.addEventListener("click", (e) => {
	if (calendar.style.display === "none") {
		calendar.style.display = "block";
		calendarControl1.style.display = "block";
		calendarControl2.style.display = "none";
	} else {
		calendar.style.display = "none";
		calendarControl1.style.display = "none";
		calendarControl2.style.display = "block";
	}
});

const modifyInfo = document.querySelector(".modify-info");

const formItem1 = document.querySelector(".form-item-1");
const formItem2 = document.querySelector(".form-item-2");

modifyInfo.addEventListener("click", (e) => {
	if (memnerName.style.display === "none") {
		memnerName.style.display = "block";
		memnerEmail.style.display = "block";
		formItem1.style.display = "none";
		formItem2.style.display = "none";
	} else {
		memnerName.style.display = "none";
		memnerEmail.style.display = "none";
		formItem1.style.display = "flex";
		formItem2.style.display = "flex";
	}
});

const message = document.querySelector(".message");
const messageContent = document.querySelector(".message-content");
const userButton = document.querySelector("#user-button");
const userNmae = document.querySelector("#user-name");
const userEmail = document.querySelector("#user-email");
const messageStyle =
	"color: red; font-size:18px; padding:10px; text-align: center;";
const nameNewRegex = new RegExp("(^[a-zA-Z0-9]+$)");
const emailNewRegex = new RegExp(
	"^[a-z0-9]+@[a-z]+.([a-z]{2,3}|[a-z]{2,3}.[a-z]{2,3})$"
);
userButton.addEventListener("click", (e) => {
	e.preventDefault();
	const updateUserNmae = userNmae.value;
	const updateUserEmail = userEmail.value;

	if (updateUserNmae === "" || updateUserEmail === "") {
		message.style = "display:flex;";
		messageContent.innerText = "請輸入內容";
		messageContent.style = messageStyle;
		message.addEventListener("click", (e) => {
			if (message.style.display == "flex") {
				message.style = "display :none";
			}
		});
	} else if (!emailNewRegex.test(updateUserEmail)) {
		message.style = "display:flex;";
		messageContent.innerText = "信箱輸入錯誤";
		messageContent.style = messageStyle;
		message.addEventListener("click", (e) => {
			if (message.style.display == "flex") {
				message.style = "display :none";
			}
		});
	} else if (!nameNewRegex.test(updateUserNmae)) {
		message.style = "display:flex;";
		messageContent.innerText = "輸入姓名錯誤";
		messageContent.style = messageStyle;
		message.addEventListener("click", (e) => {
			if (message.style.display == "flex") {
				message.style = "display :none";
			}
		});
	} else {
		fetch(urlMemberApi, {
			method: "POST",
			body: JSON.stringify({
				name: updateUserNmae,
				email: updateUserEmail,
			}),
			headers: {
				"Content-type": "application/json;",
				Authorization: `Bearer ${parser}`,
			},
		})
			.then((response) => response.json())
			.then((api) => {
				if (api.error) {
					message.style = "display:flex;";
					messageContent.innerText = "沒有權限";
					messageContent.style = messageStyle;
					message.addEventListener("click", (e) => {
						if (message.style.display == "flex") {
							message.style = "display :none";
						}
					});
				} else {
					message.style = "display:flex;";
					messageContent.innerText = api.message;
					messageContent.style = messageStyle;
					message.addEventListener("click", (e) => {
						if (message.style.display == "flex") {
							message.style = "display :none";
						}
					});

					setTimeout(() => window.location.reload(), 2000);
				}
			});
	}
});
// const modifyPicture = document.querySelector(".modify-picture");
// const pictureInput = document.querySelector("#picture-input");
// const userPicture = document.querySelector("#user-picture");

// modifyPicture.addEventListener("click", () => {
// 	pictureInput.click();
// });
// pictureInput.addEventListener("change", () => {
// 	const file = pictureInput.files[0];
// 	const reader = new FileReader();
// 	reader.onload = () => {
// 		userPicture.src = reader.result;
// 	};
// 	reader.readAsDataURL(file);
// });
