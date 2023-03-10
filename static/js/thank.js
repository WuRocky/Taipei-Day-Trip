///// * get the URL order number on the URL * ////
const orderNumber = window.location.search;

// ///// * get the order number string on the URL * ////
const apiOthor = window.location.origin + "/api/order" + orderNumber;
const getOrderNumber = document.querySelector(".order-number");
const cookie = document.cookie.split("=");
const parser = cookie[1];
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
		if (api.error) {
			location.href = "/";
		} else {
			getOrderNumber.innerHTML = api.data["number"][0];
		}
		///// * get the data and order number return by the backend add to screen * ////
	});
