import {
  AppointmentModel,
  ChangeSet,
  EditingState,
  SchedulerDateTime,
  ViewState,
} from "@devexpress/dx-react-scheduler";
import {
  AllDayPanel,
  AppointmentForm,
  Appointments,
  AppointmentTooltip,
  ConfirmationDialog,
  DateNavigator,
  DayView,
  EditRecurrenceMenu,
  MonthView,
  Scheduler,
  TodayButton,
  Toolbar,
  ViewSwitcher,
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import Paper from "@mui/material/Paper";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./config/firebase";
export default function App() {
  const locale = "pl-PL";

  const [currentDate, setCurrentDate] = useState<SchedulerDateTime>(
    new Date().toISOString()
  );

  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);

  const getAppointments = async () => {
    const appointmentsCollectionRef = collection(db, "appointments");

    const data = await getDocs(appointmentsCollectionRef);

    setAppointments(
      data.docs.map((doc) => ({
        ...doc.data(),
        startDate: doc.data().startDate.toDate().toISOString(),
        endDate: doc.data().endDate.toDate().toISOString(),
        id: doc.id,
      }))
    );
  };

  async function commitChanges({ added, changed, deleted }: ChangeSet) {
    if (added && !changed) {
      setAppointments([...appointments, added as AppointmentModel]);

      await addDoc(collection(db, "appointments"), {
        ...added,
        rRule: added.rRule ?? null,
        exDate: added.exDate ?? null,
      });
    }

    if (changed) {
      setAppointments(
        appointments.map((appointment) =>
          changed[appointment.id!]
            ? { ...appointment, ...changed[appointment.id!] }
            : appointment
        )
      );

      const docRef = doc(db, "appointments", Object.entries(changed)[0][0]);

      const docSnap = await getDoc(docRef);

      await updateDoc(docRef, {
        ...Object.entries(changed)[0][1],
        rRule: Object.entries(changed)[0][1].rRule ?? docSnap.data()?.rRule,
        exDate: Object.entries(changed)[0][1].exDate ?? docSnap.data()?.exDate,
      });
    }

    if (deleted !== undefined) {
      setAppointments(
        appointments.filter((appointment) => appointment.id !== deleted)
      );

      console.log(deleted);

      const docRef = doc(db, "appointments", deleted.toString());

      await deleteDoc(docRef);
    }
  }

  const todayPolishMessage = {
    "pl-PL": {
      today: "Dzisiaj",
    },
  };

  const formPolishMessages = {
    "pl-PL": {
      detailsLabel: "Szczegóły",
      titleLabel: "Tytuł",
      allDayLabel: "Cały dzień",
      repeatLabel: "Powtarzaj",
      moreInformationLabel: "Więcej informacji",
      notesLabel: "...",
      repeatEveryLabel: "Powtarzaj co",
      daysLabel: "dni",
      endRepeatLabel: "Zakończ powtarzanie",
      never: "Nigdy",
      onLabel: "Po",
      occurrencesLabel: "wystąpieniach",
      afterLabel: "W dniu",
      commitCommand: "Zapisz",
      daily: "Codziennie",
      weekly: "Co tydzień",
      monthly: "Co miesiąc",
      yearly: "Co rok",
    },
  };

  const confirmationDialogPolishMessages = {
    "pl-PL": {
      confirmDeleteMessage: "Czy na pewno chcesz usunąć to wydarzenie?",
      confirmCancelMessage: "Czy na pewno chcesz anulować zmiany?",
      discardButton: "Tak",
      deleteButton: "Usuń",
      cancelButton: "Anuluj",
    },
  };

  const allDayPolishMessage = {
    "pl-PL": {
      allDay: "Cały dzień",
    },
  };

  const editRecurrenceMenuPolishMessages = {
    "pl-PL": {
      all: "Wszystkie",
      currentAndFollowing: "Bieżące i następne",
      current: "Bieżące",
      cancelButton: "Anuluj",
      commitButton: "Zapisz",
    },
  };

  const getTodayPolishMessage = () => todayPolishMessage[locale];

  const getFormPolishMessages = () => formPolishMessages[locale];

  const getConfirmationDialogPolishMessages = () =>
    confirmationDialogPolishMessages[locale];

  const getAllDayPolishMessage = () => allDayPolishMessage[locale];

  const getEditRecurrenceMenuPolishMessages = () =>
    editRecurrenceMenuPolishMessages[locale];

  useEffect(() => {
    getAppointments();
  }, [appointments]);

  return (
    <Paper>
      <Scheduler data={appointments} locale={locale}>
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={setCurrentDate}
          defaultCurrentViewName="week"
        />

        <EditingState onCommitChanges={commitChanges} />

        <EditRecurrenceMenu messages={getEditRecurrenceMenuPolishMessages()} />

        <DayView
          name="day"
          displayName="Dzień"
          startDayHour={8}
          endDayHour={20}
        />

        <WeekView
          name="week"
          displayName="Tydzień"
          startDayHour={8}
          endDayHour={20}
        />

        <MonthView name="month" displayName="Miesiąc" />

        <ConfirmationDialog messages={getConfirmationDialogPolishMessages()} />

        <Appointments />

        <AllDayPanel messages={getAllDayPolishMessage()} />

        <AppointmentTooltip showOpenButton showDeleteButton />

        <AppointmentForm messages={getFormPolishMessages()} />

        <Toolbar />

        <DateNavigator />

        <TodayButton messages={getTodayPolishMessage()} />

        <ViewSwitcher />
      </Scheduler>
    </Paper>
  );
}
