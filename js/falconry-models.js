YUI.add('falconry-models', function(Y) {
    var isFunction = Y.Lang.isFunction;

    Y.KestrelModel = Y.Base.create('kestrelModel', Y.Model, [ ], {
      url   : function() { return Y.one('#host').get('value'); },
      parse : function(response) {
        if ( !Y.Lang.isObject(response) ) {
          response = KestrelModel.superclass.parse.apply(this, response);

          // Response is guaranteed to be an object now (or should be)
          // the superclass will call the JSON parsing.

          var counters = response.counters;
          var gauges = response.gauges;

          var results = {};

          // Grab each of the counters
          Y.Object.each(counters, function(value, key) {
            // We want to exclude anything that has a queue marker on the
            // front, as we're not worried about those.
            if(key.substr(0, 2) != "q/") {

              results[key] = value;
            }
          });

          // Grab each of the gauges
          Y.Object.each(gauges, function(value, key) {
            if(key.substr(0, 2) != "q/") {

              // Skip these problematic names fttb
              if(key.substr(0, 7) != "kestrel") {
                results[key] = value;
              }
            }
          });

          return Y.Object.values( results );
        }
      }
    }, {
      ATTRS: {
        jvm_gc_PS_MarkSweep_cycles: null,
        jvm_gc_PS_MarkSweep_msec  : null,
        jvm_gc_PS_Scavenge_cycles : null,
        jvm_gc_PS_Scavenge_msec   : null,
        jvm_gc_cycles             : null,
        jvm_gc_msec               : null,
        queue_creates             : null,
        bytes                     : null,
        connections               : null,
        items                     : null,
        jvm_fd_count              : null,
        jvm_fd_limit              : null,
        jvm_heap_committed        : null,
        jvm_heap_max              : null,
        jvm_heap_used             : null,
        jvm_nonheap_committed     : null,
        jvm_nonheap_max           : null,
        jvm_nonheap_used          : null,
        jvm_num_cpus              : null,
        jvm_post_gc_PS_Eden_Space_used: null,
        jvm_post_gc_PS_Old_Gen_used: null,
        jvm_post_gc_PS_Perm_Gen_used: null,
        jvm_post_gc_PS_Survivor_Space_used: null,
        jvm_post_gc_used          : null,
        jvm_start_time            : null,
        jvm_thread_count          : null,
        jvm_thread_daemon_count   : null,
        jvm_thread_peak_count     : null,
        jvm_uptime                : null,
        kestrel_memcache_connections: null,
        kestrel_memcache_pending  : null,
        kestrel_text_connections  : null,
        kestrel_text_pending      : null,
        kestrel_thrift_connections: null,
        kestrel_thrift_pending    : null,
        reserved_memory_ratio     : null
      }
    });

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
      initializer: function() { this.on('filterChange', this.load, this) },
      model : Y.QueueModel,
      parse : function(response) {
        if ( !Y.Lang.isObject(response) ) {
          response = QueueList.superclass.parse.apply(this, response);
        }

        // Response is guaranteed to be an object now (or should be)
        // the superclass will call the JSON parsing.
 
        var counters = response.counters;
        var gauges = response.gauges;

        var results = {};

        var re = new RegExp(this.get("filter"));

        // Grab each of the counters
        Y.Object.each(counters, function(value, key) {
          if(key.substr(0, 2) == "q/") {
            
            var parts = key.split("/"),
                name  = parts[1];
            if(re.test(name)) {
              if(!Y.Lang.isObject( results[ parts[1] ] )) {
                results[parts[1]] = { name : parts[1] };
              }
              results[parts[1]][parts[2]] = value;
            }
          }
        });

        // Grab each of the gauges
        Y.Object.each(gauges, function(value, key) {
          if(key.substr(0, 2) == "q/") {
            
            var parts = key.split("/"),
                name  = parts[1];
            if(re.test(name)) {
              results[parts[1]][parts[2]] = value;
            }
          }
        });
        
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

        Y.jsonp(query, {
            on: {
                success : function(r){
                    if (r.error) {
                        callback(r.error, r);
                    } else {
                        callback(null, r);
                    }
                },
                failure : function(o) {
                    // Extract the individual error text and return as an array
                    callback( Y.Array.map( o.errors, function(err) { return err.error; } ), null);
                },
                timeout : function(o) {
                    callback( Y.Array.map( o.errors, function(err) { return err.error; } ), null);
                }
            }
        });
      }
    }, {
      ATTRS: {
        filter: '.*'
      }
    });
}, '0.1.0', {
  requires : [ 'model', 'model-list' ]
});


