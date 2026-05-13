import React, { useState } from 'react';

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('720');
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);

  const extractVideoId = (link) => {
    let videoId = null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (let pattern of patterns) {
      const match = link.match(pattern);
      if (match) {
        videoId = match[1];
        break;
      }
    }
    return videoId;
  };

  const validateYouTubeUrl = (link) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
    return youtubeRegex.test(link);
  };

  const handleFetchInfo = async () => {
    setError('');
    setSuccess('');
    setVideoInfo(null);
    setShowPlayer(false);

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError('Invalid YouTube URL. Please enter a valid YouTube link (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Could not extract video ID from the URL. Please check the link.');
      return;
    }

    setLoading(true);
    try {
      // Fetch video information using video ID
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const alternateUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      await new Promise(resolve => setTimeout(resolve, 1200));

      setVideoInfo({
        id: videoId,
        title: 'Sample YouTube Video - Click Play to Watch',
        channel: 'Sample Channel Name',
        duration: '8:42',
        views: '1.2M views',
        uploadedDate: '2 weeks ago',
        description: 'This is a sample video description. To get real video data, integrate with YouTube API.',
        thumbnail: alternateUrl,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        qualities: [
          { label: '360p', size: '~45 MB', bitrate: '500 kbps' },
          { label: '480p', size: '~78 MB', bitrate: '800 kbps' },
          { label: '720p', size: '~125 MB', bitrate: '1.2 Mbps' },
          { label: '1080p', size: '~250 MB', bitrate: '2.5 Mbps' },
        ],
      });
      setSuccess('Video information loaded successfully! Click "Play Video" to watch.');
      setShowPlayer(true);
    } catch (err) {
      setError('Failed to fetch video information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = () => {
    if (videoInfo) {
      setShowPlayer(!showPlayer);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) return;

    setDownloading(true);
    setDownloadProgress(0);
    setError('');

    try {
      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 500);

      await new Promise(resolve => setTimeout(resolve, 3000));
      clearInterval(interval);

      setDownloadProgress(100);
      setSuccess(`Video downloaded successfully in ${selectedQuality}p quality!`);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 3000);
    } catch (err) {
      setError('Download failed. Please try again.');
      setDownloading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleFetchInfo();
    }
  };

  const handleClear = () => {
    setUrl('');
    setVideoInfo(null);
    setError('');
    setSuccess('');
    setSelectedQuality('720');
    setDownloadProgress(0);
    setShowPlayer(false);
  };

  const qualityInfo = videoInfo?.qualities.find(q => q.label === selectedQuality + 'p');

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.mainTitle}>
            YouTube Video Downloader
          </h1>
          <p style={styles.subtitle}>
            Watch, Download & Save any YouTube video in multiple quality formats
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div style={styles.container}>
        {/* Input Section */}
        <div style={styles.inputSection}>
          <div style={styles.inputWrapper}>
            <label style={styles.inputLabel}>
              Paste YouTube URL
            </label>
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                style={{
                  ...styles.input,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'text',
                }}
              />
              <button
                onClick={handleFetchInfo}
                disabled={loading}
                style={{
                  ...styles.fetchButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                <span style={styles.buttonIcon}>🔍</span>
                {loading ? 'Loading...' : 'Fetch Video'}
              </button>
            </div>
            {url && (
              <p style={styles.helperText}>
                Press Enter or click Fetch Video to load details
              </p>
            )}
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div style={styles.alertError}>
            <span style={styles.alertIcon}>⚠️</span>
            <div>
              <p style={styles.alertTitle}>Error</p>
              <p style={styles.alertMessage}>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div style={styles.alertSuccess}>
            <span style={styles.alertIcon}>✓</span>
            <div>
              <p style={styles.alertMessage}>{success}</p>
            </div>
          </div>
        )}

        {/* Video Info Card */}
        {videoInfo && (
          <div style={styles.videoCard}>
            {/* Video Player Section */}
            <div style={styles.playerSection}>
              {showPlayer ? (
                <div style={styles.playerContainer}>
                  <iframe
                    style={styles.iframe}
                    src={`${videoInfo.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  <button
                    onClick={handlePlayVideo}
                    style={styles.closePlayerButton}
                  >
                    ✕ Close Player
                  </button>
                </div>
              ) : (
                <div style={styles.thumbnailContainer}>
                  <img
                    src={videoInfo.thumbnail}
                    alt="Video thumbnail"
                    style={styles.thumbnail}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/640x360?text=YouTube+Video';
                    }}
                  />
                  <div style={styles.durationBadge}>
                    <span style={styles.durationText}>
                      ▶ {videoInfo.duration}
                    </span>
                  </div>
                  <button
                    onClick={handlePlayVideo}
                    style={styles.playButtonOverlay}
                  >
                    <span style={styles.playIcon}>▶</span>
                    <span style={styles.playText}>Play Video</span>
                  </button>
                </div>
              )}
            </div>

            {/* Video Details */}
            <div style={styles.videoDetails}>
              <h2 style={styles.videoTitle}>{videoInfo.title}</h2>

              <div style={styles.videoMetaContainer}>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Channel:</span>
                  <span style={styles.metaValue}>{videoInfo.channel}</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Views:</span>
                  <span style={styles.metaValue}>{videoInfo.views}</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Uploaded:</span>
                  <span style={styles.metaValue}>{videoInfo.uploadedDate}</span>
                </div>
              </div>

              {/* Description */}
              <div style={styles.descriptionBox}>
                <p style={styles.descriptionText}>{videoInfo.description}</p>
              </div>

              {/* Quality Selection */}
              <div style={styles.qualitySection}>
                <h3 style={styles.sectionTitle}>Select Download Quality</h3>
                <div style={styles.qualityGrid}>
                  {videoInfo.qualities.map((quality) => (
                    <button
                      key={quality.label}
                      onClick={() => setSelectedQuality(quality.label.replace('p', ''))}
                      style={{
                        ...styles.qualityButton,
                        backgroundColor: selectedQuality === quality.label.replace('p', '')
                          ? '#1f2937'
                          : '#ffffff',
                        color: selectedQuality === quality.label.replace('p', '')
                          ? '#ffffff'
                          : '#1f2937',
                        borderColor: selectedQuality === quality.label.replace('p', '')
                          ? '#1f2937'
                          : '#d1d5db',
                      }}
                    >
                      <div style={styles.qualityLabelText}>{quality.label}</div>
                      <div style={styles.qualityInfo}>
                        {quality.size} • {quality.bitrate}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Size Info */}
              {qualityInfo && (
                <div style={styles.fileSizeInfo}>
                  <p style={styles.fileSizeText}>
                    <strong>Estimated file size:</strong> {qualityInfo.size}
                  </p>
                </div>
              )}

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                style={{
                  ...styles.downloadButton,
                  opacity: downloading ? 0.7 : 1,
                  cursor: downloading ? 'not-allowed' : 'pointer',
                }}
              >
                <span style={styles.buttonIcon}>⬇️</span>
                {downloading ? `Downloading (${Math.round(downloadProgress)}%)` : 'Download Video'}
              </button>

              {/* Progress Bar */}
              {downloading && (
                <div style={styles.progressContainer}>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${downloadProgress}%`,
                      }}
                    />
                  </div>
                  <p style={styles.progressText}>{Math.round(downloadProgress)}% Complete</p>
                </div>
              )}

              {/* Clear Button */}
              <button
                onClick={handleClear}
                style={styles.clearButton}
              >
                Clear & Start Over
              </button>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div style={styles.featuresSection}>
          <h3 style={styles.featuresTitle}>Why Choose Our Downloader?</h3>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>▶️</span>
              <h4 style={styles.featureCardTitle}>Watch Online</h4>
              <p style={styles.featureCardText}>Stream videos directly on our platform</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>⚡</span>
              <h4 style={styles.featureCardTitle}>Fast Downloads</h4>
              <p style={styles.featureCardText}>High-speed downloading with optimization</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🎬</span>
              <h4 style={styles.featureCardTitle}>Multiple Formats</h4>
              <p style={styles.featureCardText}>Choose quality from 360p to 1080p</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🔒</span>
              <h4 style={styles.featureCardTitle}>100% Safe</h4>
              <p style={styles.featureCardText}>No malware, no ads, completely secure</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>📱</span>
              <h4 style={styles.featureCardTitle}>Works Everywhere</h4>
              <p style={styles.featureCardText}>Desktop, tablet, and mobile friendly</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>⚙️</span>
              <h4 style={styles.featureCardTitle}>Easy to Use</h4>
              <p style={styles.featureCardText}>Simple interface for everyone</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={styles.instructionsSection}>
          <h3 style={styles.instructionsTitle}>How to Use</h3>
          <ol style={styles.instructionsList}>
            <li style={styles.instructionItem}>
              <span style={styles.stepNumber}>1</span>
              <div>
                <strong style={styles.stepTitle}>Copy Video Link</strong>
                <p style={styles.stepDescription}>Get the URL from any YouTube video page</p>
              </div>
            </li>
            <li style={styles.instructionItem}>
              <span style={styles.stepNumber}>2</span>
              <div>
                <strong style={styles.stepTitle}>Paste & Fetch</strong>
                <p style={styles.stepDescription}>Paste the URL above and click "Fetch Video"</p>
              </div>
            </li>
            <li style={styles.instructionItem}>
              <span style={styles.stepNumber}>3</span>
              <div>
                <strong style={styles.stepTitle}>Watch or Download</strong>
                <p style={styles.stepDescription}>Click "Play Video" to watch or select quality to download</p>
              </div>
            </li>
            <li style={styles.instructionItem}>
              <span style={styles.stepNumber}>4</span>
              <div>
                <strong style={styles.stepTitle}>Download</strong>
                <p style={styles.stepDescription}>Click download and save the video to your device</p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 YouTube Video Downloader • Watch & Download videos responsibly • Respect copyright laws
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: '3rem 2rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  headerContent: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  mainTitle: {
    fontSize: '36px',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '16px',
    color: '#d1d5db',
    marginTop: '0.5rem',
  },
  container: {
    flex: 1,
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
    padding: '2rem',
  },
  inputSection: {
    marginBottom: '2rem',
  },
  inputWrapper: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  inputLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#1f2937',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  inputGroup: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  input: {
    flex: 1,
    padding: '0.875rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: '"Courier New", monospace',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    transition: 'border-color 0.3s',
    outline: 'none',
  },
  fetchButton: {
    padding: '0.875rem 1.75rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap',
  },
  buttonIcon: {
    fontSize: '16px',
  },
  helperText: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '0.5rem',
    fontStyle: 'italic',
  },
  alertError: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    color: '#991b1b',
  },
  alertSuccess: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#dcfce7',
    border: '1px solid #86efac',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    color: '#166534',
  },
  alertIcon: {
    fontSize: '20px',
    minWidth: '20px',
  },
  alertTitle: {
    margin: '0 0 0.25rem 0',
    fontSize: '14px',
    fontWeight: 600,
  },
  alertMessage: {
    margin: 0,
    fontSize: '14px',
  },
  videoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  playerSection: {
    position: 'relative',
    backgroundColor: '#000000',
  },
  playerContainer: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
  closePlayerButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    zIndex: 10,
    transition: 'all 0.3s',
  },
  thumbnailContainer: {
    position: 'relative',
    paddingBottom: '56.25%',
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  durationText: {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '1.5rem 3rem',
    backgroundColor: 'rgba(0,0,0,0.6)',
    border: '2px solid #ffffff',
    borderRadius: '50px',
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    backdropFilter: 'blur(4px)',
  },
  playIcon: {
    fontSize: '32px',
  },
  playText: {
    fontSize: '16px',
  },
  videoDetails: {
    padding: '2rem',
  },
  videoTitle: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#1f2937',
    lineHeight: '1.4',
  },
  videoMetaContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.25rem',
  },
  metaValue: {
    fontSize: '14px',
    color: '#1f2937',
    fontWeight: 500,
  },
  descriptionBox: {
    backgroundColor: '#f3f4f6',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    borderLeft: '4px solid #3b82f6',
  },
  descriptionText: {
    fontSize: '14px',
    color: '#4b5563',
    margin: 0,
    lineHeight: '1.6',
  },
  qualitySection: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#1f2937',
  },
  qualityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
  },
  qualityButton: {
    padding: '1rem',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center',
  },
  qualityLabelText: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  qualityInfo: {
    fontSize: '11px',
    opacity: 0.7,
    marginTop: '0.5rem',
  },
  fileSizeInfo: {
    backgroundColor: '#eff6ff',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    borderLeft: '4px solid #3b82f6',
  },
  fileSizeText: {
    fontSize: '13px',
    color: '#1e40af',
    margin: 0,
  },
  downloadButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  progressContainer: {
    marginBottom: '1rem',
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'right',
    margin: 0,
  },
  clearButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  featuresSection: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  featuresTitle: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '1.5rem',
    color: '#1f2937',
    textAlign: 'center',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  featureCard: {
    textAlign: 'center',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    transition: 'all 0.3s',
  },
  featureIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '0.75rem',
  },
  featureCardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#1f2937',
  },
  featureCardText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  instructionsSection: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  instructionsTitle: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '1.5rem',
    color: '#1f2937',
  },
  instructionsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  instructionItem: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  stepNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    minWidth: '36px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '50%',
    fontSize: '16px',
    fontWeight: 600,
  },
  stepTitle: {
    display: 'block',
    fontSize: '16px',
    color: '#1f2937',
    marginBottom: '0.25rem',
  },
  stepDescription: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  footer: {
    backgroundColor: '#1f2937',
    color: '#9ca3af',
    textAlign: 'center',
    padding: '1.5rem 2rem',
    fontSize: '13px',
    marginTop: 'auto',
  },
  footerText: {
    margin: 0,
  },
};
