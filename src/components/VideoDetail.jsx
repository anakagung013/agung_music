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
import { fetchFromAPI } from "../utils/fetchFromAPI";
import cheerio from "cheerio";

const VideoDetail = () => {
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
  const { id } = useParams();
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const [playing, setPlaying] = useState(true);
  const [isAppBarSticky, setIsAppBarSticky] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

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
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const savedLyrics = localStorage.getItem(`editedLyrics_${id}`);
    if (savedLyrics) {
      setEditedLyrics(savedLyrics);
    }
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
    setPlayed(newValue / 100);
    playerRef.current.seekTo(newValue / 100);
  };

  const formatTime = (seconds) => {
    const format = (val) => `0${Math.floor(val)}`.slice(-2);
    const hours = seconds / 3600;
    const minutes = (seconds % 3600) / 60;
    seconds %= 60;
    return [hours, minutes, seconds].map(format).join(":");
  };

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  const toggleLyrics = () => {
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
    setOpenMore(true); // Open More actions popover
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
    setEditedLyrics(lyrics); // Load current lyrics into editedLyrics for editing
    setShowEditPopup(true);
  };

  const handleSaveLyrics = () => {
    setLyrics(editedLyrics); // Update displayed lyrics with edited content
    localStorage.setItem(`editedLyrics_${id}`, editedLyrics); // Save edited lyrics to localStorage
    setShowEditPopup(false);
  };

  return (
    <Box
      minHeight="95vh"
      bgcolor={theme.palette.background.default}
      sx={{ overflow: "hidden", position: "relative" }}
    >
      <AppBar
        position={isAppBarSticky ? "sticky" : "relative"}
        sx={{
          top: "auto",
          bottom: 0,
          bgcolor: theme.palette.background.default,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" color="textPrimary">
              {videoDetail?.snippet.title}
            </Typography>
          </Box>
          <IconButton onClick={togglePlayPause}>
            {playing ? <Pause /> : <PlayArrow />}
          </IconButton>
          <Slider
            value={played * 100}
            onChange={handleSeekChange}
            aria-labelledby="continuous-slider"
            sx={{ width: "30%", mx: 2 }}
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
                Set Sleep Timer
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

      <Box minHeight="95vh" sx={{ overflowY: "auto", paddingTop: "64px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <ReactPlayer
                ref={playerRef}
                url={`https://www.youtube.com/watch?v=${id}`}
                className="react-player"
                width="100%"
                height="450px"
                playing={playing}
                onEnded={handleVideoEnd}
                onProgress={handleProgress}
                playbackRate={playbackRate}
                pitch={pitch}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <Stack direction="column" spacing={2}>
                {showLyrics && (
                  <Paper sx={{ maxHeight: "50vh", overflowY: "auto", p: 2 }}>
                    <Typography variant="h6" color="primary">
                      Lyrics
                    </Typography>
                    <Typography
                      color={theme.palette.text.primary}
                      variant="body1"
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {lyrics}
                    </Typography>
                    <IconButton onClick={handleEditLyrics}>
                      <Edit />
                    </IconButton>
                  </Paper>
                )}
                <Button
                  onClick={toggleRelatedVideos}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
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
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>

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
          <Button onClick={closeShare} color="primary">
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
            fullWidth
            rows={6}
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditPopup(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveLyrics} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoDetail;
