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
  
  // var myDataSource = new Y.DataSource.Get({
  //   source: 'http://127.0.0.1:2223/stats.json?'
  // });
  // var myDataSource = new Y.DataSource.Function({
  //     source: function (request) {
  //         Y.log("hello world!");
  //         // This should really be a JSONP request.
  //         return [{"age_msec":0,"bytes":0,"discarded":0,"name":"on-demand-sql-4195","total_items":11111,"open_transactions":1,"expired_items":5,"mem_items":0,"waiters":2,"journal_size":1727087,"mem_bytes":0,"items":0},{"bytes":0,"age_msec":0,"discarded":0,"name":"nagios-on-demand-sql-4170-response-ab80b953ac6b6d0c797d449e7ebe3bd5","total_items":2,"open_transactions":0,"expired_items":2,"waiters":0,"mem_items":0,"journal_size":0,"items":0,"mem_bytes":0},{"age_msec":0,"bytes":0,"discarded":0,"name":"on-demand-sql-4335","total_items":11457,"open_transactions":7,"expired_items":11,"mem_items":0,"waiters":2,"journal_size":1789172,"items":0,"mem_bytes":0},{"age_msec":0,"bytes":0,"discarded":0,"name":"on-demand-sql-0","total_items":523,"open_transactions":1,"expired_items":5,"waiters":2,"mem_items":0,"journal_size":0,"items":0,"mem_bytes":0},{"age_msec":0,"bytes":0,"discarded":0,"name":"on-demand-sql-4210","total_items":4364,"open_transactions":4,"expired_items":17,"mem_items":0,"waiters":2,"journal_size":630379,"mem_bytes":0,"items":0},{"age_msec":0,"bytes":0,"discarded":0,"name":"on-demand-sql-4180","total_items":27823,"open_transactions":0,"expired_items":5,"waiters":2,"mem_items":0,"journal_size":4958640,"mem_bytes":0,"items":0},{"bytes":0,"age_msec":0,"discarded":0,"name":"on-demand-sql-4645","total_items":21748,"open_transactions":2,"expired_items":6,"mem_items":0,"waiters":2,"journal_size":3879965,"items":0,"mem_bytes":0},{"age_msec":0,"bytes":0,"discarded":0,"name":"on-demand-sql-4518","total_items":35805,"open_transactions":0,"expired_items":5,"mem_items":0,"waiters":2,"journal_size":6490590,"mem_bytes":0,"items":0},{"bytes":0,"age_msec":0,"discarded":0,"name":"response-net-kestrel-88f94582da4594d19a69044a1ba4e78b","total_items":0,"open_transactions":0,"expired_items":0,"mem_items":0,"waiters":0,"journal_size":0,"items":0,"mem_bytes":0},{"bytes":0,"age_msec":0,"discarded":0,"name":"on-demand-sql-4200","total_items":25273,"open_transactions":0,"expired_items":18,"mem_items":0,"waiters":2,"journal_size":4586670,"items":0,"mem_bytes":0},{"bytes":0,"age_msec":0,"discarded":0,"name":"on-demand-sql-4365","total_items":19944,"open_transactions":10,"expired_items":21,"waiters":2,"mem_items":0,"journal_size":3507106,"items":0,"mem_bytes":0},{"age_msec":0,"bytes":0,"discarded":0,"name":"on-demand-sql-4110","total_items":22608,"open_transactions":1,"expired_items":7,"mem_items":0,"waiters":2,"journal_size":4039704,"items":0,"mem_bytes":0},{"age_msec":0,"bytes":0,"discarded":0,"name":"on-demand-sql-4170","total_items":32939,"open_transactions":10,"expired_items":19,"mem_items":0,"waiters":2,"journal_size":5901826,"mem_bytes":0,"items":0},{"age_msec":0,"bytes":0,"discarded":0,"name":"on-demand-sql-2610","total_items":17870,"open_transactions":2,"expired_items":5,"mem_items":0,"waiters":2,"journal_size":2864247,"items":0,"mem_bytes":0},{"age_msec":0,"bytes":0,"discarded":0,"name":"on-demand-sql-3120","total_items":22382,"open_transactions":0,"expired_items":6,"mem_items":0,"waiters":2,"journal_size":3999923,"items":0,"mem_bytes":0},{"bytes":0,"age_msec":0,"discarded":0,"name":"on-demand-sql-4205","total_items":18529,"open_transactions":7,"expired_items":9,"mem_items":0,"waiters":2,"journal_size":3202262,"mem_bytes":0,"items":0},{"bytes":0,"age_msec":0,"discarded":0,"name":"on-demand-sql-4630","total_items":34673,"open_transactions":1,"expired_items":5,"waiters":2,"mem_items":0,"journal_size":6254916,"mem_bytes":0,"items":0},{"age_msec":0,"bytes":0,"discarded":0,"name":"nagios-on-demand-sql-4200-response-0af25f890908584a3b9b8f3944a81325","total_items":2,"open_transactions":0,"expired_items":2,"waiters":0,"mem_items":0,"journal_size":0,"items":0,"mem_bytes":0},{"bytes":0,"age_msec":0,"discarded":0,"name":"on-demand-sql-4130","total_items":11677,"open_transactions":0,"expired_items":5,"waiters":2,"mem_items":0,"journal_size":1825633,"mem_bytes":0,"items":0},{"bytes":0,"age_msec":0,"discarded":0,"name":"on-demand-sql-4135","total_items":26390,"open_transactions":0,"expired_items":79,"mem_items":0,"waiters":0,"journal_size":4581816,"mem_bytes":0,"items":0},{"bytes":0,"age_msec":0,"discarded":0,"name":"on-demand-sql-4150","total_items":19063,"open_transactions":0,"expired_items":5,"waiters":2,"mem_items":0,"journal_size":3330269,"items":0,"mem_bytes":0}];
  //     }
  // });
  // myDataSource.plug(Y.Plugin.DataSourceJSONSchema, {
  //     schema: {
  //         resultFields: [ "name", "items", "total_items", "discarded", "waiters", "open_transactions", "bytes", "journal_size" ]
  //     }
  // })
  
  var list = new Y.QueueList();
  list.load( function(err) { Y.log(Y.JSON.stringify(err)); Y.log(list.toJSON()); });
  
  var table = new Y.DataTable.Base({
     columns: cols,
     // plugins: [ Y.Plugin.DataTableSort ],
     data: new Y.QueueList()
   });

  // table.plug(Y.Plugin.DataTableDataSource, {
  //    datasource: myDataSource,
  //    initialRequest: ""
  // });

  table.render("#data");
});
