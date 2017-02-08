var questionId;

function prepareStem(event, ui)
{

    function successHandlerFactory(questionId)
    {
        function successHandler(res, code)
        {
            console.debug(code + ": " + JSON.stringify(res));
            // check lige om indholdes er bare lidt i orden...
            if (res.error.msg == '' && res[questionId] != undefined && res[questionId].answers != undefined) {
                // fjern 'gamle' knapper'er
                $('#radio *').remove();
                var newContent = '';
                // gennemløb alle svar til spørgsmål
                for (var i in res[questionId].answers) {
                    newContent +=
                        '<label>' +
                        '<input type="radio" name="radio-choice-0" id=' + i + '>' + res[questionId].answers[i].answer +
                        '</label>';
                }
                $(newContent).appendTo("#radio")
                $('#radio').enhanceWithin();
            }
        }

        return successHandler
    }

    questionId = this.dataset.id;
    $.get
    (
        'http://grahn.dk/darup/vote.php?qid=' + questionId,
        successHandlerFactory(questionId)
    )
}



function prepareCategories(event, ui)
{
    console.log("ready to load Categories");

    $.get("http://grahn.dk/darup/vote.php",
        function(res, code) {
            console.debug(code + ": " + JSON.stringify(res));

            // check lige om indholdes er bare lidt i orden...
            if (res.error.msg == '' && res.questions != undefined)
            {
                // fjern 'gamle' knapper
                $('#kategorier a').remove();
                var newContent = '';
                // gennemløb alle sæsoner i Items
                for (var i in res.questions)
                {
                    // lav en ny "knap" for hver sæson
                    // <a href="#episodes" data-role="button" data-slug="">Sæson 1</a>
                    newContent += '<a href="#stem" data-role="button" data-id="'+i+'">' + res.questions[i] + '</a>';
                }
                // tilføj knapperne til DOM'en

                $(newContent).appendTo('#kategorier');
                // lad JQM forbedre htmlen
                $('#kategorier').enhanceWithin();
                // tilføj event handler til hver knap
                $('#kategorier a').one('click', prepareStem);
            }

        }
    )
}

$(document).ready( // når siden er loaded
    function(){
        var pageContainer = $("body").pagecontainer({
            beforeshow:
                function( event, ui){
                    //hvilken side er vi ved at vise
                    console.log("beforeshow: " + ui.toPage[0].id);

                    switch(ui.toPage[0].id) {
                        case "kategorier":
                            prepareCategories(event, ui);
                            break;

                        case "stem":
                            // debug mockUp
                            questionId = 2;
                            break;

                        case "forside":
                            break;
                    }
                }
        })
    }
);
