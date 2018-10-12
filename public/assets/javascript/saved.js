$(document).ready(function(){
    var articleContainer = $(".article-container");

    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn-note", handleArticleNotes);
    $(document).on("click", ".btn-save", handleNoteSave);
    $(document).on("click", ".btn-delete", handleNoteDelete);

    initPage();

    function initPage() {
        articleContainer.empty();
        $.getJSON("/api/headlines?saved=true").then(function(data){
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

        for (var i = 0; i < articles.length; i++){
            articleCards.push(createArticleDiv(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    function createArticleDiv(article){
        var savedArticleDiv = 
            $([
                "<div class='card'>",
                "<div class='card-body'>",
                "<div class='card-title'>",
                "<h6>",
                "<a href='" + article.link + "'>",
                article.headline,
                "</a>",
                "<button type='button' class='btn btn-sm btn-warning btn-note' data-toggle='modal' data-target='#myModal'>", 
                "Add Note",
                "</button>",
                "</h6>",
                "</div>",
                "<div class='card-text'>","<p>",
                article.summary,"</p>",
                "</div>",
                "</div>",
                "</div>"
        ].join(""));
    savedArticleDiv.data("_id", article._id);
    return savedArticleDiv;
    }
    function renderEmpty(){
        var emptyAlert =
            $([
                "<div class='alert text-center'>",
                "<h5='UH OH'></h5>",
                "<div class='card-body'>",
                "<h3>No saved articles. Would you like to browse articles?</h3>",
                "<h4><a class='btn-sm btn-warning scrape-new'></a></h4>",
                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        articleContainer.append(emptyAlert);
    }
    function renderNotesList(data){
        var notesToRender = {};
        var currentNote;
        if(!data.notes.length){
            currentNote = [
                "<li class='list-group-item'>",
                "No notes exist yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            for (var i = 0; i < data.notes.length; i++){
                currentNote = $[
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-warning note-delete'></button>",
                    "</li>"
                ].join("");
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
        var articleToDelete = $(this).children(".card").data();
        articleToSave.saved = true;

        $.ajax({
            method: "DELETE",
            url: "/api/headlines" + articleToDelete._id,
        })
        .then(function(data){
            if(data.ok) {
                initPage();
            }
        });
        
    }
    
    function handleArticleNotes() {
        var currentArticle = $(this).attr("_id").data();
        $.get("/api/notes/" + currentArticle._id).then(function(data){
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h3>Article Notes: ",
                currentArticle._id,
                "</h3>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-warning save'></button>",
                "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            $(".btn-save").data("article", noteData);
            renderNotesList(noteData);
        })  
    }
    function handleNoteSave(){
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if(newNote) {
            noteData = {
                _id: $(this).data("article").id,
                noteText:newNote
            };
            $.post("/api/notes", noteData).then(function(){
                bootbox.hideAll();
            });
        }
    }
    function handleNoteDelete(){
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function(){
            bootbox.hideAll();
        });
    }

})