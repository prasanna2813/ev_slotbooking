// ========================================
// EVCHARGE - STATIONS PAGE
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

const stationList =
    document.getElementById("stationList");

const nearbyStations =
    document.getElementById("nearbyStations");

const findNearbyBtn =
    document.getElementById("findNearbyBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


// ========================================
// LOAD ALL STATIONS
// ========================================

async function loadStations() {

    stationList.innerHTML = `
        <p>Loading charging stations...</p>
    `;

    try {

        const response = await fetch(
            `${API_URL}/api/stations`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();


        if (!response.ok) {

            stationList.innerHTML = `
                <p>
                    ${data.message || "Failed to load stations."}
                </p>
            `;

            return;
        }


        const stations = data.stations;


        if (!stations || stations.length === 0) {

            stationList.innerHTML = `
                <div class="empty-state">
                    <h3>No charging stations found</h3>
                    <p>
                        There are currently no charging stations available.
                    </p>
                </div>
            `;

            return;
        }


        stationList.innerHTML = "";


        stations.forEach(function (station) {

            const card =
                createStationCard(station);

            stationList.appendChild(card);

        });


    } catch (error) {

        console.log(error);

        stationList.innerHTML = `
            <div class="empty-state">

                <h3>Unable to connect</h3>

                <p>
                    Please make sure the backend server is running.
                </p>

            </div>
        `;

    }

}


// ========================================
// CREATE STATION CARD
// ========================================

function createStationCard(station, distance = null) {

    const card =
        document.createElement("div");

    card.className =
        "professional-station-card";


    // ========================================
    // AVAILABILITY
    // ========================================

    let statusText = "";

    let statusClass = "";


    if (station.availableSlots > 0) {

        statusText =
            `${station.availableSlots} Slots Available`;

        statusClass =
            "available";

    } else {

        statusText =
            "No Slots Available";

        statusClass =
            "full";

    }


    // ========================================
    // DISTANCE
    // ========================================

    let distanceHTML = "";


    if (distance !== null) {

        distanceHTML = `
            <span class="distance-badge">
                📍 ${distance} km away
            </span>
        `;

    }


    // ========================================
    // BUTTON TEXT
    // ========================================

    let buttonText = "";


    if (station.availableSlots > 0) {

        buttonText =
            "Book Charging Slot →";

    } else {

        buttonText =
            "Join Queue →";

    }


    // ========================================
    // CARD HTML
    // ========================================

    card.innerHTML = `

        <div class="professional-station-image">

            <div class="station-image-icon">
                ⚡
            </div>

            ${distanceHTML}

        </div>


        <div class="professional-station-content">

            <div class="station-card-top">

                <div>

                    <h3>
                        ${station.name}
                    </h3>

                    <p class="station-address">
                        📍 ${station.address}
                    </p>

                </div>


                <span class="station-status ${statusClass}">
                    ${statusText}
                </span>

            </div>


            <div class="station-info-row">

                <div>

                    <span class="info-label">
                        Charging Type
                    </span>

                    <strong>
                        ⚡ ${station.chargingType}
                    </strong>

                </div>


                <div>

                    <span class="info-label">
                        Price
                    </span>

                    <strong>
                        ₹${station.pricePerUnit}/unit
                    </strong>

                </div>


                <div>

                    <span class="info-label">
                        Slots
                    </span>

                    <strong>
                        ${station.availableSlots}
                        / ${station.totalSlots}
                    </strong>

                </div>

            </div>


            <div class="slot-bar">

                <div
                    class="slot-progress"
                    style="width: ${
                        station.totalSlots > 0
                            ? (
                                station.availableSlots /
                                station.totalSlots
                            ) * 100
                            : 0
                    }%"
                ></div>

            </div>


            <button
                class="station-book-btn"
                data-station-id="${station._id}"
            >
                ${buttonText}
            </button>

        </div>

    `;


    // ========================================
    // BOOK / QUEUE BUTTON
    // ========================================

    const button =
        card.querySelector(
            ".station-book-btn"
        );


    button.addEventListener(
        "click",
        function () {

            // Save selected station
            localStorage.setItem(
                "selectedStationId",
                station._id
            );


            // Open booking page
            window.location.href =
                `booking.html?stationId=${station._id}`;

        }
    );


    return card;

}


// ========================================
// FIND NEARBY STATIONS
// ========================================

if (findNearbyBtn) {

    findNearbyBtn.addEventListener(
        "click",
        async function () {

            nearbyStations.innerHTML = `
                <p>
                    Finding nearby charging stations...
                </p>
            `;


            /*
             * Currently using Tirupati coordinates.
             *
             * Later we can replace this with
             * browser GPS location.
             */

            const latitude =
                13.6288;

            const longitude =
                79.4192;

            const radius =
                10;


            try {

                const response = await fetch(
                    `${API_URL}/api/stations/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
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

                    nearbyStations.innerHTML = `
                        <p>
                            ${
                                data.message ||
                                "Unable to find nearby stations."
                            }
                        </p>
                    `;

                    return;
                }


                const stations =
                    data.stations;


                if (
                    !stations ||
                    stations.length === 0
                ) {

                    nearbyStations.innerHTML = `
                        <div class="empty-state">

                            <h3>
                                No nearby stations
                            </h3>

                            <p>
                                No charging station was found
                                within ${radius} km.
                            </p>

                        </div>
                    `;

                    return;
                }


                nearbyStations.innerHTML = "";


                stations.forEach(
                    function (station) {

                        const card =
                            createStationCard(
                                station,
                                station.distance
                            );

                        nearbyStations.appendChild(
                            card
                        );

                    }
                );


            } catch (error) {

                console.log(error);

                nearbyStations.innerHTML = `
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
    );

}


// ========================================
// LOGOUT
// ========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem("token");

            localStorage.removeItem("userId");

            localStorage.removeItem(
                "selectedStationId"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ========================================
// LOAD STATIONS WHEN PAGE OPENS
// ========================================

loadStations();