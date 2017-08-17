(function (LI, $) {
  // Define private functions and variables here

  /**
   * LI.home namespace, for homepage exclusive logic
   */
  LI.pages.home = {
    /**
     * jQuery/DOM code here
     */
    init: function() {
      // Example on how to call a function
      LI.pages.home.greet();
    },

    /**
     * Greet function to use as a test
     */
    greet: function() {
      console.log('Hello from the home page');
    }
  };
})(window.LI, jQuery);
