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

import "./schedule.css";

const ApproveShifts = () => {
  const approveShiftSettings = {
    categoryColor: "#b65dc3",
    IsReadonly: true,
  };

  const userData = JSON.parse(localStorage.getItem("userData"));

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const [isLoading, setIsLoading] = useState(true);
  const [rawShifts, setRawShifts] = useState([]);
  const [shifts, setShifts] = useState([]);
  
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
    /*
        let newshiftData = {};
        if (args.data) {
            const data = args.data[0];
            newshiftData['startDateTime'] = toADTISOString(new Date(data.StartTime));
            newshiftData['endDateTime'] = toADTISOString(new Date(data.EndTime));
        } else {
            return;
        }
*/
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
    newshiftData["id"] = args?.data?.Id;
    newshiftData["startDateTime"] = toADTISOString(args?.data?.StartTime);
    newshiftData["endDateTime"] = toADTISOString(args?.data?.EndTime);

    if (args.type === "QuickInfo" && args.data.Subject) {
      const quickPopup = args.element;
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("select-shift-container");
      quickPopup.appendChild(buttonContainer);
      const root = createRoot(buttonContainer);
      root.render(<CustomButton selectedShift={newshiftData}></CustomButton>);
    } else {
      args.cancel = true;
      setSnackbarMessage("Please add shifts of POST SHIFTS page");
      setOpen(true);
    }
  };

  const processShift = (shift) => {
    return {
      ...approveShiftSettings,
      StartTime: shift.startDateTime,
      EndTime: shift.endDateTime,
      Id: shift.id,
      approved: shift.approved,
      user: shift.user,
      Subject: "Request by " + shift.user.name,
    };
  };

  const filterShifts = (shifts) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let processedShifts = shifts.filter(
      (shift) =>
        Date.parse(shift.StartTime) > today.getTime() &&
        !shift.approved &&
        shift.user.userRole === "EMPLOYEE" &&
        shift.user.organizationNumber === userData.organizationNumber
    );
    return processedShifts;
  };

  async function updateShift(shift) {
    await axios
      .put(API_URLS.update + shift.id, {
        startDateTime: shift.startDateTime,
        endDateTime: shift.endDateTime,
      })
      .then((res) => {
        setOpen(false);
        setSnackbarMessage("updated the posted shift");
        setOpen(true);
        getShifts();
      })
      .catch((error) => {
        setSnackbarMessage("Error while performing action");
        setOpen(true);
        console.error(error);
      });
  }

  async function approveShift(shift) {
    await axios
      .post(API_URLS.approve, shift)
      .then((res) => {
        setSnackbarMessage("Approved");
        setOpen(true);
        let shiftToModify;
        rawShifts.forEach((rawShift) => {
          if (
            rawShift.startDateTime === shift.startDateTime &&
            rawShift.endDateTime !== shift.endDateTime
          ) {
            shiftToModify = rawShift;
          }
        });
        if (shiftToModify) {
          shiftToModify.startDateTime = shift.endDateTime;
          updateShift(shiftToModify);
        }
      })
      .catch((error) => {
        setSnackbarMessage("Error while performing action");
        setOpen(true);
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
          setRawShifts(data.filter((shift)=> shift.user.organizationNumber === userData.organizationNumber));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setSnackbarMessage("Error while performing action");
        setOpen(true);
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

  function CustomButton({selectedShift}) {
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
      if (isLoading && selectedShift?.id !== "") {
        approveShift(selectedShift)
          .then((res) => {
            setLoading(false);
          })
          .catch((error) => {
            setSnackbarMessage("Error while Approving!!!");
            setOpen(true);
            setLoading(false);
          });
      }
    }, [selectedShift, isLoading]);

    return (
      <Button
        variant="outlined"
        color="secondary"
        onClick={(e) => {
          setLoading(true);
          approveShift(selectedShift);
        }}
      >
        Approve Shift
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

export default ApproveShifts;
