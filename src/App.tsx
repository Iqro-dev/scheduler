import {
  AppointmentModel,
  ChangeSet,
  EditingState,
  IntegratedEditing,
  SchedulerDateTime,
  ViewState,
} from "@devexpress/dx-react-scheduler";
import {
  AppointmentForm,
  Appointments,
  AppointmentTooltip,
  ConfirmationDialog,
  DayView,
  MonthView,
  Resources,
  Scheduler,
  Toolbar,
  ViewSwitcher,
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import Paper from "@mui/material/Paper";
import { useState } from "react";

export default function App() {
  const [currentDate, setCurrentDate] = useState<SchedulerDateTime>(
    new Date().toISOString()
  );

  const [appointments, setAppointments] = useState<AppointmentModel[]>([
    {
      id: 1,
      startDate: "2024-08-06T09:45",
      endDate: "2024-08-06T11:00",
      title: "Meeting",
    },
    {
      id: 2,
      startDate: "2024-08-07T12:00",
      endDate: "2024-08-07T13:30",
      title: "Go to a gym",
    },
  ]);

  const resources = [
    {
      fieldName: "type",
      title: "Type",
      instances: [
        { id: "private", text: "Private", color: "#EC407A" },
        { id: "work", text: "Work", color: "#7E57C2" },
      ],
    },
  ];

  function commitChanges({ added, changed, deleted }: ChangeSet) {
    if (added) {
      setAppointments([...appointments, added as AppointmentModel]);
    }
    if (changed) {
      setAppointments(
        appointments.map((appointment) =>
          changed[appointment.id!]
            ? { ...appointment, ...changed[appointment.id!] }
            : appointment
        )
      );
    }
    if (deleted !== undefined) {
      setAppointments(
        appointments.filter((appointment) => appointment.id !== deleted)
      );
    }
  }

  return (
    <Paper>
      <Scheduler data={appointments} locale={"pl-PL"} height={600}>
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={setCurrentDate}
          defaultCurrentViewName="week"
        />

        <EditingState onCommitChanges={commitChanges} />

        <IntegratedEditing />

        <DayView
          name="day"
          displayName="Dzień"
          startDayHour={9}
          endDayHour={14}
        />

        <WeekView
          name="week"
          displayName="Tydzień"
          startDayHour={9}
          endDayHour={14}
        />

        <MonthView name="month" displayName="Miesiąc" />

        <ConfirmationDialog />

        <Appointments />

        <AppointmentTooltip showOpenButton showDeleteButton />

        <AppointmentForm />

        <Toolbar />

        <ViewSwitcher />

        <Resources data={resources} />
      </Scheduler>
    </Paper>
  );
}
