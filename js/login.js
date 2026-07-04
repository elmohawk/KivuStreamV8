const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email")
        .value
        .trim();

    const password =
        document.getElementById("password")
        .value;

    const message =
        document.getElementById("message");

    message.style.color = "#ff5c5c";
    message.textContent = "";

    const { error } = await login(email, password);

    if (error) {

        message.textContent = error.message;

        return;

    }

    message.style.color = "#00d26a";
    message.textContent = "Login successful!";

    setTimeout(() => {

        window.location.href = "index.html";

    }, 1000);

});
