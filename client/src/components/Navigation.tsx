import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'

//AppBar functionality 
const Navigation = () => {
    const [jwt, setJwt] = useState<string | null>(null)

    useEffect(() => {
        if(localStorage.getItem("token")) {
            setJwt(localStorage.getItem("token"))
        }
    }, [jwt])

    const logout = () => {
        localStorage.removeItem("token")
        setJwt(null)
        window.location.href = "/"
    }

    return (
        <Box sx={{ flexGrow: 1}} >
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        >
                        <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                Tommi Heinonen - final project
                        </Typography>
                        <Button component={Link} to="/" color="inherit">Home</Button>
                        {!jwt ? (<><Button component={Link} to="/login" color="inherit">Login</Button>
                            <Button component={Link} to="/register" color="inherit">Register</Button></>
                        ) : (
                        <Button component={Link} to="/logout" color="inherit" onClick={logout}>Logout</Button>)
                        }
                        
                    </Toolbar>
                </AppBar>
            </Box>
    )
}

export default Navigation