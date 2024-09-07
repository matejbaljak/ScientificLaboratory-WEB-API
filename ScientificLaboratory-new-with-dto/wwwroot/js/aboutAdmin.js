document.addEventListener('DOMContentLoaded', function () {
    const isAdmin = localStorage.getItem('role') === 'Admin'; // Check if the user is an admin
    const jwtToken = localStorage.getItem('token'); // Ensure there's a valid JWT token for user

    // Elements
    const editIntroButton = document.getElementById('editIntroButton');
    const editHistoryButton = document.getElementById('editHistoryButton');
    const editTeamButton = document.getElementById('editTeamButton');
    const editCollaborationsButton = document.getElementById('editCollaborationsButton');
    const editValuesButton = document.getElementById('editValuesButton');
    const editFacilitiesButton = document.getElementById('editFacilitiesButton');

    const introText = document.getElementById('introText');
    const historyText = document.getElementById('historyText');
    const teamText = document.getElementById('teamText');
    const collaborationsText = document.getElementById('collaborationsText');
    const valuesText = document.getElementById('valuesText');
    const facilitiesText = document.getElementById('facilitiesText');

    // Modal elements
    const editModal = document.getElementById('editModal');
    const editArea = document.getElementById('editArea');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');

    let currentSection = '';
    let currentTextElement = null;

    // Retrieve any locally stored content and display it
    function loadStoredContent() {
        introText.textContent = localStorage.getItem('introText') || introText.textContent;
        historyText.textContent = localStorage.getItem('historyText') || historyText.textContent;
        teamText.textContent = localStorage.getItem('teamText') || teamText.textContent;
        collaborationsText.textContent = localStorage.getItem('collaborationsText') || collaborationsText.textContent;
        valuesText.textContent = localStorage.getItem('valuesText') || valuesText.textContent;
        facilitiesText.textContent = localStorage.getItem('facilitiesText') || facilitiesText.textContent;
    }

    loadStoredContent(); // Load content from localStorage when the page loads

    // Show admin buttons if the user is an admin
    if (isAdmin && jwtToken) {
        editIntroButton.style.display = 'inline';
        editHistoryButton.style.display = 'inline';
        editTeamButton.style.display = 'inline';
        editCollaborationsButton.style.display = 'inline';
        editValuesButton.style.display = 'inline';
        editFacilitiesButton.style.display = 'inline';
    }

    // Function to open the modal for editing content
    function openEditModal(section, textElement) {
        currentSection = section;
        currentTextElement = textElement;
        editArea.value = textElement.textContent; // Pre-fill the textarea with current content
        editModal.style.display = 'flex'; // Show the modal
    }

    // Attach event listeners to the edit buttons for each section
    editIntroButton.addEventListener('click', function () {
        openEditModal('intro', introText);
    });

    editHistoryButton.addEventListener('click', function () {
        openEditModal('history', historyText);
    });

    editTeamButton.addEventListener('click', function () {
        openEditModal('team', teamText);
    });

    editCollaborationsButton.addEventListener('click', function () {
        openEditModal('collaborations', collaborationsText);
    });

    editValuesButton.addEventListener('click', function () {
        openEditModal('values', valuesText);
    });

    editFacilitiesButton.addEventListener('click', function () {
        openEditModal('facilities', facilitiesText);
    });

    // Save button functionality
    saveButton.addEventListener('click', function () {
        const newText = editArea.value;
        if (newText) {
            currentTextElement.textContent = newText;
            localStorage.setItem(`${currentSection}Text`, newText); // Save the new content in localStorage
            alert(`${currentSection} updated successfully.`);
            editModal.style.display = 'none'; // Close the modal
        }
    });

    // Cancel button functionality
    cancelButton.addEventListener('click', function () {
        editModal.style.display = 'none'; // Close the modal without saving
    });

    // Close modal on outside click
    window.addEventListener('click', function (e) {
        if (e.target == editModal) {
            editModal.style.display = 'none';
        }
    });
});
