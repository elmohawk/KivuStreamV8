document
.getElementById("registerForm")
.addEventListener("submit", async (e)=>{

    e.preventDefault();

    await register(

        document.getElementById("email").value,

        document.getElementById("password").value,

        document.getElementById("username").value

    );

});
