import BadRequest from "./BadRequest";

// Utility function to handle Google Sheets data errors
export function handleGoogleSheetError(status, message) {
  switch (status) {
    case 400:
      return (
        <BadRequest
          message={message || "Error fetching data. Try again later."}
        />
      );
    case 403:
      return (
        <BadRequest message="You do not have permission to access the requested sheet." />
      );
    case 404:
      return <BadRequest message="The requested sheet was not found." />;
    case 503:
      return (
        <BadRequest message="Google Sheets API is currently unreachable. Please check your connection and try again later." />
      );
    case 500:
      return (
        <BadRequest message="An internal error occurred. Please try again later." />
      );
    default:
      return null;
  }
}
