import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Calendar | Lookcard Admin Portal",
  description: "View and manage your schedules efficiently with the Lookcard Admin Portal Calendar. Stay organized and on top of your tasks with ease.",
};


const CalendarPage = () => {
  return (
    <DefaultLayout>
      <Calendar />
    </DefaultLayout>
  );
};

export default CalendarPage;
