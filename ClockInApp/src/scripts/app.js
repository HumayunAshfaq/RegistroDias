document.addEventListener('DOMContentLoaded', () => {
    const clockInButton = document.getElementById('clockInBtn');
    const viewRecordsButton = document.getElementById('viewRecordsBtn');
    const clearDataButton = document.getElementById('clearDataBtn');
    const countDaysButton = document.getElementById('countDaysBtn');
    const recordsModal = document.getElementById('recordsModal');
    const recordsList = document.getElementById('recordsList');
    const filterMenu = document.getElementById('filterMenu');
    const closeModalButton = document.querySelector('.close');

    clockInButton.addEventListener('click', clockIn);
    viewRecordsButton.addEventListener('click', displayRecords);
    clearDataButton.addEventListener('click', clearAllData);
    countDaysButton.addEventListener('click', showCount);
    closeModalButton.addEventListener('click', () => {
        recordsModal.style.display = 'none';
    });

    function clockIn() {
        const today = new Date();
        const date = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const dayName = today.toLocaleString('es', { weekday: 'long' }); // Spanish day name
        const record = `${date} - ${dayName}`;

        let records = JSON.parse(localStorage.getItem('records')) || [];
        if (!records.includes(record)) {
            records.push(record);
            localStorage.setItem('records', JSON.stringify(records));
            alert(`Registrado para ${dayName} en ${date}`);
        } else {
            alert('¡Ya has registrado tu entrada hoy!');
        }
    }

    function displayRecords() {
        const records = JSON.parse(localStorage.getItem('records')) || [];
        recordsList.innerHTML = '';

        if (records.length === 0) {
            recordsList.innerHTML = '<li>No se encontraron registros.</li>';
        } else {
            records.forEach(record => {
                const li = document.createElement('li');
                li.textContent = record;
                recordsList.appendChild(li);
            });
        }

        recordsModal.style.display = 'block';
    }

    function clearAllData() {
        if (confirm('¿Estás seguro de que deseas borrar todos los datos? Esta acción no se puede deshacer.')) {
            if (confirm('Por favor confirma nuevamente para borrar todos los datos.')) {
                localStorage.removeItem('records');
                alert('Todos los datos han sido borrados.');
                recordsList.innerHTML = '';
            }
        }
    }

    filterMenu.addEventListener('change', filterRecords);

    function filterRecords() {
        const filterValue = filterMenu.value;
        const records = JSON.parse(localStorage.getItem('records')) || [];
        let filteredRecords = records;

        if (filterValue === 'week') {
            const today = new Date();
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            filteredRecords = records.filter(record => {
                const recordDate = new Date(record.split(' - ')[0]);
                return recordDate >= startOfWeek;
            });
        } else if (filterValue === 'month') {
            const today = new Date();
            const currentMonth = today.getMonth();
            filteredRecords = records.filter(record => {
                const recordDate = new Date(record.split(' - ')[0]);
                return recordDate.getMonth() === currentMonth;
            });
        }

        return filteredRecords;
    }

    function showCount() {
        const filteredRecords = filterRecords();
        alert(`Total de días trabajados: ${filteredRecords.length}`);
    }
});