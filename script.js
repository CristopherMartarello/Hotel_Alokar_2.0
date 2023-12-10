const clientsData = []; 

class Hospede {

    static nextId = 1;

    constructor(name, phone, checkin, checkout, room, service) {
        this.id = Hospede.nextId++;
        this.name = name;
        this.phone = phone;
        this.checkin = checkin;
        this.checkout = checkout;
        this.room = room;
        this.service = service;
    }
}

class ClienteManager {
    static showPanel(panelId) {
        const panels = document.querySelectorAll('.panel');
        panels.forEach((panel) => {
            panel.style.display = "none";
        });

        if (panelId) {
            const panel = document.getElementById(panelId);
            panel.style.display = "block";
        }
    }

    static addService() {
        const targetRoom = document.getElementById('serviceRoom').value;
        console.log(targetRoom);

        clientsData.forEach((client, i) => {
            if (client.room === targetRoom) {
                client.service = 'yes';
                alert('Serviço adicionado com sucesso!');
            }
        });
    }

    static checkout() {
        const clientName = document.getElementById('checkoutName').value;
        const clientPhone = document.getElementById('checkoutPhone').value;
        const clientRoom = document.getElementById('checkoutRoom').value
        clientsData.forEach((client, i) => {
            console.log(client, i);
            if (clientName === client.name && clientPhone === client.phone && clientRoom === client.room) {
                clientsData.splice(i, 1);
                ClienteManager.updateLocalStorage();
                ClienteManager.populateTable();
                ClienteManager.calcularValorTotal(client.checkin, client.checkout, client.service);
                ClienteManager.clearData();
                alert('Check-out realizado com sucesso!');
            }
        });
    }

    static submitData() {
        const clientName = document.getElementById('clientName').value;
        const clientPhone = document.getElementById('clientPhone').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const clientRoom = document.getElementById('clientRoom').value;
        const service = document.getElementById('services').value;

        if (clientName && clientPhone && startDate && endDate && clientRoom) {
            const roomOccupied = clientsData.some(client => client.room === clientRoom);
            console.log(roomOccupied);
    
            if (!roomOccupied) {
                const clientObject = new Hospede(clientName, clientPhone, startDate, endDate, clientRoom, service);
                console.log(clientObject);
    
                ClienteManager.clearData();
                clientsData.push(clientObject);
                ClienteManager.updateLocalStorage();
                ClienteManager.populateTable();
                alert('Cliente cadastrado com sucesso!');
            } else {
                alert('Esse quarto já está ocupado!');
            }
        } else {
            alert('É necessário preencher todas as lacunas antes de fazer Check-in!');
        }
    }

    static calcularValorTotal(checkin, checkout, service) {

        if (service === 'yes') {
            service = 75;
        } else {
            service = 0;
        }

        const startDateValue = checkin;
        const endDateValue = checkout;
    
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);
    
        const diferencaEmMilissegundos = endDate - startDate;
    
        const diasTotais = Math.ceil(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));
    
        const valorDiario = 150; 
        const valorTotal = (diasTotais * valorDiario) + service;
    
        console.log(`Total de dias: ${diasTotais}`);
        console.log(`Valor total: ${valorTotal}`);
        alert(`Total de dias: ${diasTotais}\nTaxa de Serviço: ${service}\nValor total: ${valorTotal}`);
    }

    static clearData() {
        document.getElementById('clientName').value = '';
        document.getElementById('clientPhone').value = '';
        document.getElementById('clientEmail').value = '';
        document.getElementById('clientPartners').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('clientRoom').value = '';
        document.getElementById('checkoutPhone').value = '';
        document.getElementById('checkoutEmail').value = '';
        document.getElementById('checkoutPartners').value = '';
        document.getElementById('checkoutRoom').value = '';
        document.getElementById('checkoutName').value = '';
    }

    static populateTable() {
        const table = document.getElementById('clients-table').getElementsByTagName('tbody')[0];

        table.innerHTML = '';

        clientsData.forEach((client, i) => {
            const newRow = table.insertRow(table.rows.length);
        
            // Adicionando as células de dados
            for (let i = 0; i < 6; i++) {
                const cell = newRow.insertCell(i);
                switch (i) {
                    case 0:
                        cell.innerHTML = client.id;
                        break;
                    case 1:
                        cell.innerHTML = client.name;
                        break;
                    case 2:
                        cell.innerHTML = client.phone;
                        break;
                    case 3:
                        client.checkin = client.checkin.replace("T", ' ');
                        cell.innerHTML = client.checkin;
                        break;
                    case 4:
                        client.checkout = client.checkout.replace("T", ' ');
                        cell.innerHTML = client.checkout;
                        break;
                    case 5:
                        cell.innerHTML = client.room;
                        break;
                    default:
                        break;
                }
            }
        
            const buttonsContainer = document.createElement('div');
        
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'delete-button';
            deleteButton.style.backgroundColor = '#f44336';
            deleteButton.style.margin = '5px';
            deleteButton.addEventListener('click', () => {
                clientsData.splice(i, 1);
                ClienteManager.updateLocalStorage();
                ClienteManager.populateTable();
                alert('Cliente removido com sucesso!');
            });
            buttonsContainer.appendChild(deleteButton);
        
            newRow.insertCell(6).appendChild(buttonsContainer);
        });
    }

    static updateLocalStorage() {
        localStorage.setItem('clientsData', JSON.stringify(clientsData));
    }
}

window.onload = function () {
    const localStorageData = localStorage.getItem('clientsData');
    clientsData.push(...(localStorageData ? JSON.parse(localStorageData) : []));
    ClienteManager.populateTable();
};

document.addEventListener("DOMContentLoaded", () => {
    const searchClients = document.getElementById('searchClients');
    const clientsBody = document.getElementById('clients-body');

    const serviceCheckboxes = document.querySelectorAll('#serviceCheckbox');

    serviceCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                alert('Serviço adicionado! Um adicional será cobrado.')
            }
        });
    });


    searchClients.addEventListener('keyup', () => {
        const typed = searchClients.value.toLowerCase();

        clientsData.forEach((client, position) => {
            const rowContent = Object.values(client).join(' ').toLowerCase();
            const row = clientsBody.getElementsByTagName('tr')[position];

            if (rowContent.includes(typed)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});



