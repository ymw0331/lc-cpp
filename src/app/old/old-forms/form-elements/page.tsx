import React from "react";
import FormElements from "@/components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Form Elements | Lookcard Admin Portal",
  description: "Discover and customize form elements in the Lookcard Admin Portal. Build intuitive forms to collect and manage user data efficiently.",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <FormElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
