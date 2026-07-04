const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const confirm = document.getElementById("confirmPassword").value;

    const message = document.getElementById("message");

    message.textContent = "";

    if (password !== confirm) {

        message.textContent = "Passwords do not match.";

        return;

    }

    if (password.length < 6) {

        message.textContent = "Password must be at least 6 characters.";

        return;

    }

    const { error } = await register(name, email, password);

    if (error) {

        message.textContent = error.message;

        return;

    }

    message.style.color = "#00d26a";
    message.textContent =
        "Registration successful! Please check your email to verify your account.";

    form.reset();

});
