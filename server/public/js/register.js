const initializeRegister = () => {
    document.getElementById('registerForm').addEventListener('submit', async(event) => {
        fetchData(event)
    })

    const fetchData = async (event) => {
        event.preventDefault()
    
        //get the username and password from the form
        const formData = {
            username: event.target.username.value,
            password: event.target.password.value
        }

        try {
            const response = await fetch("./user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
                })
            if(!response.ok) {
                document.getElementById("error").innerText = "Error when trying to register. Please try again"
            } else {
                window.location.href ="/login.html"
            }
        } catch(error) {
            console.log("error while trying to register: ", error)
        }
    }
}

initializeRegister()