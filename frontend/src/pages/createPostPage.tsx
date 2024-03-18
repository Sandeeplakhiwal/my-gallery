import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { createNewPostApi } from "../utils/apis";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as PageRoutes from "../constants/routes";

export interface SelectedFile {
  file: File;
  dataUrl: string;
}

export const readFileAsync = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        resolve(reader.result as string);
      }
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

function CreatePostPage() {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [title, setTitle] = useState("");
  const naviage = useNavigate();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      try {
        const dataUrl = await readFileAsync(file);
        setSelectedFile({ file, dataUrl });
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      try {
        const dataUrl = await readFileAsync(file);
        setSelectedFile({ file, dataUrl });
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const queryClient = useQueryClient();

  const { isPending: MutationPending, mutateAsync } = useMutation({
    mutationKey: ["Share-post"],
    mutationFn: createNewPostApi,
    onSuccess: () => {
      setTitle("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      naviage(PageRoutes.HOME);
      toast.success("Post Created Successfully");
    },
    onError: (error: any) => {
      console.log("Error", error);
      if (error.message === "Network Error") toast.error("You are offline!");
      else toast.error("Internal server error!");
    },
  });

  const handlePostSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (selectedFile && selectedFile.file) {
      formData.append("image", selectedFile.file);
    } else {
      toast.error("No image file selected.");
      return;
    }

    mutateAsync(formData);
  };

  return (
    <Box maxWidth={"md"} mx={"auto"}>
      <Typography
        variant={"h5"}
        sx={{ textDecoration: "underline" }}
        textAlign={"center"}
      >
        Create New Post
      </Typography>
      <Container
        maxWidth="sm"
        sx={{
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "80vh",
          alignItems: "center",
          mt: 2,
          mb: 5,
        }}
      >
        {selectedFile ? (
          <Box>
            <Box height={350} width={350}>
              <img
                src={selectedFile.dataUrl}
                alt="Uploaded Image"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
            <Box textAlign={"center"}>
              <Button size="small" onClick={() => setSelectedFile(null)}>
                Change
              </Button>
            </Box>
            <Box
            // sx={{
            //   display: "flex",
            //   flexDirection: "row",
            //   alignItems: "center",
            //   gap: 2,
            //   justifyContent: "center",
            // }}
            >
              {/* <Avatar
                sx={{
                  width: { md: 72, xs: 60 },
                  height: { md: 72, xs: 60 },
                  bgcolor: deepPurple[500],
                  fontSize: { md: 40, xs: 30 },
                }}
              >
                SL
              </Avatar> */}
              {/* <InputLabel>Title</InputLabel> */}
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                type="text"
                required
                size={"small"}
                name="title"
                id="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </Box>
            <Box display={"flex"} justifyContent={"center"}>
              <Button
                variant="contained"
                fullWidth
                disabled={!selectedFile.dataUrl || !title || MutationPending}
                onClick={(e) => handlePostSubmit(e)}
              >
                {MutationPending ? "Uploading.." : "Upload"}
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Box
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Box height={250} width={250}>
                <img
                  src="/images/upload.svg"
                  alt="upload imgs"
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              </Box>
            </Box>
            <Box>
              {dragging ? (
                <Typography variant={"subtitle1"}>
                  Drop the image here
                </Typography>
              ) : (
                <Typography variant={"subtitle1"}>
                  Drag & Drop image here
                </Typography>
              )}
            </Box>
            <Box>
              <label
                htmlFor="fileInput"
                style={{
                  cursor: "pointer",
                  backgroundColor: "blueviolet",
                  color: "white",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  display: "inline-block",
                  margin: "32px 0",
                }}
              >
                Choose File
              </label>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e)}
                accept="image/*"
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

export default CreatePostPage;
