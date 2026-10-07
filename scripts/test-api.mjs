const BASE = "http://localhost:3000/api/notes";

// Helper: builds the options for a request that sends JSON
const json = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// Helper: makes a request and prints the status code and response
async function call(label, url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  console.log(`\n=== ${label} ===`);
  console.log("Status:", res.status);
  console.log(JSON.stringify(data, null, 2));
  return data;
}

async function main() {
  await call("1. List notes", BASE);

  const note = await call(
    "2. Create a note",
    BASE,
    json("POST", {
      title: "First note",
      content: "Hello from the API",
      tags: ["Work", "ideas"],
    }),
  );

  if (!note.id) {
    console.log(
      "\nCreate failed, so I'm stopping here. Check the output above.",
    );
    return;
  }

  const url = `${BASE}/${note.id}`;

  await call("3a. Get the note", url);
  await call(
    "3b. Update the note",
    url,
    json("PATCH", { title: "Renamed note", tags: ["personal"] }),
  );
  await call("3c. Delete the note", url, { method: "DELETE" });
  await call("3d. Get it again (should be 404)", url);

  await call(
    "4. Validation (should be 400)",
    BASE,
    json("POST", { title: "", content: "x" }),
  );

  console.log("\nDone! Compare the status codes with the table below.");
}

main().catch((err) => {
  console.error("\nCould not reach the server. Is `npm run dev` running?");
  console.error(err.message);
});
