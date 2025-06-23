async function CheckSession(gotType) {
    const response = await fetch("/api/auth/isAuthorized");
    const gotUser = await response.json();
    const user = (gotUser.user ? gotUser.user : null);
    if (!user) { window.location.href = "/"; }
    if (gotType) {
        switch (gotType) {
            case "atendente":
                if (user.type != "attendant") {
                    window.location.href = "/"
                }
                break;
            case "medico":
                if (user.type != "doctor") {
                    window.location.href = "/"
                }
                break;
            case "utente":
                if (user.type != "patient") {
                    window.location.href = "/"
                }
                break;
            default:
                window.location.href = "/"
                break;
        }
    }
}

async function CheckLoginSession() {
    const response = await fetch("/api/auth/isAuthorized");
    const gotUser = await response.json();
    const user = (gotUser.user ? gotUser.user : null);
    if (user) {
        switch (user.type) {
            case "doctor":
                window.location.href = "/medico";
                break;
            case "patient":
                window.location.href = "/utente";
                break;
            case "attendant":
                window.location.href = "/atendente";
                break;
            default:
                break;
        }
    }
}

async function LogoutSession() {
    const response = await fetch("/api/auth/logout", { method: "POST", headers: { 'Content-Type': 'application/json' }});
    if (response.ok) { window.location.href = "/"; }
}