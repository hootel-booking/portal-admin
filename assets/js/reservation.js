$(document).ready(function () {
    const idElTable = document.getElementById("reservationTable");
    const token = localStorage.getItem("TOKEN");

    $.ajax({
        url: `http://localhost:8080/reservation`,
        method: "get",
        headers: {
            Authorization: "Bearer " + token,
        },
    }).done(function (data) {
        const reservationList = data?.data;

        reservationList.forEach((reservation, index) => {
            let htmlDisplay = "";
            // create tr element
            let tr = document.createElement("tr");
            tr.setAttribute("id", `idReservation-${reservation.id}`);

            idElTable.appendChild(tr);
            const idElReservation = document.getElementById(`idReservation-${reservation.id}`);
            const betwenTwoDays = canculateBetweenTwoDays(new Date(reservation.dateCheckIn), new Date(reservation.dateCheckout));
            const total = canculateTotal(betwenTwoDays, reservation.price, reservation.discount);

            htmlDisplay = `
                <td>${index+1}</td>
                <td>${reservation.roomName}</td>
                <td>${displayDate(reservation.dateCheckIn)}</td>
                <td>${displayDate(reservation.dateCheckout)}</td>
                <td>${displayDate(reservation.createDate)}</td>
                <td>${total}</td>
                <td>${reservation.emailUser}</td>
                <td>${reservation.phoneUser}</td>
                <td>${reservation.status}</td>
                <td>
                    <div class="dropdown">
                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a style="display:${showBtnEdit(reservation.status)};" class="dropdown-item" href="../../html/reservation-update.html?id=${reservation.id}">
                                <i class="bx bx-edit-alt me-1"></i> Edit
                            </a>
                            <a class="dropdown-item" href="../../html/reservation-detail.html?id=${reservation.id}">
                                <i class="bx bx-detail me-1"></i> Detail
                            </a>
                        </div>
                    </div>
                </td>
            `;

            idElReservation.innerHTML = htmlDisplay;
        })
    }).fail(function(jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
    });

    function showBtnEdit(status) {
        if (status === "CANCEL") {
            return "none";
        }
        return "";
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

    function displayDate(date) {
        const dateUTC = new Date(date);
        const getDate = dateUTC.getDate();
        const day = getDate >= 10 ? getDate : '0' + getDate;
        const month = dateUTC.getMonth() + 1;
        const year = dateUTC.getFullYear();
        return day + '-' + month + '-' + year;
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