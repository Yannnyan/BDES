
function tabulate(data) {
    let columns = Object.keys(data[0])
    console.log(columns)
    var table = d3.select('#analyze_table').append('table')
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



async function onsub()
{
    var img = document.createElement('img');
    img.width= 20
    img.height=20
    img.src = 'images/loading.gif'
    document.getElementById('loading').appendChild(img)
    document.getElementById('analyze_table').innerHTML = ''
    start_date = document.getElementById('start').value
    end_date = document.getElementById('end').value
    await fetch('http://localhost:3000/analyzesmth?' + new URLSearchParams({
        start: start_date,
        end: end_date
    }),{
        headers: {
        'Accept': 'application/json'
    }})
    .then(res => res.text())
    .then((res) => {
        var data = JSON.parse(res)
        document.getElementById('loading').innerHTML = ""
        if(data.error !== undefined)
        {
            // show an alert with error
            alert("Exception: " + data.error)
        }
        else{
            tabulate(data)
        }
    })
}







