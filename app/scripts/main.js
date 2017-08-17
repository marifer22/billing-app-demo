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
    baseApi: 'http://localhost:3001',

    /**
     * jQuery/DOM code here
     */
    init: function() {
      for (var page in LI.pages) {
        LI.pages[page].init();
      }
    }
  };

  $(LI.global.init);
})(window.LI, jQuery);
