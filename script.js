function openTab(tab, event) {
    document.querySelectorAll(".tab-page").forEach(page => page.classList.add("hidden"));
    document.getElementById(tab).classList.remove("hidden");
    document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
}

function toggleCountryDropdown() {
    const dropdown = document.getElementById("countryDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function selectCountry(flag, code) {
    document.getElementById("selectedFlag").src = flag;
    const phoneInput = document.getElementById("phoneInput");
    const onlyNumber = phoneInput.value.replace(/^\+\d+\s*/, "");
    phoneInput.value = code + " " + onlyNumber;
    document.getElementById("countryDropdown").style.display = "none";
}

const countries = [
    { flag: 'in', code: '+91', name: 'India' },
    { flag: 'us', code: '+1', name: 'United States' },
    { flag: 'gb', code: '+44', name: 'United Kingdom' },
    { flag: 'ae', code: '+971', name: 'UAE' },
    { flag: 'au', code: '+61', name: 'Australia' },
    { flag: 'ca', code: '+1', name: 'Canada' },
    { flag: 'jp', code: '+81', name: 'Japan' },
    { flag: 'de', code: '+49', name: 'Germany' },
    { flag: 'fr', code: '+33', name: 'France' },
    { flag: 'sg', code: '+65', name: 'Singapore' },
    { flag: 'br', code: '+55', name: 'Brazil' },
    { flag: 'mx', code: '+52', name: 'Mexico' },
    { flag: 'za', code: '+27', name: 'South Africa' },
    { flag: 'ng', code: '+234', name: 'Nigeria' },
    { flag: 'pk', code: '+92', name: 'Pakistan' },
    { flag: 'bd', code: '+880', name: 'Bangladesh' },
    { flag: 'lk', code: '+94', name: 'Sri Lanka' },
    { flag: 'nz', code: '+64', name: 'New Zealand' },
];

function buildCountryList(filter = '') {
    const list = document.getElementById('countryList');
    list.innerHTML = '';
    countries
        .filter(c => (c.name + ' ' + c.code).toLowerCase().includes(filter.toLowerCase()))
        .forEach(c => {
            const div = document.createElement('div');
            div.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:9px;cursor:pointer;font-size:12px;color:#ddd;';
            div.onmouseover = () => div.style.background = 'rgba(255,255,255,0.1)';
            div.onmouseout = () => div.style.background = 'transparent';

            const img = document.createElement('img');
            img.src = `https://flagcdn.com/w40/${c.flag}.png`;
            img.style.cssText = 'width:24px;height:17px;border-radius:3px;object-fit:cover;flex-shrink:0;';

            const txt = document.createTextNode(`${c.name} ${c.code}`);

            div.appendChild(img);
            div.appendChild(txt);
            div.onclick = () => selectCountry(`https://flagcdn.com/w40/${c.flag}.png`, c.code);
            list.appendChild(div);
        });
}

function filterCountries() {
    buildCountryList(document.getElementById("countrySearch").value);
}

window.addEventListener("DOMContentLoaded", () => buildCountryList());

document.addEventListener("click", function (e) {
    const phoneBox = document.querySelector(".phone-box");
    if (phoneBox && !phoneBox.contains(e.target)) {
        document.getElementById("countryDropdown").style.display = "none";
    }
});

// Bio character count
const bioBox = document.querySelector(".bio-box");
const count = document.querySelector(".count");
function updateCount() { count.textContent = bioBox.value.length + "/300"; }
bioBox.addEventListener("input", updateCount);
updateCount();

// Save
document.querySelector(".save-btn").addEventListener("click", async function () {

    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();
    const bio = bioBox.value.trim();

    if (!name) {
        alert("Please enter name");
        return;
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
        alert("Please enter valid email");
        return;
    }

    if (!phone) {
        alert("Please enter phone number");
        return;
    }

    // Store JSON in frontend
    // Store JSON in frontend
let storedData = JSON.parse(localStorage.getItem("users"));

if (!storedData || !Array.isArray(storedData.users)) {
    storedData = { users: [] };
}

storedData.users.push({
    name: name,
    email: email,
    phone: phone,
    bio: bio
});

localStorage.setItem(
    "users",
    JSON.stringify(storedData)
);

    // Send JSON to backend
    const profileData = {
        name: name,
        email: email,
        phone: phone,
        bio: bio
    };

    try {

        const response = await fetch(
            "http://localhost:3000/api/profile",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profileData)
            }
        );

        const result = await response.json();
        if (result.success) {
            alert("Profile Saved Successfully ");

            console.log(
                JSON.parse(localStorage.getItem("users"))
            );
        } else {
            alert("Save Failed");
        }

    } catch (error) {
        console.error(error);
        alert("Backend Connection Failed");
    }
});



// Toggle preferences
document.querySelectorAll(".switch input").forEach((toggle, index) => {
    const saved = localStorage.getItem("pref_" + index);
    if (saved !== null) toggle.checked = saved === "true";
    toggle.addEventListener("change", function () {
        localStorage.setItem("pref_" + index, this.checked);
    });
});


async function loadUsersFromJson() {

    try {

        const response = await fetch("data.json");
        const data = await response.json();

        if (data.users.length > 0) {

            document.getElementById("nameInput").value =
                data.users[0].name;

            document.getElementById("emailInput").value =
                data.users[0].email;

            document.getElementById("phoneInput").value =
                data.users[0].phone;

            document.querySelector(".bio-box").value =
                data.users[0].bio;

            updateCount();
        }

    } catch (error) {

        console.error(
            "Error loading data.json:",
            error
        );

    }
}

// Load saved data
window.addEventListener("load", async function () {

    await loadUsersFromJson();

    if (localStorage.getItem("profileName"))
        document.getElementById("nameInput").value =
            localStorage.getItem("profileName");

    if (localStorage.getItem("profileEmail"))
        document.getElementById("emailInput").value =
            localStorage.getItem("profileEmail");

    if (localStorage.getItem("profilePhone"))
        document.getElementById("phoneInput").value =
            localStorage.getItem("profilePhone");

    if (localStorage.getItem("profileBio")) {
        bioBox.value =
            localStorage.getItem("profileBio");
        updateCount();
    }

    if (localStorage.getItem("profileFlag"))
        document.getElementById("selectedFlag").src =
            localStorage.getItem("profileFlag");

    if (localStorage.getItem("profileAvatar"))
        document.querySelector(".avatar").style.backgroundImage =
            `url('${localStorage.getItem("profileAvatar")}')`;

});

function openFileUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpg,image/jpeg,image/svg+xml";
    input.onchange = function () {
        const file = input.files[0];
        if (file) updateAvatar(file);
    };
    input.click();
}

function updateAvatar(file) {
    if (!file.type.startsWith("image/")) { alert("Please upload image only"); return; }
    if (file.size > 10 * 1024 * 1024) { alert("Image must be below 10MB"); return; }
    const reader = new FileReader();
    reader.onload = function (e) {
        document.querySelector(".avatar").style.backgroundImage = `url('${e.target.result}')`;
        localStorage.setItem("profileAvatar", e.target.result);
        alert("Avatar updated successfully ");
    };
    reader.readAsDataURL(file);
}