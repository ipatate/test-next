import axios from "axios";

export default async (req, res) => {
  //   res.setPreviewData({});
  //   res.end("Preview mode enabled");
  // (1)
  // Check for the right query params
  if (
    (!req.query["x-craft-live-preview"] && !req.query["x-craft-preview"]) ||
    !req.query.entryUid
  ) {
    return res
      .status(401)
      .json({ message: "Not allowed to access this route" });
  }

  // (2)
  // Get the url from Craft for the specific entry
  const { data } = await axios.post(process.env.API_URL, {
    query: `
      {
        entry(uid: "${req.query.entryUid}", status: ["live", "disabled"]) {
          uri
        }
      }
    `,
  });

  if (!data?.data?.entry?.uri) {
    return res.status(404).json({
      message: `URL of the entry "${req.query.entryUid}" could not be fetched`,
    });
  }

  // (3)
  // Set the token as preview data
  res.setPreviewData({
    previewToken: req.query.token ?? null,
  });

  // (4)
  //   const parsedUrl = new URL(`http://localhost:3000/${data.data.entry.uri}`);
  //   console.log(parsedUrl.pathname);
  // Redirect to the path from the fetched url
  //   res.writeHead(307, { Location: parsedUrl.pathname });
  console.log(`redirect to /${data.data.entry.uri}`);
  res.redirect(`/${data.data.entry.uri}`);
};
