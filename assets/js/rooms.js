$(document).ready(function () {
    const idElTable = document.getElementById("idRoomTable");
    const token = localStorage.getItem("TOKEN");

    $.ajax({
        url: `http://localhost:8080/rooms`,
        method: "get",
        headers: {
            Authorization: "Bearer " + token,
        },
    }).done(function (data) {
        const rooms = data?.data;

        rooms.forEach((room, index) => {
            let htmlDisplay = "";

            // create tr element
            let tr = document.createElement("tr");
            tr.setAttribute("id", `idRoom-${room.id}`);

            idElTable.appendChild(tr);
            const idElRoom = document.getElementById(`idRoom-${room.id}`);

            htmlDisplay = `
                <td>${index+1}</td>
                <td>${room.name}</td>
                <td>${room.price}</td>
                <td>${room.discount}</td>
                <td>${room.square}</td>
                <td>${room.nameType}</td>
                <td>${displayDate(room.createDate)}</td>
                <td>
                    <div class="dropdown">
                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="../../html/update-room.html?id=${room.id}">
                                <i class="bx bx-edit-alt me-1"></i> Edit
                            </a>
                        </div>
                    </div>
                </td>
            `;

            idElRoom.innerHTML = htmlDisplay;
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + errorThrown, 3);
    });

    $(document).on("click", ".btn-create", function (e) {
        // prevent reload page
        e.preventDefault();

        window.location.replace("http://127.0.0.1:5502/html/create-room.html");
    })

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