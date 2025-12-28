document.addEventListener('DOMContentLoaded', () => {
    // --- Variables del DOM ---
    const usernameInput = document.getElementById('username');
    const suggestionsContainer = document.getElementById('user-suggestions');
    
    // Solo ejecutar si los elementos necesarios existen en la página (evita errores en index.html)
    if (!usernameInput || !suggestionsContainer) {
        return;
    }

    let allUsers = [];

    // --- Carga de la base de datos de usuarios desde usuarios.json ---
    fetch('usuarios.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red al cargar usuarios.json');
            }
            return response.json();
        })
        .then(data => {
            allUsers = data;
        })
        .catch(error => {
            console.error('Error al cargar o procesar usuarios.json:', error);
            // Opcionalmente, podrías mostrar un mensaje al usuario o desactivar la función
        });

    // --- Event Listener para la entrada de texto en el campo de usuario ---
    usernameInput.addEventListener('input', () => {
        const query = usernameInput.value.toLowerCase();
        
        // Limpiar sugerencias anteriores siempre que se escriba
        suggestionsContainer.innerHTML = '';

        // No mostrar sugerencias si la consulta es muy corta
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        // Filtrar usuarios que coincidan con la consulta
        const filteredUsers = allUsers.filter(user => 
            user.username.toLowerCase().includes(query)
        );

        // Mostrar las sugerencias si hay coincidencias
        if (filteredUsers.length > 0) {
            suggestionsContainer.style.display = 'block';
            filteredUsers.forEach(user => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                
                // Construir la URL del avatar de Roblox usando el avatarId
                const avatarUrl = `https://tr.rbxcdn.com/${user.avatarId}/150/150/AvatarHeadshot/Png`;

                suggestionItem.innerHTML = `
                    <img src="${avatarUrl}" alt="${user.username}" class="suggestion-avatar" onerror="this.src='https://tr.rbxcdn.com/00000000000000000000000000000000/150/150/AvatarHeadshot/Png'">
                    <span class="suggestion-username">${user.username}</span>
                `;
                
                // --- Event Listener para hacer clic en una sugerencia ---
                suggestionItem.addEventListener('click', () => {
                    usernameInput.value = user.username;
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.style.display = 'none';
                });
                
                suggestionsContainer.appendChild(suggestionItem);
            });
        } else {
            // Ocultar si no hay coincidencias
            suggestionsContainer.style.display = 'none';
        }
    });

    // --- Ocultar sugerencias si se hace clic fuera del campo de usuario ---
    document.addEventListener('click', (event) => {
        // Comprobar si el clic fue fuera del input o del contenedor de sugerencias
        const isClickInside = usernameInput.contains(event.target) || suggestionsContainer.contains(event.target);
        
        if (!isClickInside) {
            suggestionsContainer.style.display = 'none';
        }
    });
});