document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", loadCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#password").addEventListener("click", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", validateForm);

// The rubric says to call this function directly.
loadStates();

async function displayCity() {
    const zipCode = document.querySelector("#zip").value.trim();
    const city = document.querySelector("#city");
    const latitude = document.querySelector("#latitude");
    const longitude = document.querySelector("#longitude");

    try {
        const url =
            `https://csumb.space/api/cityInfoAPI.php?zip=${encodeURIComponent(zipCode)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data === false) {
            city.textContent = "Zip code not found";
            city.style.color = "red";
            latitude.textContent = "";
            longitude.textContent = "";
            return;
        }

        city.textContent = data.city;
        city.style.color = "green";
        latitude.textContent = data.latitude;
        longitude.textContent = data.longitude;
    } catch (error) {
        city.textContent = "Unable to retrieve city";
        city.style.color = "red";
        latitude.textContent = "";
        longitude.textContent = "";
        console.error(error);
    }
}

async function loadStates() {
    const stateMenu = document.querySelector("#state");

    stateMenu.textContent = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select One";
    stateMenu.appendChild(defaultOption);

    try {
        const url = "https://csumb.space/api/allStatesAPI.php";
        const response = await fetch(url);
        const data = await response.json();

        for (const item of data) {
            const option = document.createElement("option");

            option.value = item.usps;
            option.textContent = item.state;

            stateMenu.appendChild(option);
        }
    } catch (error) {
        console.error(error);

        stateMenu.textContent = "";

        const errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Unable to load states";

        stateMenu.appendChild(errorOption);
    }
}

async function loadCounties() {
    const state = document.querySelector("#state").value;
    const countyMenu = document.querySelector("#county");

    countyMenu.textContent = "";

    if (state === "") {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Select a state first";
        countyMenu.appendChild(option);
        return;
    }

    try {
        const url =
            `https://csumb.space/api/countyListAPI.php?state=${encodeURIComponent(state)}`;

        const response = await fetch(url);
        const data = await response.json();

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select One";
        countyMenu.appendChild(defaultOption);

        for (const county of data) {
            const option = document.createElement("option");

            // Handles either a county string or an object returned by the API.
            const countyName =
                typeof county === "string"
                    ? county
                    : county.county || county.county_name || county.name;

            option.value = countyName;
            option.textContent = countyName;

            countyMenu.appendChild(option);
        }
    } catch (error) {
        console.error(error);

        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Unable to load counties";
        countyMenu.appendChild(option);
    }
}

async function checkUsername() {
    const username = document.querySelector("#username").value.trim();
    const usernameError = document.querySelector("#usernameError");

    if (username.length === 0) {
        usernameError.textContent = "Username required";
        usernameError.style.color = "red";
        return false;
    }

    try {
        const url =
            `https://csumb.space/api/usernamesAPI.php?username=${encodeURIComponent(username)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.available) {
            usernameError.textContent = "Username available!";
            usernameError.style.color = "green";
            return true;
        }

        usernameError.textContent = "Username taken";
        usernameError.style.color = "red";
        return false;
    } catch (error) {
        usernameError.textContent = "Unable to check username";
        usernameError.style.color = "red";
        console.error(error);
        return false;
    }
}

async function suggestPassword() {
    const passwordSuggestion = document.querySelector("#passwordSuggestion");

    try {
        const url =
            "https://csumb.space/api/suggestedPassword.php?length=8";

        const response = await fetch(url);
        const data = await response.json();

        let suggestedPassword;

        if (typeof data === "string") {
            suggestedPassword = data;
        } else {
            suggestedPassword =
                data.password ||
                data.suggestedPassword ||
                data.suggested_password;
        }

        passwordSuggestion.textContent =
            `Suggested password: ${suggestedPassword}`;
    } catch (error) {
        passwordSuggestion.textContent =
            "Unable to generate password suggestion";
        console.error(error);
    }
}

async function validateForm(event) {
    event.preventDefault();

    let isValid = true;

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value;
    const passwordAgain = document.querySelector("#passwordAgain").value;
    const usernameError = document.querySelector("#usernameError");
    const passwordError = document.querySelector("#passwordError");

    passwordError.textContent = "";

    if (username.length === 0) {
        usernameError.textContent = "Username required";
        usernameError.style.color = "red";
        isValid = false;
    } else {
        const usernameAvailable = await checkUsername();

        if (usernameAvailable === false) {
            isValid = false;
        }
    }

    if (password.length < 6) {
        passwordError.textContent =
            "Password must have at least 6 characters";
        passwordError.style.color = "red";
        isValid = false;
    } else if (password !== passwordAgain) {
        passwordError.textContent = "Passwords do not match";
        passwordError.style.color = "red";
        isValid = false;
    }

    if (isValid) {
        document.querySelector("#signupForm").submit();
    }
}