$(document).ready(function () {
    const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
  
    getInfoUser();
  
    function getInfoUser() {
      const idUserNavEl = document.getElementById("user-nav");
      const dataImage = currentUser?.avatar
        ? `http://localhost:8080/file/pathImage=avatars&fileName=${currentUser.avatar}`
        : "../assets/img/avatars/1.png";
        const role = currentUser?.roleName ? currentUser?.roleName.split("_") : "";
      let htmlDisplay = "";
      
      htmlDisplay = `
        <!-- Place this tag where you want the button to render. -->
        <li class="nav-item lh-1 me-3">
            <a
            class="github-button"
            href="https://github.com/themeselection/sneat-html-admin-template-free"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star themeselection/sneat-html-admin-template-free on GitHub"
            >Star</a
            >
        </li>

        <!-- User -->
        <li class="nav-item navbar-dropdown dropdown-user dropdown">
            <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
            <div class="avatar avatar-online">
                <img src=${dataImage} alt class="w-px-40 h-auto rounded-circle" />
            </div>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
            <li>
                <a class="dropdown-item" href="./profile.html">
                <div class="d-flex">
                    <div class="flex-shrink-0 me-3">
                    <div class="avatar avatar-online">
                        <img src=${dataImage} alt class="w-px-40 h-auto rounded-circle" />
                    </div>
                    </div>
                    <div class="flex-grow-1">
                    <span class="fw-semibold d-block">${currentUser?.userName}</span>
                    <small class="text-muted">${role}</small>
                    </div>
                </div>
                </a>
            </li>
            <li>
                <div class="dropdown-divider"></div>
            </li>
            <li>
                <a class="dropdown-item" href="./profile.html">
                    <i class="bx bx-user me-2"></i>
                    <span class="align-middle">My Profile</span>
                </a>
            </li>
            <li>
                <a class="dropdown-item" href="./settings.html">
                    <i class="bx bx-cog me-2"></i>
                    <span class="align-middle">Settings</span>
                </a>
            </li>
            <li>
                <div class="dropdown-divider"></div>
            </li>
            <li>
                <a class="dropdown-item logout" href="javascript:void(0)">
                    <i class="bx bx-power-off me-2"></i>
                    <span class="align-middle">Log Out</span>
                </a>
            </li>
            </ul>
        </li>
        <!--/ User -->
      `;
  
      idUserNavEl.innerHTML = htmlDisplay;
    }

    $(document).on("click", ".logout", function (e) {
        localStorage.removeItem("TOKEN");
        localStorage.removeItem("CURRENT_USER");
        window.location.href = "http://127.0.0.1:5502/html/auth-login.html";
      });
  });
  