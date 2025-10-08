const reportForm = document.getElementById(
	"errorReportForm"
) as HTMLFormElement;
const errorTitle = document.getElementById("errorTitle") as HTMLInputElement;
const errorDescription = document.getElementById(
	"errorDescription"
) as HTMLTextAreaElement;
const userEmail = document.getElementById("userEmail") as HTMLInputElement;
const successMessage = document.getElementById(
	"successMessage"
) as HTMLDivElement;

interface ErrorReport {
	title: string;
	description: string;
	email: string;
}

function submitError() {
	const title = errorTitle.value;
	console.log("lfjkdnsadkjcnd");
	const description = errorDescription.value;
	const email = userEmail.value;

	const errorReport: ErrorReport = {
		title,
		description,
		email,
	};
	console.log(errorReport);
	fetch("/api/report", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(errorReport),
	});

	errorTitle.value = "";
	errorDescription.value = "";
	userEmail.value = "";

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
	console.log("Formulário enviado!");
});
