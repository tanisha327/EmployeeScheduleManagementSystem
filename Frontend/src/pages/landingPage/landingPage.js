import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocation } from 'react-router-dom';

import {
    ScheduleComponent, Week, Inject,
    ViewsDirective, ViewDirective, DragAndDrop
} from '@syncfusion/ej2-react-schedule';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { fetchSchedule } from '../../apiConfig';
import "./landingPage.css";

const LandingPage = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const location = useLocation();
    const [currentPath, setPath] = useState(location.pathname);
    const [shifts, setShifts] = useState([]);
    const [localSchedule, setLocalSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const scheduleObj = useRef(null);

    const eventSettings = {
        availableShifts: {
            Subject: 'Available',
            categoryColor: '#1AAB55',
            IsReadonly: true
        },

        myShifts: {
            Subject: '',
            categoryColor: '#1B76D2',
            IsReadonly: false,
        },

        postShifts: {
            Subject: 'Posted',
            categoryColor: '#F57F16',
            IsReadonly: false,
        },

        schedule: {
            Subject: 'userId',
            categoryColor: '#1B76D2',
            IsReadonly: false
        }
    }

    //scheduler functions
    const onActionBegin = (args) => {
        if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
            const eventData = args.data instanceof Array ? args.data[0] : args.data;
            if (new Date(eventData.StartTime).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                args.cancel = true;
                setSnackbarMessage("Cannot Create/Update events in past!");
                setOpen(true);
            }
        }
    };

    const onActionComplete = (args) => {
        let newshiftData = {};
        if (args.data) {
            const data = args.data[0];
            newshiftData['startDateTime'] = new Date(data.StartTime).toISOString();
            newshiftData['endDateTime'] = new Date(data.EndTime).toISOString();
            newshiftData['Id'] = data.Id;
        } else {
            return;
        }

        if (args.requestType === 'eventCreated') {
            setLocalSchedule([...localSchedule, newshiftData]);
        }

        if (args.requestType === "eventChanged") {
            let updatedSchedule = [...localSchedule];
            let ind = updatedSchedule.findIndex(item => item.Id === newshiftData.Id);
            updatedSchedule[ind] = newshiftData;
            setLocalSchedule(updatedSchedule);
        }

        if (args.requestType === "eventRemoved") {
            let updatedSchedule = localSchedule.filter(item => item.Id !== args.data[0].Id);
            let updatedShifts = shifts.filter(item => item.Id !== args.data[0].Id);
            setLocalSchedule(updatedSchedule);
            setShifts(updatedShifts);
        }
    };

    const onEventRendered = (args) => {
        let categoryColor = args.data.categoryColor;
        if (!args.element || !categoryColor) {
            return;
        }
        const el = args.element;
        if (scheduleObj.current.currentView === 'Agenda') {
            el.firstChild.style.borderLeftColor = categoryColor;
        }
        else {
            el.style.backgroundColor = categoryColor;
        }

    };

    const onPopupOpen = (args) => {
 
        if (currentPath === "/available_shifts") {
            if (args.type === 'QuickInfo' && args.data.Subject) {
                const quickPopup = args.element;
                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add("select-shift-container");
                quickPopup.appendChild(buttonContainer);
                const root = createRoot(buttonContainer);
                root.render(<CustomButton></CustomButton>);
            }else{
                args.cancel = true; 
                setSnackbarMessage("You are not allowed to access this slot");
                setOpen(true);
            }
        } else if(currentPath === "/my_shifts" || currentPath === "/schedule"){
            if(!args.data.Subject){
                args.cancel = true; 
                setSnackbarMessage("You are not allowed to access this slot");
                setOpen(true);
            }
        }

        if (new Date(args?.data?.StartTime).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
            args.cancel = true; 
            setSnackbarMessage("Cannot Create events in past!");
            setOpen(true);
        }

    }

    //component additional functions
    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const modifyForMyShifts = (shift) => {
        const date = new Date(shift?.StartTime);
        const today = new Date();

        if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear() && date.getDate() === today.getDate()) {
            shift.Subject = "Your next shift is today";
        } else {
            shift.Subject = date.toLocaleDateString("en-US", { weekday: 'long' });
        }

        return shift;
    };

    const markPastShiftsReadOnly = (shift) => {
        const date = new Date(shift?.StartTime);
        const today = new Date();
        if (date.getDate() < today.getDate() && date.getMonth() <= today.getMonth()) {
            shift.IsReadonly = true;
            shift.Subject += " (Completed)"
        }
        return shift;
    }

    const modifyShiftData = (scheduleData, scheduleSettings) => {
        const modifiedSchedule = [];
        scheduleData.forEach((shift) => {
            let modifiedShift = {};
            modifiedShift['Id'] = shift?.ID;
            modifiedShift["StartTime"] = shift?.startDateTime;
            modifiedShift["EndTime"] = shift?.endDateTime;
            modifiedShift = Object.assign(modifiedShift, scheduleSettings);
            if (currentPath === "/my_shifts") {
                modifiedShift = modifyForMyShifts(modifiedShift);
            }
            modifiedShift = markPastShiftsReadOnly(modifiedShift);
            modifiedSchedule.push(modifiedShift);
        });
        setShifts(modifiedSchedule);
    }

    const addSettings = (schedule) => {
        setShifts([]);
        setIsLoading(true);
        if (currentPath === "/my_shifts") {
            modifyShiftData(schedule, eventSettings.myShifts);
        } else if (currentPath === "/available_shifts") {
            modifyShiftData(schedule, eventSettings.availableShifts);
        } else if (currentPath === "/schedule") {
            modifyShiftData(schedule, eventSettings.schedule);
        } else if (currentPath === "/post_shifts") {
            modifyShiftData(schedule, eventSettings.postShifts);
        }
        setIsLoading(false);
    };

    function handleResize() {
        setWindowDimensions(getWindowDimensions());
    }

    useEffect(() => {
        setPath(location.pathname);
        addSettings(localSchedule);
    }, [location.pathname, localSchedule]);

    useEffect(() => {
        setIsLoading(shifts.length === 0);
    }, [shifts]);

    useEffect(() => {
        addSettings(localSchedule);
      }, [localSchedule]);
      
    useEffect(() => {
        async function fetchAndSetSchedule() {
            await fetchSchedule().then((res) => {
                setLocalSchedule(res);
                setIsLoading(false);
            });

        }
        fetchAndSetSchedule();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Custom Components for scheduler
    function CustomButton() {
        return (
            <Button
                variant='outlined'
                color="success"
                onClick={(e) => {
                    setSnackbarMessage("Shift Assigned to you");
                    setOpen(true);
                }}
            >
                Select Shift
            </Button>
        );
    }

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
            {isLoading ? (<div style={{ display: "flex", justifyContent: "center", flexFlow: "column", alignItems: "center" }}>

                <h2>Loading Shifts</h2>
                <CircularProgress></CircularProgress>
            </div>) : (<>
                <ScheduleComponent actionBegin={onActionBegin} selectedDate={new Date()} popupOpen={onPopupOpen} actionComplete={onActionComplete} width={windowDimensions.width - 128} height={windowDimensions.height - 128} ref={scheduleObj} eventSettings={{ dataSource: shifts }} eventRendered={onEventRendered}>
                    <ViewsDirective>
                        <ViewDirective option='Week'></ViewDirective>
                    </ViewsDirective>
                    <Inject services={[Week, DragAndDrop]} />
                </ScheduleComponent>
            </>)}

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
    );

}

export default LandingPage;
