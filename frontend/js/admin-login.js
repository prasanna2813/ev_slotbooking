const API_URL = "https://ev-slotbooking-1.onrender.com";


// ========================================
// ADMIN LOGIN FORM
// ========================================

const adminLoginForm =
    document.getElementById("adminLoginForm");

const adminLoginMessage =
    document.getElementById("adminLoginMessage");


adminLoginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document.getElementById(
                "adminEmail"
            ).value.trim();

        const password =
            document.getElementById(
                "adminPassword"
            ).value;


        // Clear old message

        adminLoginMessage.textContent = "";


        try {

            const response =
                await fetch(
                    `${API_URL}/api/admin/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            // Login failed

            if (!response.ok) {

                adminLoginMessage.textContent =
                    data.message ||
                    "Admin login failed";

                return;
            }


            // ========================================
            // SAVE ADMIN DETAILS
            // ========================================

            localStorage.setItem(
                "adminToken",
                data.token
            );

            localStorage.setItem(
                "adminId",
                data.adminId
            );

            localStorage.setItem(
                "adminName",
                data.name
            );


            // ========================================
            // REDIRECT
            // ========================================

            window.location.href =
                "admin.html";

        } catch (error) {

            console.error(
                "Admin login error:",
                error
            );

            adminLoginMessage.textContent =
                "Unable to connect to server.";

        }

    }
);