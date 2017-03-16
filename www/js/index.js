var questionId;

function prepareStem(event, ui)
{

    function successHandlerFactory(questionId)
    {
        function successHandler(res, code)
        {
            console.debug(code + ": " + JSON.stringify(res));
            // check lige om indholdes er bare lidt i orden...
            if (res.error.msg == '' && res[questionId] != undefined && res[questionId].answers != undefined)
            {
                // fjern 'gamle' knapper'er
                $('#radio *').remove();
                var newContent = '';
                // gennemløb alle svar til spørgsmål
                for (var i in res[questionId].answers)
                {
                    newContent +=
                        '<label>' +
                        '<input type="radio" name="radio_choice" value="' + i +'">' + res[questionId].answers[i].answer +
                        '</label>';
                }
                $(newContent).appendTo("#radio");
                $('#radio').enhanceWithin();

                $('#radio input[type="radio"]').one
                ('click', function()
                {
                    answerID = this.value;
                });


                $('#stemKnap').one('click', function()
                {
                    // indsamle alle data
                    var postData = {};
                    postData['action']              = 'polls';
                    postData['view']                = 'process';
                    postData['poll_id']             = questionId;
                    postData['poll_' + questionId]  = answerID;
                    postData['poll_' + questionId + '_nonce']  = res['poll_' + questionId + '_nonce']

                    // send request
                    /// min postData: {"action":"poll","view":"process","poll_id":2,"poll_2":"10","poll_2_nonce":"ef888dbe6c"}
                    /// din postData: {"action":"polls","view":"process","poll_id":"2","poll_2":"8","poll_2_nonce":"ef888dbe6c"}
                    $.post('http://grahn.dk/darup/wp-admin/admin-ajax.php', postData,
                        function(returnData, code)
                        {
                            console.log('Du har stemt');
                            console.log('postData: ' + JSON.stringify(postData));
                            console.log(code + ': ' + returnData);
                            // henvise til resultat
                            //$('#resultater')[0].innerHTML = returnData;


                            // Load the Visualization API and the corechart package.
                            google.charts.load('current', {'packages':['corechart']});

                            // Set a callback to run when the Google Visualization API is loaded.
                            google.charts.setOnLoadCallback(drawChart);

                            // Callback that creates and populates a data table,
                            // instantiates the pie chart, passes in the data and
                            // draws it.

                            function drawChart()
                            {
                                var And = [];
                                $.get
                                (
                                    "http://grahn.dk/darup/vote.php?qid=" + questionId,
                                    function(res, code)
                                    {

                                        for (var i in res[questionId].answers)
                                        {
                                            //And [i]= res[questionId].answers[i].answer
                                            And[And.length] =  [ res[questionId].answers[i].answer, parseInt(res[questionId].answers[i].votes) ];
                                        }

                                        // Create the data table.
                                        var data = new google.visualization.DataTable();
                                        data.addColumn('string', 'svar');
                                        data.addColumn('number', 'stemmer');
                                        data.addRows(And);



                                        // Set chart options
                                        var options =
                                            {
                                                'title':res[questionId].question,
                                                //'width':300,
                                                //'height':500
                                                is3D: true
                                                //backgroundColor.fill: "#189adb"
                                            };

                                        // Instantiate and draw our chart, passing in some options.
                                        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
                                        chart.draw(data, options);

                                    }
                                );
                            }
                            //drawChart();
                        }
                    ).fail
                    (
                        function (returnData, code)
                    {
                        console.log('Det virkede ikke')
                        console.log(code + ': ' + returnData);
                    })
                });
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

var zoomLevel = 0.5;
function zoomIn()
{
    if (zoomLevel < 2)
    {
        zoomLevel = zoomLevel + 0.1;
        zoomLevel = Math.round(zoomLevel * 100) / 100;
        document.getElementById("kortIma").style.transform = "scale(" + zoomLevel + ")";
        console.log(zoomLevel)
    }
}

/*$(document).ready
(function(){
    var mc = new Hammer(document.getElementById('kortIma'));
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    mc.on('pan', function(ev) {
        //console.log(ev);
    });

    mc.on('pinch', function(ev) {
        console.log(ev);
    });
})
**/
function zoomOut()
{
    if(zoomLevel > 0.5)
    {
        zoomLevel = zoomLevel - 0.1;
        zoomLevel = Math.round(zoomLevel * 100) / 100;
        document.getElementById("kortIma").style.transform = "scale(" + zoomLevel + ")";
        console.log(zoomLevel)
    }
}

//$(document).ready
//(
    function geoPos()
    {
        window.setInterval(function()
        {
            if (navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(function (position)
                {
                    //var pos = {
                    //lat: position.coords.latitude,
                    //lng: position.coords.longitude
                    //};
                    console.log(position.coords.latitude);
                    console.log(position.coords.longitude);
                    geo(position.coords.longitude, position.coords.latitude);
                    //infoWindow.setPosition(pos);
                    //infoWindow.setContent('Location found.');
                    //map.setCenter(pos);
                },
                function ()
                {
                    handleLocationError(true, map.getCenter());
                });
            }
            else
            {
                // Browser doesn't support Geolocation
                handleLocationError(false, map.getCenter());
            }
        }, 1000);
    }
//);

function handleLocationError()
{}

//var dinX = 12.525;
//var dinY = 56.2;

function geo(dinX, dinY)
{
    $('#DOT').remove();

    // transponerer koordinater fra TEC til parken
    //    dinX += 0.0045873;
    //    dinY -= 0.0071285;

    a = 1576 / (12.532064 - 12.518360);
    pX = (dinX - 12.518360) * a;

    b = -(1374 / (56.621368 - 55.678093));
    pY = (dinY - 55.678093) * b;
    //pY = (dinY - 56.621368) * b;

    console.log(pX);
    console.log(pY);
    //newContent = '<area shape="circle" coords="' +  pX + "," + pY + "," + 2000 + '"href=#dig" alt="dig">';
    newContent = '<img src="/ima/locator.png" id="DOT" style="z-index: 50; position:absolute; opacity: 0.8;  left:' + (pX - 25) + "px" + '; top:' + (pY - 25) + "px" + '; width:50px; height:50px;">';

    console.log(newContent);
    $(newContent).appendTo('#kortIma');
    // lad JQM forbedre htmlen
    $('#kortIma').enhanceWithin();

}
new Date($.now());
var dt = new Date();
var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

var sceneVal;


function prepareScene(event, ui)
{
    var dateTimeNow = new Date();
    $.get
    (
        "http://grahn.dk/darup/wp-json/ee/v4.8.36/events" +
        "?include=Venue&where[Venue.VNU_name]=" + encodeURI(sceneVal) +
        "&include=Datetime&where[Datetime.DTT_EVT_end][]=%3E&where[Datetime.DTT_EVT_end][]=" + dateTimeNow.toISOString()
        //"2017-04-01T18:45:14"
        //Voksen%20Scenen
        , function (res, code)
        {
            $("#scene *").remove();
            if(res.length > 0)
            {
                var newContent = "<div id='program'><table width='100%'>";
                for(var i in res)
                {
                    var start = new Date(res[i].datetimes[0].DTT_EVT_start);
                    newContent += '<tr><td><h1>' + res[i].EVT_name + '</h1></td><td style="text-align: right"><h2>' + start.getHours() + ":" + start.getMinutes() + '</h2></td></tr>';
                }
                newContent += "</table></div>";
                $(newContent).appendTo('#scene');
                // lad JQM forbedre htmlen
                $('#scene').enhanceWithin();
            }
            console.log('SceneData: ' + JSON.stringify(res));
            console.log(res[0].EVT_name)
            var start = new Date(res[0].datetimes[0].DTT_EVT_start);
            console.log("Kl " + start.getHours() + ":" + start.getMinutes())
            console.log("iso Kl " + start.toISOString())
            console.log("utc Kl " + start.toUTCString())
            console.log("lokal Kl " + start.toLocaleTimeString())
        }
    )
}

// når siden er loaded
$(document).ready
(
    function()
    {

        var pageContainer = $("body").pagecontainer
        ({
            beforeshow:

                function( event, ui)
                {
                    //hvilken side er vi ved at vise
                    console.log("beforeshow: " + ui.toPage[0].id);
                    switch(ui.toPage[0].id)
                    {
                        case "kategorier":
                            prepareCategories(event, ui);
                            break;

                        case "stem":
                            break;

                        case "forside":
                            break;

                        case "pladsKort":
                            geoPos();
                            //console.log(pX);
                            //console.log(pY);

                            document.getElementById("kortIma").style.transform = "scale(" + zoomLevel + ")";

                            $('#zoomIn').on('click', zoomIn);

                            $('#zoomOut').on('click', zoomOut);

                            //$("#container").scrollTo({left:"500px", top:"500px"});
                            $("#container").scrollTo(500, 600);
                            //window.scrollTo(500, 500);

                            console.log("scrolled?");

                            break;
                        case "scene":
                            prepareScene(event, ui);
                            break;
                    }
                }
        })
    }
);