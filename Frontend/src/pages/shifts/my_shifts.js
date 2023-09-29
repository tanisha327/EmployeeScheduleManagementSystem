import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URLS } from "../../apiConfig";
import {
    ScheduleComponent, Week, Inject,
    ViewsDirective, ViewDirective, DragAndDrop
} from '@syncfusion/ej2-react-schedule';
import CircularProgress from '@mui/material/CircularProgress';

import "./schedule.css";

const MyShifts = () => {
    const availableShiftSettings = {
        categoryColor: '#1b76d2',
        IsReadonly: true,
    };

    const userData = JSON.parse(localStorage.getItem('userData'));

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    const [isLoading, setIsLoading] = useState(true);
    const [shifts, setShifts] = useState([]);

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

    const processShift = (shift) => {
        return modifyForMyShifts({
            ...availableShiftSettings,
            StartTime: shift.startDateTime,
            EndTime: shift.endDateTime,
            Id: shift.id,
            approved: shift.approved,
            user: shift.user,
            Subject: shift.user.name
        });
    };

    async function getShifts() {
        setIsLoading(true);
        await axios.get(API_URLS.schedule)
            .then((res) => {
                const data = res.data;
                if (Array.isArray(data)) {
                    setShifts(data.map(processShift).filter(shift => shift.approved === true && shift.user.username === userData.username && shift.user.organizationNumber === userData.organizationNumber));
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

    return (
        <div className="scheduler-container">
            {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", flexFlow: "column", alignItems: "center" }}>
                    <h2>Loading Shifts</h2>
                    <CircularProgress></CircularProgress>
                </div>
            ) : (
                <ScheduleComponent width={windowDimensions.width - 128} height={windowDimensions.height - 128} eventSettings={{ dataSource: shifts }}
                    eventRendered={onEventRendered}
                >
                    <ViewsDirective>
                        <ViewDirective option='Week'></ViewDirective>
                    </ViewsDirective>
                    <Inject services={[Week, DragAndDrop]} />
                </ScheduleComponent>
            )}
        </div>
    )
}

export default MyShifts;