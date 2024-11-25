<script type="text/javascript">
    var selectedRow = null;

    function onFormSubmit(e) {
        event.preventDefault();
        var formData = readFormData();
        if (selectedRow == null) {
            createUser (formData);
        } else {
            updateUser (formData);
        }
        resetForm();
    }

    function readFormData() {
        var formData = {};
        formData["name"] = document.getElementById("name").value;
        formData["email"] = document.getElementById("email").value;
        formData["dob"] = document.getElementById("dob").value;
        return formData;
    }

    function createUser (data) {
        fetch('/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            insertNewRecord(data);
        })
        .catch(error => console.error('Error:', error));
    }

    function insertNewRecord(data) {
        var table = document.getElementById("li").getElementsByTagName('tbody')[0];
        var newRow = table.insertRow(table.length);
        newRow.insertCell(0).innerHTML = data.name;
        newRow.insertCell(1).innerHTML = data.email;
        newRow.insertCell(2).innerHTML = data.dob;
        newRow.insertCell(3).innerHTML = `<button onClick="onEdit(this)">Edit</button> <button onClick="onDelete(this)">Delete</button>`;
    }

    function updateUser (data) {
        fetch(`/api/users/${selectedRow.dataset.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            selectedRow.cells[0].innerHTML = data.name;
            selectedRow.cells[1].innerHTML = data.email;
            selectedRow.cells[2].innerHTML = data.dob;
        })
        .catch(error => console.error('Error:', error));
    }

    function onEdit(td) {
        selectedRow = td.parentElement.parentElement;
        document.getElementById("name").value = selectedRow.cells[0].innerHTML;
        document.getElementById("email").value = selectedRow.cells[1].innerHTML;
        document.getElementById("dob").value = selectedRow.cells[2].innerHTML;
        selectedRow.dataset.id = selectedRow.dataset.id; // Store the ID for updating
    }

    function onDelete(td) {
        if (confirm('Do you want to delete this record?')) {
            var row = td.parentElement.parentElement;
            fetch(`/api/users/${row.dataset.id}/`, {
                method: 'DELETE',
            })
            .then(() => {
                document.getElementById('li').deleteRow(row.rowIndex);
                resetForm();
            })
            .catch(error => console.error('Error:', error));
        }
    }

    function resetForm() {
        document.getElementById("name").value = '';
        document.getElementById("email").value = '';
        document.getElementById("dob").value = '';
        selectedRow = null;
    }
</script>