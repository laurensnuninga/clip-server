import express from "express";
import { exec } from "child_process";

const app = express();
app.use(express.json());

app.post("/process", (req, res) => {
  const { video_url, clips } = req.body;

  console.log("Downloading video...");

  exec(`yt-dlp "${video_url}" -o video.mp4`, () => {
    console.log("Cutting clips...");

    clips.forEach((clip, i) => {
      exec(
        `ffmpeg -i video.mp4 -ss ${clip.start} -to ${clip.end} -vf "crop=ih*9/16:ih" clip_${i}.mp4`
      );
    });
  });

  res.json({ status: "processing" });
});

app.listen(3000, () => console.log("Server running"));
