$(document).ready(function () {
    // get id user
    const idUser = 1;

    renderInfoUser();

    function renderInfoUser() {
        const idElForm = document.getElementById("formUser");

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
                <div class="mt-2">
                    <button type="submit" class="btn btn-primary me-2 btn-save">Save changes</button>
                    <button type="reset" class="btn btn-outline-secondary btn-back">Cancel</button>
                </div>
            `;

            idElForm.innerHTML = htmlDisplay;

            displayAvatar(user?.avatar);
        })
    }

    $(document).on("click", ".btn-save", function (e) {
        e.preventDefault();

        const idElFile = document.getElementById("formAccountSettings");
        const formData = new FormData(idElFile);

        fetch(`http://localhost:8080/users/profileId=${idUser}`, {
            method: 'PUT',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data?.data) {
                alert("Success");
            } else {
                alert("Error");
            }
        })
        .catch(error => {
            console.error('Error uploading image:', error);
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
})