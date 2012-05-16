YUI().use('falconry-models', 'datasource', 'datatable-base', 'datatable-sort', function(Y) {
  Y.log( Y.QueueList );

  function bytesToHuman(o)  {  
    var precision = 0;
    var kilobyte  = 1024;
    var megabyte  = kilobyte * 1024;
    var gigabyte  = megabyte * 1024;
    var terabyte  = gigabyte * 1024;

    var bytes = o.value;

    if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';
    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KB';
    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return (bytes / megabyte).toFixed(precision) + ' MB';
    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return (bytes / gigabyte).toFixed(precision) + ' GB';
    } else if (bytes >= terabyte) {
        return (bytes / terabyte).toFixed(precision) + ' TB';
    } else {
        return bytes + ' B';
    }
  }

  function addCommas(o) {
    var nStr = o.value;
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
  
  var cols = [
    { key: "name", label: "Name", sortable: true },
    { key: "items", label: "Item Count", sortable: true },
    { key: "total_items", label: "Total Items", sortable: true, formatter: addCommas },
    { key: "discarded", label: "Discarded", sortable: true, formatter: addCommas },
    { key: "waiters", label: "Waiters", sortable: true, formatter: addCommas },
    { key: "open_transactions", label: "Open Transactions", sortable: true, formatter: addCommas },
    { key: "bytes", label: "Bytes", sortable: true, formatter: bytesToHuman },
    { key: "journal_size", label: "Journal Size", sortable: true, formatter: bytesToHuman }
  ];

  var table = new Y.DataTable.Base({
     columnset: cols,
     plugins: [ Y.Plugin.DataTableSort ],
     data: new Y.QueueList()
   });
  table.render("#data");
});
