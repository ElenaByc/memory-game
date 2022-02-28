export const getResultsFromLocalStorage = () => {
    const table = document.querySelector('.results-table');
    table.innerHTML = '';
    const timeArray = JSON.parse(localStorage.getItem('time-array'));
    const turnsArray = JSON.parse(localStorage.getItem('turns-array'));

    if (timeArray === null) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 2;
        td.textContent = 'No Results';
        tr.appendChild(td);
        table.appendChild(tr);
    } else {
        let tr, th1, th2, td1, td2;
        tr = document.createElement('tr');
        th1 = document.createElement('th');
        th2 = document.createElement('th');
        th1.textContent = 'Turns';
        th2.textContent = 'Time';
        tr.appendChild(th1);
        tr.appendChild(th2);
        table.appendChild(tr);
        const len = timeArray.length;
        if (len <= 10) {
            for (let i = 0; i < len; i++) {
                tr = document.createElement('tr');
                td1 = document.createElement('td');
                td2 = document.createElement('td');
                td1.textContent = turnsArray[i];
                td2.textContent = timeArray[i];
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            }
        } else {
            for (let i = len - 10; i < len; i++) {
                tr = document.createElement('tr');
                td1 = document.createElement('td');
                td2 = document.createElement('td');
                td1.textContent = timeArray[i];
                td2.textContent = turnsArray[i];
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            }
        }
    }
}

export const saveResultToLocalStorage = (time, turns) => {
    let timeArray = JSON.parse(localStorage.getItem('time-array'));
    let turnsArray = JSON.parse(localStorage.getItem('turns-array'));
    if (timeArray === null) {
        timeArray = [];
        turnsArray = [];
        timeArray[0] = time;
        turnsArray[0] = turns;
    } else {
        const len = timeArray.length;
        if (len <= 9) {
            timeArray[len] = time;
            turnsArray[len] = turns;
        } else {
           timeArray = timeArray.slice(-9);
           turnsArray = turnsArray.slice(-9);
           timeArray[9] = time;
           turnsArray[9] = turns;
        }
    }
    localStorage.setItem('time-array', JSON.stringify(timeArray));
    localStorage.setItem('turns-array', JSON.stringify(turnsArray));
}
