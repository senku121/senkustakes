/*==================================================
        ADMIN LOGIN
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("adminLoginForm");

    const username = document.getElementById("adminUsername");

    const password = document.getElementById("adminPassword");

    const loginBtn = document.querySelector(".admin-login-btn");

    const toggle = document.querySelector(".toggle-password");

    if (toggle) {

        toggle.addEventListener("click", () => {

            if (password.type === "password") {

                password.type = "text";

                toggle.className =
                    "fa-solid fa-eye-slash toggle-password";

            }

            else {

                password.type = "password";

                toggle.className =
                    "fa-solid fa-eye toggle-password";

            }

        });

    }

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        loginBtn.disabled = true;

        loginBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

        try {

            const response = await fetch(

                "https://senkustakes-api.onrender.com/api/admin/auth/login",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        username: username.value,

                        password: password.value

                    })

                }

            );

            const data = await response.json();

            if (!response.ok) {

                alert(data.message);

                loginBtn.disabled = false;

                loginBtn.innerHTML =
                    '<i class="fa-solid fa-right-to-bracket"></i> Login Dashboard';

                return;

            }

            localStorage.setItem(

                "adminToken",

                data.token

            );

            localStorage.setItem(

                "currentUser",

                JSON.stringify(data.admin)

            );

            window.location.href =
                "admin-dashboard.html";

        }

        catch (err) {

            console.log(err);

            alert("Unable to connect to server.");

            loginBtn.disabled = false;

            loginBtn.innerHTML =
                '<i class="fa-solid fa-right-to-bracket"></i> Login Dashboard';

        }

    });

});