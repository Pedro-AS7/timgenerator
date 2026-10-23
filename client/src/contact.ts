const reportForm = document.getElementById(
	"errorReportForm"
) as HTMLFormElement;
const errorTitle = document.getElementById("errorTitle") as HTMLInputElement;
const errorDescription = document.getElementById(
	"errorDescription"
) as HTMLTextAreaElement;
const successMessage = document.getElementById(
	"successMessage"
) as HTMLDivElement;

// The site is static (GitHub Pages), so reports become GitHub issues
const ISSUES_URL = "https://github.com/Pedro-AS7/timgenerator/issues/new";

function submitError() {
	const params = new URLSearchParams({
		title: errorTitle.value,
		body: errorDescription.value,
	});
	window.open(`${ISSUES_URL}?${params}`, "_blank", "noopener");

	errorTitle.value = "";
	errorDescription.value = "";

	// Show success message
	successMessage.style.display = "block";

	// Hide success message after 5 seconds
	setTimeout(() => {
		successMessage.style.display = "none";
	}, 5000);
}

reportForm.addEventListener("submit", function (event) {
	event.preventDefault(); // Impede o recarregamento da página
	submitError();
});
