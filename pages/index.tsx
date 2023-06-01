import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRef, useCallback } from "react";

export default function Home() {
  
  const blurbRef = useRef("");

  const generateBlurb = useCallback(async () => {
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
    const data = await response.json();
    console.log("Response was:", JSON.stringify(data));
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
   </Stack>
  );
}