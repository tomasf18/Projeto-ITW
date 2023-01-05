// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Games/');
    self.displayName = 'Olympic Games edition Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.CountryName = ko.observable('');
    self.Logo = ko.observable('');
    self.Name = ko.observable('');
    self.Photo = ko.observable('');
    self.Season = ko.observable('');
    self.Year = ko.observableArray('');
    self.Url = ko.observable('');

    self.favsdata = {
        athletes: [],
        competitions: [],
        countries: [],
        games: [],
        modalities: [],
    }

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getGame...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.CountryName(data.CountryName);
            self.Logo(data.Logo);
            self.Name(data.Name);
            self.Photo(data.Photo);
            self.Season(data.Season);
            self.Year(data.Year);
            self.updateheart(data.Id, 'games');
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