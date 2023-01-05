var vm = function() {
    var self = this

    self.favsdata = {
        athletes: [],
        competitions: [],
        countries: [],
        games: [],
        modalities: [],
    }

    self.athletesdata = ko.observableArray()
    self.competitionsdata = ko.observableArray()
    self.countriesdata = ko.observableArray()
    self.gamesdata = ko.observableArray()
    self.modalitiesdata = ko.observableArray()

    self.updateLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
        console.log(data)
    }


    self.loadData = function(array) {
        let temp = []
        for (e in array) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/Olympics/api/Athletes/Athlete?id=" + array[e],
                async: false,
                success: function(data) {
                    temp.push(data)
                        console.log(data)
                }
            });
        }
        return temp
    }

    self.loadData1 = function(array) {
        let temp = []
        for (e in array) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/Olympics/api/Competitions/Competition?id=" + array[e],
                async: false,
                success: function(data) {
                    temp.push(data)
                        console.log(data)
                }
            });
        }
        return temp
    }

    self.loadData2 = function(array) {
        let temp = []
        for (e in array) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/Olympics/api/Countries/Country?id=" + array[e],
                async: false,
                success: function(data) {
                    temp.push(data)
                        console.log(data)
                }
            });
        }
        return temp
    }

    self.loadData3 = function(array) {
        let temp = []
        for (e in array) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/Olympics/api/Games/Game?id=" + array[e],
                async: false,
                success: function(data) {
                    temp.push(data)
                        console.log(data)
                }
            });
        }
        return temp
    }

    self.loadData4 = function(array) {
        let temp = []
        for (e in array) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/Olympics/api/Modalities/Modality?id=" + array[e],
                async: false,
                success: function(data) {
                    temp.push(data)
                        console.log(data)
                }
            });
        }
        return temp
    }


    self.updatefavsdata = function(id, name) {
        if (self.favsdata[name].includes(String(id)) == false) {
            self.favsdata[name].push(String(id))
            self.updateLocalStorage(name, self.favsdata[name])
        } else {
            self.favsdata[name].splice(self.favsdata[name].indexOf(String(id)), 1)
            self.updateLocalStorage(name, self.favsdata[name])
        }
        self.athletesdata(self.loadData(self.favsdata.athletes))
        self.competitionsdata(self.loadData1(self.favsdata.competitions))
        self.countriesdata(self.loadData2(self.favsdata.countries))
        self.gamesdata(self.loadData3(self.favsdata.games))
        self.modalitiesdata(self.loadData4(self.favsdata.modalities))
    }


    self.init = function() {
        for (let k in self.favsdata) {
            if (localStorage.getItem(k) != null) {
                self.favsdata[k] = JSON.parse(localStorage.getItem(k))
            } else {
                self.favsdata[k] = []
            }
        }
        self.athletesdata(self.loadData(self.favsdata.athletes))
        self.competitionsdata(self.loadData1(self.favsdata.competitions))
        self.countriesdata(self.loadData2(self.favsdata.countries))
        self.gamesdata(self.loadData3(self.favsdata.games))
        self.modalitiesdata(self.loadData4(self.favsdata.modalities))
    }
    self.init()

}

$(document).ready(function() {
    console.log("ready!");
    ko.applyBindings(new vm());
});
