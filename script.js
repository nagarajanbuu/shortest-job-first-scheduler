function generateProcessInputs() {
    const numProcesses = document.getElementById('numProcesses').value;
    const processTable = document.getElementById('processTable');
    processTable.innerHTML = '';
    for (let i = 1; i <= numProcesses; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>P${i}</td>
            <td><input type="number" value="0"></td>
            <td><input type="number" value="0"></td>
        `;
        processTable.appendChild(row);
    }
}

function generateScheduler() {
    const rows = document.getElementById('processTable').rows;
    const processes = [];
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const arrivalTime = parseInt(cells[1].children[0].value);
        const burstTime = parseInt(cells[2].children[0].value);
        processes.push({ id: i + 1, arrivalTime, burstTime });
    }
    processes.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime);

    // Calculate waiting time and turnaround time
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const result = [];
    for (const process of processes) {
        const waitingTime = Math.max(0, currentTime - process.arrivalTime);
        const turnaroundTime = waitingTime + process.burstTime;
        currentTime += process.burstTime;
        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;
        result.push({ ...process, waitingTime, turnaroundTime });
    }

    const avgWaitingTime = (totalWaitingTime / processes.length).toFixed(2);
    const avgTurnaroundTime = (totalTurnaroundTime / processes.length).toFixed(2);
    document.getElementById('avgWaitingTime').innerText = `Average Waiting Time: ${avgWaitingTime} ms`;
    document.getElementById('avgTurnaroundTime').innerText = `Average Turnaround Time: ${avgTurnaroundTime} ms`;

    // Generate Gantt Chart
    const ganttChart = document.getElementById('ganttChart');
    ganttChart.innerHTML = 'Gantt Chart: ';
    currentTime = 0;
    for (const process of result) {
        ganttChart.innerHTML += 'Idle -> '.repeat(Math.max(0, process.arrivalTime - currentTime));
        ganttChart.innerHTML += `P${process.id} -> `.repeat(process.burstTime);
        currentTime = process.arrivalTime + process.burstTime;
    }
    ganttChart.innerHTML = ganttChart.innerHTML.slice(0, -4); // Remove last arrow
}
