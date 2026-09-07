// ========================================
// EVCHARGE - DASHBOARD
// ========================================

const API_URL =
    "http://localhost:5000";

const token =
    localStorage.getItem("token");


// ========================================
// LOGIN CHECK
// ========================================

if (!token) {

    window.location.href =
        "login.html";

}


// ========================================
// ELEMENTS
// ========================================

const userName =
    document.getElementById("userName");

const userInitial =
    document.getElementById("userInitial");

const batteryValue =
    document.getElementById("batteryValue");

const batteryProgress =
    document.getElementById("batteryProgress");

const chargingType =
    document.getElementById("chargingType");

const vehicleNumber =
    document.getElementById("vehicleNumber");

const vehicleModel =
    document.getElementById("vehicleModel");

const bookingCount =
    document.getElementById("bookingCount");

const notificationCount =
    document.getElementById(
        "notificationCount"
    );

const stationList =
    document.getElementById("stationList");

const notificationList =
    document.getElementById(
        "notificationList"
    );

const logoutBtn =
    document.getElementById("logoutBtn");


// ========================================
// LOAD PROFILE
// ========================================

async function loadProfile() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/auth/profile`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            return;

        }


        const user =
            data.user;


        // Name

        if (userName) {

            userName.textContent =
                user.name;

        }


        // Initial

        if (userInitial) {

            userInitial.textContent =
                user.name
                    .charAt(0)
                    .toUpperCase();

        }


        // Battery

        if (batteryValue) {

            batteryValue.textContent =
                `${user.batteryPercentage}%`;

        }


        if (batteryProgress) {

            batteryProgress.style.width =
                `${user.batteryPercentage}%`;

        }


        // Vehicle

        if (vehicleNumber) {

            vehicleNumber.textContent =
                user.vehicleNumber;

        }


        if (vehicleModel) {

            vehicleModel.textContent =
                user.vehicleModel;

        }


        // Charging Type

        if (chargingType) {

            chargingType.textContent =
                "EV Charging";

        }


    } catch (error) {

        console.log(error);

    }

}


// ========================================
// LOAD BOOKINGS
// ========================================

async function loadBookings() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/bookings/my-bookings`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            return;

        }


        const bookings =
            data.bookings || [];


        if (bookingCount) {

            bookingCount.textContent =
                bookings.filter(
                    booking =>
                        booking.status === "Booked"
                ).length;

        }


    } catch (error) {

        console.log(error);

    }

}


// ========================================
// LOAD NOTIFICATIONS
// ========================================

async function loadNotifications() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/notifications`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            return;

        }


        const notifications =
            data.notifications || [];


        const unread =
            notifications.filter(
                notification =>
                    !notification.isRead
            );


        if (notificationCount) {

            notificationCount.textContent =
                unread.length;

        }


        // Recent notifications

        if (notificationList) {

            notificationList.innerHTML = "";


            notifications
                .slice(0, 4)
                .forEach(
                    function (notification) {

                        const item =
                            document.createElement(
                                "div"
                            );

                        item.className =
                            "dashboard-notification";


                        item.innerHTML = `

                            <div>

                                <strong>
                                    ${notification.title}
                                </strong>

                                <p>
                                    ${notification.message}
                                </p>

                            </div>

                            <span>
                                ${
                                    notification.isRead
                                        ? "Read"
                                        : "New"
                                }
                            </span>

                        `;


                        notificationList
                            .appendChild(item);

                    }
                );

        }


    } catch (error) {

        console.log(error);

    }

}


// ========================================
// LOAD STATIONS
// ========================================

async function loadStations() {

    if (!stationList) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/stations`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            return;

        }


        const stations =
            data.stations || [];


        stationList.innerHTML = "";


        stations
            .slice(0, 3)
            .forEach(
                function (station) {

                    const card =
                        document.createElement(
                            "div"
                        );

                    card.className =
                        "dashboard-station-card";


                    const status =
                        station.availableSlots > 0
                            ? "Available"
                            : "Full";


                    card.innerHTML = `

                        <div>

                            <h3>
                                ${station.name}
                            </h3>

                            <p>
                                📍 ${station.address}
                            </p>

                        </div>


                        <div>

                            <strong>
                                ${station.availableSlots}
                                /
                                ${station.totalSlots}
                                slots
                            </strong>

                            <span>
                                ${status}
                            </span>

                        </div>

                    `;


                    stationList
                        .appendChild(card);

                }
            );


    } catch (error) {

        console.log(error);

    }

}


// ========================================
// VIEW ALL STATIONS
// ========================================

const viewStationsBtn =
    document.getElementById(
        "viewStationsBtn"
    );


if (viewStationsBtn) {

    viewStationsBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "stations.html";

        }
    );

}


// ========================================
// VIEW NOTIFICATIONS
// ========================================

const viewNotificationsBtn =
    document.getElementById(
        "viewNotificationsBtn"
    );


if (viewNotificationsBtn) {

    viewNotificationsBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "notifications.html";

        }
    );

}


// ========================================
// BOOK SLOT
// ========================================

const bookSlotBtn =
    document.getElementById(
        "bookSlotBtn"
    );


if (bookSlotBtn) {

    bookSlotBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "stations.html";

        }
    );

}


// ========================================
// RECOMMEND STATION
// ========================================

const recommendBtn =
    document.getElementById(
        "recommendBtn"
    );


if (recommendBtn) {

    recommendBtn.addEventListener(
        "click",
        async function () {

            recommendBtn.textContent =
                "Finding Best Station...";


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/stations/recommend?latitude=13.6288&longitude=79.4192`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to generate recommendation."
                    );

                    return;

                }


                const station =
                    data.recommendedStation;


                alert(
                    `Recommended Station: ${station.station.name}\n\nDistance: ${station.distance} km\nAvailable Slots: ${station.availableSlots}\nEstimated Wait: ${station.estimatedWaitTime} minutes`
                );


            } catch (error) {

                console.log(error);

                alert(
                    "Unable to connect to backend."
                );

            }


            recommendBtn.textContent =
                "Find Best Station";

        }
    );

}


// ========================================
// LOGOUT
// ========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "userId"
            );

            localStorage.removeItem(
                "selectedStationId"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ========================================
// START DASHBOARD
// ========================================

loadProfile();

loadBookings();

loadNotifications();

loadStations();