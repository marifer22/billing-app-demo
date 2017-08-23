(function (LI, $) {
  // Define private functions and variables here

  /**
   * Greet function to use as a test
   */
  var fetchBooks = function() {
    LI.global.fetchBooks({_limit:12})
      .then(LI.pages.home.renderBooks);
  };

  /**
   * LI.home namespace, for homepage exclusive logic
   */
  LI.pages.home = {
    /**
     * jQuery/DOM code here
     */
    init: function() {
      fetchBooks();
    },

    renderBooks: function(books) {
      var $mainContent = $('.main-content');
      var content = '';

      for (var i = 0; i < books.length; i++){
        var book = books[i];
        content +=
          '<div class="col-sm-4">' +
            '<div class="row product-box">' +
              '<div class="col-sm-4 product-image">' +
                '<a href="#">' +
                  '<img src="'+book.thumb+'" class="img-responsive">' +
                '</a>' +
              '</div>' +

              '<div class="col-sm-8 product-info">' +
                '<ul class="list-unstyled">' +
                  '<li class="title"><a href="#" title="'+book.title+'">' +
                    book.title +
                  '</a></li>' +
                  '<li><a href="#" title="'+book.author.name+'">'+
                    book.author.name +
                  '</a></li>' +
                  '<li><a href="#" title="'+book.category.name+'">'+
                    book.category.name +
                  '</a></li>' +
                  '<li><a href="#" title="'+book.publisher.name+'">'+
                    book.publisher.name +
                  '</a></li>' +
                  '<li>'+book.year+'</li>' +
                  '<li>₡'+book.price+'</li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
          '</div>';
      }

      $mainContent.html(content);
    }
  };
})(window.LI, jQuery);
