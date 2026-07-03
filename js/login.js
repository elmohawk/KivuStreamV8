document
.getElementById("loginForm")
.addEventListener("submit", async (e)=>{

    e.preventDefault();

    await login(

        document.getElementById("email").value,

        document.getElementById("password").value

    );

});
