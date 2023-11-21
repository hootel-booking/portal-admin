$(document).ready(function () {
    class User {
        constructor(id, email, role, avatar, userName) {
            this.id = id;
            this.email = email;
            this.role = role;
            this.avatar = avatar;
            this.userName = userName;
        }
    }

    $(document).on("click", ".btn-login", function (e) {
        // prevent reload page
        e.preventDefault();

        let email = $("#email").val();
        let password = $("#password").val();

        if (validateForm(email, password) === 1) {
            return;
        }

        $.ajax({
            url: `http://localhost:8080/login/signin`,
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({
                email: email,
                password: password
            })
        }).done(function (data) {
            if (data?.statusCode === 200) {
                const response = data?.data;
                const user = new User(
                    response.user.id,
                    response.user.email,
                    response.user.roleName,
                    response.user.avatar,
                    response.user.userName
                );

                if (user.role === "ROLE_ADMIN") {
                    localStorage.setItem("TOKEN", response.token);
                    localStorage.setItem("CURRENT_USER", JSON.stringify(user));
                    window.location.href = "http://127.0.0.1:5502/html/index.html";
                } else {
                    displayToast("Access Denied", 3);
                }
            } else if (data?.statusCode === 403) {
                displayToast("Access Denied", 3);
            } else if (data?.statusCode === 401) {
                displayToast("Invalid username or password", 3);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            if (jqXHR?.status === 500) {
                displayToast("Error: Email or password is incorrect", 3);
            } else {
                displayToast("Error: " + errorThrown, 3);
            }
        });
    });

    function validateForm(email, password) {
        const patternEmail = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/i;
        if (!email) {
            displayToast("Email is required", 2);
            return 1;
        } else if (!patternEmail.test(email)) {
            displayToast("Email is invalid", 2);
            return 1;
        }
        
        const patternPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i;
        if (!password) {
            displayToast("Password is required", 2);
            return 1;
        } else if (!patternPassword.test(password)) {
            displayToast("Password is invalid", 2);
            return 1;
        }

        return 0;
    }

    function displayToast(content, status) {
        let title = "Successful";
        const idEl = document.getElementById("toastMessage");

        switch(status) {
            case 1:
                // SUCCESS
                idEl.classList.remove('bg-warning');
                idEl.classList.remove('bg-danger');

                idEl.classList.add('bg-success', 'show');
            break;
            case 2:
                // WARNING
                title = "Warning";
                idEl.classList.remove('bg-danger');
                idEl.classList.remove('bg-success');

                idEl.classList.add('bg-warning', 'show');
            break;
            case 3:
                // DANGER
                title = "Error";
                idEl.classList.remove('bg-warning');
                idEl.classList.remove('bg-success');

                idEl.classList.add('bg-danger', 'show');
            break;
        }

        let htmlDisplay = `
            <div class="toast-header">
                <i class="bx bx-bell me-2"></i>
                <div class="me-auto fw-semibold">${title}</div>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${content}
            </div>
        `;
        idEl.innerHTML = htmlDisplay;
    }
})