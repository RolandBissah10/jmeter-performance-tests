/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 88.88888888888889, "KoPercent": 11.11111111111111};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5798148148148148, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9866666666666667, 500, 1500, "POST - Login"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "POST - View Cart"], "isController": false}, {"data": [0.3, 500, 1500, "TC07 - View Cart"], "isController": true}, {"data": [0.36, 500, 1500, "TC04 - User Signup"], "isController": true}, {"data": [0.20333333333333334, 500, 1500, "TC06 - Add to Cart"], "isController": true}, {"data": [0.21666666666666667, 500, 1500, "TC02 - Browse Products"], "isController": true}, {"data": [0.9933333333333333, 500, 1500, "POST - Delete Cart Item"], "isController": false}, {"data": [0.8266666666666667, 500, 1500, "GET - Get All Products"], "isController": false}, {"data": [1.0, 500, 1500, "POST - View Product"], "isController": false}, {"data": [1.0, 500, 1500, "POST - Signup"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "TC03 - View Product Detail"], "isController": true}, {"data": [0.2866666666666667, 500, 1500, "TC01 - Load Homepage"], "isController": true}, {"data": [0.0, 500, 1500, "POST - Place Order"], "isController": false}, {"data": [0.2966666666666667, 500, 1500, "TC05 - User Login"], "isController": true}, {"data": [0.9966666666666667, 500, 1500, "POST - Add to Cart"], "isController": false}, {"data": [0.0, 500, 1500, "TC08 - Checkout"], "isController": true}, {"data": [0.9933333333333333, 500, 1500, "TC09 - Delete from Cart"], "isController": true}, {"data": [0.8266666666666667, 500, 1500, "GET - Homepage"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 300, 11.11111111111111, 330.08814814814804, 163, 1680, 297.0, 393.9000000000001, 640.0, 791.0, 24.912575314405927, 29.838521675093883, 5.944309148912612], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST - Login", 300, 0, 0.0, 312.7999999999999, 264, 986, 298.0, 334.2000000000003, 356.0, 942.0, 3.157130378960883, 0.7648641644654453, 0.7800331893331088], "isController": false}, {"data": ["POST - View Cart", 300, 0, 0.0, 319.87333333333333, 264, 801, 300.0, 360.60000000000014, 399.0, 727.0, 3.1656255276042544, 0.8748750237421915, 0.7172120335978389], "isController": false}, {"data": ["TC07 - View Cart", 300, 0, 0.0, 1720.906666666667, 349, 6095, 1437.5, 3224.1000000000076, 4055.0, 5416.0, 3.146369090070059, 0.8695531762595964, 0.7128492469689978], "isController": true}, {"data": ["TC04 - User Signup", 300, 0, 0.0, 1422.0866666666664, 278, 3828, 1254.5, 2512.300000000002, 2995.0, 3577.0, 3.237049106034939, 0.8124234572763468, 0.8029399149735101], "isController": true}, {"data": ["TC06 - Add to Cart", 300, 0, 0.0, 2072.98, 348, 6209, 1868.5, 3636.3000000000015, 4727.0, 6151.0, 3.144720015094656, 0.6050719747793455, 0.8537423478479633], "isController": true}, {"data": ["TC02 - Browse Products", 300, 0, 0.0, 2551.126666666668, 360, 7961, 2170.5, 4984.800000000002, 5648.0, 7523.0, 3.1502677727606847, 9.01719028929959, 0.5691401737897721], "isController": true}, {"data": ["POST - Delete Cart Item", 300, 0, 0.0, 290.5999999999998, 250, 666, 281.0, 324.60000000000014, 351.0, 509.0, 3.0930067118245645, 0.7793732537399607, 0.7792927066901736], "isController": false}, {"data": ["GET - Get All Products", 300, 0, 0.0, 442.29999999999984, 270, 1680, 326.0, 704.9000000000001, 770.0, 801.0, 3.213883978788366, 9.199282567357653, 0.58063333601157], "isController": false}, {"data": ["POST - View Product", 300, 0, 0.0, 302.846666666667, 257, 367, 298.0, 340.80000000000007, 352.0, 366.0, 3.2636365614325187, 1.5745346598202825, 0.6693004667000283], "isController": false}, {"data": ["POST - Signup", 300, 0, 0.0, 301.5399999999998, 260, 445, 297.0, 331.0, 344.0, 397.0, 3.2470695197584183, 0.8149383462674935, 0.8054254472838263], "isController": false}, {"data": ["TC03 - View Product Detail", 300, 0, 0.0, 2646.0400000000027, 297, 7825, 2322.0, 4659.200000000001, 5822.0, 7795.0, 3.1766537129787484, 1.5325699657980285, 0.6514621872319699], "isController": true}, {"data": ["TC01 - Load Homepage", 300, 0, 0.0, 1778.473333333334, 204, 4505, 1608.0, 3250.4, 3817.0, 4255.0, 3.06563525071787, 17.765056899467602, 0.5628314718114839], "isController": true}, {"data": ["POST - Place Order", 300, 300, 100.0, 299.14, 252, 710, 286.0, 334.0, 355.0, 632.0, 3.094091316948401, 1.317647794428573, 1.030356581132231], "isController": false}, {"data": ["TC05 - User Login", 300, 0, 0.0, 1646.966666666667, 302, 5151, 1482.5, 2935.3, 3390.0, 4219.0, 3.1362054005457, 0.7597947614915793, 0.7748632483770137], "isController": true}, {"data": ["POST - Add to Cart", 300, 0, 0.0, 312.96000000000004, 270, 636, 303.5, 352.7000000000001, 370.0, 433.0, 3.1671628555140305, 0.6093901759886827, 0.859835228352442], "isController": false}, {"data": ["TC08 - Checkout", 300, 300, 100.0, 2694.379999999999, 326, 6391, 2406.5, 4907.700000000004, 5547.0, 6170.0, 3.0647270349787514, 1.3051427396616542, 1.0205780458278848], "isController": true}, {"data": ["TC09 - Delete from Cart", 300, 0, 0.0, 290.86, 250, 666, 281.5, 324.60000000000014, 351.0, 509.0, 3.092974823184939, 0.7793652184671217, 0.7792846722477679], "isController": true}, {"data": ["GET - Homepage", 300, 0, 0.0, 388.7333333333333, 163, 1489, 293.5, 684.7, 785.0, 1200.0, 3.1252278811996708, 18.110390373516818, 0.5737723063140021], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 300, 100.0, 11.11111111111111], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 300, "404/Not Found", 300, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST - Place Order", 300, 300, "404/Not Found", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
