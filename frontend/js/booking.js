// ========================================
// EVCHARGE - BOOKING
// ========================================

const API_URL = "https://ev-slotbooking-1.onrender.com";

const token = localStorage.getItem("token");


// ========================================
// LOGIN CHECK
// ========================================

if (!token) {
    window.location.href = "./login.html";
}


// ========================================
// GET STATION ID
// ========================================

const urlParams =
    new URLSearchParams(window.location.search);

const stationIdFromURL =
    urlParams.get("stationId");

const selectedStationId =
    stationIdFromURL ||
    localStorage.getItem("selectedStationId");


if (!selectedStationId) {

    window.location.href =
        "./stations.html";
}


// ========================================
// ELEMENTS
// ========================================

const stationName =
    document.getElementById("stationName");

const stationDetails =
    document.getElementById("stationDetails");

const bookingSection =
    document.getElementById("bookingSection");

const queueSection =
    document.getElementById("queueSection");

const bookingForm =
    document.getElementById("bookingForm");

const slotTime =
    document.getElementById("slotTime");

const duration =
    document.getElementById("duration");

const vehicleNumber =
    document.getElementById("vehicleNumber");

const bookBtn =
    document.getElementById("bookBtn");

const bookingMessage =
    document.getElementById("bookingMessage");

const joinQueueBtn =
    document.getElementById("joinQueueBtn");

const queueMessage =
    document.getElementById("queueMessage");

const logoutBtn =
    document.getElementById("logoutBtn");


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
            return;
        }

        if (vehicleNumber) {

            vehicleNumber.value =
                data.user.vehicleNumber || "";

        }

    } catch (error) {

        console.log(
            "Profile error:",
            error
        );

    }

}


// ========================================
// LOAD STATION
// ========================================

async function loadStation() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/stations/${selectedStationId}`,
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

            stationDetails.innerHTML = `

                <div class="dashboard-empty">

                    <h3>
                        Station not found
                    </h3>

                    <p>
                        ${
                            data.message ||
                            "Unable to load station."
                        }
                    </p>

                </div>

            `;

            bookingSection.style.display =
                "none";

            return;
        }

        const station =
            data.station;

        // STATION NAME

        stationName.textContent =
            station.name;


        // STATION DETAILS

        stationDetails.innerHTML = `

            <div class="dashboard-station-card">

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
                        ${station.availableSlots}/${station.totalSlots}
                    </strong>

                    <span class="available">
                        Available Slots
                    </span>

                    <span>
                        ₹${station.pricePerUnit}/unit
                    </span>

                </div>

            </div>

        `;


        // ========================================
        // CHECK AVAILABILITY
        // ========================================

        if (station.availableSlots > 0) {

            bookingSection.style.display =
                "block";

            queueSection.style.display =
                "none";

        } else {

            bookingSection.style.display =
                "none";

            queueSection.style.display =
                "block";

        }

    } catch (error) {

        console.log(
            "Station loading error:",
            error
        );

        stationDetails.innerHTML = `

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
// SET MINIMUM DATE/TIME
// ========================================

function setMinimumDateTime() {

    if (!slotTime) {
        return;
    }

    const now =
        new Date();

    now.setMinutes(
        now.getMinutes() -
        now.getTimezoneOffset()
    );

    const minimum =
        now.toISOString()
            .slice(0, 16);

    slotTime.min =
        minimum;

}


