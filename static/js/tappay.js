///// * use TapPay Fields SetupSDK * /////
TPDirect.setupSDK(
	126871,
	"app_a3gfmunokavPpeW1DAkFdxMzFWltrGbmwDMO0R7Wtl7dDTEE98QUA6xPSXLp",
	"sandbox"
);

///// * use TapPay Fields TPDirect.card.setup element and style * /////
TPDirect.card.setup({
	fields: {
		number: {
			element: "#card-number",
			placeholder: "**** **** **** ****",
		},
		expirationDate: {
			element: "#card-expiration-date",
			placeholder: "MM / YY",
		},
		ccv: {
			element: "#card-ccv",
			placeholder: "CVV",
		},
	},
	styles: {
		input: {
			color: "gray",
		},
		":focus": {
			color: "GoldenRod",
		},
		".valid": {
			color: "green",
		},
		".invalid": {
			color: "red",
		},
	},

	isMaskCreditCardNumber: true,
	maskCreditCardNumberRange: {
		beginIndex: 6,
		endIndex: 11,
	},
});

///// * use TapPay Fields onUpdate if card input error not buttom * /////
const btn = document.querySelector(".btn");
TPDirect.card.onUpdate(function (update) {
	if (update.canGetPrime) {
		btn.removeAttribute("disabled");
	} else {
		btn.setAttribute("disabled", true);
	}
});

///// * if user not input personal information and card show error * /////
const apiOthor = window.location.origin + "/api/order";
const thankyou = window.location.origin + "/thankyou";
btn.addEventListener("click", (e) => {
	e.preventDefault();
	const message = document.querySelector(".message");
	const messageContent = document.querySelector(".message-content");
	const userName = document.querySelector("#user-name").value;
	const userEmail = document.querySelector("#user-email").value;
	const userPhone = document.querySelector("#user-phone").value;
	const userNameWeb = document.querySelector(".booking-username").innerText;
	const tappayStatus = TPDirect.card.getTappayFieldsStatus();
	if (
		(userName == null || userName == "",
		userEmail == null || userEmail == "",
		userPhone == null || userPhone == "")
	) {
		message.style = "display :flex;";
		messageContent.innerText = "請輸入聯絡資訊";
		message.addEventListener("click", (e) => {
			if (message.style.display == "flex") {
				message.style = "display :none";
			}
		});
		return;
	}

	if (tappayStatus.canGetPrime === false) {
		message.style = "display :flex;";
		messageContent.innerText = "請輸入信用卡付款資訊";
		message.addEventListener("click", (e) => {
			if (message.style.display == "flex") {
				message.style = "display :none";
			}
		});
		return;
	}

	///// *  get TapPay Fields prime return information * /////
	TPDirect.card.getPrime((result) => {
		if (result.status !== 0) {
			message.style = "display :flex;";
			messageContent.innerText = result.msg;
			message.addEventListener("click", (e) => {
				if (message.style.display == "flex") {
					message.style = "display :none";
				}
			});
			return;
		}
		const cardPrime = result.card.prime;

		///// *  if get prime success return backend storage information* /////
		fetch(apiOthor, {
			method: "POST",
			body: JSON.stringify({
				prime: cardPrime,
				name: userName,
				email: userEmail,
				phone: userPhone,
				userNameWeb: userNameWeb,
			}),
			headers: {
				"Content-type": "application/json;",
				Authorization: `Bearer ${parser}`,
			},
		})
			.then((response) => response.json())
			.then((api) => {
				if (api) {
					///// *  get backend order number lead to thank you page * /////
					message.style = "display :flex;";
					messageContent.innerText = "訂單完成";
					message.addEventListener("click", (e) => {
						if (message.style.display == "flex") {
							message.style = "display :none";
						}
					});
					setTimeout(
						///// * get the order number directed to thank you page * /////
						() => (location.href = thankyou + "?number=" + api.data["number"]),
						1000
					);
				}
			});
	});
});
