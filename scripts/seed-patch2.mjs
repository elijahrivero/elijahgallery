import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "dhatd78ou",
  api_key: "827683151623318",
  api_secret: "t-qoIzBX32bU_wHSj65FH2ddPOk",
  secure: true,
});
const FOLDER = "elijah-gallery";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?w=1200&q=85&fm=jpg&fit=crop`;

const patches = [
  { album: "street", url: unsplash("1499336315816-097655dcfbda") },  // woman city walk
  { album: "street", url: unsplash("1479030160180-6b5f6b47e6dc") },  // foggy city street
  { album: "nature", url: unsplash("1448375240586-882707db888b") },   // misty forest
];

async function main() {
  console.log("🩹  Patch 2...\n");
  for (const { album, url } of patches) {
    try {
      await cloudinary.uploader.upload(url, {
        folder: `${FOLDER}/${album}`,
        unique_filename: true,
        resource_type: "image",
      });
      console.log(`  ✓ ${album}`);
    } catch (err) {
      console.log(`  ✗ ${album}: ${err.message}`);
    }
    await sleep(400);
  }
  console.log("\n✅  Done.");
}
main().catch(console.error);
