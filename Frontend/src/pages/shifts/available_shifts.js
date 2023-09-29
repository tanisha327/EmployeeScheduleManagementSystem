import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URLS } from "../../apiConfig";
import {
  ScheduleComponent,
  Week,
  Inject,
  ViewsDirective,
  ViewDirective,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import CircularProgress from "@mui/material/CircularProgress";

import { createRoot } from "react-dom/client";

//Snackbar Dependencies
import { Button } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
//Date Components
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";

import "./schedule.css";

const AvailableShifts = () => {
  const availableShiftSettings = {
    Subject: "Available",
    categoryColor: "#1AAB55",
    IsReadonly: true,
  };

  const userData = JSON.parse(localStorage.getItem("userData"));

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const [isLoading, setIsLoading] = useState(true);
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState({
    startDateTime: "",
    endDateTime: "",
  });

  //Snackbar variables
  const [open, setOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //convert Date
  const toADTISOString = (date) => {
    let adtDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
    let adtISOString = adtDate.toISOString().slice(0, 19);
    return adtISOString;
  };

  const onActionComplete = (args) => {
    let newshiftData = {};
    if (args.data) {
      const data = args.data[0];
      newshiftData["startDateTime"] = toADTISOString(new Date(data.StartTime));
      newshiftData["endDateTime"] = toADTISOString(new Date(data.EndTime));
    } else {
      return;
    }
  };

  const onEventRendered = (args) => {
    let categoryColor = args.data.categoryColor;
    const el = args.element;

    if (!args.element || !categoryColor) {
      return;
    } else {
      el.style.backgroundColor = categoryColor;
    }
  };

  const onPopupOpen = (args) => {
    if (
      new Date(args?.data?.StartTime).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0)
    ) {
      args.cancel = true;
      setSnackbarMessage("Cannot select past Shifts");
      setOpen(true);
    }

    let newshiftData = {};
    newshiftData["startDateTime"] = toADTISOString(
      new Date(args?.data?.StartTime)
    );
    newshiftData["endDateTime"] = toADTISOString(new Date(args?.data?.EndTime));
    setSelectedShift(newshiftData);

    const shiftData = {
      StartTime: args.data.StartTime,
      EndTime: args.data.EndTime,
      id: args.data.Id,
    };

    if (args.type === "QuickInfo" && args.data.Subject) {
      const quickPopup = args.element;
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("select-shift-container");
      quickPopup.appendChild(buttonContainer);
      const root = createRoot(buttonContainer);
      root.render(
        <>
          <CustomPopup shiftData={shiftData}></CustomPopup>
        </>
      );
    } else {
      args.cancel = true;
      setSnackbarMessage("You are not allowed to access this slot");
      setOpen(true);
    }
  };

  const processShift = (shift) => {
    return {
      ...availableShiftSettings,
      StartTime: shift.startDateTime,
      EndTime: shift.endDateTime,
      Id: shift.id,
      approved: shift.approved,
      user: shift.user,
    };
  };

  const filterShifts = (shifts) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let processedShifts = shifts.filter(
      (shift) =>
        Date.parse(shift.StartTime) > today.getTime() &&
        !shift.approved &&
        shift.user.userRole === "MANAGER" &&
        shift.user.organizationNumber === userData.organizationNumber
    );

    let approved_shifts = shifts.filter(
      (shift) =>
        shift.approved === true &&
        shift.user.organizationNumber === userData.organizationNumber
    );
    let available_shifts = [];

    processedShifts.forEach((pshift) => {
      let shiftAvaillable = true;
      approved_shifts.forEach((ashift) => {
        if (
          ashift.StartTime === pshift.StartTime &&
          ashift.EndTime === pshift.EndTime
        ) {
          shiftAvaillable = false;
        }
      });
      if (shiftAvaillable) {
        available_shifts.push(pshift);
      }
    });

    return available_shifts;
  };

  async function postShift(shift) {
    await axios
      .post(API_URLS.postShifts, shift)
      .then((res) => {
        setSnackbarMessage("Request for preffered time sent");
        setOpen(true);
        getShifts();

      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getShifts() {
    setIsLoading(true);
    await axios
      .get(API_URLS.schedule)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setShifts(filterShifts(data.map(processShift)));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }

  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  useEffect(() => {
    getShifts();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Customs components for scheduler
  function CustomPopup({ shiftData }) {
    const [showCustomTimeForm, setShowCustomTimeForm] = useState(false);
    const [customStartTime, setCustomStartTime] = useState(shiftData.StartTime);
    const [customEndTime, setCustomEndTime] = useState(shiftData.EndTime);
    return (
      <div className="available-shift-buttons">
        {showCustomTimeForm ? (
          <>
            <form className="time-form">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimeField"]}>
                  <TimeField
                    label="Preffered Start Time"
                    defaultValue={dayjs(customStartTime)}
                    minTime={dayjs(customStartTime)}
                    maxTime={dayjs(customEndTime)}
                    required
                    onChange={(newValue) => {
                        if (newValue) {
                          setCustomStartTime(newValue);
                        } else {
                         //
                        }
                      }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <br></br>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimeField"]}>
                  <TimeField
                    label="Preffered End Time"
                    
                    defaultValue={dayjs(customEndTime)}
                    minTime={dayjs(customStartTime)}
                    maxTime={dayjs(customEndTime)}
                    required
                    onChange={(newValue) => {
                        if (newValue) {
                          setCustomEndTime(newValue);
                        } else {
                         //   
                        }
                      }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <br></br>
            </form>
          </>
        ) : (
          <></>
        )}
        <CustomButton></CustomButton>
        {showCustomTimeForm ? (
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginLeft: "0.5rem" }}
            onClick={() => {
              const shift = {
                startDateTime: toADTISOString(new Date(customStartTime)),
                endDateTime: toADTISOString(new Date(customEndTime)),
              };
             postShift(shift);
            }}
          >
            Request Preffered Time
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setShowCustomTimeForm(true);
            }}
            sx={{ marginLeft: "0.5rem" }}
          >
            Choose Preffered Time
          </Button>
        )}
      </div>
    );
  }

  function CustomButton() {
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
      if (
        isLoading &&
        selectedShift.startDateTime &&
        selectedShift.startDateTime !== ""
      ) {
        postShift(selectedShift)
          .then((res) => {
            setSnackbarMessage("Sent for Approval");
            setOpen(true);
            setLoading(false);
          })
          .catch((error) => {
            setSnackbarMessage("Error Sending for Approval!!!");
            setOpen(true);
            setLoading(false);
          });
      }
    }, [selectedShift, isLoading]);

    return (
      <Button
        variant="contained"
        color="success"
        onClick={(e) => {
          setLoading(true);
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
        onClick={() => {
          setOpen(false);
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="scheduler-container">
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexFlow: "column",
            alignItems: "center",
          }}
        >
          <h2>Loading Shifts</h2>
          <CircularProgress></CircularProgress>
        </div>
      ) : (
        <ScheduleComponent
          width={windowDimensions.width - 128}
          height={windowDimensions.height - 128}
          eventSettings={{ dataSource: shifts }}
          eventRendered={onEventRendered}
          actionComplete={onActionComplete}
          popupOpen={onPopupOpen}
        >
          <ViewsDirective>
            <ViewDirective option="Week"></ViewDirective>
          </ViewsDirective>
          <Inject services={[Week, DragAndDrop]} />
        </ScheduleComponent>
      )}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={(event) => {
          setOpen(false);
        }}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={action}
      ></Snackbar>
    </div>
  );
};

export default AvailableShifts;
