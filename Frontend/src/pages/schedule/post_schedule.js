import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URLS } from "../../apiConfig";
import {
    ScheduleComponent, Week, Inject,
    ViewsDirective, ViewDirective, DragAndDrop
} from '@syncfusion/ej2-react-schedule';
import CircularProgress from '@mui/material/CircularProgress';

import { createRoot } from 'react-dom/client';

import { Button } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import "./schedule.css";

const PostSchedule = () => {
    const postShiftSettings = {
        categoryColor: '#F57F16',
        IsReadonly: true,
    };

    const userData = JSON.parse(localStorage.getItem('userData'));

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    const [isLoading, setIsLoading] = useState(true);
    const [shifts, setShifts] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const toADTISOString = (date) => {
        let adtDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));
        let adtISOString = adtDate.toISOString().slice(0, 19);
        return adtISOString;
    }

    const onActionComplete = (args) => {
        let newshiftData = {};
        if (args.data) {
            const data = args.data[0];
            newshiftData['startDateTime'] = toADTISOString(new Date(data.StartTime));
            newshiftData['endDateTime'] = toADTISOString(new Date(data.EndTime));
        } else {
            return;
        }

        if (args.requestType === 'eventCreated') {
            postShift(newshiftData);
        }

        if (args.requestType === "eventChanged") {
        }

        if (args.requestType === "eventRemoved") {

        }
    };

    const onEventRendered = (args) => {
        let categoryColor = args.data.categoryColor;
        const el = args.element;

        if (!args.element || !categoryColor) {
            return;
        }
        else {
            el.style.backgroundColor = categoryColor;
        }
    };

    const onPopupOpen = (args) => {
        if (new Date(args?.data?.StartTime).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
            args.cancel = true; 
            setSnackbarMessage("Cannot Create events in past!");
            setOpen(true);
        }
    }

    const processShift = (shift) => {
        return {
            ...postShiftSettings,
            StartTime: shift.startDateTime,
            EndTime: shift.endDateTime,
            Id: shift.id,
            approved: shift.approved,
            user: shift.user,
            Subject: shift.approved ? "Posted (Approved)":"Posted",
            
        };
    };

    async function postShift(shift) {
        axios.post(API_URLS.postShifts, shift).then((res) => {
            getShifts();
        }).catch((error) => {
            console.error(error);
        });
    }

    async function getShifts() {
        setIsLoading(true);
        await axios.get(API_URLS.schedule)
            .then((res) => {
                const data = res.data;
                if (Array.isArray(data)) {
                    setShifts(data.map(processShift).filter(shift => shift.approved === false && shift.user.userRole === "MANAGER" && shift.user.organizationNumber === userData.organizationNumber));
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    };

    function handleResize() {
        setWindowDimensions(getWindowDimensions());
    }

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    useEffect(() => {
        getShifts();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    
    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => { setOpen(false) }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div className="scheduler-container">
            {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", flexFlow: "column", alignItems: "center" }}>
                    <h2>Loading Shifts</h2>
                    <CircularProgress></CircularProgress>
                </div>
            ) : (
                <ScheduleComponent width={windowDimensions.width - 128} height={windowDimensions.height - 128} eventSettings={{ dataSource: shifts }}
                    eventRendered={onEventRendered} actionComplete={onActionComplete} popupOpen={onPopupOpen}
                >
                    <ViewsDirective>
                        <ViewDirective option='Week'></ViewDirective>
                    </ViewsDirective>
                    <Inject services={[Week, DragAndDrop]} />
                </ScheduleComponent>
            )}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={(event) => { setOpen(false) }}
                message={snackbarMessage}
                anchorOrigin={{ vertical: "top", horizontal: 'center' }}
                action={action}
            >
            </Snackbar>
        </div>
    )
}

export default PostSchedule;
