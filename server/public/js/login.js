const initializeLogin = () => {
    document.getElementById('loginForm').addEventListener('submit', async(event) => {
        fetchData(event)
    })
}

const fetchData = async (event) => {
    event.preventDefault()

    //get the username and password from the form
    const formData = {
        username: event.target.username.value,
        password: event.target.password.value
    }

    try{
        const response = await fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        //If response ok, store the token in local storage and redirect user to home page
        //If not, throw an error
        if(!response.ok) {
            document.getElementById("error").innerText = "Error when trying to login. Please try again"
        } else {
            const data = await response.json()
            if(data.token) {
                localStorage.setItem("auth_token", data.token)
                window.location.href = "/" //needs implementation, should I redirect to home page or root?
            }
        }
    } catch (error) {
        console.log("error while trying to register: ", error)
    }
}

initializeLogin()