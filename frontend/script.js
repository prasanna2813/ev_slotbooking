// ========================================
// HOME PAGE
// ========================================

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", function () {

        window.location.href = "login.html";

    });

}


// Find Station Button

const findStationBtn =
    document.getElementById("findStationBtn");

if (findStationBtn) {

    findStationBtn.addEventListener("click", function () {

        window.location.href = "stations.html";

    });

}


// Book Slot Button

const bookSlotBtn =
    document.getElementById("bookSlotBtn");

if (bookSlotBtn) {

    bookSlotBtn.addEventListener("click", function () {

        const token = localStorage.getItem("token");

        if (token) {

            window.location.href = "dashboard.html";

        } else {

            window.location.href = "login.html";

        }

    });

}


// CTA Button

const ctaButton =
    document.getElementById("ctaButton");

if (ctaButton) {

    ctaButton.addEventListener("click", function () {

        const token = localStorage.getItem("token");

        if (token) {

            window.location.href = "dashboard.html";

        } else {

            window.location.href = "login.html";

        }

    });

}


// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("loginMessage");


            message.textContent = "Logging in...";
            message.style.color = "#087f45";


            try {

                const response = await fetch(
                    "http://localhost:5000/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                if (response.ok) {

                    // Save login information

                    localStorage.setItem(
                        "token",
                        data.token
                    );

                    localStorage.setItem(
                        "userId",
                        data.userId
                    );


                    message.textContent =
                        "Login successful! Redirecting...";

                    message.style.color =
                        "#087f45";


                    setTimeout(function () {

                        window.location.href =
                            "dashboard.html";

                    }, 700);

                } else {

                    message.textContent =
                        data.message || "Login failed.";

                    message.style.color =
                        "#dc2626";

                }

            } catch (error) {

                console.log(error);

                message.textContent =
                    "Unable to connect to backend.";

                message.style.color =
                    "#dc2626";

            }

        }
    );

}


// ========================================
// REGISTER
// ========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById("name").value.trim();

            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;

            const vehicleNumber =
                document
                    .getElementById("vehicleNumber")
                    .value
                    .trim();

            const vehicleModel =
                document
                    .getElementById("vehicleModel")
                    .value
                    .trim();

            const batteryPercentage =
                Number(
                    document
                        .getElementById("batteryPercentage")
                        .value
                );

            const message =
                document.getElementById(
                    "registerMessage"
                );


            message.textContent =
                "Creating your account...";

            message.style.color =
                "#087f45";


            try {

                const response = await fetch(
                    "http://localhost:5000/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            email: email,

                            password: password,

                            vehicleNumber:
                                vehicleNumber,

                            vehicleModel:
                                vehicleModel,

                            batteryPercentage:
                                batteryPercentage

                        })
                    }
                );


                const data =
                    await response.json();


                if (response.ok) {

                    message.textContent =
                        "Account created successfully!";

                    message.style.color =
                        "#087f45";


                    setTimeout(function () {

                        window.location.href =
                            "login.html";

                    }, 1000);

                } else {

                    message.textContent =
                        data.message ||
                        "Registration failed.";

                    message.style.color =
                        "#dc2626";

                }

            } catch (error) {

                console.log(error);

                message.textContent =
                    "Unable to connect to backend.";

                message.style.color =
                    "#dc2626";

            }

        }
    );

}