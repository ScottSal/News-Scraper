$(document).on("click", ".btn-save", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
  
    $.ajax({
      method: "PUT",
      url: "/saved/" + thisId,
     
    })
    
    .done(function(data) {
        console.log(data);
    });
  });
  
  
  $(document).ready(function() {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn-save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
  
    initPage();
  
    function initPage() {
      articleContainer.empty();
      $.get("/api/headlines?saved=false").then(function(data) {
        if (data && data.length) {
          renderArticles(data);
        }
        else {
          renderEmpty();
        }
      });
    }
  
    function renderArticles(articles) {
      var articleCards = [];
      for (var i = 0; i < articles.length; i++) {
        articleCards.push(createArticleDiv(articles[i]));
      }
      articleContainer.append(articleCards);
    }
  
    function createArticleDiv(article) {
      var articleDiv = $(
        [
          "<div class='card'>",
          "<div class='card-body'>",
          "<div class='card-title'>",
          "<h6>",
          "<a href='" + article.url + "'>",
          article.headline,
          "</a>",
          "<a class='btn btn-sm btn-warning btn-save'>",
          "Save Article",
          "</a>",
          "</h6>",
          "</div>",
          "<div class='card-text'>","<p>",
          article.summary,"</p>",
          "</div>",
          "</div>",
          "</div>"
        ].join("")
      );
      
      articleDiv.data("_id", article._id);
      return articleDiv;
    }
  
    function renderEmpty() {
      var emptyAlert = $(
        [
          "<div class='alert text-center'>",
          "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
          "</div>",
          "<div class='card'>",
          "<div class='card-header text-center'>",
          "<h3>What Would You Like To Do?</h3>",
          "</div>",
          "<div class='card-body text-center'>",
          "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
          "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
          "</div>",
          "</div>"
        ].join("")
      );
      articleContainer.append(emptyAlert);
    }
  
    function handleArticleSave() {
      var articleToSave = $(".card").data();
      articleToSave.saved = true;
      $.ajax({
        method: "PUT",
        url: "/api/headlines",
        data: articleToSave
      }).then(function(data) {
        if (data.ok) {
          initPage();
        }
      });
    }
  
    function handleArticleScrape() {
      $.get("/api/fetch").then(function(data) {
        initPage();
        bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
      });
    }
  });