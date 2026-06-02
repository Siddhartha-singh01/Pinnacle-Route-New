import ffmpegPath from 'ffmpeg-static';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';

const srcDir = 'H:\\Pinnacle-Route-New\\Website Videos\\Website Videos';
const destDir = 'H:\\Pinnacle-Route-New\\public\\assets\\videos';

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const videos = [
  {
    src: '5527786-uhd_3840_2160_25fps.mp4',
    dest: 'tech.mp4',
    scale: '1280:-2', // downscale to 720p width
  },
  {
    src: '6558513-uhd_3840_2160_25fps.mp4',
    dest: 'design.mp4',
    scale: '1280:-2', // downscale to 720p width
  },
  {
    src: '7308089-hd_1920_1080_24fps.mp4',
    dest: 'strategy.mp4',
    scale: '1280:-2', // downscale to 720p width
  },
  {
    src: '7308102-hd_1920_1080_24fps.mp4',
    dest: 'growth.mp4',
    scale: '1280:-2', // downscale to 720p width
  },
  {
    src: '6558143-uhd_2160_3840_25fps.mp4',
    dest: 'team-portrait.mp4',
    scale: '-2:960', // downscale vertical to 960p height
  },
  {
    src: '8034517-uhd_2160_3840_25fps.mp4',
    dest: 'about-hero.mp4',
    scale: '1280:-2', // this one is vertical in the files, let's verify orientation
  }
];

function compressVideo(video) {
  return new Promise((resolve, reject) => {
    const srcPath = path.join(srcDir, video.src);
    const destPath = path.join(destDir, video.dest);

    console.log(`Starting compression: ${video.src} -> ${video.dest}`);

    // ffmpeg arguments
    const args = [
      '-y',                     // overwrite output files
      '-i', srcPath,            // input file
      '-an',                    // disable audio
      '-c:v', 'libx264',        // H.264 video codec
      '-profile:v', 'main',     // main profile for broad compatibility
      '-level:v', '4.0',
      '-crf', '26',             // Constant Rate Factor (26 is a good sweet spot for web)
      '-preset', 'fast',        // fast encoding preset
      '-vf', `scale=${video.scale}`, // downscaling
      '-pix_fmt', 'yuv420p',    // pixel format for compatibility
      '-movflags', '+faststart', // move index to front of file for web streaming
      destPath
    ];

    const child = execFile(ffmpegPath, args, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error compressing ${video.src}:`, error);
        reject(error);
      } else {
        const srcSize = (fs.statSync(srcPath).size / (1024 * 1024)).toFixed(2);
        const destSize = (fs.statSync(destPath).size / (1024 * 1024)).toFixed(2);
        console.log(`Successfully completed: ${video.dest} (${srcSize}MB -> ${destSize}MB)`);
        resolve();
      }
    });
  });
}

async function run() {
  console.log('Using ffmpeg binary at:', ffmpegPath);
  for (const video of videos) {
    try {
      await compressVideo(video);
    } catch (e) {
      console.error('Failed to process video:', video.src);
    }
  }
  console.log('All videos processed!');
}

run();
