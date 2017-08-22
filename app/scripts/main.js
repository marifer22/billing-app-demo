/**
 * Initialize the global LI (libreria internacional) namespace
 */
window.LI = {
  pages: {}
};

(function (LI, $) {
  // Define private functions and variables here

  /**
   * LI.global namespace, for global logic avaialbe in the whole app
   */
  LI.global = {
    baseApi: 'http://localhost:3002',

    /**
     * jQuery/DOM code here
     */
    init: function() {
      for (var page in LI.pages) {
        LI.pages[page].init();
      }
    },

    fetchBooks: function(callback) {
      $.ajax(LI.global.baseApi + '/books?_expand=author&_expand=category&_expand=publisher&&_limit=12')
        .done(function (data) {
          console.log(data);

          if (callback) {
            callback(data);
          }
        });
    },

    smallName: function(product, length) {
      return product.slice(0, length - 3) + '...';
    },
  };

  $(LI.global.init);
})(window.LI, jQuery);

