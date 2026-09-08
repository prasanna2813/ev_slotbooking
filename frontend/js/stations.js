// ========================================
// EVCHARGE - STATIONS PAGE
// ========================================

const API_URL = "https://ev-slotbooking-1.onrender.com";

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

const stationsContainer =
    document.getElementById("stationsContainer");

const nearbyContainer =
    document.getElementById("nearbyContainer");

const nearbyBtn =
    document.getElementById("nearbyBtn");

const stationCount =
    document.getElementById("stationCount");

const logoutBtn =
    document.getElementById("logoutBtn");


// ========================================
// LOAD ALL STATIONS
// ========================================

async function loadStations() {

    if (!stationsContainer) {
        return;
    }

    stationsContainer.innerHTML = `
        <div class="station-loading">
            Loading charging stations...
        </div>
    `;

    try {

        const response = await fetch(
            `${API_URL}/api/stations`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            stationsContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Unable to load stations</h3>
                    <p>
                        ${data.message || "Failed to load stations."}
                    </p>
                </div>
            `;

            return;
        }

        const stations = data.stations || [];


        // ========================================
        // STATION COUNT
        // ========================================

        if (stationCount) {
            stationCount.textContent =
                `${stations.length} Stations`;
        }


        // ========================================
        // NO STATIONS
        // ========================================

        if (stations.length === 0) {

            stationsContainer.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No charging stations found
                    </h3>

                    <p>
                        There are currently no charging
                        stations available.
                    </p>

                </div>
            `;

            return;
        }


        // ========================================
        // DISPLAY ALL STATIONS
        // ========================================

        stationsContainer.innerHTML = "";

        stations.forEach(function (station) {

            const card =
                createStationCard(station);

            stationsContainer.appendChild(card);

        });

    } catch (error) {

        console.log(
            "Load stations error:",
            error
        );

        stationsContainer.innerHTML = `
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
// CREATE STATION CARD
// ========================================

function createStationCard(
    station,
    distance = null
) {

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
    // BUTTON
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
    // SLOT PERCENTAGE
    // ========================================

    const availabilityPercentage =
        station.totalSlots > 0
            ? (
                station.availableSlots /
                station.totalSlots
            ) * 100
            : 0;


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
                    style="width: ${availabilityPercentage}%"
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


    if (button) {

        button.addEventListener(
            "click",
            function () {

                localStorage.setItem(
                    "selectedStationId",
                    station._id
                );

                window.location.href =
                    `booking.html?stationId=${station._id}`;

            }
        );

    }


    return card;
}


// ========================================
// FIND NEARBY STATIONS
// ========================================

if (nearbyBtn) {

    nearbyBtn.addEventListener(
        "click",
        async function () {

            if (!nearbyContainer) {
                return;
            }


            // Button loading state

            nearbyBtn.disabled = true;

            nearbyBtn.textContent =
                "Finding Nearby Stations...";


            nearbyContainer.innerHTML = `
                <div class="station-loading">
                    Finding nearby charging stations...
                </div>
            `;


            // ========================================
            // CURRENT LOCATION
            // Tirupati coordinates
            // ========================================

            const latitude =
                13.6288;

            const longitude =
                79.4192;

            const radius =
                10;


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/stations/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
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

                    nearbyContainer.innerHTML = `
                        <div class="empty-state">

                            <h3>
                                Unable to find nearby stations
                            </h3>

                            <p>
                                ${
                                    data.message ||
                                    "Unable to find nearby stations."
                                }
                            </p>

                        </div>
                    `;

                    return;
                }


                const stations =
                    data.stations || [];


                // ========================================
                // NO NEARBY STATIONS
                // ========================================

                if (stations.length === 0) {

                    nearbyContainer.innerHTML = `
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


                // ========================================
                // DISPLAY NEARBY STATIONS
                // ========================================

                nearbyContainer.innerHTML = "";


                stations.forEach(
                    function (station) {

                        const card =
                            createStationCard(
                                station,
                                station.distance
                            );

                        nearbyContainer.appendChild(
                            card
                        );

                    }
                );


                // Scroll to nearby results

                nearbyContainer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });


            } catch (error) {

                console.log(
                    "Nearby stations error:",
                    error
                );

                nearbyContainer.innerHTML = `
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

            } finally {

                nearbyBtn.disabled = false;

                nearbyBtn.textContent =
                    "📍 Find Nearby Stations";

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
                "login.html";

        }
    );
}


// ========================================
// LOAD STATIONS WHEN PAGE OPENS
// ========================================

loadStations();