// ========================================
// BOOK SLOT
// ========================================

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const selectedTime =
                slotTime.value;

            const selectedDuration =
                Number(duration.value);

            const vehicle =
                vehicleNumber.value.trim();


            // VALIDATION

            if (!selectedTime) {

                bookingMessage.innerHTML = `

                    <div class="dashboard-empty">

                        <h3>
                            Select date and time
                        </h3>

                    </div>

                `;

                return;
            }


            if (
                !selectedDuration ||
                selectedDuration <= 0
            ) {

                bookingMessage.innerHTML = `

                    <div class="dashboard-empty">

                        <h3>
                            Select charging duration
                        </h3>

                    </div>

                `;

                return;
            }


            if (!vehicle) {

                bookingMessage.innerHTML = `

                    <div class="dashboard-empty">

                        <h3>
                            Enter vehicle number
                        </h3>

                    </div>

                `;

                return;
            }


            const selectedDate =
                new Date(selectedTime);


            if (
                isNaN(
                    selectedDate.getTime()
                )
            ) {

                bookingMessage.innerHTML = `

                    <div class="dashboard-empty">

                        <h3>
                            Invalid date and time
                        </h3>

                    </div>

                `;

                return;
            }


            if (
                selectedDate <= new Date()
            ) {

                bookingMessage.innerHTML = `

                    <div class="dashboard-empty">

                        <h3>
                            Select a future time
                        </h3>

                    </div>

                `;

                return;
            }


            // DISABLE BUTTON

            bookBtn.disabled =
                true;

            bookBtn.textContent =
                "Booking...";


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/bookings`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    stationId:
                                        selectedStationId,

                                    slotTime:
                                        selectedTime,

                                    duration:
                                        selectedDuration,

                                    vehicleNumber:
                                        vehicle

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    bookingMessage.innerHTML = `

                        <div class="dashboard-empty">

                            <h3>
                                Booking failed
                            </h3>

                            <p>
                                ${
                                    data.message ||
                                    "Unable to create booking."
                                }
                            </p>

                        </div>

                    `;

                    return;
                }


                // SUCCESS

                bookingMessage.innerHTML = `

                    <div class="dashboard-empty">

                        <h3>
                            ✅ Booking confirmed
                        </h3>

                        <p>
                            Your charging slot has been booked successfully.
                        </p>

                    </div>

                `;


                // GO TO MY BOOKINGS

                setTimeout(
                    function () {

                        window.location.href =
                            "./bookings.html";

                    },
                    1200
                );


            } catch (error) {

                console.log(
                    "Booking error:",
                    error
                );

                bookingMessage.innerHTML = `

                    <div class="dashboard-empty">

                        <h3>
                            Unable to connect
                        </h3>

                        <p>
                            Please make sure the backend server is running.
                        </p>

                    </div>

                `;

            } finally {

                bookBtn.disabled =
                    false;

                bookBtn.textContent =
                    "⚡ Confirm Booking";

            }

        }
    );

}


// ========================================
// JOIN QUEUE
// ========================================

if (joinQueueBtn) {

    joinQueueBtn.addEventListener(
        "click",
        async function () {

            joinQueueBtn.disabled =
                true;

            joinQueueBtn.textContent =
                "Joining Queue...";


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/queue`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    stationId:
                                        selectedStationId

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    queueMessage.innerHTML = `

                        <div class="dashboard-empty">

                            <h3>
                                Unable to join queue
                            </h3>

                            <p>
                                ${
                                    data.message ||
                                    "Queue request failed."
                                }
                            </p>

                        </div>

                    `;

                    return;
                }


                const queue =
                    data.queue;


                queueMessage.innerHTML = `

                    <div class="dashboard-empty">

                        <h3>
                            ⏳ Added to Queue
                        </h3>

                        <p>
                            Queue Position:
                            <strong>
                                ${queue.position}
                            </strong>
                        </p>

                        <p>
                            Estimated Waiting Time:
                            <strong>
                                ${queue.estimatedWaitTime} minutes
                            </strong>
                        </p>

                    </div>

                `;


                joinQueueBtn.textContent =
                    "Queue Joined";


                joinQueueBtn.disabled =
                    true;


            } catch (error) {

                console.log(
                    "Queue error:",
                    error
                );

                queueMessage.innerHTML = `

                    <div class="dashboard-empty">

                        <h3>
                            Unable to connect
                        </h3>

                        <p>
                            Please make sure the backend server is running.
                        </p>

                    </div>

                `;

                joinQueueBtn.disabled =
                    false;

                joinQueueBtn.textContent =
                    "⏳ Join Charging Queue";

            }

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
                "./login.html";

        }
    );

}


// ========================================
// START
// ========================================

loadProfile();

loadStation();

setMinimumDateTime();