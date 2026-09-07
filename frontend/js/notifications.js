// ========================================
// EVCHARGE - NOTIFICATIONS
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

const notificationList =
    document.getElementById(
        "notificationList"
    );

const notificationLoading =
    document.getElementById(
        "notificationLoading"
    );

const emptyNotifications =
    document.getElementById(
        "emptyNotifications"
    );

const markAllBtn =
    document.getElementById(
        "markAllBtn"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// ========================================
// LOAD NOTIFICATIONS
// ========================================

async function loadNotifications() {

    notificationLoading.style.display =
        "block";

    notificationList.innerHTML = "";

    emptyNotifications.style.display =
        "none";


    try {

        const response = await fetch(
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


        notificationLoading.style.display =
            "none";


        if (!response.ok) {

            notificationList.innerHTML = `
                <p>
                    ${
                        data.message ||
                        "Failed to load notifications."
                    }
                </p>
            `;

            return;
        }


        const notifications =
            data.notifications || [];


        // ========================================
        // EMPTY
        // ========================================

        if (notifications.length === 0) {

            emptyNotifications.style.display =
                "block";

            return;
        }


        // ========================================
        // DISPLAY
        // ========================================

        notifications.forEach(
            function (notification) {

                const card =
                    createNotificationCard(
                        notification
                    );

                notificationList.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.log(error);

        notificationLoading.innerHTML = `
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
// CREATE NOTIFICATION CARD
// ========================================

function createNotificationCard(
    notification
) {

    const card =
        document.createElement("div");


    card.className =
        notification.isRead
            ? "notification-page-card read"
            : "notification-page-card unread";


    // ========================================
    // ICON
    // ========================================

    let icon = "🔔";


    if (notification.type === "Booking") {

        icon = "📅";

    } else if (
        notification.type === "Queue"
    ) {

        icon = "⏳";

    } else if (
        notification.type === "Reminder"
    ) {

        icon = "⏰";

    } else if (
        notification.type === "System"
    ) {

        icon = "ℹ️";

    }


    // ========================================
    // DATE
    // ========================================

    const notificationDate =
        new Date(
            notification.createdAt
        );


    const dateText =
        notificationDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    // ========================================
    // BUTTON
    // ========================================

    let actionHTML = "";


    if (!notification.isRead) {

        actionHTML = `

            <button
                class="notification-read-btn"
                data-id="${notification._id}"
            >
                Mark as Read
            </button>

        `;

    } else {

        actionHTML = `

            <span class="notification-read-label">
                ✓ Read
            </span>

        `;

    }


    // ========================================
    // HTML
    // ========================================

    card.innerHTML = `

        <div class="notification-page-icon">
            ${icon}
        </div>


        <div class="notification-page-content">

            <div class="notification-page-header">

                <h3>
                    ${notification.title}
                </h3>

                <span class="notification-type">
                    ${notification.type}
                </span>

            </div>


            <p>
                ${notification.message}
            </p>


            <div class="notification-page-footer">

                <small>
                    ${dateText}
                </small>

                ${actionHTML}

            </div>

        </div>

    `;


    // ========================================
    // MARK AS READ
    // ========================================

    const readBtn =
        card.querySelector(
            ".notification-read-btn"
        );


    if (readBtn) {

        readBtn.addEventListener(
            "click",
            function () {

                markAsRead(
                    notification._id
                );

            }
        );

    }


    return card;

}


// ========================================
// MARK ONE AS READ
// ========================================

async function markAsRead(
    notificationId
) {

    try {

        const response = await fetch(
            `${API_URL}/api/notifications/read/${notificationId}`,
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
                "Unable to update notification."
            );

            return;
        }


        await loadNotifications();


    } catch (error) {

        console.log(error);

        alert(
            "Unable to connect to backend."
        );

    }

}


// ========================================
// MARK ALL AS READ
// ========================================

if (markAllBtn) {

    markAllBtn.addEventListener(
        "click",
        async function () {

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/notifications/read-all`,
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
                        "Unable to update notifications."
                    );

                    return;
                }


                await loadNotifications();


            } catch (error) {

                console.log(error);

                alert(
                    "Unable to connect to backend."
                );

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
// START
// ========================================

loadNotifications();