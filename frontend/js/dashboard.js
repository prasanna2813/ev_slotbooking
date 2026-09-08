// ========================================
// EVCHARGE - DASHBOARD
// ========================================

const API_URL = "http://localhost:5000";

const token = localStorage.getItem("token");


// ========================================
// LOGIN CHECK
// ========================================

if (!token) {
    window.location.href = "./login.html";
}


// ========================================
// ELEMENTS
// ========================================

const welcomeName =
    document.getElementById("welcomeName");

const profileInitial =
    document.getElementById("profileInitial");

const profileDropdown =
    document.getElementById("profileDropdown");

const profileDropdownInitial =
    document.getElementById("profileDropdownInitial");

const profileDropdownName =
    document.getElementById("profileDropdownName");

const profileDropdownEmail =
    document.getElementById("profileDropdownEmail");

const profileDropdownVehicle =
    document.getElementById("profileDropdownVehicle");

const profileDropdownBattery =
    document.getElementById("profileDropdownBattery");

const profileLogoutBtn =
    document.getElementById("profileLogoutBtn");

const batteryValue =
    document.getElementById("batteryValue");

const batteryLarge =
    document.getElementById("batteryLarge");

const batteryProgress =
    document.getElementById("batteryProgress");

const vehicleNumber =
    document.getElementById("vehicleNumber");

const vehicleModel =
    document.getElementById("vehicleModel");

const bookingCount =
    document.getElementById("bookingCount");

const notificationCount =
    document.getElementById("notificationCount");

const stationList =
    document.getElementById("stationList");

const notificationList =
    document.getElementById("notificationList");

const viewAllStations =
    document.getElementById("viewAllStations");

const viewNotifications =
    document.getElementById("viewNotifications");

const recommendBtn =
    document.getElementById("recommendBtn");

const recommendation =
    document.getElementById("recommendation");

const logoutBtn =
    document.getElementById("logoutBtn");


// ========================================
// PROFILE DROPDOWN
// ========================================

if (profileInitial && profileDropdown) {

    profileInitial.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            profileDropdown.classList.toggle(
                "show"
            );

        }
    );


    // Close dropdown when clicking outside

    document.addEventListener(
        "click",
        function (event) {

            if (
                !profileDropdown.contains(event.target) &&
                !profileInitial.contains(event.target)
            ) {

                profileDropdown.classList.remove(
                    "show"
                );

            }

        }
    );

}


// ========================================
// LOAD USER PROFILE
// ========================================

