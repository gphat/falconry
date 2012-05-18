YUI.add('falconry-models', function(Y) {
    var isFunction = Y.Lang.isFunction;

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
    
    Y.QueueList = Y.Base.create('queueModelList', Y.ModelList, [], {
      url   : function() { return Y.one('#host').get('value'); },
      model : Y.QueueModel,
      parse : function(response) {
        if ( !Y.Lang.isObject(response) ) {
          response = QueueList.superclass.parse.apply(this, response);
        }

        // Response is guaranteed to be an object now (or should be)
        // the superclass will call the JSON parsing.
 
        var counters = response.counters;
        var gauges = response.gauges;

        Y.log(response);
        var results = {};

        // Grab each of the counters
        for(var key in counters) {
          if(key.substr(0, 2) == "q/") {
            
            var parts = key.split("/");
            
            if(!Y.Lang.isObject( results[ parts[1] ] )) {
              results[parts[1]] = { name : parts[1] };
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
        
        Y.log(results);
    
        return Y.Object.values( results );
      },

      buildQuery : function(options) {
        // I presume this is `filtered by`.
        return this.url();
      },

      sync : function (action, options, callback) {
        isFunction(callback) || (callback = noop);
        // Only read is supported.
        if (action !== 'read') {
            // TODO: return some error dingus here.
            return callback(null);
        }

        var query   = this.buildQuery(options);

        Y.jsonp(query, function(r){
            if (r.error) {
                callback(r.error, r);
            } else {
                callback(null, r);
            }
        });
      }
    });
}, '0.1.0', {
  requires : [ 'model', 'model-list' ]
});


