$(document).ready(function () {
    // get id user
    const idUser = 1;

    const idElForm = document.getElementById("userInfo");

    $.ajax({
        url: `http://localhost:8080/users/id=${idUser}`,
        method: "get",
    }).done(function (data) {
        const user = data?.data;
        let htmlDisplay = "";
        const avatar = data?.data?.avatar;
        const dataImage = avatar ?
            `http://localhost:8080/file/pathImage=avatars&fileName=${avatar}` :
            "../assets/img/elements/12.jpg";

            htmlDisplay = `
            <div class="row g-0">
                <div class="col-md-4">
                    <img class="card-img card-img-left" src=${dataImage} alt="Card image" />
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${user.userName ? user.userName : "Username"}</h5>
                        <p class="card-text">
                            <div class="col-lg-12">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">First Name</p>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">${user.firstname ? user.firstname : ""}</p>
                                            </div>
                                        </div>
                                        <hr>

                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Last Name</p>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">${user.lastName ? user.lastName : ""}</p>
                                            </div>
                                        </div>
                                        <hr>

                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Email</p>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">${user.email ? user.email : ""}</p>
                                            </div>
                                        </div
                                        <hr>
                                        <hr>
                                        
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Username</p>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">${user.userName ? user.userName : ""}</p>
                                            </div>
                                        </div>
                                        <hr>

                                        <div class="row">
                                            <div class="col-sm-3">
                                                <p class="mb-0">Phone</p>
                                            </div>
                                            <div class="col-sm-9">
                                                <p class="text-muted mb-0">${user.phone ? user.phone : ""}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </p>
                        <div class="mt-2">
                            <button type="reset" class="btn btn-outline-secondary btn-back">Back</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        idElForm.innerHTML = htmlDisplay;
    }).fail(function(jqXHR, textStatus, errorThrown) {
        alert("Error " + errorThrown);
    });

    $(document).on("click", ".btn-back", function (e) {
        // prevent reload page
        e.preventDefault();
        window.history.back();
    })
})