$(document).ready(function () {
    const idElTable = document.getElementById("idUserTable");
    const token = localStorage.getItem("TOKEN");

    $.ajax({
        url: `http://localhost:8080/users`,
        method: "get",
        headers: {
            Authorization: "Bearer " + token,
        },
    }).done(function (data) {
        const users = data?.data;

        users.forEach((user, index) => {
            let htmlDisplay = "";

            // create tr element
            let tr = document.createElement("tr");
            tr.setAttribute("id", `idUser-${user.id}`);

            idElTable.appendChild(tr);
            const idElUser = document.getElementById(`idUser-${user.id}`);

            htmlDisplay = `
                <td>${index+1}</td>
                <td>${user.firstname}</td>
                <td>${user.lastName}</td>
                <td>${user.userName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.roleName}</td>
                <td>
                    <div class="dropdown">
                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="../../html/update-user.html?id=${user.id}">
                                <i class="bx bx-edit-alt me-1"></i> Edit
                            </a>
                            <a class="dropdown-item" href="../../html/user-detail.html?id=${user.id}">
                                <i class="bx bx-detail me-1"></i> Detail
                            </a>
                        </div>
                    </div>
                </td>
            `;

            idElUser.innerHTML = htmlDisplay;
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
        displayToast("Error: " + error, 3);
    });

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