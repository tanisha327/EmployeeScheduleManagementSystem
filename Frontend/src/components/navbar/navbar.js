import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import "./navbar.css";

export default function ButtonAppBar() {

    const selectedRouteColor = '#1b76d2';
    const location = useLocation();
    const [url,setUrl] = React.useState(location.pathname);
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'));
    React.useEffect(()=>{
        setUrl(location.pathname);
    }, [location.pathname]);

    return (
        <Box sx={{ flexGrow: 1, display: location.pathname === "/" ? 'none':'initial' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        ShiftNinja
                    </Typography>
                    {userData?.userRole && userData.userRole === 'MANAGER' ? (<><Button onClick={(event) => {
                        navigate("/schedule");
                    }} className='nav-buttons' sx={{ backgroundColor: 'white', marginRight: '1rem', color: url.includes("/schedule") ? selectedRouteColor : 'black' }}>Current Schedule</Button>
                        <Button onClick={(event) => {
                            navigate("/post_shifts");
                        }} className='nav-buttons' sx={{ backgroundColor: 'white', marginRight: '1rem', color: url.includes("/post_shifts") ? selectedRouteColor : 'black' }}>Post Shifts</Button><Button onClick={(event) => {
                            navigate("/approve_shifts");
                        }} className='nav-buttons' sx={{ backgroundColor: 'white', marginRight: '1rem', color: url.includes("/approve_shifts") ? selectedRouteColor : 'black' }}>Approve Shifts</Button></>) : (<><Button onClick={(event) => {
                            navigate("/my_shifts");
                        }} className='nav-buttons' sx={{ backgroundColor: 'white', marginRight: '1rem', color: url.includes("/my_shifts") ? selectedRouteColor : 'black' }}>My Shifts</Button>
                            <Button onClick={(event) => {
                                navigate("/available_shifts");
                            }} className='nav-buttons' sx={{ backgroundColor: 'white', marginRight: '1rem', color: url.includes("/available_shifts") ? selectedRouteColor : 'black' }}>Available Shifts</Button></>)}
                    <Button className='nav-buttons logout' onClick={()=>{
                        window.localStorage.clear();
                        navigate("/");
                    }} sx={{ backgroundColor: 'white', color: 'black' }}>Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
