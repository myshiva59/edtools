/// <reference types="aws-sdk" />
import AWS from "aws-sdk";
export const uploadToS3 = (
  data: string | Blob,
  contentType: string,
  fileName: string,
) => {
  AWS.config.update({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.REACT_APP_EDTOOLS_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env
        .REACT_APP_EDTOOLS_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const s3Bucket = new AWS.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: "excalifcbuck" },
  });
  let buf;
  let contentEncoding;
  if (typeof data === "string") {
    buf = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ""), "base64");
    contentEncoding = "base64";
  } else {
    buf = data;
    contentEncoding = "blob";
  }
  const params = {
    Key: `${fileName}`,
    Body: buf,
    ContentEncoding: contentEncoding,
    ContentType: contentType,
    Bucket: "excalifcbuck",
    ACL: "public-read",
  };
  const progress = document.getElementById("progress_inner")!;
  const actionText = document.getElementById("action_text")!;
  progress.style.display = "block";
  actionText.style.display = "block";
  const upload = s3Bucket
    .putObject(params)
    .on("httpUploadProgress", (eve) => {
      const percentage = (eve.loaded / eve.total) * 100;
      progress.style.width = `${percentage}%`;
      console.log();
    })
    .send((err, data) => {
      if (data) {
        progress.style.display = "none";
        const url = encodeURIComponent(
          `https://excalifcbuck.s3.ap-south-1.amazonaws.com/${fileName}`,
        );
        const link = `http://localhost:3000/create-excali-fc/${url}`;
        actionText.setAttribute("href", link);
        actionText.innerHTML = "Create Flash Card";
        window.localStorage.setItem("link", link);
        // alert("Successfully uploaded photo.");
      } else {
        console.log(err);
        alert(err.message);
      }
    });
};
