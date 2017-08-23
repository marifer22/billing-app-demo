/**
 * Initialize the global LI (libreria internacional) namespace
 */
window.LI = {
  pages: {}
};

(function (LI, $) {
  // Define private functions and variables here
  var $search;

  var onSearch = function(e) {
    // Enter = 13
    var searchTerm = $search.val();

    if (e.keyCode === 13 && searchTerm) {
      var search = {q: searchTerm};

      $.when(
        LI.global.fetchBooks(search),
        LI.global.fetchAuthors(search),
        LI.global.fetchPublishers(search),
        LI.global.fetchCategories(search)
      )
        .then(function (booksResult, authorsResult, publishersResult, categoriesResult) {
          var books = booksResult[0];
          var authors = authorsResult[0].length ? authorsResult[0] : [{id: 0}];
          var publishers = publishersResult[0].length ? publishersResult[0] : [{id: 0}];
          var categories = categoriesResult[0].length ? categoriesResult[0] : [{id: 0}];

          return $.when(
            books,
            LI.global.fetchAuthorBooks(authors[0].id, {}),
            LI.global.fetchPublisherBooks(publishers[0].id, {}),
            LI.global.fetchCategoryBooks(categories[0].id, {})
          );
        })
        .then(function (books, authorBooksResult, publisherBooksResult, categoryBooksResult) {
          var authorBooks = authorBooksResult[0];
          var publisherBooks = publisherBooksResult[0];
          var categoryBooks = categoryBooksResult[0];

          var finalBooks = books
            // Join all book results
            .concat(authorBooks, publisherBooks, categoryBooks)
            // Filter books to remove duplicates
            .filter(function (book, index, arr) {
              var itemsBeforeThis = arr.slice(0, index);
              var isDuplicate = itemsBeforeThis.some(function (item) {
                return book.id === item.id;
              });

              return !isDuplicate;
            });

          LI.pages.home.renderBooks(finalBooks);
        });
    }
  };

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

      $search = $('#search');

      $search.on('keypress', onSearch);
    },

    fetch: function(path, callback) {
      var ajax = $.ajax(LI.global.baseApi + '/' + path);

      ajax.done(function (data) {
        console.log(data);

        if (callback) {
          callback(data);
        }
      });

      return ajax.promise();
    },

    /**
     * Example:
     * LI.global.fetchBooks({}, callback);
     * LI.global.fetchBooks({_limit: 12}, callback);
     * LI.global.fetchBooks({q: 'do some search'}, callback);
     */
    fetchBooks: function(params, callback) {
      var query = LI.global.paramsToQuery(params);

      return LI.global.fetch(
        'books?_expand=author&_expand=category&_expand=publisher&' + query,
        callback
      );
    },

    fetchAuthors: function(params, callback) {
      var query = LI.global.paramsToQuery(params);

      return LI.global.fetch('authors?' + query, callback);
    },

    fetchAuthorBooks: function(authorId, params, callback) {
      var query = LI.global.paramsToQuery(params);

      return LI.global.fetch('author/' + authorId + '/books?_expand=author&_expand=category&_expand=publisher&' + query, callback);
    },

    fetchPublishers: function(params, callback) {
      var query = LI.global.paramsToQuery(params);

      return LI.global.fetch('publishers?' + query, callback);
    },

    fetchPublisherBooks: function(authorId, params, callback) {
      var query = LI.global.paramsToQuery(params);

      return LI.global.fetch('publisher/' + authorId + '/books?_expand=author&_expand=category&_expand=publisher&' + query, callback);
    },

    fetchCategories: function(params, callback) {
      var query = LI.global.paramsToQuery(params);

      return LI.global.fetch('categories?' + query, callback);
    },

    fetchCategoryBooks: function(authorId, params, callback) {
      var query = LI.global.paramsToQuery(params);

      return LI.global.fetch('category/' + authorId + '/books?_expand=author&_expand=category&_expand=publisher&' + query, callback);
    },

    smallName: function(product, length) {
      return product.slice(0, length - 3) + '...';
    },

    paramsToQuery: function(params) {
      return Object.keys(params).map(function(key){
        return key + '=' + params[key];
      }).join('&');
    }
  };

  $(LI.global.init);
})(window.LI, jQuery);

