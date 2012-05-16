var YUI_config = {
  gallery: "gallery-2012.03.23-18-00",
  groups : {
    falconry : {
      combine  : false,
      base     : '../js/',
      root     : '../js/',
      filter   : 'raw',
      modules  : {
        'falconry-models' : {
          path : 'falconry-models.js',
          requires : [ 'model', 'model-list', 'gallery-model-sync-rest' ]
        }
      }
    }
  }
};
