import { Card, CardContent, Stack } from "@mui/material";
import Plagiarism from "./plagiarism";
import { useState } from "react";

interface Props {
  generatingPost: string;
}

export default function Blurb({ generatingPost }: Props) {
  const [plagiarismLoading, setPlagiarismLoading] = useState<boolean>(false);
  const [plagiarisedScore, setPlagiarisedScore] = useState<number>(0);
  return (
      <Stack direction="row" spacing="1em">
        <Card sx={{ width: "37em" }}>
          <CardContent>{generatingPost}</CardContent>
        </Card>
        <Stack
          alignItems="center"
          justifyContent="center"
          width="12em"
          className="bg-white rounded-xl shadow-md p-4 border"
        >
          <Plagiarism loading={plagiarismLoading} score={plagiarisedScore} />
        </Stack>
      </Stack>
  );
}