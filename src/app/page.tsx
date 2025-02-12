import AgentDashboard from "@/components/Dashboard/AgentDashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Lookcard Reseller Portal | Community Partnership Program",
  description: "The Lookcard Community Partnership Program is your all-in-one dashboard for managing your business efficiently. Track performance, analyze data, and take control of your operations with ease.",
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
