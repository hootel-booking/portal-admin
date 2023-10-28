$(document).ready(function () {
    // get id user
    const idUser = 1;

    renderInfoUser();

    function renderInfoUser() {
        const idElForm = document.getElementById("formAccountSettings");

        $.ajax({
            url: `http://localhost:8080/users/id=${idUser}`,
            method: "get",
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
                        value="${user.firstname}"
                        autofocus
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="lastName" class="form-label">Last Name</label>
                        <input class="form-control" type="text" name="lastName" id="lastName" value="${user.lastName}" />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="email" class="form-label">E-mail</label>
                        <input
                        class="form-control"
                        type="text"
                        id="email"
                        name="email"
                        value="${user.email}"
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
                        value="${user.userName}"
                        disabled
                        />
                    </div>
                    <div class="mb-3 col-md-6">
                        <label class="form-label" for="phoneNumber">Phone Number</label>
                        <div class="input-group input-group-merge">
                        <span class="input-group-text">US (+84)</span>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            class="form-control"
                            placeholder="202 555 0111"
                            value="${user.phone}"
                        />
                        </div>
                    </div>
                </div>
                <div class="mt-2">
                    <button type="submit" class="btn btn-primary me-2 btn-save">Save changes</button>
                    <button type="reset" class="btn btn-outline-secondary">Cancel</button>
                </div>
            `;

            idElForm.innerHTML = htmlDisplay;
        })
    }

    $(document).on("click", ".btn-save", function (e) {
        e.preventDefault();

        const idElFile = document.getElementById("imageUploadForm");
        const formData = new FormData(idElFile);

        let firstName = $("#firstName").val();
        let lastName = $("#lastName").val();
        let phone = $("#phoneNumber").val();
        console.log(firstName)

        let user = new Object();
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        //user.file = formData;

        $.ajax({
            url: `http://localhost:8080/users/profileId=${idUser}`,
            method: "put",
            contentType: 'multipart/form-data',
            data: {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                file: formData
            }
        }).done(function (data) {
            const result = data?.data;
            if (result) {
                alert("Success");
            } else {
                alert("Error");
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert("Error " + errorThrown);
        });
    })
})