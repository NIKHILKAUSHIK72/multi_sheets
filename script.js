document.addEventListener("DOMContentLoaded", function() {
    // CSV URLs for each sheet
    const ordersUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuFQgA8IkJFk4SXreMAjvy0ICZY3f1dYeiDIe5sxhp1EEaL5B-iSRzuzH-GSkBYclPapzOXIGyXKsc/pub?output=csv&sheet=Orders";
    const dispatchUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2J8Z-INbVaBrtmbGrmC9t2sI4mRViIOVX06WFrA0YHp_QQCoKU3S8rVBs0sTdoaqr1IbKsO7sF739/pub?output=csv&sheet=dispatch";
    const press1Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpc9Aae1lrFH02QdDZfKZArdJ-geR16N1demUx4pJs5SUSVLOC5RfvCqNpiLdwmRvtnF4gDV7pza76/pub?gid=0&single=true&output=csv&sheet=press1";
    const press2Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSVvFtjgnm2hoAifaAxSmQeEgi2JBbVyfafZcgGA1AgGX04zOqoRM0ZDOjGdrDlLVkuPwDYMaGGY26i/pub?gid=0&single=true&output=csv&sheet=press2";
 //   const qtyUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vTuFQgA8IkJFk4SXreMAjvy0ICZY3f1dYeiDIe5sxhp1EEaL5B-iSRzuzH-GSkBYclPapzOXIGyXKsc/pub?gid=1792096651&single=true&output=csv&sheet=quantity";
    
    // Fetch data from multiple sheets (CSV)
    Promise.all([
        fetch(ordersUrl).then(res => res.text()),
        fetch(dispatchUrl).then(res => res.text()),
        fetch(press1Url).then(res => res.text()),
        fetch(press2Url).then(res => res.text()),
     //  fetch(qtyUrl).then(res => res.text())
    ])
    .then(([ordersData, dispatchData, press1Data, press2Data]) => {
        // Parse the CSV data for each sheet
        const ordersRows = parseCSV(ordersData);
        const dispatchRows = parseCSV(dispatchData);
        const press1Rows = parseCSV(press1Data);
        const press2Rows = parseCSV(press2Data);
       // const qtyRows =  parseCSV(qtyData);


        // Extract totals from each sheet
        const totals = {
            totalOrders: calculateTotalOrders(ordersRows),
            totalQtyOrdered: calculateTotalQtyOrdered(ordersRows),
            totalDispatch: calculateTotalDispatch(dispatchRows),
            totalProductionPress1: calculateTotalProduction(press1Rows),
            totalProductionPress2: calculateTotalProduction(press2Rows)
        };

        // Update dashboard with the calculated totals
        updateDashboard(totals);
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
    });

    // Function to parse CSV data and return rows as arrays
    function parseCSV(csvData) {
        return csvData.split('\n').map(row => row.split(','));
    }

    // Calculate total orders from Orders sheet (assuming column 1 contains orders)
    function calculateTotalOrders(data) {
        return data.slice(1).reduce((sum, row) => sum + (parseInt(row[0]) || 0), 0);
    }

    // Calculate total qty ordered from Orders sheet (assuming column 2 contains qty)
    function calculateTotalQtyOrdered(data) {
        return data.slice(1).reduce((sum, row) => sum + (parseInt(row[1]) || 0), 0);
    }

    // Calculate total dispatch from Dispatch sheet (assuming column 1 contains dispatch data)
    function calculateTotalDispatch(data) {
        return data.slice(1).reduce((sum, row) => sum + (parseInt(row[0]) || 0), 0);
    }

    // Calculate total production (from Production Press sheets, assuming column 1 contains production values)
    function calculateTotalProduction(data) {
        return data.slice(1).reduce((sum, row) => sum + (parseInt(row[0]) || 0), 0);
    }

    // Update dashboard with the totals
    function updateDashboard(totals) {
        document.getElementById('total-orders').textContent = totals.totalOrders;
        document.getElementById('total-qty-ordered').textContent = totals.totalQtyOrdered;
        document.getElementById('total-dispatch').textContent = totals.totalDispatch;
        document.getElementById('total-production-press1').textContent = totals.totalProductionPress1;
        document.getElementById('total-production-press2').textContent = totals.totalProductionPress2;
    }

    // Apply date filter (if necessary)
    window.applyDateFilter = function() {
        // This can be enhanced by filtering data based on the date range
    };
});

