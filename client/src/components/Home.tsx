
import { useEffect, useState} from 'react'

import Layout from "./Layout"


const Home = () => {
    const [jwt, setJwt] = useState<string | null>(null)

    useEffect(() => {
        if(localStorage.getItem("token")) {
            setJwt(localStorage.getItem("token"))
        }
    }, [jwt])

    /*Check if user has jwt to display the layout */
    return(
        <div>
            {!jwt ? (
                <p>Please login to use the application</p>
            ): (
                <Layout />
            )}
        </div>
    )
}

export default Home
