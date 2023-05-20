function toggle(source) {
    var checkboxes = document.getElementsByName('statement_file');
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = source.checked;
    }
}

function validateUpdateStatementForm() {
  // Get all the statement files checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"][name="statement_file"]');
  let atLeastOneChecked = false;

  // Check if at least one checkbox is checked
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      atLeastOneChecked = true;
      break;
    }
  }

  // Display an error message if no checkbox is checked
  if (!atLeastOneChecked) {
    alert("Please select at least one statement file to delete.");
    return false; // Prevent form submission
  }

  return true;
}