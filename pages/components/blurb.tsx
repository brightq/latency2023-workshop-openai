import { Card, CardContent, Stack } from "@mui/material";
import Plagiarism from "./plagiarism";
import { useState, useEffect } from "react";
import dummyScanResults from "../../utils/dummy-data/dummyScanResults.json";


interface Props {
  generatingPost: string;
  blurbsFinishedGenerating: boolean;
}

export default function Blurb({ generatingPost, blurbsFinishedGenerating }: Props) {
  const [plagiarismLoading, setPlagiarismLoading] = useState<boolean>(false);
  const [plagiarisedScore, setPlagiarisedScore] = useState<number>(0);

  const checkPlagiarism = async (streamedBlurb: string) => {
    setPlagiarismLoading(true);
    // await new Promise((r) => setTimeout(r, 500));
    const scan = dummyScanResults;
    handleScan(streamedBlurb, scan);
    setPlagiarismLoading(false);
  };

  function handleScan(text: string, scan: any) {
    const totalBlurbWords = text.split(" ").length;
    const matchedWords = scan.matchedWords;
    setPlagiarisedScore((matchedWords / totalBlurbWords) * 100);
  }

  useEffect(() => {
    if (blurbsFinishedGenerating) {
      checkPlagiarism(generatingPost);
    }
  }, [blurbsFinishedGenerating]);

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

