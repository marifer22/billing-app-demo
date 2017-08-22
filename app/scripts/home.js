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
      LI.pages.home.fetchBooks();
    },

    /**
     * Greet function to use as a test
     */
    fetchBooks: function() {
      LI.global.fetchBooks(function(books) {
        for (var book = 0; book < books.length; book++){
          $('.main-content').append(
            '<div class="col-sm-4"> <div class="row product-box"> <div class="col-sm-4 product-image"> <a href="#"> <img src="'+books[book].thumb+'" class="img-responsive"> </a> </div> <div class="col-sm-8 product-info"> <ul class="list-unstyled"> <li><a href="#">'+books[book].title+'</li> <li><a href="#">'+books[book].author.name+'</a></li> <li><a href="#">'+books[book].category.name+'</a></li> <li><a href="#">'+books[book].publisher.name+'</a></li> <li>'+books[book].year+'</li> <li> ₡'+books[book].price+'</li> </ul> </div> </div> </div>'
          )
        }
      });
    }
  };
})(window.LI, jQuery);
