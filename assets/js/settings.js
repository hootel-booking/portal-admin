$(document).ready(function () {
    // get id user
    const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
    const idUser = currentUser?.id;
    const token = localStorage.getItem("TOKEN");

    renderInfoUser();

    function renderInfoUser() {
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
    
            htmlDisplay = `
                <div class="row">
                    <div class="mb-3 col-md-6">
                        <label for="firstName" class="form-label">First Name</label>
                        <input
                            class="form-control"
                            type="text"
                            id="firstName"
                            name="firstName"
                            value="${user.firstname ? user.firstname : ''}"
                            autofocus
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="lastName" class="form-label">Last Name</label>
                        <input
                            class="form-control"
                            type="text"
                            name="lastName"
                            id="lastName"
                            value="${user.lastName ? user.lastName : ''}"
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="email" class="form-label">E-mail</label>
                        <input
                            class="form-control"
                            type="text"
                            id="email"
                            name="email"
                            value="${user.email ? user.email : ''}"
                            placeholder="john.doe@example.com"
                            disabled
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="username" class="form-label">Username</label>
                        <input
                            type="text"
                            class="form-control"
                            id="username"
                            name="username"
                            value="${user.userName ? user.userName : ''}"
                            disabled
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label class="form-label" for="phone">Phone Number</label>
                        <div class="input-group input-group-merge">
                        <span class="input-group-text">VN (+84)</span>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            class="form-control"
                            placeholder="202 555 0111"
                            value="${user.phone ? user.phone : ''}"
                        />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="mb-3 col-md-6">
                        <label for="accountNumber" class="form-label">Account Number</label>
                        <input
                            class="form-control"
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            value="${
                              user.accountNumber ? user.accountNumber : ""
                            }"
                            autofocus
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="amount" class="form-label">Amount ($)</label>
                        <input
                            class="form-control"
                            type="text"
                            name="amount"
                            id="amount"
                            value="${user.amount ? user.amount : parseFloat(0)}"
                            disabled
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="transfer" class="form-label">Transfer ($)</label>
                        <input
                            class="form-control"
                            type="text"
                            id="transfer"
                            name="transferAmount"
                            placeholder="0"
                        />
                    </div>
                </div>
                
                <div class="mt-2" style="display: flex; justify-content: end;">
                    <button type="submit" class="btn btn-primary me-2 btn-save">Save changes</button>
                    <button type="reset" class="btn btn-outline-secondary btn-back">Cancel</button>
                </div>
            `;

            idElForm.innerHTML = htmlDisplay;

            displayAvatar(user?.avatar);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            displayToast("Error: " + errorThrown, 3);
        });
    }

    $(document).on("click", ".btn-save", function (e) {
        e.preventDefault();

        if (validateForm() === 1) {
            return;
        }

        const idElFile = document.getElementById("formAccountSettings");
        const formData = new FormData(idElFile);
        formData.set("upload", $("#upload").val());
        formData.set("firstName", $("#firstName").val());
        formData.set("lastName", $("#lastName").val());
        formData.set("phone", $("#phone").val());
        formData.set("accountNumber", $("#accountNumber").val());
        formData.set("amount", $("#amount").val() ? $("#amount").val() : 0);
        formData.set(
            "transferAmount",
            $("#transferAmount").val() ? $("#transferAmount").val() : 0
        );

        fetch(`http://localhost:8080/users/profileId=${idUser}`, {
            method: 'PUT',
            body: formData,
            headers: {
                Authorization: "Bearer " + token,
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data?.data) {
                displayToast("Update successful", 1);
            } else {
                displayToast("Update failed", 3);
            }
        })
        .catch(error => {
            displayToast("Error: " + error, 3);
        });
    })

    $(document).on("click", ".btn-back", function (e) {
        // prevent reload page
        e.preventDefault();
        window.history.back();
    })

    function displayAvatar(fileName) {
        const data = !!fileName ?
            `http://localhost:8080/file/pathImage=avatars&fileName=${fileName}` :
            "../assets/img/avatars/1.png";
        const idElFile = document.getElementById("uploadedAvatar");
        idElFile.setAttribute("src", data);
    }

    function validateForm() {
        const phoneNumber = $("#phone").val();
        const patternPhoneNumber = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/i;
        if (!patternPhoneNumber.test(phoneNumber)) {
            displayToast("Phone number is invalid", 2);
            return 1;
        }

        const transfer = $("#transferAmount").val();
        if (transfer) {
            if (isNaN(transfer)) {
                displayToast("Tranfer amount is invalid. Please input a number", 2);
                return 1;
            } else if (transfer < 0) {
                displayToast("Tranfer amount is invalid", 2);
                return 1;
            }
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