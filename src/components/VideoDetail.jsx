import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme,
  IconButton,
  Popover,
  Paper,
  MenuItem,
  AppBar,
  Toolbar,
  Slider,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  MoreVert,
  Pause,
  PlayArrow,
  SkipNext,
  AccessTime,
  Lyrics,
  Edit,
} from "@mui/icons-material";
import ReactPlayer from "react-player";
import { Videos } from "./";
import { fetchFromAPI, fetchComments } from "../utils/fetchFromAPI"; // Pastikan import sesuai
import { locales } from '../locales';


const VideoDetail = () => {
  const [language, setLanguage] = useState('en'); // Set default language
  const texts = locales[language];
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [lyricsLines, setLyricsLines] = useState([]);
  const [editedLyrics, setEditedLyrics] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showRelatedVideos, setShowRelatedVideos] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [sleepTimerValue, setSleepTimerValue] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [played, setPlayed] = useState(0);
  const [openMore, setOpenMore] = useState(false); // State for More actions popover
  const [newComment, setNewComment] = useState(""); // State for new comment
  const [showCommentDialog, setShowCommentDialog] = useState(false); // State to control comment dialog
  const { id } = useParams();
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Detect if the device is mobile
  const [playing, setPlaying] = useState(true);
  const [isAppBarSticky, setIsAppBarSticky] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [originalLyrics, setOriginalLyrics] = useState(lyrics);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);


  const fetchComments = useCallback(async () => {
    // Replace with your API call to fetch comments
    // Example:
    // const response = await fetchFromAPI(`comments?videoId=${id}`);
    // setComments(response.data);
    const savedComments = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];
    setComments(savedComments);
  }, [id]);

  const addComment = () => {
    if (newComment.trim() === "") return;
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments)); // Save to localStorage
    setNewComment("");
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const fetchLyrics = useCallback(async (title, artist) => {
    const { songTitle, artist: cleanedArtist } = extractTitleAndArtist(title);
    const lyricsURL = `https://api.lyrics.ovh/v1/${cleanedArtist}/${songTitle}`;
    const geniusURL = `https://api.genius.com/search?q=${encodeURIComponent(
      songTitle + " " + cleanedArtist
    )}&access_token=${process.env.GENIUS_API_KEY}`;

    try {
      // Try fetching lyrics from lyrics.ovh
      const response = await axios.get(lyricsURL);
      if (response.data.lyrics) {
        const formattedLyrics = response.data.lyrics.replace(/\n{2,}/g, "\n\n");
        const lines = formattedLyrics
          .split("\n")
          .filter((line) => line.trim() !== "");
        setLyricsLines(lines);
        setLyrics(formattedLyrics);
      } else {
        // If no lyrics found, try Genius API
        const geniusResponse = await axios.get(geniusURL);
        if (geniusResponse.data.response.hits.length > 0) {
          const geniusLyricsPath =
            geniusResponse.data.response.hits[0].result.path;
          const geniusLyricsURL = `https://api.genius.com${geniusLyricsPath}?access_token=${process.env.GENIUS_API_KEY}`;

          const geniusLyricsResponse = await axios.get(geniusLyricsURL);
          const geniusLyrics = extractLyricsFromGeniusResponse(
            geniusLyricsResponse.data
          );
          const formattedLyrics = geniusLyrics.replace(/\n{2,}/g, "\n\n");
          const lines = formattedLyrics
            .split("\n")
            .filter((line) => line.trim() !== "");
          setLyricsLines(lines);
          setLyrics(formattedLyrics);
        } else {
          setLyrics("Lyrics not available");
        }
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      setLyrics("Lyrics not available");
    }
  }, []); 

  const extractLyricsFromGeniusResponse = (data) => {
    // Implement the function to extract lyrics from Genius response
    // This is a placeholder implementation
    const html = data.response.song.html;
    const lyrics = html.replace(/<[^>]+>/g, "").trim(); // Strip HTML tags
    return lyrics;
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const videoResponse = await fetchFromAPI(
          `videos?part=snippet,statistics&id=${id}`
        );
        const videoData = videoResponse.items[0];
        setVideoDetail(videoData);
        fetchLyrics(videoData.snippet.title, videoData.snippet.channelTitle);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    const fetchRelatedVideos = async () => {
      try {
        const relatedVideosResponse = await fetchFromAPI(
          `search?part=snippet&relatedToVideoId=${id}&type=video`
        );
        setVideos(relatedVideosResponse.items);
      } catch (error) {
        console.error("Error fetching related videos:", error);
      }
    };

    fetchVideoData();
    fetchRelatedVideos();
  }, [id, fetchLyrics]);

  useEffect(() => {
    if (videos && videos.length > 0) {
      setCurrentVideoIndex(0);
    }
  }, [videos]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const appBarHeight = 64; // Assuming default MUI AppBar height
      setIsAppBarSticky(offset > appBarHeight);
      setOriginalLyrics(lyrics);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const savedLyrics = localStorage.getItem(`editedLyrics_${id}`);
    if (savedLyrics) {
      setLyrics(savedLyrics); // Muat lirik yang tersimpan
      setEditedLyrics(savedLyrics); // Juga set editedLyrics agar form edit menampilkan lirik yang tersimpan
    }
  }, [id]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commentsData = await fetchComments(id);
        console.log("Fetched comments data:", commentsData); // Log data yang diterima
        setComments(commentsData || []); // Set comments atau array kosong jika data tidak tersedia
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]); // Set array kosong jika terjadi error
      }
    };
    fetchData();
  }, [id]);
  
  

  const extractTitleAndArtist = (title) => {
    const regex =
      /(.+?)\s*-\s*(.+?)(?:\s*\[.*\]|\s*\(.*\)|\s*Official Video)?$/i;
    const match = title.match(regex);
    if (match) {
      return { songTitle: match[2].trim(), artist: match[1].trim() };
    }
    return { songTitle: title, artist: "" };
  };

  const handleVideoEnd = () => {
    const nextVideoIndex = (currentVideoIndex + 1) % videos.length;
    const nextVideoId = videos[nextVideoIndex]?.id?.videoId;
    if (nextVideoId) {
      navigate(`/video/${nextVideoId}`);
    }
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
    if (!lyricsLines.length) return;
    const currentTime = state.playedSeconds;
    const currentLine = lyricsLines.find((line) =>
      line.startsWith(formatTime(currentTime))
    );
    if (currentLine) {
      setLyrics(currentLine);
    }
  };

  const handleSeekChange = (event, newValue) => {
    if (playerRef.current) {
      const seekTo = (newValue / 100) * playerRef.current.getDuration();
      playerRef.current.seekTo(seekTo, 'seconds');
    }
  };;

  const formatTime = (seconds) => {
    const format = (val) => `0${Math.floor(val)}`.slice(-2);
    const hours = seconds / 3600;
    const minutes = (seconds % 3600) / 60;
    seconds %= 60;
    return [hours, minutes, seconds].map(format).join(":");
  };

  const fetchVideoComments = async () => {
    try {
      const comments = await fetchComments(id);
      setComments(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  const toggleLyrics = () => {
    console.log("Lyrics icon clicked");
    setShowLyrics(!showLyrics);
  };
  

  const toggleRelatedVideos = () => {
    setShowRelatedVideos(!showRelatedVideos);
  };

  const toggleAdvancedSettings = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };

  const toggleSleepTimer = () => {
    setShowSleepTimer(!showSleepTimer);
  };

  const handleSetSleepTimer = () => {
    console.log("Sleep timer set to:", sleepTimerValue);
    setShowSleepTimer(false);
  };

  const handleSaveSettings = () => {
    playerRef.current.seekTo(0);
    playerRef.current.getInternalPlayer().playbackRate = playbackRate;
    setShowAdvancedSettings(false);
  };

  const handleResetSettings = () => {
    setPlaybackRate(1);
    setPitch(1);
    playerRef.current.seekTo(0);
    playerRef.current.getInternalPlayer().playbackRate = 1;
  };

  const handleClickMore = (event) => {
    setAnchorEl(event.currentTarget);
  };
  

  const handleCloseMore = () => {
    setAnchorEl(null);
    setOpenMore(false); // Close More actions popover
  };

  const openDetails = () => {
    setShowDetails(true);
    handleCloseMore();
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  const openShare = () => {
    setShowShare(true);
    handleCloseMore();
  };

  const closeShare = () => {
    setShowShare(false);
  };

  const handleCopyLink = () => {
    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    navigator.clipboard.writeText(videoUrl);
  };

  const handleEditLyrics = () => {
    console.log('Icon clicked');
    setShowEditPopup(true);
  };
  
  

  const handleSaveLyrics = () => {
    setLyrics(editedLyrics); // Update displayed lyrics with edited content
    localStorage.setItem(`editedLyrics_${id}`, editedLyrics); // Save edited lyrics to localStorage
    setShowEditPopup(false);
  };

  const handleResetLyrics = () => {
    setEditedLyrics(originalLyrics); // Reset lirik ke nilai asli
  };
  
  return (
    <Box
    minHeight="95vh"
    bgcolor={theme.palette.background.default}
    sx={{ overflow: "hidden", position: "relative" }}
  >
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${id}`}
            className="react-player"
            width="100%"
            height="450px"
            playing={playing}
            onEnded={handleVideoEnd}
            onProgress={handleProgress}
            playbackRate={playbackRate}
            pitch={pitch}
            ref={playerRef}
          />
  
            {!isMobile && (
              <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <AppBar
                  position="static"
                  sx={{
                    bgcolor: theme.palette.background.default,
                    boxShadow: 'none',
                  }}
                >
                  <Toolbar>
                    <IconButton onClick={togglePlayPause}>
                      {playing ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <Slider
                      value={played * 100}
                      onChange={handleSeekChange}
                      aria-labelledby="continuous-slider"
                      sx={{ width: "90%", mx: 2 }}
                    />
                    <IconButton onClick={handleVideoEnd}>
                      <SkipNext />
                    </IconButton>
                    <IconButton onClick={toggleLyrics}>
                      <Lyrics />
                    </IconButton>
                    <IconButton onClick={toggleSleepTimer}>
                      <AccessTime />
                    </IconButton>
                    <Popover
                      open={showSleepTimer}
                      onClose={toggleSleepTimer}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <Paper sx={{ p: 2, width: "250px" }}>
                        <Typography variant="h6" gutterBottom>
                          Timer
                        </Typography>
                        <TextField
                          label="Minutes"
                          type="number"
                          value={sleepTimerValue}
                          onChange={(e) => setSleepTimerValue(e.target.value)}
                          InputProps={{ inputProps: { min: 1, max: 120 } }}
                          fullWidth
                        />
                        <DialogActions>
                          <Button onClick={handleSetSleepTimer} color="primary">
                            Set Timer
                          </Button>
                        </DialogActions>
                      </Paper>
                    </Popover>
                    <IconButton
                      aria-describedby={openMore ? "popover-more" : undefined}
                      onClick={handleClickMore}
                    >
                      <MoreVert />
                    </IconButton>
                    <Popover
                      id="popover-more"
                      open={openMore}
                      anchorEl={anchorEl}
                      onClose={handleCloseMore}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <Paper>
                        <MenuItem onClick={toggleAdvancedSettings}>
                          Advanced Settings
                        </MenuItem>
                        <MenuItem onClick={openDetails}>Details</MenuItem>
                        <MenuItem onClick={openShare}>Share</MenuItem>
                      </Paper>
                    </Popover>
                  </Toolbar>
                </AppBar>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2 }}>
            <Stack direction="column" spacing={2}>
            {showLyrics && (
              <Paper
                elevation={0}
                sx={{ maxHeight: "50vh", overflowY: "auto", p: 2, position: 'relative' }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6" color="primary">
                    Lyrics
                  </Typography>
                  <IconButton onClick={() => setShowEditPopup(true)}>
                    <Edit />
                  </IconButton>
                </Stack>
                <Typography
                  color={theme.palette.text.primary}
                  variant="body1"
                  sx={{ whiteSpace: "pre-line" }}
                >
                  {lyrics}
                </Typography>
              </Paper>
            )}
              <Button
                onClick={toggleRelatedVideos}
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2, borderRadius: 8 }}
              >
                {showRelatedVideos
                  ? "Hide Related Videos"
                  : "Show Related Videos"}
              </Button>
              {showRelatedVideos && (
                <Box mt={2}>
                  <Typography variant="h6" color="primary">
                    Related Videos
                  </Typography>
                  <Videos videos={videos} direction="column" />
                </Box>
              )}
               {/* <Button
                onClick={() => setShowComments(!showComments)}
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2, borderRadius: 8 }}
              >
                {showComments ? "Hide Comments" : "Show Comments"}
              </Button>

              {showComments && (
                <Box mt={2}>
                  <Typography variant="h6" color="primary">
                    Comments
                  </Typography>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <Paper key={index} sx={{ p: 2, mb: 1 }}>
                        <Typography variant="body1">{comment}</Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography>No comments available.</Typography>
                  )}
                </Box>
              )} */}
            </Stack>
          </Box>
        </Grid>
      </Grid>
  
      {/* Bottom Navbar for Mobile Devices */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            top: 'auto',
            bottom: 0,
            bgcolor: theme.palette.background.default,
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ width: '100%', p: 1 }}
          >
            <IconButton onClick={togglePlayPause}>
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            <Slider
              value={played * 100}
              onChange={handleSeekChange}
              aria-labelledby="continuous-slider"
              sx={{ width: "70%" }}
            />
            <IconButton onClick={handleVideoEnd}>
              <SkipNext />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            spacing={2}  // Add spacing between icons
            alignItems="center"
            justifyContent="center"  // Center icons horizontally
            sx={{ width: '100%', p: 1 }}
          >
            <IconButton onClick={toggleLyrics}>
              <Lyrics />
            </IconButton>
            <IconButton onClick={toggleSleepTimer}>
              <AccessTime />
            </IconButton>
            <IconButton
              aria-describedby={openMore ? "popover-more" : undefined}
              onClick={handleClickMore}
            >
              <MoreVert />
            </IconButton>
          </Stack>
        </AppBar>
      )}
  
      {/* Dialogs */}
      <Dialog open={showAdvancedSettings} onClose={toggleAdvancedSettings}>
        <DialogTitle>Advanced Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Playback Rate"
              type="number"
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              inputProps={{ step: 0.1, min: 0.5, max: 2 }}
              fullWidth
            />
            <TextField
              label="Pitch"
              type="number"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              inputProps={{ step: 0.1, min: 0.5, max: 2 }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveSettings} color="primary">
            Save
          </Button>
          <Button onClick={handleResetSettings} color="secondary">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
  
      <Dialog open={showDetails} onClose={closeDetails}>
        <DialogTitle>Video Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>Title:</strong> {videoDetail?.snippet.title}
          </Typography>
          <Typography variant="body1">
            <strong>Artist:</strong> {videoDetail?.snippet.channelTitle}
          </Typography>
          <Typography variant="body1">
            <strong>Media ID:</strong> {id}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
  
      <Dialog open={showShare} onClose={closeShare}>
        <DialogTitle>Share Video</DialogTitle>
        <DialogContent>
          <TextField
            label="Share Link"
            fullWidth
            value={`https://www.youtube.com/watch?v=${id}`}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyLink} color="primary">
            Copy Link
          </Button>
          <Button onClick={closeShare} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

       
      <Dialog open={showEditPopup} onClose={() => setShowEditPopup(false)}>
        <DialogTitle>Edit Lyrics</DialogTitle>
        <DialogContent>
          <TextField
            label="Lyrics"
            multiline
            rows={10}
            fullWidth
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveLyrics} color="primary">
            Save
          </Button>
          <Button onClick={handleResetLyrics} color="secondary">
            Reset
          </Button>
          <Button onClick={() => setShowEditPopup(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showCommentDialog} onClose={() => setShowCommentDialog(false)}>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            {comments.map((comment, index) => (
              <Paper key={index} sx={{ p: 2, mb: 1 }}>
                <Typography variant="body1">{comment}</Typography>
              </Paper>
            ))}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={addComment} color="primary">
            Add Comment
          </Button>
          <Button onClick={() => setShowCommentDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};  

export default VideoDetail;
