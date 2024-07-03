document.addEventListener('DOMContentLoaded', () => {
    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este usuario?');

            // simulacion de metodo delete desde HBS
            if (confirmed) {
                const methodInput = document.createElement('input');
                methodInput.setAttribute('type', 'hidden');
                methodInput.setAttribute('name', '_method');
                methodInput.setAttribute('value', 'DELETE');
                form.appendChild(methodInput);
                form.submit();
            }
        });
    });
});