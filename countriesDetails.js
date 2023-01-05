// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Countries/');
    self.displayName = 'Country Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.IOC = ko.observable('');
    self.Flag = ko.observable('');
    self.Events = ko.observableArray([])
    self.Participant = ko.observableArray([])
    self.Organizer = ko.observableArray([])
    self.Url = ko.observable('');
    self.Total = ko.observable('');
    self.isIn = ko.observable(true);

    self.maps = ko.observable('https://www.google.com/maps/embed/v1/place?key=AIzaSyCGZ9XevhvCQFZMLeg9Cj9tZ7fSSIp1lFc&q=');
    self.fonte = ko.computed(function () {
        return self.maps() + self.Name() + ',' + self.IOC();
});

    self.EventsOpen = ko.observable(50);
    self.EventsToggleMore = function () {
        self.EventsOpen(self.EventsOpen()+50)
        if (self.EventsOpen() > self.Events().length) {
            self.EventsOpen(self.Events().length)
        }
        console.log(self.EventsOpen())

    }

    self.EventsToggleLess = function () {
        self.EventsOpen(self.EventsOpen()-50)
        if (self.EventsOpen() < 50) {
            self.EventsOpen(50)
        }
        console.log(self.EventsOpen())

    }

    self.EventsButtonMore = ko.computed(() => self.Events().length > 50 && self.EventsOpen() != self.Events().length);
    self.EventsButtonLess = ko.computed(() => self.EventsOpen() > 50);
    self.EventsEntries = ko.computed(function () {
       
            return self.Events().slice(0, self.EventsOpen());
    });

    self.ParticipantOpen = ko.observable(18);
    self.ParticipantToggleMore = function () {
        self.ParticipantOpen(self.ParticipantOpen()+18)
        if (self.ParticipantOpen() > self.Participant().length) {
            self.ParticipantOpen(self.Participant().length)
        }
        console.log(self.ParticipantOpen())

    }

    self.ParticipantToggleLess = function () {
        self.ParticipantOpen(self.ParticipantOpen()-18)
        if (self.ParticipantOpen() < 18) {
            self.ParticipantOpen(18)
        }
        console.log(self.ParticipantOpen())

    }

    self.ParticipantButtonMore = ko.computed(() => self.Participant().length > 18 && self.ParticipantOpen() != self.Participant().length);
    self.ParticipantButtonLess = ko.computed(() => self.ParticipantOpen() > 18);
    self.ParticipantEntries = ko.computed(function () {
       
            return self.Participant().slice(0, self.ParticipantOpen());
    });

    self.favsdata = {
        athletes: [],
        competitions: [],
        countries: [],
        games: [],
        modalities: [],
    }

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getCountry...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.IOC(data.IOC);
            self.Flag(data.Flag);
            self.Events(data.Events);
            self.Participant(data.Participant);
            self.Organizer(data.Organizer);
            self.updateheart(data.Id, 'countries');
        });
    };

    self.init = function() {
        for (let k in self.favsdata) {
            if (localStorage.getItem(k) != undefined) {
                self.favsdata[k] = JSON.parse(localStorage.getItem(k))
            } else {
                self.favsdata[k] = []
            }
        }
    }

    self.updateLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
        console.log(data)
    }

    self.updatefavsdata = function(id, name) {
        console.log(self.favsdata.name)
        if (self.favsdata[name].includes(String(id)) == false) {
            self.favsdata[name].push(String(id))
            self.updateLocalStorage(name, self.favsdata[name])
        } else {
            //Remover
            self.favsdata[name].splice(self.favsdata[name].indexOf(String(id)), 1)
            self.updateLocalStorage(name, self.favsdata[name])
        }
        self.updateheart(id, name)
    }

    self.updateheart = function(id, name){
        console.log(self.favsdata[name].includes(String(id)))
        if (self.favsdata[name].includes(String(id)) == true) {
            $('#favs-button').css({"color": "lightskyblue"})
        } else {
            $('#favs-button').css({"color": "rgb(150,150,150)"})
    }}

    $.ajax({
        type: "GET",
        url: "http://192.168.160.58/Olympics/api/Statistics/Medals_Country",
        dataType: "json",
        success: function (data) {
            var IdCounter = []; // array do tipo [CountryId, [Gold, Counter],[Silver, Counter], [Bronze, Counter]]
            
            for (i = 0; i < data.length; i++) {
                IdCounter.push([data[i].CountryId]);
                for (i2 = 0; i2 < data[i].Medals.length; i2++) {
                    IdCounter[i].push([data[i].Medals[i2].MedalName, data[i].Medals[i2].Counter]);
                }     
            }    
            console.log(IdCounter);
            
            google.charts.load("current", { packages: ["corechart"] });
            google.charts.setOnLoadCallback(drawChart);
    
            function drawChart() {
                for (i = 0; i < IdCounter.length; i++) {
                    if (IdCounter[i].includes(self.Id()) & IdCounter[i][0] == self.Id()) {
                        self.isIn(true);
                        console.log(IdCounter[i]);
                        var data = google.visualization.arrayToDataTable([
                            ["MedalName", "Counter"],
                            [IdCounter[i][1][0], IdCounter[i][1][1]],
                            [IdCounter[i][2][0], IdCounter[i][2][1]],
                            [IdCounter[i][3][0], IdCounter[i][3][1]],
                        ]);
                        
                        var options = {
                            title: "Divisão entre Ouro/Prata/Bronze",
                            titleTextStyle: {color: 'lightgrey'},
                            legend: {position: 'left', textStyle: {color: 'lightgrey', fontSize: 16}},
                            is3D: true,
                            colors: ['gold', 'silver', '#cd7f32' ],

                            backgroundColor: '#010615',
                            
                        };
                        
                        var chart = new google.visualization.PieChart(
                            document.getElementById("chart")
                            );
                            
                        self.Total(IdCounter[i][1][1] + IdCounter[i][2][1] + IdCounter[i][3][1]);
                        console.log(self.Total());
                            
                        chart.draw(data, options);
                        break;
                    }
                    else {
                        self.isIn(false);
                    }
                }
            }
           
        },
        error: function () {
            alert("ERRO");
            hideLoading();
        },
    });

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    self.init();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})