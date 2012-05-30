YUI.add('falconry', function(Y) {
  var NS = Y.namespace('Falconry');

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
 

  NS.App = Y.Base.create('falconry', Y.App, [ ], {
    views : { },

    cols : [
      { key: "name", label: "Name", sortable: true },
      { key: "items", label: "Item Count", sortable: true },
      { key: "total_items", label: "Total Items", sortable: true, formatter: addCommas },
      { key: "discarded", label: "Discarded", sortable: true, formatter: addCommas },
      { key: "waiters", label: "Waiters", sortable: true, formatter: addCommas },
      { key: "open_transactions", label: "Open Transactions", sortable: true, formatter: addCommas },
      { key: "bytes", label: "Bytes", sortable: true, formatter: bytesToHuman },
      { key: "journal_size", label: "Journal Size", sortable: true, formatter: bytesToHuman }
    ],
 
    timer : null,
    table : null,

    initializer : function(config) {
      Y.log('[' + this.getPath() + ']');
      Y.log('[' + this.hasRoute( this.getPath() ) + ']');
      if ( this.hasRoute( this.getPath() ) ) {
        this.dispatch();
      }
    },

    handleRoot : function(req) {
      Y.log('handleRoot');
      Y.log(req);
      var list    = this.get('queueList'),
          kestrel = this.get('kestrel'),

          table;

      Y.Array.each( [ 'host', 'filter', 'refresh' ], function(key) {
        if ( req.query[key] ) {
          this.get(key + 'Input').set('value', req.query[key]);
        }
      }, this);

      list.on('error', this.handleKestrelError, this);
      kestrel.on('change', this.updateKestrel, this);

      list.load();
      kestrel.load();
      Y.log(kestrel);
  
      this.get('refreshInput').on('valueChange', this.setupPolling, this);
      this.get('filterInput').on('valueChange', function(e) { list.set('filter', e.newVal); });
      
      table = this.table = new Y.DataTable({
        columns: this.cols,
        data: list
      });
  
      table.TABLE_TEMPLATE = '<table cellspacing="0" class="{className} table table-bordered table-striped"/>'
      table.render("#data");

      this.setupPolling();
    },

    handleKestrelError : function(e) {
      Y.log('Kestrel is in an error state');
      Y.log(e.error); // Most likely an array of fail.
    },

    setupPolling : function(e) {
       var timer    = this.timer,
           interval = e ? e.newVal : null,
           list     = this.get('queueList'),
           kestrel  = this.get('kestrel');

       if(interval === null) {
         interval = Y.one('#refresh').get('value');
       }
       interval = parseInt(interval, 10) * 1000;

       if ( timer ) {
         timer.cancel();
         timer = this.timer = null;
         if ( interval <= 0 ) {
           return;
         }
       }
       timer = this.timer = Y.later( interval, list, function() { list.load(); kestrel.load() }, null, true );
    },
  
    updateKestrel : function(e) {
      var kestrel = this.get('kestrel');
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
  }, {
    ATTRS : {
      queueList : { valueFn : function() { return new Y.QueueList(); } },
      kestrel   : { valueFn : function() { return new Y.KestrelModel(); } },

      hostInput    : { valueFn : function() { return Y.one('#host'); } },
      filterInput  : { valueFn : function() { return Y.one('#filter'); } },
      refreshInput : { valueFn : function() { return Y.one('#refresh'); } },

      routes : {
        value : [
            { path : '/', callback : 'handleRoot' }
        ]
      }
    }
  });

}, '0.1.0', {
  requires : [ 'model', 'model-list' ]
});
