YUI().use('falconry-models', 'datasource', 'datatable-base', 'datatable-sort', 'event-valuechange', function(Y) {

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
  
  function handleKestrelError(e) {
    Y.log('Kestrel is in an error state');
    Y.log(e.error); // Most likely an array of fail.
  }

  var list = new Y.QueueList();
  list.on('error', handleKestrelError);
  list.load();
  
  var table = new Y.DataTable({
    columns: cols,
    data: list
  });
  table.TABLE_TEMPLATE = '<table cellspacing="0" class="{className} table table-bordered table-striped"/>'
  table.render("#data");
  
  var kestrel = new Y.KestrelModel();
  kestrel.load();
  Y.log(kestrel);
  
  var timer;

  function setupPolling(e) {

    var interval = e ? e.newVal : null;
    if(interval === null) {
      interval = Y.one('#refresh').get('value');
    }
    interval = parseInt(interval, 10) * 1000;

    if ( timer ) {
      timer.cancel();
      if ( interval <= 0 ) {
        return;
      }
    }
    timer = Y.later( interval, list, function() { list.load(); kestrel.load() }, null, true );
  }
  
  function updateKestrel(e) {
    Y.log("Refreshing global panel");

    Y.Object.each( kestrel.getAttrs(), function(value, name) {
      var node = Y.one("#" + name);
      if(node == null) {
        Y.log("Could not find node for " + name);
      } else {
        eVal = node.getHTML();
        if(eVal != value) {
          node.setHTML(value);
          node.addClass("updated");
          Y.later(250, node, function(e) { node.removeClass("updated") }, null, false);
        }
      }
    });
  }

  // Read http://yuilibrary.com/yui/docs/api/classes/ValueChange.html (this is a separate module that needs to be used)
  Y.one('#refresh').on('valueChange', setupPolling);
  Y.one('#filter').on('valueChange', function(e) { list.set('filter', e.newVal); });
  kestrel.on('change', updateKestrel);
  setupPolling();
});
