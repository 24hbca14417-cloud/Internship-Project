let selectedFeedback = "";

/* Meeting data */
function formatDuration(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
}

function updateMeetingData() {

    const startTime =
        Number(localStorage.getItem("meetingStartTime"));

    const endTime =
        Number(localStorage.getItem("meetingEndTime")) ||
        Date.now();

    const participants =
        localStorage.getItem("participantsCount");

    if (startTime) {

        document.getElementById(
            "durationText"
        ).innerText =
            formatDuration(endTime - startTime);

    }

    if (participants) {

        document.getElementById(
            "participantsText"
        ).innerText =
            participants;

    }
}

/* Load users from JSON */
async function loadUsers() {

    try {

        const response =
            await fetch("session end host.json");

        if (!response.ok) {
            throw new Error(
                "Failed to load session end host.json"
            );
        }

        const data =
            await response.json();
document.getElementById("durationText").innerText =
    data.meeting.duration;

document.getElementById("participantsText").innerText =
    data.meeting.participants;
        const container =
            document.getElementById(
                "attentionContainer"
            );

        if (!container) {
            console.error(
                "attentionContainer not found"
            );
            return;
        }

        container.innerHTML = "";

        data.users.forEach(user => {

            const row =
                document.createElement("div");

            row.className =
                "user-row";

            row.innerHTML = `
                <div class="user-name">
                    ${user.name}
                </div>

                <div class="progress">
                    <div
                        class="progress-fill"
                        data-value="${user.percentage}"
                        style="width:0%">
                    </div>
                </div>

                <div class="percent">
                    ${user.percentage}%
                </div>
            `;

            container.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Error loading users:",
            error
        );

    }
}

/* Attention bars */
function animateAttentionBars() {

    document
        .querySelectorAll(".progress-fill")
        .forEach(fill => {

            const value =
                fill.getAttribute("data-value");

            setTimeout(() => {

                fill.style.width =
                    value + "%";

            }, 300);

        });

}

/* Toast */
function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);
}

/* Feedback */
function selectFeedback(element, value) {

    selectedFeedback = value;

    document
        .querySelectorAll(".feedback-option")
        .forEach(option => {

            option.classList.remove("active");

        });

    element.classList.add("active");

    document
        .querySelector(".feedback")
        .classList.remove("error");

    showToast(
        "Feedback selected: " + value
    );
}

function checkFeedback() {

    if (selectedFeedback === "") {

        const feedbackBox =
            document.querySelector(".feedback");

        feedbackBox.classList.add("error");

        showToast(
            "⚠ Please select feedback before continuing"
        );

        setTimeout(() => {

            feedbackBox.classList.remove("error");

        }, 1500);

        return false;
    }

    return true;
}

/* Save report */
function saveSessionReport() {

    const attentionUsers = [];

    document
        .querySelectorAll(".user-row")
        .forEach(row => {

            attentionUsers.push({

                user:
                    row.querySelector(".user-name")
                       .innerText,

                score:
                    row.querySelector(".percent")
                       .innerText

            });

        });

    const report = {

        duration:
            document.getElementById(
                "durationText"
            ).innerText,

        participants:
            document.getElementById(
                "participantsText"
            ).innerText,

        attentionUsers:

            attentionUsers,

        feedback:
            selectedFeedback,

        comment:
            document.getElementById(
                "commentBox"
            ).value.trim(),

        savedAt:
            new Date().toLocaleString()

    };

    localStorage.setItem(
        "lastSessionReport",
        JSON.stringify(report)
    );

    console.log(
        "Session Report:",
        report
    );
}

/* Buttons */
function startNewMeeting() {

    if (!checkFeedback())
        return;

    saveSessionReport();

    localStorage.setItem(
        "meetingStartTime",
        Date.now()
    );

    localStorage.removeItem(
        "meetingEndTime"
    );

    showToast(
        "Starting new meeting..."
    );

    setTimeout(() => {

        window.location.href =
            "meeting.html";

    }, 900);
}

function goHome() {

    if (!checkFeedback())
        return;

    saveSessionReport();

    showToast(
        "Going home..."
    );

    setTimeout(() => {

        window.location.href =
            "index.html";

    }, 900);
}

/* Page Load */
window.onload = async function () {

    

    await loadUsers();

    animateAttentionBars();

};