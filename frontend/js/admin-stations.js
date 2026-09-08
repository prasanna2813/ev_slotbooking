const API_URL = "https://ev-slotbooking-1.onrender.com";


// ===============================
// ADMIN TOKEN CHECK
// ===============================

const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {
    window.location.href = "admin-login.html";
}


// ===============================
// ELEMENTS
// ===============================

const stationForm =
    document.getElementById("stationForm");

const stationMessage =
    document.getElementById("stationMessage");

const stationsTableBody =
    document.getElementById("stationsTableBody");


// ===============================
// LOAD ALL STATIONS
// ===============================

async function loadStations() {

    try {

        const response = await fetch(
            `${API_URL}/api/admin/stations`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${adminToken}`
                }
            }
        );


        const data = await response.json();


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            logoutAdmin();
            return;
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load stations"
            );
        }


        const stations =
            data.stations || data;


        stationsTableBody.innerHTML = "";


        if (stations.length === 0) {

            stationsTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No charging stations found.
                    </td>
                </tr>
            `;

            return;
        }


        stations.forEach((station) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${station.name}
                    </strong>
                </td>


                <td>
                    ${station.address}
                </td>


                <td>
                    ${station.availableSlots}
                    /
                    ${station.totalSlots}
                </td>


                <td>
                    ${station.chargingType}
                </td>


                <td>
                    ₹${station.pricePerUnit}/unit
                </td>


                <td>

                    <button
                        class="station-edit-btn"
                        onclick="editStation('${station._id}')"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="station-delete-btn"
                        onclick="deleteStation('${station._id}')"
                    >
                        🗑️ Delete
                    </button>

                </td>

            `;


            stationsTableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Station loading error:",
            error
        );


        stationsTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load stations.
                </td>
            </tr>
        `;
    }
}



// ===============================
// ADD NEW STATION
// ===============================

stationForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        stationMessage.textContent =
            "Adding station...";


        const name =
            document.getElementById(
                "stationName"
            ).value.trim();


        const address =
            document.getElementById(
                "stationAddress"
            ).value.trim();


        const latitude =
            Number(
                document.getElementById(
                    "latitude"
                ).value
            );


        const longitude =
            Number(
                document.getElementById(
                    "longitude"
                ).value
            );


        const totalSlots =
            Number(
                document.getElementById(
                    "totalSlots"
                ).value
            );


        const availableSlots =
            Number(
                document.getElementById(
                    "availableSlots"
                ).value
            );


        const chargingType =
            document.getElementById(
                "chargingType"
            ).value;


        const pricePerUnit =
            Number(
                document.getElementById(
                    "pricePerUnit"
                ).value
            );



        // ===============================
        // VALIDATION
        // ===============================

        if (availableSlots > totalSlots) {

            stationMessage.textContent =
                "Available slots cannot be greater than total slots.";

            return;
        }


        if (availableSlots < 0) {

            stationMessage.textContent =
                "Available slots cannot be negative.";

            return;
        }


        if (totalSlots <= 0) {

            stationMessage.textContent =
                "Total slots must be greater than 0.";

            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/api/admin/stations`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${adminToken}`
                    },

                    body: JSON.stringify({

                        name,
                        address,
                        latitude,
                        longitude,
                        totalSlots,
                        availableSlots,
                        chargingType,
                        pricePerUnit

                    })
                }
            );


            const data =
                await response.json();


            // ===============================
            // AUTH ERROR
            // ===============================

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                logoutAdmin();
                return;
            }


            if (!response.ok) {

                stationMessage.textContent =
                    data.message ||
                    "Failed to add station.";

                return;
            }


            // ===============================
            // SUCCESS
            // ===============================

            stationMessage.textContent =
                "✅ Charging station added successfully!";


            stationForm.reset();


            loadStations();

        } catch (error) {

            console.error(
                "Add station error:",
                error
            );


            stationMessage.textContent =
                "Unable to connect to server.";
        }

    }
);



// ===============================
// EDIT STATION
// ===============================

async function editStation(stationId) {

    const newName =
        prompt(
            "Enter new station name:"
        );


    if (newName === null) {
        return;
    }


    const newAddress =
        prompt(
            "Enter new address:"
        );


    if (newAddress === null) {
        return;
    }


    const newTotalSlots =
        prompt(
            "Enter total slots:"
        );


    if (newTotalSlots === null) {
        return;
    }


    const newAvailableSlots =
        prompt(
            "Enter available slots:"
        );


    if (newAvailableSlots === null) {
        return;
    }


    const newChargingType =
        prompt(
            "Enter charging type:",
            "Fast Charging"
        );


    if (newChargingType === null) {
        return;
    }


    const newPrice =
        prompt(
            "Enter price per unit:"
        );


    if (newPrice === null) {
        return;
    }


    const totalSlots =
        Number(newTotalSlots);


    const availableSlots =
        Number(newAvailableSlots);


    const pricePerUnit =
        Number(newPrice);


    if (
        totalSlots <= 0 ||
        availableSlots < 0 ||
        availableSlots > totalSlots ||
        pricePerUnit < 0
    ) {

        alert(
            "Please enter valid station details."
        );

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/api/admin/stations/${stationId}`,
            {
                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${adminToken}`
                },

                body: JSON.stringify({

                    name: newName,
                    address: newAddress,
                    totalSlots,
                    availableSlots,
                    chargingType: newChargingType,
                    pricePerUnit

                })
            }
        );


        const data =
            await response.json();


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            logoutAdmin();
            return;
        }


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update station."
            );

            return;
        }


        alert(
            "✅ Station updated successfully!"
        );


        loadStations();


    } catch (error) {

        console.error(
            "Edit station error:",
            error
        );


        alert(
            "Unable to connect to server."
        );
    }
}



// ===============================
// DELETE STATION
// ===============================

async function deleteStation(stationId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this charging station?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/api/admin/stations/${stationId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization":
                        `Bearer ${adminToken}`
                }
            }
        );


        const data =
            await response.json();


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            logoutAdmin();
            return;
        }


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete station."
            );

            return;
        }


        alert(
            "✅ Station deleted successfully!"
        );


        loadStations();


    } catch (error) {

        console.error(
            "Delete station error:",
            error
        );


        alert(
            "Unable to connect to server."
        );
    }
}



// ===============================
// ADMIN LOGOUT
// ===============================

function logoutAdmin() {

    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "adminName"
    );

    localStorage.removeItem(
        "adminId"
    );


    window.location.href =
        "admin-login.html";
}



// ===============================
// LOGOUT BUTTON
// ===============================

const logoutBtn =
    document.getElementById(
        "adminLogoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logoutAdmin
    );
}



// ===============================
// LOAD STATIONS
// ===============================

loadStations();