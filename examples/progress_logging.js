const Versalog = require("versalog");

const log = new Versalog("detailed", false, true, "BATCH");

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processLine(lineNumber: number) {
  await sleep(100);

  if (Math.random() < 0.05) {
    log.warning(`Line ${lineNumber} took longer than expected`);
  }
}

async function processFile(fileIndex: number, totalFiles: number) {
  log.step(`Processing file_${fileIndex}.txt`, fileIndex, totalFiles);

  await log.timer(`file_${fileIndex}.txt`, async () => {
    const totalLines = 20;

    for (let i = 1; i <= totalLines; i++) {
      await processLine(i);

      log.progress(
        `file_${fileIndex}.txt`,
        i,
        totalLines
      );
    }
  });
}

async function main() {
  const totalFiles = 5;

  log.info("Batch Start");

  await log.timer("Total Batch", async () => {
    for (let i = 1; i <= totalFiles; i++) {
      await processFile(i, totalFiles);

      log.progress(
        "Overall Progress",
        i,
        totalFiles
      );
    }
  });

  log.info("Batch Finished");
}

main().catch(err => {
  log.critical(String(err));
});
