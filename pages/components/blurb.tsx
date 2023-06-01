import { Card, CardContent, Stack, Box } from "@mui/material";
import Plagiarism from "./plagiarism";
import { useState, useEffect } from "react";
import dummyScanResults from "@/utils/dummy-data/dummyScanResults.json";
import dummyCompletedExportResultsWebhookResponse from "@/utils/dummy-data/dummyCompletedExportResultsWebhookResponse.json";
import dummyCompletedScanWebhookResponse from "@/utils/dummy-data/dummyCompletedScanWebhookResponse.json";
import { FirebaseWrapper } from "@/lib/firebase/firebaseWrapper";
import { onValue } from "firebase/database";

interface Props {
  generatingPost: string;
  blurbsFinishedGenerating: boolean;
}

type ScanResponse = {
  scanId: string;
}

export default function Blurb({ generatingPost, blurbsFinishedGenerating }: Props) {
  const [plagiarismLoading, setPlagiarismLoading] = useState<boolean>(false);
  const [plagiarisedScore, setPlagiarisedScore] = useState<number>(0);
  const [highlightedHTMLBlurb, setHighlightedHTMLBlurb] = useState<JSX.Element>();

  const checkPlagiarism = async (streamedBlurb: string) => {
    setPlagiarismLoading(true);

    // Send blurb to be scanned for plagiarism
    const scanResponse = await fetch("/api/plagiarismCheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: streamedBlurb,
      }),
    });

    const scanId = ((await scanResponse.json()) as ScanResponse).scanId;
    const firebase = new FirebaseWrapper();
    const scanRef = firebase.getScanReference(scanId);
    onValue(scanRef, async (scanRecord: any) => {
      // Only continue if a <scanId> node is present in Firebase
      if (scanRecord.exists()) {
        const scan = scanRecord.val();
        handleScan(streamedBlurb, scan);
      }
    });
    setPlagiarismLoading(false);
  };

  function handleScan(text: string, scan) {
    const totalBlurbWords = text.split(" ").length;
    const matchedWords = scan.matchedWords;
    setPlagiarisedScore((matchedWords / totalBlurbWords) * 100);
    if (matchedWords == 0) {
      setPlagiarismLoading(false);
    } else if (scan.results) {
      const characterStarts = scan.results.identical.source.chars.starts;
      const characterLengths = scan.results.identical.source.chars.lengths;
      const highlightedHTMLBlurb = getHighlightedHTMLBlurb(
        text,
        characterStarts,
        characterLengths
      );
      setHighlightedHTMLBlurb(highlightedHTMLBlurb);
      setPlagiarismLoading(false);
    }
  }

  function getHighlightedHTMLBlurb(
    text: string,
    characterStarts: number[],
    characterLengths: number[]
  ) {
    let characterStartsIndex = 0;
    let highlightedHTMLBlurb = "";
    for (let i = 0; i < text.length; i++) {
      if (i == characterStarts[characterStartsIndex]) {
        const segmentStart = characterStarts[characterStartsIndex];
        const segmentEnd =
          characterStarts[characterStartsIndex] +
          characterLengths[characterStartsIndex];

        highlightedHTMLBlurb += `<mark style="background:#FF9890">${text.substring(
          segmentStart,
          segmentEnd
        )}</mark>`;

        i = segmentEnd - 1;
        characterStartsIndex = characterStartsIndex + 1;
      } else {
        highlightedHTMLBlurb += text[i];
      }
    }
    return <Box dangerouslySetInnerHTML={{ __html: highlightedHTMLBlurb }}></Box>;
  }

  useEffect(() => {
    if (blurbsFinishedGenerating) {
      checkPlagiarism(generatingPost);
      setHighlightedHTMLBlurb(<>{generatingPost}</>);
    }
  }, [blurbsFinishedGenerating]);

  return (
    <Stack direction="row" spacing="1em">
      <Card sx={{ width: "37em" }}>
        <CardContent>
          {!blurbsFinishedGenerating ? generatingPost : highlightedHTMLBlurb}
        </CardContent>
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

