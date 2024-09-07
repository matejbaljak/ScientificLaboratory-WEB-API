document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/api/members';
    const role = localStorage.getItem('role');

    // Create and configure the Create Member button
    const createMemberButton = document.getElementById('createMemberButton');
    const createFormContainer = document.getElementById('createFormContainer');
    const createMemberForm = document.getElementById('createMemberForm');
    const createMemberNameInput = document.getElementById('createMemberName');
    const createMemberPositionSelect = document.getElementById('createMemberPosition');
    const cancelCreateButton = document.getElementById('cancelCreate');

    let deleteInProgress = false; // Flag to indicate if a delete operation is in progress

    if (role === 'Admin') {
        createMemberButton.style.display = 'block';
    }

    // Populate positions dropdown
    const validPositions = ['LaboratoryManager', 'Researcher', 'ExternalAssociate'];
    createMemberPositionSelect.innerHTML = validPositions.map(position => `<option value="${position}">${position}</option>`).join('');

    // Show the Create Member form when button is clicked
    createMemberButton.addEventListener('click', function () {
        createFormContainer.style.display = 'block';
    });

    // Hide the Create Member form when cancel is clicked
    cancelCreateButton.addEventListener('click', function () {
        createFormContainer.style.display = 'none';
    });

    // Handle form submission for creating a new member
    createMemberForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const newMember = {
            name: createMemberNameInput.value.trim(),
            position: createMemberPositionSelect.value
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newMember)
        })
            .then(response => {
                if (response.status === 201) {
                    alert('Member created successfully.');
                    fetchMembers(); // Refresh the list after creation
                    createFormContainer.style.display = 'none'; // Hide the form
                } else {
                    return response.text().then(text => {
                        console.error('Create member error:', text);
                        alert(`Failed to create the member: ${text}`);
                    });
                }
            })
            .catch(error => {
                console.error('Create member error:', error);
                alert(`Error: ${error.message}`);
            });
    });

    // Fetch and display all members
    fetchMembers();

    function fetchMembers() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const members = data.$values || data;

                const positions = {
                    LaboratoryManager: [],
                    Researcher: [],
                    ExternalAssociate: []
                };

                members.forEach(member => {
                    const position = member.position;
                    if (positions.hasOwnProperty(position)) {
                        positions[position].push({ id: member.id, name: member.name });
                    } else {
                        console.warn(`Unknown position detected: ${position}`);
                    }
                });

                populateMembers('laboratory-managers', positions.LaboratoryManager);
                populateMembers('researchers', positions.Researcher);
                populateMembers('external-associates', positions.ExternalAssociate);

                // Attach event listeners for Update and Delete buttons (only for admins)
                if (role === 'Admin') {
                    attachEventListeners();
                }
            })
            .catch(error => {
                console.error('Fetch members error:', error);
            });
    }

    function populateMembers(sectionId, membersArray) {
        const section = document.getElementById(sectionId);
        const ul = section.querySelector('.members-list');

        ul.innerHTML = ''; // Clear existing members

        if (membersArray.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No members found.';
            ul.appendChild(li);
        } else {
            membersArray.forEach(member => {
                const li = document.createElement('li');
                li.innerHTML = `<p>${member.name}</p>`;

                if (role === 'Admin') {
                    const buttonGroup = document.createElement('div');
                    buttonGroup.className = 'button-group';

                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.className = 'updateButton';
                    updateButton.setAttribute('data-member-id', member.id);
                    updateButton.setAttribute('data-member-name', member.name);
                    updateButton.setAttribute('data-member-position', sectionId.replace('-', ''));
                    buttonGroup.appendChild(updateButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'deleteButton';
                    deleteButton.setAttribute('data-member-id', member.id);
                    buttonGroup.appendChild(deleteButton);

                    li.appendChild(buttonGroup);
                }

                ul.appendChild(li);
            });
        }
    }

    // Attach event listeners for the update and delete buttons
    function attachEventListeners() {
        const membersContainer = document.querySelector('.members-container');

        membersContainer.addEventListener('click', handleMemberActions);

        function handleMemberActions(event) {
            if (event.target.classList.contains('updateButton')) {
                const memberId = event.target.getAttribute('data-member-id');
                const memberName = event.target.getAttribute('data-member-name');
                const memberPosition = event.target.getAttribute('data-member-position');

                console.log('Updating member (using id):', memberId, memberName, memberPosition);

                const updateMemberIdInput = document.getElementById('updateMemberId');
                const updateMemberNameInput = document.getElementById('updateMemberName');
                const updateMemberPositionSelect = document.getElementById('updateMemberPosition');

                if (updateMemberIdInput && updateMemberNameInput && updateMemberPositionSelect) {
                    updateMemberIdInput.value = memberId;
                    updateMemberNameInput.value = memberName;

                    // Populate the update position select with the same options
                    updateMemberPositionSelect.innerHTML = validPositions.map(position => `<option value="${position}">${position}</option>`).join('');
                    updateMemberPositionSelect.value = memberPosition;

                    document.getElementById('updateFormContainer').style.display = 'block';
                } else {
                    console.error('Update form elements are not found in the DOM.');
                }
            }

            if (event.target.classList.contains('deleteButton')) {
                const deleteButton = event.target;
                const memberId = deleteButton.getAttribute('data-member-id');
                console.log('DELETE (using id):', memberId);

                if (deleteInProgress) {
                    console.log('Delete already in progress. Ignoring further clicks.');
                    return; // If a delete is in progress, ignore further clicks
                }

                // Set the flag to indicate delete is in progress
                deleteInProgress = true;

                if (confirm('Are you sure you want to delete this member?')) {
                    // Disable the button to prevent multiple clicks
                    deleteButton.disabled = true;

                    fetch(`${apiUrl}/${memberId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then(response => {
                            if (response.status === 204) {
                                setTimeout(() => {
                                    alert('Member deleted successfully.');
                                    fetchMembers(); // Refresh the list after deletion
                                }, 500);
                            } else if (response.status === 404) {
                                alert('Member not found. Check if the URL is correct.');
                            } else {
                                alert('Failed to delete the member.');
                            }
                        })
                        .catch(error => {
                            console.error('Delete member error:', error);
                            alert(`Error: ${error.message}`);
                        })
                        .finally(() => {
                            // Re-enable the button and reset the flag after the request is completed
                            deleteButton.disabled = false;
                            deleteInProgress = false;
                        });
                } else {
                    // Reset the flag if the user cancels the delete
                    deleteInProgress = false;
                }
            }
        }
    }

    // Handle form submission for updating a member
    document.getElementById('updateMemberForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const memberId = document.getElementById('updateMemberId').value;

        console.log('Submitting update for member (using id):', memberId);

        if (!memberId) {
            alert('Member ID is missing. Cannot update.');
            return;
        }

        const updatedMember = {
            name: document.getElementById('updateMemberName').value.trim(),
            position: document.getElementById('updateMemberPosition').value
        };

        fetch(`${apiUrl}/${memberId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedMember)
        })
            .then(response => {
                if (response.ok) {
                    alert('Member updated successfully.');
                    fetchMembers();
                    document.getElementById('updateFormContainer').style.display = 'none';
                } else {
                    return response.text().then(text => {
                        console.error('Update member error:', text);
                        alert(`Failed to update the member: ${text}`);
                    });
                }
            })
            .catch(error => {
                console.error('Update member error:', error);
                alert(`Error: ${error.message}`);
            });
    });

    // Handle cancel button click for the update form
    document.getElementById('cancelUpdate').addEventListener('click', function () {
        document.getElementById('updateFormContainer').style.display = 'none';
    });
});
