/**
 * Patches failed uploads from the initial seed.
 * Run: node scripts/seed-patch.mjs
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dhatd78ou",
  api_key: "827683151623318",
  api_secret: "t-qoIzBX32bU_wHSj65FH2ddPOk",
  secure: true,
});

const FOLDER = "elijah-gallery";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=85&fm=jpg&fit=crop`;

const patches = [
  // Architecture — 1 missing
  { album: "architecture", url: unsplash("1553877522-43269d4ea984") }, // Paris Eiffel detail
  // Street — 2 missing
  { album: "street", url: unsplash("1555689502-c4b22d76d56b") },      // Hong Kong neon
  { album: "street", url: unsplash("1514565131-fce0801e6173") },       // Paris cafe sidewalk
  // Nature — 4 missing
  { album: "nature", url: unsplash("1511497584788-876760111969") },    // cherry blossom close
  { album: "nature", url: unsplash("1542601906990-b4d3fb778b09") },    // tropical jungle
  { album: "nature", url: unsplash("1559827260-dc66d52bef19") },       // sunflower field
  { album: "nature", url: unsplash("1513002749994-4de6c4c0f3f8") },   // autumn forest lane
];

async function main() {
  console.log("🩹  Patching failed uploads...\n");
  for (const { album, url } of patches) {
    try {
      await cloudinary.uploader.upload(url, {
        folder: `${FOLDER}/${album}`,
        unique_filename: true,
        overwrite: false,
        resource_type: "image",
      });
      console.log(`  ✓ ${album} — uploaded`);
    } catch (err) {
      console.log(`  ✗ ${album} — ${err.message}`);
    }
    await sleep(400);
  }
  console.log("\n✅  Patch complete.");
}

main().catch(console.error);
