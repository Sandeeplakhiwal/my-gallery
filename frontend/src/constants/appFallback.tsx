import { Box, Typography } from "@mui/material";

function AppFallback() {
  return (
    <Box
      display={"flex"}
      minHeight={"90vh"}
      justifyContent={"center"}
      textAlign={"center"}
    >
      <Typography
        color={"blueviolet"}
        fontWeight={"bold"}
        variant={"h4"}
        my={"auto"}
      >
        My Gallery
      </Typography>
    </Box>
  );
}

export default AppFallback;
