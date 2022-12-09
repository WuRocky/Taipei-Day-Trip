const loginRegister = document.querySelector("#login-register");
const login = document.querySelector(".login");
const loginRegisterButton = document.querySelector(".login-register-button");
const register = document.querySelector(".register");
const loginDivButton = document.querySelector(".login-div-button");
const registerDivButton = document.querySelector(".register-div-button");
const registerGiveBack = document.querySelector("#register-give-back");
const registerDiv = document.querySelector(".register-div");
const registerForm = document.querySelector(".register-form");
const logingGiveBack = document.querySelector("#login-give-back");
const loginDiv = document.querySelector(".login-div");
const loginForm = document.querySelector(".login-form");
const logoutMember = document.querySelector("#logout-member");
const registerDivStyle = "height: 379px";
const registerFormStyle = "height: 339px";
const loginDivStyle = "height: 332px";
const loginFormStyle = "height: 292px";
const giveBackRed = "color: red;  display: flex";
const registerGiveBackgreen = "color: green;  display: flex;";
const noneStyle = "display: none;";
const flexStyle = "display: flex;";
const passwrodRegex = new RegExp("(?=.{2,})");
const nameRegex = new RegExp("(^[a-zA-Z0-9]+$)");
const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

// make login and Register div
window.addEventListener("mouseup", function (event) {
	// show login div
	loginRegister.addEventListener("click", (e) => {
		login.style = flexStyle;
	});

	// if click close or not login div, login div hide
	if (
		!event.target.closest(".login-div") ||
		event.target.closest(".login-close")
	) {
		login.style = noneStyle;
	} else if (event.target.closest(".login-register-button")) {
		login.style = noneStyle;
	}
	// if click register text，show register div
	loginRegisterButton.addEventListener("click", (e) => {
		register.style = flexStyle;
	});

	// if click close or not register div, register div hide
	if (
		!event.target.closest(".register-div") ||
		event.target.closest(".register-close")
	) {
		register.style = noneStyle;
	} else if (event.target.closest(".login-button")) {
		register.style = noneStyle;
		login.style = flexStyle;
	}
});

// click login button info
loginDivButton.addEventListener("click", (e) => {
	e.preventDefault();

	// get input word info
	const form = e.target.parentElement;
	const email = form.children[2].value;
	const password = form.children[3].value;
	const url = "/api/user/auth";

	if (!emailRegex.test(email)) {
		logingGiveBack.innerText = "信箱輸入錯誤";
		logingGiveBack.style = giveBackRed;
		loginDiv.style = loginDivStyle;
		loginForm.style = loginFormStyle;
	} else if (!passwrodRegex.test(password)) {
		logingGiveBack.innerText = "密碼輸入錯誤";
		logingGiveBack.style = giveBackRed;
		loginDiv.style = loginDivStyle;
		loginForm.style = loginFormStyle;
	} else {
		// send login info to server (PUT)
		fetch(url, {
			method: "PUT",
			body: JSON.stringify({
				// this give server input word
				email: email,
				password: password,
			}),
			headers: {
				"Content-type": "application/json;",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				message = data["message"];
				// get server response, made according data show different content
				if (data.ok) {
					window.location.reload();
				} else {
					logingGiveBack.innerText = message;
					logingGiveBack.style = giveBackRed;
					loginDiv.style = loginDivStyle;
					loginForm.style = loginFormStyle;
				}
			});
	}
});

// click register button info
registerDivButton.addEventListener("click", (e) => {
	e.preventDefault();

	// get input word info
	const form = e.target.parentElement;
	const name = form.children[2].value;
	const email = form.children[3].value;
	const password = form.children[4].value;
	const url = "/api/user/auth";
	// front-end exclusion error content
	if (!nameRegex.test(name)) {
		registerGiveBack.innerText = "輸入姓名錯誤";
		registerGiveBack.style = giveBackRed;
		registerDiv.style = registerDivStyle;
		registerForm.style = registerFormStyle;
		e.preventDefault();
	} else if (!emailRegex.test(email)) {
		registerGiveBack.innerText = "輸入的 E-mail 不正確";
		registerGiveBack.style = giveBackRed;
		registerDiv.style = registerDivStyle;
		registerForm.style = registerFormStyle;
		e.preventDefault();
	} else if (!passwrodRegex.test(password)) {
		registerGiveBack.innerText = "密碼須為 2 碼";
		registerGiveBack.style = giveBackRed;
		registerDiv.style = registerDivStyle;
		registerForm.style = registerFormStyle;
		e.preventDefault();
	} else if (name == 0 || password == 0 || email == 0) {
		registerGiveBack.innerText = "不可以留白";
		registerGiveBack.style = giveBackRed;
		registerDiv.style = registerDivStyle;
		registerForm.style = registerFormStyle;
		e.preventDefault();
	} else {
		// send register info to server (POST)
		fetch(url, {
			method: "POST",
			body: JSON.stringify({
				name: name,
				email: email,
				password: password,
			}),
			headers: {
				"Content-type": "application/json;",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				message = data["message"];
				// get server response, made according data show different content
				if (data.ok) {
					registerGiveBack.innerText = "註冊成功";
					registerGiveBack.style = registerGiveBackgreen;
					registerDiv.style = registerDivStyle;
					registerForm.style = registerFormStyle;
				} else {
					registerGiveBack.innerText = message;
					registerGiveBack.style = giveBackRed;
					registerDiv.style = registerDivStyle;
					registerForm.style = registerFormStyle;
				}
			});
	}
});

// get initial info
function initialCheck() {
	// get client cookie
	const cookie = document.cookie.split("=");
	const parser = cookie[1];
	const url = "/api/user/auth";

	// send cookie info to server (GET)
	fetch(url, {
		method: "GET",
		headers: {
			// give server cookie Authorization
			Authorization: `Bearer ${parser}`,
		},
	}).then((response) => response.json());

	// according cookie show login or logout text to client
	const cookieCheck = document.cookie;
	let parts = document.cookie.split("=");
	if (cookieCheck == "" && parts == "") {
		loginRegister.classList.add("#login-register");
		logoutMember.style = noneStyle;
	} else if (cookieCheck != NaN && parts[0] == "Token") {
		logoutMember.classList.add("#logout-member");
		loginRegister.style = noneStyle;
	}
}
initialCheck();

// click logout button info
logoutMember.addEventListener("click", (e) => {
	const cookie = document.cookie.split("=");
	const parser = cookie[1];
	const url = "/api/user/auth";

	// send logout info to server (DELETE)
	fetch(url, {
		method: "DELETE",
		headers: {
			// give server cookie Authorization
			Authorization: `Bearer ${parser}`,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			// get server response, made according data show different content
			if (data.ok) {
				window.location.reload();
			} else {
				alert("伺服器錯誤");
			}
		});
});
