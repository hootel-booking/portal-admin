$(document).ready(function () {
    const idElTable = document.getElementById("idUserTable");

    $.ajax({
        url: `http://localhost:8080/users`,
        method: "get",
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
                <td>
                    <div class="dropdown">
                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="../../html/user-update.html?id=${user.id}">
                                <i class="bx bx-edit-alt me-1"></i> Edit
                            </a>
                            <a class="dropdown-item" href="javascript:void(0);">
                                <i class="bx bx-trash me-1"></i> Delete
                            </a>
                        </div>
                    </div>
                </td>
            `;

            idElUser.innerHTML = htmlDisplay;
        });
    })
})