var
filter    = (window.location.search.match(/[?&]filter=([^&]+)/) || [])[1] || 'min',
YUI_config = {
  filter : filter,
  groups : {
    falconry : {
      combine  : false,
      base     : 'js/',
      root     : 'js/',
      filter   : 'raw',
      modules  : {
        'falconry-models' : {
          path : 'falconry-models.js',
          requires : [ 'model', 'model-list', 'jsonp', 'jsonp-url' ]
        },
        'falconry' : {
          path : 'app.js',
          requires : [ 'app', 'falconry-models', 'datasource', 'datatable-base', 'datatable-sort', 'event-valuechange' ]
        }
      }
    }
  }
};
