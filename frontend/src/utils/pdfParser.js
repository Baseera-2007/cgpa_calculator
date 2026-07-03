export function parseResultPDF(file) {
  console.log("Selected PDF:", file);

  return {
    success: true,
    fileName: file.name,
  };
}