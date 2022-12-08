const loginRegister = document.querySelector("#login-register");
const login = document.querySelector(".login");
const loginRegisterButton = document.querySelector(".login-register-button");
const register = document.querySelector(".register");
const loginDivButton = document.querySelector(".login-div-button");
const registerDivButton = document.querySelector(".register-div-button");
const RegisterGiveBack = document.querySelector("#register-give-back");
const registerDiv = document.querySelector(".register-div");
const registerForm = document.querySelector(".register-form");
const logingGiveBack = document.querySelector("#login-give-back");
const loginDiv = document.querySelector(".login-div");
const loginForm = document.querySelector(".login-form");
const logoutMember = document.querySelector("#logout-member");

// make login and Register div
window.addEventListener("mouseup", function (event) {
	// show login div
	loginRegister.addEventListener("click", (e) => {
		login.style = "display: flex;";
	});

	// if click close or not login div, login div hide
	if (
		!event.target.closest(".login-div") ||
		event.target.closest(".login-close")
	) {
		login.style = "display: none;";
	} else if (event.target.closest(".login-register-button")) {
		login.style = "display: none;";
	}
	// if click register text，show register div
	loginRegisterButton.addEventListener("click", (e) => {
		register.style = "display: flex;";
	});

	// if click close or not register div, register div hide
	if (
		!event.target.closest(".register-div") ||
		event.target.closest(".register-close")
	) {
		register.style = "display: none;";
	} else if (event.target.closest(".login-button")) {
		register.style = "display: none;";
		login.style = "display: flex;";
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
			// get server response, made according data show different content
			if (data.ok) {
				window.location.reload();
			} else {
				logingGiveBack.innerText = "登入失敗";
				logingGiveBack.style = "color: red;  display: flex;";
				loginDiv.style = "height: 332px";
				loginForm.style = "height: 292px";
			}
		});
});

// click register button info
registerDivButton.addEventListener("click", (e) => {
	e.preventDefault();

	// get input word info
	const form = e.target.parentElement;
	const name = form.children[2].value;
	const email = form.children[3].value;
	const password = form.children[4].value;
	const emailError = email.indexOf("@");
	const url = "/api/user/auth";

	// front-end exclusion error content
	if (name === "" || password === "" || email === "") {
		RegisterGiveBack.innerText = "請輸入資料";
		RegisterGiveBack.style = "color: red;  display: flex;";
		registerDiv.style = "height: 379px";
		registerForm.style = "height: 339px";
		e.preventDefault();
	} else if (emailError <= 0) {
		RegisterGiveBack.innerText = "您輸入的 E-mail 不正確";
		RegisterGiveBack.style = "color: red;  display: flex;";
		registerDiv.style = "height: 379px";
		registerForm.style = "height: 339px";
		e.preventDefault();
	} else if (name == 0 || password == 0 || email == 0) {
		RegisterGiveBack.innerText = "不可以留白";
		RegisterGiveBack.style = "color: red;  display: flex;";
		registerDiv.style = "height: 379px";
		registerForm.style = "height: 339px";
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
				// get server response, made according data show different content
				if (data.ok) {
					RegisterGiveBack.innerText = "註冊成功";
					RegisterGiveBack.style = "color: green; display: flex;";
					registerDiv.style = "height: 379px";
					registerForm.style = "height: 339px";
				} else {
					RegisterGiveBack.innerText = "Emil 已經註冊帳戶";
					RegisterGiveBack.style = "color: red;  display: flex;";
					registerDiv.style = "height: 379px";
					registerForm.style = "height: 339px";
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
		logoutMember.style = "display : none";
	} else if (cookieCheck != NaN && parts[0] == "Token") {
		logoutMember.classList.add("#logout-member");
		loginRegister.style = "display: none";
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
				alert("登出失敗");
			}
		});
});
