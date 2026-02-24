/**
 * Gallery seeder — uploads curated Unsplash photos to Cloudinary.
 * Run: node scripts/seed-gallery.mjs
 */

import { v2 as cloudinary } from "cloudinary";

// ── Config ──────────────────────────────────────────────────
cloudinary.config({
  cloud_name: "dhatd78ou",
  api_key: "827683151623318",
  api_secret: "t-qoIzBX32bU_wHSj65FH2ddPOk",
  secure: true,
});

const FOLDER = "elijah-gallery";

// ── Curated Unsplash images (photo ID → download URL) ──────
// Using the CDN format: images.unsplash.com/photo-{id}?w=1200&q=85
const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=85&fm=jpg&fit=crop`;

const albums = [
  {
    id: "portraits",
    name: "Portraits",
    images: [
      unsplash("1506794778202-cad84cf45f1d"),  // moody male, dark bg
      unsplash("1531746020798-e6953c6e8e04"),  // woman editorial
      unsplash("1544005313-94ddf0286df2"),     // woman natural light
      unsplash("1552058544-f2b08422138a"),     // close-up
      unsplash("1500648767791-00dcc994a43e"), // man bokeh
      unsplash("1438761681033-6461ffad8d80"), // woman smiling
      unsplash("1521119989659-a83eee488004"), // dramatic fashion
      unsplash("1547425260-76bcadfb4f2c"),    // man looking away
    ],
  },
  {
    id: "landscapes",
    name: "Landscapes",
    images: [
      unsplash("1506905925346-21bda4d32df4"), // Alps lake
      unsplash("1469474968028-56623f02e42e"), // misty mountains
      unsplash("1476514525535-07fb3b4ae5f1"), // lake reflection
      unsplash("1433086966358-54859d0ed716"), // waterfall
      unsplash("1501854140801-50d01698950b"), // aerial forest
      unsplash("1518020382113-a7e8fc38eac9"), // snowy peak
      unsplash("1441974231531-c6227db76b6e"), // redwood forest
      unsplash("1500534314209-a25ddb2bd429"), // forest path
      unsplash("1504701954957-2010ec3bcec1"), // rolling hills
    ],
  },
  {
    id: "architecture",
    name: "Architecture",
    images: [
      unsplash("1486325212027-8081e485255e"), // modern glass facade
      unsplash("1480714378408-67cf0d13bc1b"), // NYC skyline night
      unsplash("1494522855154-9297ac14b55f"), // bridge golden gate
      unsplash("1524230572899-a752b3835840"), // brutalist staircase
      unsplash("1512917774080-9991f1c4c750"), // aerial city
      unsplash("1555041469-a586c61ea9bc"),    // minimalist interior
      unsplash("1467269204519-45d6c4e4f92b"), // cathedral interior
      unsplash("1476362555312-ab9e108a0b7e"), // neon city alley
    ],
  },
  {
    id: "street",
    name: "Street",
    images: [
      unsplash("1477959858617-67f85cf4f1df"), // Tokyo street night
      unsplash("1519501025264-65ba15a82390"), // rainy umbrella street
      unsplash("1465447142348-e9952c393450"), // crosswalk NYC
      unsplash("1529156069898-49953e39b3ac"), // woman walking
      unsplash("1475669913379-b0bb85d34c2a"), // market crowd
      unsplash("1444723121867-7a241d668f6a"), // alley skateboard
      unsplash("1526746323784-6bc814d79273"), // coffee shop window
      unsplash("1558618666-fcd25c85cd64"), // couple walking night
    ],
  },
  {
    id: "nature",
    name: "Nature",
    images: [
      unsplash("1470252649378-9c29740c9fa8"), // sunrise over ocean
      unsplash("1509316785289-025f5b846b35"), // cherry blossoms
      unsplash("1418065460487-3e41a6d18738"), // macro flower
      unsplash("1500534314209-a25ddb2bd429"), // forest floor
      unsplash("1507003211169-0a1dd7228f2d"), // desert dunes
      unsplash("1472214103451-9374f2aa4f06"), // crashing waves
      unsplash("1485470733090-0dc2ad9f1cd7"), // autumn leaves
      unsplash("1490750967868-88df5691cc0b"), // wildflower field
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureFolder(folderPath) {
  // Upload a 1×1 transparent placeholder to create the folder
  const placeholder =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  const albumId = folderPath.split("/").pop();
  await cloudinary.uploader.upload(placeholder, {
    folder: folderPath,
    public_id: `${albumId}-placeholder`,
    overwrite: true,
    resource_type: "image",
    tags: ["placeholder"],
  });
}

async function uploadImage(url, folder, index) {
  const result = await cloudinary.uploader.upload(url, {
    folder,
    use_filename: false,
    unique_filename: true,
    overwrite: false,
    resource_type: "image",
  });
  return result.secure_url;
}

// ── Main ────────────────────────────────────────────────────
async function seed() {
  console.log("🌱  Starting gallery seed...\n");

  for (const album of albums) {
    const folderPath = `${FOLDER}/${album.id}`;
    console.log(`📁  Album: ${album.name} (${album.id})`);

    // Create folder
    try {
      await ensureFolder(folderPath);
      console.log(`    ✓ Folder created`);
    } catch (err) {
      console.log(`    ✗ Folder error: ${err.message}`);
    }

    // Upload images
    for (let i = 0; i < album.images.length; i++) {
      const url = album.images[i];
      try {
        const result = await uploadImage(url, folderPath, i);
        console.log(`    ✓ [${i + 1}/${album.images.length}] uploaded`);
      } catch (err) {
        console.log(`    ✗ [${i + 1}/${album.images.length}] failed: ${err.message}`);
      }
      // Rate limit guard
      await sleep(400);
    }

    console.log(`    ✅  Done\n`);
  }

  console.log("🎉  Seed complete!");
}

seed().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
