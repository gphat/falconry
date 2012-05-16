var YUI_config = {
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
        }
      }
    }
  }
};
