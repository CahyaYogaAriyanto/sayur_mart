# 📁 Assets Folder

## 🎥 Video Files

Place your video files here for the About page.

### Required Files:

1. **petani-video.mp4** (Wajib)
   - Format: MP4 (H.264 codec)
   - Resolution: 1080p recommended
   - Aspect Ratio: 1:1 (square) or 16:9
   - File Size: < 10MB
   - Duration: 10-30 seconds

2. **petani-video.webm** (Opsional)
   - Format: WebM (VP9 codec)
   - For better browser support
   - Same specs as MP4

### Example Structure:

```
public/assets/
├── petani-video.mp4    ← Your video here
├── petani-video.webm   ← Optional
└── README.md           ← This file
```

## 🚀 Quick Start

1. Copy your video file to this folder
2. Rename it to `petani-video.mp4`
3. Restart the dev server: `npm run dev`
4. Open: http://localhost:3000/about
5. Video will autoplay in the Mission section!

## 📐 Video Specifications

- **Format**: MP4 (H.264) or WebM (VP9)
- **Resolution**: 720p - 1080p
- **Aspect Ratio**: 1:1 (square) preferred
- **File Size**: < 10MB (compress if needed)
- **Duration**: 10-30 seconds
- **Frame Rate**: 24fps or 30fps

## 🛠️ Compress Video

If your video is too large:

### Using HandBrake (Free):
1. Download: https://handbrake.fr/
2. Preset: "Web" → "Gmail Large 3 Minutes 720p30"
3. Quality: RF 23-25
4. Start Encode

### Using FFmpeg:
```bash
ffmpeg -i input.mp4 -vcodec h264 -b:v 2M petani-video.mp4
```

### Online Tools:
- https://www.freeconvert.com/video-compressor
- https://www.videosmaller.com/

## 🎨 Video Features

The video will have these features:
- ✅ Auto play on page load
- ✅ Loop continuously
- ✅ Muted (no sound)
- ✅ Plays inline on mobile
- ✅ Rounded corners (48px)
- ✅ Shadow effect
- ✅ Responsive

## 🔧 Troubleshooting

### Video not showing?
1. Check file name: `petani-video.mp4` (exact)
2. Check location: `public/assets/` folder
3. Restart server: `npm run dev`
4. Clear browser cache: Ctrl+Shift+R

### Video not playing?
1. Check browser console for errors
2. Ensure video is muted (required for autoplay)
3. Try different browser
4. Check video format (MP4 H.264)

## 📝 Need Help?

Read the full guide: `CARA_TAMBAH_VIDEO.md` in the root folder.

---

**Note**: If no video file is present, a fallback image from Unsplash will be displayed.
