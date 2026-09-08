const API_URL = "https://ev-slotbooking-1.onrender.com";

const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {
    window.location.href = "admin-login.html";
}


// ===============================
// ADMIN NAME
// ===============================

const adminName = localStorage.getItem("adminName");

const adminNameElement = document.getElementById("adminName");

if (adminNameElement && adminName) {
    adminNameElement.textContent = adminName;
}


// ===============================
// LOAD DASHBOARD STATISTICS
// ===============================

async function loadDashboardStats() {

    try {

        const response = await fetch(
            `${API_URL}/api/admin/dashboard`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${adminToken}`
                }
            }
        );

        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminName");
            localStorage.removeItem("adminId");

            window.location.href = "admin-login.html";

            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load dashboard"
            );
        }

        const stats = data.statistics;

        document.getElementById("totalUsers").textContent =
            stats.totalUsers;

        document.getElementById("totalStations").textContent =
            stats.totalStations;

        document.getElementById("totalBookings").textContent =
            stats.totalBookings;

        document.getElementById("activeBookings").textContent =
            stats.activeBookings;

        document.getElementById("waitingUsers").textContent =
            stats.waitingUsers;

        document.getElementById("availableSlots").textContent =
            stats.availableSlots;

        document.getElementById("totalSlots").textContent =
            stats.totalSlots;

        document.getElementById("overviewAvailableSlots").textContent =
            stats.availableSlots;

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        alert(
            "Unable to load dashboard statistics."
        );
    }
}


// ===============================
// LOAD USER BOOKING INFORMATION
// ===============================

async function loadRecentBookings() {

    try {

        const response = await fetch(
            `${API_URL}/api/admin/bookings`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${adminToken}`
                }
            }
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load bookings"
            );
        }

        const data = await response.json();

        const bookings = data.bookings;

        const tableBody =
            document.getElementById(
                "adminBookingsTableBody"
            );

        if (!bookings || bookings.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No bookings found
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML = "";


        bookings.forEach((booking) => {

            const slotDate =
                new Date(
                    booking.slotTime
                );


            const formattedDate =
                slotDate.toLocaleDateString(
                    "en-IN"
                );


            const formattedTime =
                slotDate.toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${booking.user.name}
                    </strong>
                    <br>
                    <small>
                        ${booking.user.email}
                    </small>
                </td>


                <td>
                    ${booking.user.vehicleNumber}
                    <br>
                    <small>
                        ${booking.user.vehicleModel}
                    </small>
                </td>


                <td>
                    <strong>
                        ${booking.station.name}
                    </strong>
                    <br>
                    <small>
                        ${booking.station.chargingType}
                    </small>
                </td>


                <td>
                    ${formattedDate}
                    <br>
                    ${formattedTime}
                </td>


                <td>
                    ${booking.duration} min
                </td>


                <td>
                    <span class="booking-status ${booking.status.toLowerCase()}">
                        ${booking.status}
                    </span>
                </td>

            `;


            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Booking loading error:",
            error
        );

        const tableBody =
            document.getElementById(
                "adminBookingsTableBody"
            );

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        Unable to load booking information
                    </td>
                </tr>
            `;
        }
    }
}


// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.getElementById(
        "adminLogoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

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
    );
}


// ===============================
// ADD STATION
// ===============================

const addStationBtn =
    document.getElementById(
        "addStationBtn"
    );


if (addStationBtn) {

    addStationBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "admin-stations.html";
        }
    );
}


// ===============================
// LOAD DATA
// ===============================

loadDashboardStats();

loadRecentBookings();