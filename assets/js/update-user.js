$(document).ready(function () {
    // get id user
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idUser = Number(urlParams.get("id"));
    const token = localStorage.getItem("TOKEN");

    const idElForm = document.getElementById("formUser");

    $.ajax({
        url: `http://localhost:8080/users/id=${idUser}`,
        method: "get",
        headers: {
            Authorization: "Bearer " + token,
        },
    }).done(function (data) {
        const user = data?.data;
        let htmlDisplay = "";

        getListRole(user.idRole);

        htmlDisplay = `
            <div class="row mb-3">
                <label class="col-sm-2 col-form-label" for="first-name">First Name</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="first-name" placeholder="John" value="${user.firstname}" autofocus />
                </div>
            </div>
            <div class="row mb-3">
                <label class="col-sm-2 col-form-label" for="last-name">Last Name</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="last-name" placeholder="Doe" value="${user.lastName}"/>
                </div>
            </div>
            <div class="row mb-3">
                <label class="col-sm-2 col-form-label" for="email">Email</label>
                <div class="col-sm-10">
                <input type="text" id="email" class="form-control" name="email" value="${user.email}" disabled />
                </div>
            </div>
            <div class="row mb-3">
                <label class="col-sm-2 col-form-label" for="username">Username</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="username" placeholder="Doe" value="${user.userName}" disabled />
                </div>
            </div>
            <div class="row mb-3">
                <label class="col-sm-2 col-form-label" for="phone">Phone</label>
                <div class="col-sm-10">
                <input
                    type="text"
                    id="phone"
                    class="form-control phone-mask"
                    placeholder="658 799 8941"
                    aria-label="658 799 8941"
                    aria-describedby="phone"
                    value="${user.phone}"
                />
                </div>
            </div>
            <div class="row mb-3">
                <label class="col-sm-2 col-form-label" for="role">Role</label>
                <div class="col-sm-10">
                    <div class="col-md-12">
                        <select class="form-control form-control-line" id="idRoles">
                        </select>
                    </div>
                </div>
            </div>
            <div class="row justify-content-end">
                <div class="col-sm-1">
                    <input type="submit" class="btn btn-primary btn-submit-user" value="Submit"/>
                </div>
                <div class="col-sm-1">
                    <input type="button" class="btn btn-outline-secondary btn-back" value="Back"/>
                </div>
            </div>
        `;

        idElForm.innerHTML = htmlDisplay;
    }).fail(function(jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
    });

    function getListRole(idRole) {
        $.ajax({
            url: `http://localhost:8080/roles`,
            method: "get",
        }).done(function (data) {
            let htmDisplay = "";
            roles = data?.data;

            roles.forEach(role => {
                htmDisplay += `
                    <option ${ idRole == role.id ? 'selected' : '' } value="${role.id}">${role.name}</option>
                `;
            });

            idRoles.innerHTML = htmDisplay;
        }).fail(function(jqXHR, textStatus, errorThrown) {
            displayToast("Error: " + errorThrown, 3);
        });
    }

    $(document).on("click", ".btn-submit-user", function (e) {
        // prevent reload page
        e.preventDefault();

        let phone = $("#phone").val();
        if (validateForm(phone) === 1) {
            return;
        }

        const getIdElSelect = document.getElementById("idRoles");

        let firstName = $("#first-name").val();
        let lastName = $("#last-name").val();
        let idRole = getIdElSelect.value;

        $.ajax({
            url: `http://localhost:8080/users/id=${idUser}`,
            method: "put",
            contentType: "application/json",
            data: JSON.stringify({
                firstname: firstName,
                lastName: lastName,
                phone: phone,
                idRole: idRole
            }),
            headers: {
                Authorization: "Bearer " + token,
            },
        }).done(function (data) {
            const result = data?.data;
            if (result) {
                displayToast("Update successfull!", 1);
            } else {
                displayToast("Update failed!", 3);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            displayToast("Error: " + errorThrown, 3);
        });
    })

    $(document).on("click", ".btn-back", function (e) {
        // prevent reload page
        e.preventDefault();

        window.location.href = "http://127.0.0.1:5502/html/users.html";
    })

    function validateForm(phoneNumber) {
        const patternPhoneNumber = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/i;
        if (!patternPhoneNumber.test(phoneNumber)) {
            displayToast("Phone number is invalid", 2);
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