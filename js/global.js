YUI({
  gallery: "gallery-2012.03.23-18-00"
}).use('model', 'model-list', 'gallery-model-sync-rest', function(Y) {

    //var QueueModel, QueueList,
        
    Y.QueueModel = Y.Base.create('queueModel', Y.Model, [ ], {
    }, {
      ATTRS: {
        name          : null,
        discarded     : null,
        expired_items : null,
        get_items_hit : null,
        get_items_miss: null,
        put_bytes     : null,
        put_items     : null,
        total_flushes : null,
        total_items   : null,
        age_msec      : null,
        bytes         : null,
        create_time   : null,
        items         : null,
        journal_size  : null,
        mem_bytes     : null,
        mem_items     : null,
        open_transactions: null,
        waiters       : null
      }
    });
    
    Y.QueueList = Y.Base.create('queueModelList', Y.ModelList, [ Y.ModelSync.REST ], {
      url   : 'http://where.do.i.get.this/',
      model : Y.QueueModel,
      parse : function(response) {

        if ( !Y.Lang.isObject(response) ) {
          response = QueueList.superclass.parse.apply(this, response);
        }
        // Response is guaranteed to be an object now (or should be)
        // the superclass will call the JSON parsing.
 
        var counters = response['counters'];
        var gauges = response['gauges'];

        var results = {};

        // Grab each of the counters
        for(var key in counters) {
          if(key.substr(0, 2) == "q/") {
            
            var parts = key.split("/");
            
            if(!results.hasOwnProperty(parts[1])) {
              results[parts[1]] = {};
            }
            results[parts[1]][parts[2]] = counters[key];
          }
        }

        // Grab each of the gauges
        for(var key in gauges) {
          if(key.substr(0, 2) == "q/") {
            var parts = key.split("/");
            
            results[parts[1]][parts[2]] = gauges[key];
          }
        }
    
        return results;
      }
    });
});