async function loadProfile() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/auth/profile`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.log(
                "Profile error:",
                data.message
            );

            return;
        }


        const user =
            data.user;


        // ========================================
        // USER NAME
        // ========================================

        if (welcomeName) {

            welcomeName.textContent =
                `Welcome back, ${user.name} 👋`;

        }


        // ========================================
        // PROFILE INITIAL
        // ========================================

        const initial =
            user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U";


        if (profileInitial) {

            profileInitial.textContent =
                initial;

        }


        if (profileDropdownInitial) {

            profileDropdownInitial.textContent =
                initial;

        }


        // ========================================
        // PROFILE DROPDOWN NAME
        // ========================================

        if (profileDropdownName) {

            profileDropdownName.textContent =
                user.name || "User";

        }


        // ========================================
        // PROFILE DROPDOWN EMAIL
        // ========================================

        if (profileDropdownEmail) {

            profileDropdownEmail.textContent =
                user.email || "Email unavailable";

        }


        // ========================================
        // VEHICLE
        // ========================================

        if (vehicleNumber) {

            vehicleNumber.textContent =
                user.vehicleNumber ||
                "Vehicle number unavailable";

        }


        if (vehicleModel) {

            vehicleModel.textContent =
                user.vehicleModel ||
                "Vehicle model unavailable";

        }


        if (profileDropdownVehicle) {

            profileDropdownVehicle.textContent =
                user.vehicleNumber ||
                "Not available";

        }


        // ========================================
        // BATTERY
        // ========================================

        const battery =
            Number(user.batteryPercentage);


        if (!isNaN(battery)) {

            if (batteryValue) {

                batteryValue.textContent =
                    `${battery}%`;

            }


            if (batteryLarge) {

                batteryLarge.textContent =
                    `${battery}%`;

            }


            if (batteryProgress) {

                batteryProgress.style.width =
                    `${battery}%`;

            }


            if (profileDropdownBattery) {

                profileDropdownBattery.textContent =
                    `${battery}%`;

            }

        }

    } catch (error) {

        console.log(
            "Profile connection error:",
            error
        );

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
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.log(
                "Booking error:",
                data.message
            );

            return;
        }


        const bookings =
            data.bookings || [];


        const activeBookings =
            bookings.filter(
                booking =>
                    booking.status === "Booked"
            );


        if (bookingCount) {

            bookingCount.textContent =
                activeBookings.length;

        }

    } catch (error) {

        console.log(
            "Booking connection error:",
            error
        );

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
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.log(
                "Notification error:",
                data.message
            );

            return;
        }


        const notifications =
            data.notifications || [];


        // ========================================
        // UNREAD COUNT
        // ========================================

        const unread =
            notifications.filter(
                notification =>
                    !notification.isRead
            );


        if (notificationCount) {

            notificationCount.textContent =
                unread.length;

        }


        if (!notificationList) {

            return;

        }


        notificationList.innerHTML = "";


        // ========================================
        // NO NOTIFICATIONS
        // ========================================

        if (notifications.length === 0) {

            notificationList.innerHTML = `
                <div class="dashboard-empty">

                    <h3>
                        No recent notifications
                    </h3>

                    <p>
                        You're all caught up.
                    </p>

                </div>
            `;

            return;
        }


        // ========================================
        // DISPLAY RECENT NOTIFICATIONS
        // ========================================

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


                    let icon =
                        "🔔";


                    if (
                        notification.type ===
                        "Booking"
                    ) {

                        icon = "📅";

                    } else if (
                        notification.type ===
                        "Queue"
                    ) {

                        icon = "⏳";

                    } else if (
                        notification.type ===
                        "Reminder"
                    ) {

                        icon = "⏰";

                    }


                    item.innerHTML = `

                        <div class="notification-icon">
                            ${icon}
                        </div>


                        <div class="notification-content">

                            <strong>
                                ${notification.title}
                            </strong>

                            <p>
                                ${notification.message}
                            </p>

                        </div>


                        <span class="notification-status">
                            ${
                                notification.isRead
                                    ? "Read"
                                    : "New"
                            }
                        </span>

                    `;


                    notificationList.appendChild(
                        item
                    );

                }
            );

    } catch (error) {

        console.log(
            "Notification connection error:",
            error
        );

    }

}


// ========================================
// LOAD STATIONS
// ========================================

async function loadStations() {

    if (!stationList) {

        return;

    }


    stationList.innerHTML = `
        <div class="loading">
            Loading charging stations...
        </div>
    `;


    try {

        const response =
            await fetch(
                `${API_URL}/api/stations`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            stationList.innerHTML = `

                <div class="dashboard-empty">

                    <h3>
                        Unable to load stations
                    </h3>

                    <p>
                        ${
                            data.message ||
                            "Please try again."
                        }
                    </p>

                </div>

            `;

            return;
        }


        const stations =
            data.stations || [];


        // ========================================
        // DISPLAY ALL STATIONS
        // ========================================

        stationList.innerHTML = "";


        if (stations.length === 0) {

            stationList.innerHTML = `

                <div class="dashboard-empty">

                    <h3>
                        No charging stations
                    </h3>

                    <p>
                        No stations are available currently.
                    </p>

                </div>

            `;

            return;

        }


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


                    const isAvailable =
                        station.availableSlots > 0;


                    card.innerHTML = `

                        <div class="dashboard-station-info">

                            <div class="station-mini-icon">
                                ⚡
                            </div>


                            <div>

                                <h3>
                                    ${station.name}
                                </h3>

                                <p>
                                    📍 ${station.address}
                                </p>

                                <span>
                                    ${station.chargingType}
                                </span>

                            </div>

                        </div>


                        <div class="dashboard-station-right">

                            <strong>
                                ${
                                    station.availableSlots
                                }/${station.totalSlots}
                            </strong>


                            <span
                                class="${
                                    isAvailable
                                        ? "available"
                                        : "full"
                                }"
                            >
                                ${
                                    isAvailable
                                        ? "Available"
                                        : "Full"
                                }
                            </span>


                            <button
                                class="mini-book-btn"
                            >
                                ${
                                    isAvailable
                                        ? "Book →"
                                        : "Join Queue →"
                                }
                            </button>

                        </div>

                    `;


                    const bookBtn =
                        card.querySelector(
                            ".mini-book-btn"
                        );


                    if (bookBtn) {

                        bookBtn.addEventListener(
                            "click",
                            function () {

                                localStorage.setItem(
                                    "selectedStationId",
                                    station._id
                                );


                                window.location.href =
                                    `./booking.html?stationId=${station._id}`;

                            }
                        );

                    }


                    stationList.appendChild(
                        card
                    );

                }
            );


    } catch (error) {

        console.log(
            "Station connection error:",
            error
        );


        stationList.innerHTML = `

            <div class="dashboard-empty">

                <h3>
                    Unable to connect
                </h3>

                <p>
                    Please make sure the backend
                    server is running.
                </p>

            </div>

        `;

    }

}


// ========================================
// FIND BEST STATION
// ========================================

if (recommendBtn) {

    recommendBtn.addEventListener(
        "click",
        async function () {

            recommendBtn.disabled =
                true;


            recommendBtn.textContent =
                "Finding best station...";


            if (recommendation) {

                recommendation.innerHTML = `

                    <div class="loading">
                        Analyzing nearby stations...
                    </div>

                `;

            }


            try {

                const latitude =
                    13.6288;


                const longitude =
                    79.4192;


                const response =
                    await fetch(
                        `${API_URL}/api/stations/recommend?latitude=${latitude}&longitude=${longitude}`,
                        {
                            method: "GET",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    if (recommendation) {

                        recommendation.innerHTML = `

                            <div class="dashboard-empty">

                                <h3>
                                    No recommendation available
                                </h3>

                                <p>
                                    ${
                                        data.message ||
                                        "No suitable station found."
                                    }
                                </p>

                            </div>

                        `;

                    }

                    return;
                }


                const best =
                    data.recommendedStation;


                if (!best) {

                    return;

                }


                const station =
                    best.station;


                if (recommendation) {

                    recommendation.innerHTML = `

                        <div class="recommendation-card">

                            <div class="recommendation-top">

                                <div>

                                    <span class="recommendation-label">
                                        ⭐ BEST MATCH FOR YOUR BATTERY
                                    </span>

                                    <h3>
                                        ${station.name}
                                    </h3>

                                    <p>
                                        📍 ${station.address}
                                    </p>

                                </div>


                                <div class="recommendation-score">
                                    ${best.score}
                                </div>

                            </div>


                            <div class="recommendation-grid">

                                <div>
                                    <span>
                                        📍 Distance
                                    </span>

                                    <strong>
                                        ${best.distance} km
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        🔌 Available Slots
                                    </span>

                                    <strong>
                                        ${best.availableSlots}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        👥 Waiting Users
                                    </span>

                                    <strong>
                                        ${best.waitingUsers}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        ⏱ Estimated Wait
                                    </span>

                                    <strong>
                                        ${best.estimatedWaitTime} min
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        ⚡ Charging Type
                                    </span>

                                    <strong>
                                        ${station.chargingType}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        💰 Price
                                    </span>

                                    <strong>
                                        ₹${station.pricePerUnit}/unit
                                    </strong>
                                </div>

                            </div>


                            <button
                                class="recommendation-book-btn"
                                id="recommendationBookBtn"
                            >
                                Book This Station →
                            </button>

                        </div>

                    `;


                    const recommendationBookBtn =
                        document.getElementById(
                            "recommendationBookBtn"
                        );


                    if (recommendationBookBtn) {

                        recommendationBookBtn.addEventListener(
                            "click",
                            function () {

                                localStorage.setItem(
                                    "selectedStationId",
                                    station._id
                                );


                                window.location.href =
                                    `./booking.html?stationId=${station._id}`;

                            }
                        );

                    }

                }

            } catch (error) {

                console.log(
                    "Recommendation error:",
                    error
                );


                if (recommendation) {

                    recommendation.innerHTML = `

                        <div class="dashboard-empty">

                            <h3>
                                Unable to connect
                            </h3>

                            <p>
                                Please make sure the backend
                                server is running.
                            </p>

                        </div>

                    `;

                }

            } finally {

                recommendBtn.disabled =
                    false;


                recommendBtn.textContent =
                    "⚡ Find Best Charging Station";

            }

        }
    );

}


// ========================================
// VIEW ALL STATIONS
// ========================================

if (viewAllStations) {

    viewAllStations.addEventListener(
        "click",
        function () {

            window.location.href =
                "./stations.html";

        }
    );

}


// ========================================
// VIEW ALL NOTIFICATIONS
// ========================================

if (viewNotifications) {

    viewNotifications.addEventListener(
        "click",
        function () {

            window.location.href =
                "./notifications.html";

        }
    );

}


// ========================================
// LOGOUT FUNCTION
// ========================================

function logoutUser() {

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
        "./login.html";
}


// ========================================
// SIDEBAR LOGOUT
// ========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logoutUser
    );

}


// ========================================
// PROFILE DROPDOWN LOGOUT
// ========================================

if (profileLogoutBtn) {

    profileLogoutBtn.addEventListener(
        "click",
        function () {

            logoutUser();

        }
    );

}


// ========================================
// INITIAL LOAD
// ========================================

loadProfile();

loadBookings();

loadNotifications();

loadStations();