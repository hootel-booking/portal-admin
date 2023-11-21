$(document).ready(function () {
    const token = localStorage.getItem("TOKEN");

    renderForm();

    function renderForm() {
        const idElForm = document.getElementById("formRoom");
        let htmlDisplay = "";

        getListSize();
        getListType();

        htmlDisplay = `
            <div class="row">
                <div class="mb-3 col-md-6">
                    <label for="name" class="form-label">Name<label style="color: red;">*</label></label>
                    <input
                        class="form-control"
                        type="text"
                        id="name"
                        name="name"
                        placeholder="101"
                        autofocus
                    />
                </div>
                <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">Price ($)<label style="color: red;">*</label></label>
                    <input
                        class="form-control"
                        type="text"
                        name="price"
                        id="price"
                        placeholder="0"
                    />
                </div>
                <div class="mb-3 col-md-6">
                    <label for="discount" class="form-label">Discount (%)</label>
                    <input
                        class="form-control"
                        type="text"
                        id="discount"
                        name="discount"
                        placeholder="0"
                    />
                </div>
                <div class="mb-3 col-md-6">
                    <label class="form-label">Size</label>
                    <select class="form-control form-control-line" id="idSize">
                    </select>
                </div>
                <div class="mb-3 col-md-6">
                    <label class="form-label">Type</label>
                    <select class="form-control form-control-line" id="idType">
                    </select>
                </div>
                <div class="mb-3 col-md-12">
                    <label class="form-label" for="description">Description</label>
                    <textarea class="form-control" id="description" rows="3"></textarea>
                </div>
            </div>
            
            <div class="mt-2" style="display: flex; justify-content: end;">
                <button type="submit" class="btn btn-primary me-2 btn-save">Save changes</button>
                <button type="reset" class="btn btn-outline-secondary btn-back">Back</button>
            </div>
        `;

        idElForm.innerHTML = htmlDisplay;
    }

    $(document).on("click", ".btn-back", function (e) {
        // prevent reload page
        e.preventDefault();

        window.location.href = "http://127.0.0.1:5502/html/rooms.html";
    })

    $(document).on("click", ".btn-save", function (e) {
        // prevent reload page
        e.preventDefault();

        if (validateForm() === 1) {
            return;
        }

        let name = $("#name").val();
        let isFound = findRoomByName(name);

        const idElFile = document.getElementById("formNewRoom");
        const formData = new FormData(idElFile);

        // get value
        const getIdElSize = document.getElementById("idSize");
        const getIdElType = document.getElementById("idType");
        formData.set("upload", $("#upload").val());
        formData.set("name", name);
        formData.set("price", $("#price").val() ? parseFloat($("#price").val()) : 0);
        formData.set("discount", $("#discount").val() ? parseInt($("#discount").val()) : 0);
        formData.set("description", $("#description").val());
        formData.set("idSize", parseInt(getIdElSize.value));
        formData.set("idType", parseInt(getIdElType.value));
        
        if (!isFound) {
            fetch(`http://localhost:8080/rooms/add`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data?.data) {
                    displayToast("Create room success", 1);
                    window.location.href = "http://127.0.0.1:5502/html/rooms.html";
                } else {
                    displayToast("Create room failed", 3);
                }
            })
            .catch(error => {
                displayToast("Error: " + error, 3);
            });
        } else {
            displayToast("This room is existed. Please use another name", 3);
        }
    })

    function getListSize() {
        $.ajax({
            url: `http://localhost:8080/sizes`,
            method: "get",
            headers: {
                Authorization: "Bearer " + token,
            },
        }).done(function (data) {
            let htmDisplay = "";
            const sizes = data?.data;

            sizes.forEach(size => {
                htmDisplay += `
                    <option value="${size.id}">${size.square}</option>
                `;
            });

            idSize.innerHTML = htmDisplay;
        }).fail(function(jqXHR, textStatus, errorThrown) {
            displayToast("Error: " + errorThrown, 3);
        });
    }

    function validateForm() {
        if (!$("#name").val()) {
            displayToast("Name is required", 2);
            return 1;
        }
        
        const price = $("#price").val();
        if (!price) {
            displayToast("Price is required", 2);
            return 1;
        } else {
            if (isNaN(price)) {
                displayToast("Price is invalid. Please input a number", 2);
                return 1;
            } else if (price < 0 || price > 10000) {
                displayToast("Price is invalid. Please input from 0 -> 10000", 2);
                return 1;
            }
        }

        const discount = $("#discount").val();
        if (discount) {
            if (isNaN(discount)) {
                displayToast("Discount is invalid. Please input a number", 2);
                return 1;
            } else if (discount < 0 || discount > 100) {
                displayToast("Discount is invalid. Please input from 0 -> 100", 2);
                return 1;
            }
        }

        return 0;
    }

    function getListType() {
        $.ajax({
            url: `http://localhost:8080/types`,
            method: "get",
            headers: {
                Authorization: "Bearer " + token,
            },
        }).done(function (data) {
            let htmDisplay = "";
            const types = data?.data;

            types.forEach(type => {
                htmDisplay += `
                    <option value="${type.id}">${type.name}</option>
                `;
            });

            idType.innerHTML = htmDisplay;
        }).fail(function(jqXHR, textStatus, errorThrown) {
            displayToast("Error: " + errorThrown, 3);
        });
    }

    function findRoomByName(nameRoom) {
        let result = false;
        $.ajax({
            url: `http://localhost:8080/rooms/name=${nameRoom}`,
            method: "POST",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + token,
            },
        }).done(function (data) {
            result = data?.data;
        }).fail(function(jqXHR, textStatus, errorThrown) {
            displayToast("Error: " + errorThrown, 3);
        });
        return result;
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