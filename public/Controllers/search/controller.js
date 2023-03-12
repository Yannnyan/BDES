var columns = ['Time', 'Make_Duration', 'Status', 'Quantity', 'Mushroom', 'Onion', 'Olive', 'Corn', 'Tomato', 'Eggplant']
//     fetch('http://localhost:3000/smth', {
//       headers: {
//         'Accept': 'application/json'
//       }
//     })
//     .then(res => res.text())
//     .then(res => tabulate(JSON.parse(res), columns))
   
function tabulate(data, columns) {
    document.getElementById("search_results").innerHTML = ""
    var table = d3.select('#search_results').append('table')
    var thead = table.append('thead')
    var	tbody = table.append('tbody');

    // append the header row
    thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .text(function (column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
        .data(function (row) {
        return columns.map(function (column) {
            return {column: column, value: row[column]};
        });
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value; });

    return table;
}


function onsub()
{
    branch = document.getElementById('branches').value
    date = document.getElementById('at').value
    fetch('http://localhost:3000/smth?' + new URLSearchParams({
        branch: branch,
        date: date
    }))
    .then(res => res.text())
    .then(res => tabulate(JSON.parse(res), columns))
    
}


