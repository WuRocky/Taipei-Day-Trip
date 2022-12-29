const cookie = document.cookie.split("=");
const parser = cookie[1];
const urlBookApi = window.location.origin + "/api/booking";

///// * check if the user is logged in * ////
fetch(urlBookApi, {
	method: "GET",
	headers: {
		"Content-type": "application/json;",
		Authorization: `Bearer ${parser}`,
	},
})
	.then((response) => response.json())
	.then((api) => {
		// if not get order number move to homepage
		if (api.message == "未登入系統，拒絕存取") {
			location.href = "/";
		}
	});

///// * get the URL order number on the URL * ////
const orderNumber = window.location.search;
const regex = /\?number=(\d+)/;
const match = regex.exec(orderNumber);
///// * if the URL does not have an order number, redirect to the home page * ////
if (match == null) {
	location.href = "/";
}

///// * get the order number string on the URL * ////
const number = match[1];
const apiOthor = window.location.origin + "/api/order" + orderNumber;
const getOrderNumber = document.querySelector(".order-number");

///// * send the string to the backend api/order/ using the get method * ////
fetch(apiOthor, {
	method: "GET",
	headers: {
		"Content-type": "application/json;",
		Authorization: `Bearer ${parser}`,
	},
})
	.then((response) => response.json())
	.then((api) => {
		///// * get the data and order number return by the backend add to screen * ////
		getOrderNumber.innerHTML = api.data["number"][0];
	});

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
