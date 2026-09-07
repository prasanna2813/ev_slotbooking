// ========================================
// EVCHARGE - MY BOOKINGS
// ========================================

const API_URL = "http://localhost:5000";

const token = localStorage.getItem("token");


// ========================================
// LOGIN CHECK
// ========================================

if (!token) {
    window.location.href = "login.html";
}


// ========================================
// ELEMENTS
// ========================================

const bookingList =
    document.getElementById("bookingList");

const bookingLoading =
    document.getElementById("bookingLoading");

const emptyBookings =
    document.getElementById("emptyBookings");

const totalBookings =
    document.getElementById("totalBookings");

const activeBookings =
    document.getElementById("activeBookings");

const completedBookings =
    document.getElementById("completedBookings");

const logoutBtn =
    document.getElementById("logoutBtn");


// ========================================
// LOAD MY BOOKINGS
// ========================================

async function loadBookings() {

    bookingLoading.style.display = "block";

    bookingList.innerHTML = "";

    emptyBookings.style.display = "none";


    try {

        const response = await fetch(
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

            bookingLoading.innerHTML = `
                <p>
                    ${
                        data.message ||
                        "Failed to load bookings."
                    }
                </p>
            `;

            return;
        }


        const bookings =
            data.bookings || [];


        bookingLoading.style.display =
            "none";


        // ========================================
        // UPDATE SUMMARY
        // ========================================

        totalBookings.textContent =
            bookings.length;


        const activeCount =
            bookings.filter(
                booking =>
                    booking.status === "Booked"
            ).length;


        const completedCount =
            bookings.filter(
                booking =>
                    booking.status === "Completed"
            ).length;


        activeBookings.textContent =
            activeCount;


        completedBookings.textContent =
            completedCount;


        // ========================================
        // EMPTY BOOKINGS
        // ========================================

        if (bookings.length === 0) {

            emptyBookings.style.display =
                "block";

            return;
        }


        // ========================================
        // DISPLAY BOOKINGS
        // ========================================

        bookings.forEach(
            function (booking) {

                const card =
                    createBookingCard(booking);

                bookingList.appendChild(card);

            }
        );


    } catch (error) {

        console.log(error);

        bookingLoading.innerHTML = `
            <div class="empty-state">

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
// CREATE BOOKING CARD
// ========================================

function createBookingCard(booking) {

    const card =
        document.createElement("div");

    card.className =
        "booking-card";


    // ========================================
    // STATION DETAILS
    // ========================================

    const station =
        booking.stationId;


    const stationName =
        station && station.name
            ? station.name
            : "Charging Station";


    const stationAddress =
        station && station.address
            ? station.address
            : "Address unavailable";


    const chargingType =
        station && station.chargingType
            ? station.chargingType
            : "EV Charging";


    // ========================================
    // DATE & TIME
    // ========================================

    const bookingDate =
        new Date(booking.slotTime);


    const dateText =
        bookingDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    const timeText =
        bookingDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    // ========================================
    // STATUS
    // ========================================

    let statusClass = "";


    if (booking.status === "Booked") {

        statusClass = "booking-active";

    } else if (
        booking.status === "Completed"
    ) {

        statusClass = "booking-completed";

    } else {

        statusClass = "booking-cancelled";

    }


    // ========================================
    // ACTION BUTTONS
    // ========================================

    let actionButtons = "";


    if (booking.status === "Booked") {

        actionButtons = `

            <button
                class="booking-action-btn complete-btn"
                data-id="${booking._id}"
            >
                ✓ Complete
            </button>

            <button
                class="booking-action-btn cancel-btn"
                data-id="${booking._id}"
            >
                ✕ Cancel
            </button>

        `;

    } else if (
        booking.status === "Completed"
    ) {

        actionButtons = `

            <span class="booking-finished">
                ✓ Charging Completed
            </span>

        `;

    } else {

        actionButtons = `

            <span class="booking-finished">
                ✕ Booking Cancelled
            </span>

        `;

    }


    // ========================================
    // CARD HTML
    // ========================================

    card.innerHTML = `

        <div class="booking-card-header">

            <div>

                <span class="booking-label">
                    EV CHARGING
                </span>

                <h3>
                    ${stationName}
                </h3>

                <p>
                    📍 ${stationAddress}
                </p>

            </div>


            <span
                class="booking-status ${statusClass}"
            >
                ${booking.status}
            </span>

        </div>


        <div class="booking-card-details">

            <div class="booking-detail">

                <span>
                    📅 Date
                </span>

                <strong>
                    ${dateText}
                </strong>

            </div>


            <div class="booking-detail">

                <span>
                    🕒 Time
                </span>

                <strong>
                    ${timeText}
                </strong>

            </div>


            <div class="booking-detail">

                <span>
                    ⏱ Duration
                </span>

                <strong>
                    ${booking.duration} min
                </strong>

            </div>


            <div class="booking-detail">

                <span>
                    ⚡ Charging
                </span>

                <strong>
                    ${chargingType}
                </strong>

            </div>


            <div class="booking-detail">

                <span>
                    🚗 Vehicle
                </span>

                <strong>
                    ${booking.vehicleNumber}
                </strong>

            </div>

        </div>


        <div class="booking-card-footer">

            <small>
                Booking ID:
                ${booking._id}
            </small>


            <div class="booking-actions">

                ${actionButtons}

            </div>

        </div>

    `;


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


    return card;

}


// ========================================
// COMPLETE BOOKING
// ========================================

async function completeBooking(
    bookingId
) {

    const confirmed =
        window.confirm(
            "Are you sure you want to complete this booking?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
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

            alert(
                data.message ||
                "Unable to complete booking."
            );

            return;
        }


        alert(
            "Charging session completed successfully!"
        );


        await loadBookings();


    } catch (error) {

        console.log(error);

        alert(
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

    const confirmed =
        window.confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
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

            alert(
                data.message ||
                "Unable to cancel booking."
            );

            return;
        }


        alert(
            "Booking cancelled successfully!"
        );


        await loadBookings();


    } catch (error) {

        console.log(error);

        alert(
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
                "login.html";

        }
    );

}


// ========================================
// START
// ========================================

loadBookings();