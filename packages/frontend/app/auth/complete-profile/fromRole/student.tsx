"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Container } from "lucide-react";

const StudentForm = () => {
  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>Veuillez remplir vos information </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row">
            <div>
              <Field></Field>
            </div>
            <div></div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentForm;
