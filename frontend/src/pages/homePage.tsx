// import React from "react";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { deepPurple } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogoutApi, deletePostApi } from "../utils/apis";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { removeUser } from "../redux/slices/userSlice";

const PostTemplate = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface IPostImage {
  public_id: string;
  url: string;
}

interface IPost {
  title: string;
  image: IPostImage;
  owner: string;
  createdAt: Date;
  _id: string;
}

function HomePage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [postId, setPostId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fileteredPosts, setFilteredPosts] = useState<IPost[]>(
    user?.posts || []
  );

  useEffect(() => {
    if (user && user.posts) {
      const filtered = user.posts.filter((post) =>
        post.title?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPosts(filtered || []);
    }
  }, [searchText, user?.posts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const {
    data: deletePostData,
    isSuccess: deletePostSuccess,
    error: deletePostError,
    isLoading: deletePostLoading,
    refetch: deletePostRefetch,
  } = useQuery({
    queryKey: ["delete-post"],
    queryFn: () => deletePostApi(postId),
    enabled: false,
  });

  const queryClient = useQueryClient();

  const handleDeletePost = (id: string) => {
    setPostId(id);
    deletePostRefetch();
  };

  useEffect(() => {
    if (deletePostData && deletePostSuccess) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Post deleted successfully");
    }
    if (deletePostError) {
      if (
        isAxiosError(deletePostError) &&
        deletePostError?.message === "Network Error"
      ) {
        toast.error("Network error");
      }

      if (
        isAxiosError(deletePostError) &&
        deletePostError.response &&
        deletePostError.response.data
      ) {
        const errorMessage = (
          deletePostError.response.data as { error: string }
        ).error;
        toast.error(errorMessage);
      }
    }
  }, [deletePostData, deletePostSuccess, deletePostError]);

  const {
    data: logoutData,
    isSuccess: logoutSuccess,
    error: logoutError,
    isLoading: logoutLoading,
    refetch: logoutRefetch,
  } = useQuery({ queryKey: ["logout"], queryFn: LogoutApi, enabled: false });

  const handleLogout = () => {
    logoutRefetch();
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (logoutData && logoutSuccess) {
      queryClient.resetQueries({ queryKey: ["logout"] });
      dispatch(removeUser());
      toast.success("Logged out successfully");
    }
    if (logoutError) {
      if (
        isAxiosError(logoutError) &&
        logoutError?.message === "Network Error"
      ) {
        toast.error("Network error");
      }

      if (
        isAxiosError(logoutError) &&
        logoutError.response &&
        logoutError.response.data
      ) {
        const errorMessage = (logoutError.response.data as { error: string })
          .error;
        toast.error(errorMessage);
      }
    }

    return () => {
      queryClient.resetQueries({ queryKey: ["logout"] });
    };
  }, [logoutData, logoutSuccess, logoutError]);

  return (
    <Box maxWidth={"md"} minWidth={"xs"} mx={"auto"}>
      <Container
        sx={{
          py: 2,
        }}
      >
        <Box>
          <TextField
            placeholder="Search post by title..."
            variant="outlined"
            fullWidth
            margin="normal"
            type="search"
            size={"small"}
            name="search"
            id="search-input"
            onChange={handleSearch}
            value={searchText}
            // error={errors.password ? true : false}
          />
          <Box display={"flex"} flexDirection={"row"} justifyContent={"end"}>
            <IconButton title="Logout" onClick={handleLogout}>
              {logoutLoading ? (
                <CircularProgress sx={{ color: "black" }} />
              ) : (
                <LogoutIcon />
              )}
            </IconButton>
          </Box>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          mb={4}
        >
          <Avatar
            alt="Remy Sharp"
            // src="https://mui.com/static/images/avatar/1.jpg"
            sx={{
              width: { md: 172, xs: 120 },
              height: { md: 172, xs: 120 },
              bgcolor: deepPurple[500],
              fontSize: { md: 90, xs: 60 },
            }}
          >
            {user && user.name.charAt(0)}
          </Avatar>
          <Box ml={1} display={"flex"} flexDirection={"column"}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant={"subtitle1"}
                fontSize={{ md: 30, sm: 26, xs: 18 }}
                flexGrow={1}
                textAlign={"center"}
              >
                {user && user.name}
              </Typography>
            </Box>
            <Link to={"/post/create"}>
              <Button>Create new post</Button>
            </Link>
          </Box>
        </Box>
        <Divider />
        {/* Posts grid */}
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {fileteredPosts.length === 0 ? (
              <Box textAlign={"center"} width={"100%"} py={5}>
                <Typography variant="h5">
                  {searchText ? "No posts found" : "No posts yet"}
                </Typography>
              </Box>
            ) : (
              user &&
              fileteredPosts.map((post: IPost, index) => (
                <Grid item xs={12} sm={4} md={4} key={index}>
                  <PostTemplate
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box height={250} width={250} position={"relative"}>
                      {deletePostLoading ? (
                        <CircularProgress sx={{ color: "black" }} />
                      ) : (
                        <>
                          <img
                            src={post.image ? post.image.url : ""}
                            alt={post.title ? post.title : "img"}
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            title={post && post.title}
                          />
                          {/* <Box
                            position={"absolute"}
                            bottom={-2}
                            textAlign={"center"}
                            width={"full"}
                          >
                            <Typography variant={"h3"}>
                              {post && post.title}
                            </Typography>
                          </Box> */}
                          <IconButton
                            sx={{
                              zIndex: 100,
                              position: "absolute",
                              top: 1,
                              right: 2,
                            }}
                            onClick={() => handleDeletePost(post._id)}
                          >
                            <DeleteIcon
                              fontSize="small"
                              sx={{ color: "white" }}
                            />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </PostTemplate>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
