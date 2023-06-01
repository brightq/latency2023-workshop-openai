import { Typography, Stack, TextField, Button, Card, CardContent } from "@mui/material";
import { useRef, useCallback, useState } from "react";

export default function Home() {

  const blurbRef = useRef("");
  const [generatingPosts, setGeneratingPosts] = useState("");

  const generateBlurb = useCallback(async () => {
    let done = false;

    const response = await fetch("/api/generateBlurb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: blurbRef.current,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratingPosts((prev) => prev + chunkValue);
    }
  }
    , [blurbRef.current]);

  return (
    <Stack
      component="main"
      direction="column"
      maxWidth="50em"
      mx="auto"
      alignItems="center"
      justifyContent="center"
      py="1em"
      spacing="1em"
    >
      <Typography
        variant="h1"
        className="bg-gradient-to-br from-black to-stone-400 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
      >
        Generate your next Twitter post with ChatGPT
      </Typography>

      <TextField
        multiline
        fullWidth
        minRows={4}
        onChange={(e) => {
          blurbRef.current = e.target.value;
        }}
        sx={{ "& textarea": { boxShadow: "none !important" } }}
        placeholder="Key words on what you would like your blurb to be about"
      ></TextField>

      <Button onClick={generateBlurb}>Generate Blurb</Button>

      {generatingPosts && (
        <Card>
          <CardContent>{generatingPosts}</CardContent>
        </Card>
      )}
    </Stack>
  );
}