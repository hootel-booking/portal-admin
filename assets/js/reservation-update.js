$(document).ready(function () {
    // get id reservation
    const token = localStorage.getItem("TOKEN");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idReservation = Number(urlParams.get("id"));
    const idElInfo = document.getElementById("reservationInfo");
    let total = 0;

    $.ajax({
        url: `http://localhost:8080/reservation/id=${idReservation}`,
        method: "get",
        headers: {
            Authorization: "Bearer " + token,
        },
    }).done(function (data) {
        const reservation = data?.data;
        const betwenTwoDays = canculateBetweenTwoDays(new Date(reservation.dateCheckIn), new Date(reservation.dateCheckout));
        total = canculateTotal(betwenTwoDays, reservation.price, reservation.discount);
        let htmlDisplay = "";

        htmlDisplay = `
            <div class="card">
                <h5 class="card-header">Room: ${reservation.roomName}</h5>
                <div class="card-body">
                    <small class="text-light fw-semibold">Booking Information</small>
                    <dl class="row mt-2">
                        <dt class="col-sm-2">Checkin date</dt>
                        <dd class="col-sm-4">${displayDate(reservation.dateCheckIn)}</dd>

                        <dt class="col-sm-2">Adult</dt>
                        <dd class="col-sm-4">${reservation.adultNumber}</dd>

                        <dt class="col-sm-2">Checkout date</dt>
                        <dd class="col-sm-4">${displayDate(reservation.dateCheckout)}</dd>

                        <dt class="col-sm-2 text-truncate">Child</dt>
                        <dd class="col-sm-4">${reservation.childNumber}</dd>

                        <dt class="col-sm-2 text-truncate">Create Date</dt>
                        <dd class="col-sm-4">${displayDate(reservation.createDate)}</dd>

                        <dt class="col-sm-2 text-truncate">Status</dt>
                        <dd class="col-sm-4">${reservation.status}</dd>

                        <dt class="col-sm-2">Note</dt>
                        <dd class="col-sm-10">${reservation.note ? reservation.note : ""}</dd>
                    </dl>
                </div>
                <hr class="m-0" />
                <div class="card-body">
                    <small class="text-light fw-semibold">User Information</small>
                    <dl class="row mt-2">
                        <dt class="col-sm-2">Full Name</dt>
                        <dd class="col-sm-4">${reservation.firstName} ${reservation.lastName}</dd>

                        <dt class="col-sm-2">Phone number</dt>
                        <dd class="col-sm-4">${reservation.phoneUser}</dd>


                        <dt class="col-sm-2">Email</dt>
                        <dd class="col-sm-4">${reservation.emailUser}</dd>
                    </dl>
                </div>
                <hr class="m-0" />
                <div class="card-body">
                    <small class="text-light fw-semibold">Price</small>
                    <!-- Basic Layout & Basic with Icons -->
                    <div class="row">
                        <!-- Basic Layout -->
                        <div class="col-xxl">
                            <form id="formReservation">
                                <div class="row mb-3">
                                    <label class="col-sm-2 col-form-label" for="price">Price ($)/ night</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="price" value="${reservation.price}" disabled/>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label class="col-sm-2 col-form-label" for="discount">Discount(%)</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="discount" value="${reservation.discount}" disabled/>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label class="col-sm-2 col-form-label" for="total">Total</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="total" value="${total}" disabled/>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label class="col-sm-2 col-form-label" for="deposit">Deposit</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="deposit" value="${reservation.deposit}"/>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label class="col-sm-2 col-form-label" for="status">Status</label>
                                    <div class="col-sm-10">
                                        <select class="form-control form-control-line" id="idDropdownStatus">
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="row m-2 justify-content-end">
                    <div class="col-sm-1">
                        <input type="submit" class="btn btn-primary btn-submit" value="Submit"/>
                    </div>
                    <div class="col-sm-1">
                        <input type="button" class="btn btn-outline-secondary btn-back" value="Back"/>
                    </div>
                </div>
            </div>
        `;

        idElInfo.innerHTML = htmlDisplay;

        getListStatus(reservation.idStatus);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
    });

    function getListStatus(idStatus) {
        $.ajax({
            url: `http://localhost:8080/status`,
            method: "get",
        }).done(function (data) {
            let htmDisplay = "";
            const listStatus = data?.data;

            listStatus.forEach(status => {
                htmDisplay += `
                    <option ${ idStatus == status.id ? 'selected' : '' } value="${status.id}">${status.name}</option>
                `;
            });

            idDropdownStatus.innerHTML = htmDisplay;
        }).fail(function(jqXHR, textStatus, errorThrown) {
            displayToast("Error: " + errorThrown, 3);
        });
    }

    function displayDate(date) {
        const dateUTC = new Date(date);
        const getDate = dateUTC.getDate();
        const day = getDate >= 10 ? getDate : '0' + getDate;
        const month = dateUTC.getMonth() + 1;
        const year = dateUTC.getFullYear();
        return day + '-' + month + '-' + year;
    }

    function canculateBetweenTwoDays(date1, date2) {
        const diffInTime = date2.getTime() - date1.getTime();
        return diffInTime / (1000 * 3600 * 24);
    }

    function canculateTotal(betwenTwoDays, price, discount) {
        if (discount === 0) {
            return betwenTwoDays * price;
        }

        return ((100 - discount) * (betwenTwoDays * price)) / 100;
    }

    $(document).on("click", ".btn-back", function (e) {
        // prevent reload page
        e.preventDefault();

        window.location.replace("http://127.0.0.1:5502/html/reservation.html");
    })

    $(document).on("click", ".btn-submit", function (e) {
        // prevent reload page
        e.preventDefault();

        let deposit = $("#deposit").val();
        if (validateForm(deposit, total) === 1) {
            return;
        }

        const getIdElSelect = document.getElementById("idDropdownStatus");
        let idStatus = getIdElSelect.value;

        $.ajax({
            url: `http://localhost:8080/reservation/id=${idReservation}`,
            method: "put",
            contentType: "application/json",
            data: JSON.stringify({
                deposit: deposit,
                idStatus: idStatus
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

    function validateForm(deposit, total) {
        if (isNaN(deposit)) {
            displayToast("Deposit is invalid. Please input a number", 2);
            return 1;
        } else if (deposit < 0 || deposit > total) {
            displayToast("Deposit is invalid. Deposit <= total", 2);
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