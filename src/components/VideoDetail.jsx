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
  Tooltip,


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
  const [darkMode, setDarkMode] = useState(false);
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


  // darkmode color
  const backgroundColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#000000';
  const paperBackground = darkMode ? '#1e1e1e' : '#f5f5f5';

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

  // Darkmode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const fetchLyrics = useCallback(async (title, artist) => {
    const { songTitle, artist: cleanedArtist } = extractTitleAndArtist(title);

    try {
      // Fetch lyrics from LRCLib
      const lrcLibURL = `https://lrclib.net/api/search?track_name=${encodeURIComponent(songTitle)}&artist_name=${encodeURIComponent(cleanedArtist)}`;
      
      const response = await axios.get(lrcLibURL);
      
      if (response.data && response.data.length > 0) {
        // Ambil ID lagu pertama yang cocok
        const songId = response.data[0].id;
        
        // Fetch lirik berdasarkan ID
        const lyricsResponse = await axios.get(`https://lrclib.net/api/get/${songId}`);
        
        if (lyricsResponse.data.plainLyrics) {
          const formattedLyrics = lyricsResponse.data.plainLyrics.replace(/\n{2,}/g, "\n\n");
          const lyricsWithSource = `${formattedLyrics}\n\n[Source: LRCLIB]`;
          
          const lines = lyricsWithSource
            .split("\n")
            .filter((line) => line.trim() !== "");
          
          setLyricsLines(lines);
          setLyrics(lyricsWithSource);
        } else {
          setLyrics("Lyrics not available");
        }
      } else {
        setLyrics("Lyrics not available");
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      setLyrics("Lyrics not available");
    }
  }, []);

  {lyrics.split('\n').map((line, index) => (
    <Typography 
      key={index} 
      variant="body1" 
      sx={{ 
        color: line.startsWith('Source:') ? 'gray' : 'inherit',
        fontStyle: line.startsWith('Source:') ? 'italic' : 'normal'
      }}
    >
      {line}
    </Typography>
  ))}

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
        // Dapatkan video terkait dengan sorting berdasarkan view count
        const relatedVideosResponse = await fetchFromAPI(
          `search?part=snippet&relatedToVideoId=${id}&type=video&order=viewCount&maxResults=50`
        );
    
        // Filter dan urutkan video berdasarkan view count
        const sortedVideos = relatedVideosResponse.items
          .filter(video => 
            video.snippet.thumbnails.high && // Pastikan memiliki thumbnail berkualitas
            video.snippet.title.toLowerCase().indexOf('short') === -1 // Hindari shorts
          )
          .sort((a, b) => {
            // Jika memungkinkan, tambahkan logika sorting tambahan
            const titleQualityA = checkTitleQuality(a.snippet.title);
            const titleQualityB = checkTitleQuality(b.snippet.title);
            return titleQualityB - titleQualityA;
          })
          .slice(0, 10); // Ambil 10 video terbaik
    
        setVideos(sortedVideos);
      } catch (error) {
        console.error("Error fetching related videos:", error);
        // Fallback ke daftar default jika gagal
        setVideos([]);
      }
    };
    
    // Fungsi pembantu untuk menilai kualitas judul
    const checkTitleQuality = (title) => {
      let quality = 0;
      
      // Berikan skor berdasarkan kriteria
      if (title.length > 10 && title.length < 70) quality += 2; // Judul ideal
      if (!/\b(short|shorts)\b/i.test(title)) quality += 1; // Hindari shorts
      
      // Tambahkan kriteria lain sesuai kebutuhan
      const qualityKeywords = [
        'official', 'video', 'live', 'acoustic', 
        'remix', 'cover', 'music'
      ];
      
      qualityKeywords.forEach(keyword => {
        if (title.toLowerCase().includes(keyword)) quality += 1;
      });
    
      return quality;
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
  };

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
      sx={{ 
        backgroundColor: backgroundColor,
        color: textColor,
        overflow: "hidden", 
        position: "relative", 
        p: { xs: 1, md: 3 }
      }}
    >
       <Grid container spacing={3}>
        {/* Video Player Section */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3}
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              backgroundColor: paperBackground,
              '&:hover': {
                transform: 'scale(1.01)'
              }
            }}
          >
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
                style={{ 
                  borderRadius: '16px',
                  backgroundColor: 'white',
                }}
              />

              {!isMobile && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    width: '100%',
                    background: 'linear-gradient(to top, rgba(255,255,255,0.7), transparent)'
                  }}
                >
                  <AppBar
                    position="static"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.9)',
                      boxShadow: 'none',
                    }}
                  >
                    <Toolbar>
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        alignItems="center" 
                        sx={{ width: '100%' }}
                      >
                        <IconButton onClick={togglePlayPause} sx={{ color: 'black' }}>
                          {playing ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <Slider
                          value={played * 100}
                          onChange={handleSeekChange}
                          aria-labelledby="continuous-slider"
                          sx={{ 
                            width: "70%",
                            color: 'black',
                            '& .MuiSlider-thumb': {
                              backgroundColor: 'black',
                            },
                            '& .MuiSlider-track': {
                              backgroundColor: 'black',
                            },
                          }}
                        />
                        <IconButton onClick={handleVideoEnd} sx={{ color: 'black' }}>
                          <SkipNext />
                        </IconButton>
                        <IconButton onClick={toggleLyrics} sx={{ color: 'black' }}>
                          <Lyrics />
                        </IconButton>
                        <IconButton onClick={toggleSleepTimer} sx={{ color: 'black' }}>
                          <AccessTime />
                        </IconButton>
                        <IconButton
                          aria-describedby={openMore ? "popover-more" : undefined}
                          onClick={handleClickMore}
                          sx={{ color: 'black' }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Stack>
                    </Toolbar>
                  </AppBar>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Lyrics and Related Videos Section */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {showLyrics && (
              <Paper
                elevation={2}
                sx={{ 
                  maxHeight: "50vh", 
                  overflowY: "auto", 
                  p: 3, 
                  borderRadius: 3,
                  backgroundColor: paperBackground,
                  color: textColor,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    sx={{ fontWeight: 'bold' }}
                  >
                    Lyrics
                  </Typography>
                  <IconButton 
                    onClick={() => setShowEditPopup(true)}
                    size="small"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Stack>
                
                <Typography
                  color={theme.palette.text.primary}
                  variant="body1"
                  sx={{ 
                    whiteSpace: "pre-line",
                    lineHeight: 1.6,
                  }}
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
              sx={{ 
                borderRadius: 8, 
                py: 1.5,
                fontWeight: 'bold',
                borderWidth: 2,
                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: darkMode ? '#ffffff' : 'primary',
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                }
              }}
            >
              {showRelatedVideos
                ? "Hide Related Videos"
                : "Show Related Videos"}
            </Button>
            {showRelatedVideos && (
              <Box>
                <Typography 
                  variant="h6" 
                  color="primary" 
                  sx={{ mb: 2, fontWeight: 'bold' }}
                >
                  Related Videos
                </Typography>
                <Videos videos={videos} direction="column" />
              </Box>
            )}
          </Stack>
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
              value ={played * 100}
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
            spacing={2}
            alignItems="center"
            justifyContent="center"
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
      )};
        
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
}
export default VideoDetail;
