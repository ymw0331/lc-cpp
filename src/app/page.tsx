import AgentDashboard from "@/components/Dashboard/AgentDashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Lookcard Admin Portal | Manage Your Business Effortlessly",
  description: "The Lookcard Admin Portal is your all-in-one dashboard for managing your business efficiently. Track performance, analyze data, and take control of your operations with ease.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <AgentDashboard />
      </DefaultLayout>
    </>
  );
}
