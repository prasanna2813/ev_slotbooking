// ========================================
// EVCHARGE - MY BOOKINGS
// ========================================

const API_URL = "http://localhost:5000";

const token =
    localStorage.getItem("token");


// ========================================
// LOGIN CHECK
// ========================================

if (!token) {

    window.location.href =
        "./login.html";

}


// ========================================
// ELEMENTS
// ========================================

const bookingList =
    document.getElementById("bookingList");

const totalBookings =
    document.getElementById("totalBookings");

const activeBookings =
    document.getElementById("activeBookings");

const completedBookings =
    document.getElementById("completedBookings");

const logoutBtn =
    document.getElementById("logoutBtn");


// ========================================
// LOAD BOOKINGS
// ========================================

async function loadBookings() {

    if (!bookingList) {
        return;
    }


    bookingList.innerHTML = `

        <div class="loading">
            Loading your bookings...
        </div>

    `;


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

            bookingList.innerHTML = `

                <div class="dashboard-empty">

                    <h3>
                        Unable to load bookings
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


        const bookings =
            data.bookings || [];


        // ========================================
        // UPDATE STATS
        // ========================================

        const active =
            bookings.filter(
                booking =>
                    booking.status === "Booked"
            ).length;


        const completed =
            bookings.filter(
                booking =>
                    booking.status === "Completed"
            ).length;


        if (totalBookings) {

            totalBookings.textContent =
                bookings.length;

        }


        if (activeBookings) {

            activeBookings.textContent =
                active;

        }


        if (completedBookings) {

            completedBookings.textContent =
                completed;

        }


        // ========================================
        // EMPTY
        // ========================================

        bookingList.innerHTML = "";


        if (bookings.length === 0) {

            bookingList.innerHTML = `

                <div class="dashboard-empty">

                    <h3>
                        No bookings yet
                    </h3>

                    <p>
                        Book a charging slot to see it here.
                    </p>

                    <button
                        class="recommend-btn"
                        id="findStationBtn"
                    >
                        ⚡ Find Charging Station
                    </button>

                </div>

            `;


            const findStationBtn =
                document.getElementById(
                    "findStationBtn"
                );


            if (findStationBtn) {

                findStationBtn.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            "./stations.html";

                    }
                );

            }


            return;
        }


        // ========================================
        // DISPLAY BOOKINGS
        // ========================================

        bookings.forEach(
            function (booking) {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "dashboard-panel";


                // STATION DATA

                const station =
                    booking.stationId || {};


                const stationName =
                    station.name ||
                    "Charging Station";


                const stationAddress =
                    station.address ||
                    "Address unavailable";


                const chargingType =
                    station.chargingType ||
                    "Charging type unavailable";


                // DATE

                const date =
                    new Date(
                        booking.slotTime
                    );


                const formattedDate =
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    );


                const formattedTime =
                    date.toLocaleTimeString(
                        "en-IN",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );


                // STATUS

                let statusText =
                    booking.status;


                let statusClass =
                    "";


                if (
                    booking.status ===
                    "Booked"
                ) {

                    statusText =
                        "Active";

                    statusClass =
                        "available";

                } else if (
                    booking.status ===
                    "Completed"
                ) {

                    statusText =
                        "Completed";

                } else if (
                    booking.status ===
                    "Cancelled"
                ) {

                    statusText =
                        "Cancelled";

                }


                // CARD

                card.innerHTML = `

                    <div class="panel-header">

                        <div>

                            <span>
                                ${statusText}
                            </span>

                            <h2>
                                ${stationName}
                            </h2>

                        </div>

                        <strong
                            class="${statusClass}"
                        >
                            ${statusText}
                        </strong>

                    </div>


                    <div class="dashboard-station-card">

                        <div class="dashboard-station-info">

                            <div class="station-mini-icon">
                                ⚡
                            </div>

                            <div>

                                <h3>
                                    ${stationName}
                                </h3>

                                <p>
                                    📍 ${stationAddress}
                                </p>

                                <span>
                                    ${chargingType}
                                </span>

                            </div>

                        </div>


                        <div class="dashboard-station-right">

                            <strong>
                                ${formattedDate}
                            </strong>

                            <span>
                                🕒 ${formattedTime}
                            </span>

                        </div>

                    </div>


                    <div class="recommendation-grid">

                        <div>

                            <span>
                                ⏱ Duration
                            </span>

                            <strong>
                                ${booking.duration} minutes
                            </strong>

                        </div>


                        <div>

                            <span>
                                🚗 Vehicle
                            </span>

                            <strong>
                                ${booking.vehicleNumber}
                            </strong>

                        </div>

                    </div>


                    ${
                        booking.status === "Booked"
                            ? `

                                <div
                                    style="
                                        display:flex;
                                        gap:10px;
                                        margin-top:20px;
                                    "
                                >

                                    <button
                                        class="recommend-btn complete-btn"
                                        data-id="${booking._id}"
                                    >
                                        ✓ Complete
                                    </button>

                                    <button
                                        class="recommend-btn cancel-btn"
                                        data-id="${booking._id}"
                                    >
                                        ✕ Cancel
                                    </button>

                                </div>

                            `
                            : ""
                    }

                `;


                bookingList.appendChild(
                    card
                );


                // ========================================
                // COMPLETE BUTTON
                // ========================================

                const completeBtn =
                    card.querySelector(
                        ".complete-btn"
                    );


                if (completeBtn) {

                    completeBtn.addEventListener(
                        "click",
                        function () {

                            completeBooking(
                                booking._id
                            );

                        }
                    );

                }


                // ========================================
                // CANCEL BUTTON
                // ========================================

                const cancelBtn =
                    card.querySelector(
                        ".cancel-btn"
                    );


                if (cancelBtn) {

                    cancelBtn.addEventListener(
                        "click",
                        function () {

                            cancelBooking(
                                booking._id
                            );

                        }
                    );

                }

            }
        );


    } catch (error) {

        console.log(
            "Bookings error:",
            error
        );


        bookingList.innerHTML = `

            <div class="dashboard-empty">

                <h3>
                    Unable to connect
                </h3>

                <p>
                    Please make sure the backend server is running.
                </p>

            </div>

        `;

    }

}


// ========================================
// COMPLETE BOOKING
// ========================================

async function completeBooking(
    bookingId
) {

    const confirmComplete =
        window.confirm(
            "Are you sure you want to mark this booking as completed?"
        );


    if (!confirmComplete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/bookings/complete/${bookingId}`,
                {
                    method: "PUT",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            window.alert(
                data.message ||
                "Unable to complete booking."
            );

            return;
        }


        window.alert(
            "Booking completed successfully."
        );


        loadBookings();


    } catch (error) {

        console.log(
            "Complete booking error:",
            error
        );

        window.alert(
            "Unable to connect to backend."
        );

    }

}


// ========================================
// CANCEL BOOKING
// ========================================

async function cancelBooking(
    bookingId
) {

    const confirmCancel =
        window.confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmCancel) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/bookings/cancel/${bookingId}`,
                {
                    method: "PUT",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            window.alert(
                data.message ||
                "Unable to cancel booking."
            );

            return;
        }


        window.alert(
            "Booking cancelled successfully."
        );


        loadBookings();


    } catch (error) {

        console.log(
            "Cancel booking error:",
            error
        );

        window.alert(
            "Unable to connect to backend."
        );

    }

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
                "./login.html";

        }
    );

}


// ========================================
// START
// ========================================

loadBookings();