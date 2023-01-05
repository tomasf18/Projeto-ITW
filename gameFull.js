// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Games/FullDetails?id=');
    self.displayName = 'Olympic Games edition Full Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.CountryName = ko.observable('');
    self.Season = ko.observable('');
    self.Year = ko.observableArray('');
    self.City = ko.observable('');
    self.Logo = ko.observable('');
    self.Photo = ko.observable('');
    self.Athletes = ko.observableArray([]);
    self.Modalities = ko.observableArray([]);
    self.Competitions = ko.observableArray([]);
    self.Medals = ko.observableArray([]);
    self.Url = ko.observable('');

    self.CompetitionsOpen = ko.observable(50);
    self.CompetitionsToggleMore = function () {
        self.CompetitionsOpen(self.CompetitionsOpen()+50)
        if (self.CompetitionsOpen() > self.Competitions().length) {
            self.CompetitionsOpen(self.Competitions().length)
        }
        console.log(self.CompetitionsOpen())

    }

    self.CompetitionsToggleLess = function () {
        self.CompetitionsOpen(self.CompetitionsOpen()-50)
        if (self.CompetitionsOpen() < 50) {
            self.CompetitionsOpen(50)
        }
        console.log(self.CompetitionsOpen())

    }

    self.CompetitionsButtonMore = ko.computed(() => self.Competitions().length > 50 && self.CompetitionsOpen() != self.Competitions().length);
    self.CompetitionsButtonLess = ko.computed(() => self.CompetitionsOpen() > 50);
    self.CompetitionsEntries = ko.computed(function () {
       
            return self.Competitions().slice(0, self.CompetitionsOpen());
    });

    self.AthletesOpen = ko.observable(18);
    self.AthletesToggleMore = function () {
        self.AthletesOpen(self.AthletesOpen()+18)
        if (self.AthletesOpen() > self.Athletes().length) {
            self.AthletesOpen(self.Athletes().length)
        }
        console.log(self.AthletesOpen())

    }

    self.AthletesToggleLess = function () {
        self.AthletesOpen(self.AthletesOpen()-18)
        if (self.AthletesOpen() < 18) {
            self.AthletesOpen(18)
        }
        console.log(self.AthletesOpen())

    }

    self.AthletesButtonMore = ko.computed(() => self.Athletes().length > 18 && self.AthletesOpen() != self.Athletes().length);
    self.AthletesButtonLess = ko.computed(() => self.AthletesOpen() > 18);
    self.AthletesEntries = ko.computed(function () {
       
            return self.Athletes().slice(0, self.AthletesOpen());
    });

    

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getGame...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.CountryName(data.CountryName);
            self.Name(data.Name);
            self.Year(data.Year);
            self.Season(data.Season);
            self.City(data.City);
            self.Logo(data.Logo);
            self.Photo(data.Photo);
            self.Athletes(data.Athletes);
            self.Modalities(data.Modalities);
            self.Medals(data.Medals)
            self.Competitions(data.Competitions);            
            
            // gráfico
            $.ajax({
                type: "GET",
                url: 'http://192.168.160.58/Olympics/api/Statistics/Medals_Country',
                data: {
                    id: self.Id(),
                },
                dataType: "json",

                success: function (data) {
                    console.log(data);
                    var NameCounter = []; // array do tipo [CountryId, [Gold, Counter],[Silver, Counter], [Bronze, Counter]]
                  
                    for (i = 0; i < data.length; i++) {
                        NameCounter.push([data[i].CountryName]);
                        for (i2 = 0; i2 < data[i].Medals.length; i2++) {
                            NameCounter[i].push([data[i].Medals[i2].MedalName, data[i].Medals[i2].Counter]);
                        }     
                    }  
                      
                    console.log(NameCounter);

                    var data0 = [["Country", "Gold", "Silver","Bronze"]];
                    for (i = 0; i < NameCounter.length; i++) {
                        data0.push([NameCounter[i][0], NameCounter[i][1][1], NameCounter[i][2][1], NameCounter[i][3][1]])
                    } 
                    console.log(data0)


                    google.charts.load('current', {'packages':['bar']});
                    google.charts.setOnLoadCallback(drawChart);
            
                    function drawChart() {
                        var data = google.visualization.arrayToDataTable(data0);
                        

                        var options = {
                            chart: {
                                title: 'Number of Medals per Country',
                                subtitle: 'Present Edition',
                            },
                            colors: ['gold', 'silver', '#cd7f32' ],
                            bars: "horizontal",
                            width: 1000,
                            height: 5000,
                            axes: {
                                x: {
                                    0: { side: "left", label: "Medals Counter" }, // Top x-axis.
                                },
                                y: {
                                    0: { side: "left", label: "Countries" },
                                }
                            },
                            chartArea: {
                                backgroundColor: '#010615'
                            },
                            backgroundColor: '#010615',
                        };

                        var chart = new google.charts.Bar(document.getElementById('chart'));
                        chart.draw(data, google.charts.Bar.convertOptions(options));
                    }
                   
                },
                error: function () {
                    alert("ERRO");
                    hideLoading();
                },
            });

            // obter IOC's - ainda sem efeito no site
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/Olympics/api/Countries?page=1&pageSize=240",
                dataType: "json",
                success: function (data) {
                    var ioc = [];
                    for (i = 0; i < data.Records.length; i++) {
                        ioc.push(data.Records[i].IOC);
                    }
                    console.log(ioc);
                },
                error: function () {
                    alert("ERRO");
                    hideLoading();
                },
            });
            
            
        });
    };

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