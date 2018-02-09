webpackJsonp([0],{

/***/ 110:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 110;

/***/ }),

/***/ 151:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 151;

/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_file__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(55);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var radaresPerto = [];
var marcadores;
var radaresSelecionados = [];
var markers = [];
var posicoesIniciais;
var respostaGoogle;
var jaAdicionados = false;
var HomePage = (function () {
    function HomePage(file, platform) {
        this.file = file;
        this.platform = platform;
        this.edited = false;
        this.edited2 = false;
        this.edited3 = false;
        this.removerDuplicados = function (a, s) {
            console.log("antes array de radares", a.length);
            var p, i, j;
            if (s)
                for (i = a.length; i > 1;) {
                    if (a[--i] === a[i - 1]) {
                        for (p = i - 1; p-- && a[i] === a[p];)
                            ;
                        i -= a.splice(p + 1, i - p - 1).length;
                    }
                }
            else
                for (i = a.length; i;) {
                    for (p = --i; p > 0;)
                        if (a[i] === a[--p]) {
                            for (j = p; p-- && a[i] === a[p];)
                                ;
                            i -= a.splice(p + 1, j - p).length;
                        }
                }
            console.log("Depois array de radares", a.length);
            return a;
        };
    }
    HomePage.prototype.ionViewDidLoad = function () {
        this.initializeMap();
        //    this.carregarLocalizacaoRadares(); 
    };
    HomePage.prototype.carregarLocalizacaoRadares = function () {
        var path = "" + this.file.applicationDirectory + "www/assets/coordenadas/";
        //this.file.checkFile(path,'maparadar.txt').then( ()=> {alert("achou")}).catch(()=>{alert("nao achou o arquivo")})
        this.file.readAsText(path, 'maparadar.txt')
            .then(function (text) {
            var imagens = {
                muitoBom: 'http://i.imgur.com/bFnWq8k.png',
                bom: 'http://i.imgur.com/VnlbIoL.png',
                medio: 'http://i.imgur.com/eNAvIvr.png',
                ruim: 'http://i.imgur.com/uCRXqdV.png',
                pessimo: 'http://i.imgur.com/biRJBNL.png'
            };
            var linhas = [];
            (text.split("\n")).slice(1, -1).forEach(function (element) {
                var linha = element.split(",");
                //X,Y,TYPE,SPEED,DirType,Direction
                var marcador = {
                    latitude: linha[1],
                    longitude: linha[0],
                    titulo: 'Radar',
                    velocidade: linha[3],
                    direcao: linha[5],
                    imagem: imagens.medio
                };
                linhas.push(marcador);
            });
            marcadores = linhas;
        })
            .catch(function (err) { return alert("Erro ao carregar as localizações dos radares, por favor reinicie o aplicativo"); });
    };
    HomePage.prototype.startNavigating = function () {
        console.log("startNavigation", posicoesIniciais);
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({
            map: this.map,
            draggable: true
        });
        directionsDisplay.setMap(this.map);
        directionsDisplay.setPanel(this.directionsPanel.nativeElement);
        directionsService.route({
            //-15.911610, -48.069302
            origin: { lat: posicoesIniciais.inicioLat, lng: posicoesIniciais.inicioLng },
            destination: { lat: Number(posicoesIniciais.fimLat), lng: Number(posicoesIniciais.fimLng) },
            //destination: { lat: Number(-15.911610), lng: Number(-48.069302) },
            travelMode: google.maps.TravelMode['DRIVING']
        }, function (res, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(res);
                respostaGoogle = res;
            }
            else {
                console.warn(status);
            }
        });
        //this.edited3 = true;
    };
    HomePage.prototype.calcularRota = function () {
        this.edited = true;
        this.edited3 = false;
        //iniciarDepois que selecinar o destino
        this.startNavigating();
        //this.edited = true;
    };
    HomePage.prototype.addRadares = function () {
        var _this = this;
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        this.edited = false;
        this.edited2 = true;
        if (!jaAdicionados) {
            console.log("localização ", posicoesIniciais.inicioLat, posicoesIniciais.inicioLng);
            console.log("ate onde ", posicoesIniciais.fimLat, posicoesIniciais.fimLng);
            var distanciaTotal = this.CalcRadiusDistance(posicoesIniciais.inicioLat, posicoesIniciais.inicioLng, posicoesIniciais.fimLat, posicoesIniciais.fimLng);
            console.log("olha", distanciaTotal);
            marcadores.forEach(function (element) {
                if (_this.CalcRadiusDistance(element.latitude, element.longitude, posicoesIniciais.inicioLat, posicoesIniciais.inicioLng) <= distanciaTotal && element.velocidade > 0) {
                    radaresPerto.push(element);
                }
            });
            /////////////////////////////////////////////////////////////////////////////////////////////////////
            this.verificarRadares();
            this.removerDuplicados(radaresSelecionados, null);
            radaresSelecionados.forEach(function (element) {
                _this.criaMarcador(element, _this.map);
            });
            jaAdicionados = true;
        }
        else {
            markers.forEach(function (element) {
                element.setMap(_this.map);
            });
        }
    };
    HomePage.prototype.removeRadares = function () {
        this.edited = true;
        this.edited2 = false;
        markers.forEach(function (element) {
            element.setMap(null);
        });
    };
    HomePage.prototype.initializeMap = function () {
        var _this = this;
        console.log("Iniciando mapa");
        var locationOptions = { timeout: 20000, enableHighAccuracy: true };
        //marcadores = linhas;
        navigator.geolocation.getCurrentPosition(function (position) {
            var options = {
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            _this.map = new google.maps.Map(document.getElementById("map_canvas"), options);
            //-15.506533, -47.329646
            //let selecionado = { latitude: Number(-15.903582), longitude: Number(-48.070680) };
            posicoesIniciais = {
                inicioLat: position.coords.latitude,
                inicioLng: position.coords.longitude,
                fimLat: "",
                fimLng: ""
            };
        }, function (error) {
            console.log(error);
        }, locationOptions);
        this.carregarLocalizacaoRadares();
    };
    HomePage.prototype.procurarEndereco = function (value) {
        var geocoder = new google.maps.Geocoder();
        this.geocodeAddress(geocoder, this.map, value);
        this.edited3 = true;
    };
    HomePage.prototype.geocodeAddress = function (geocoder, resultsMap, value) {
        var address = value;
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                /*var marker = new google.maps.Marker({
                  map: resultsMap,
                  position: results[0].geometry.location
                });*/
                posicoesIniciais.fimLat = results[0].geometry.location.lat();
                posicoesIniciais.fimLng = results[0].geometry.location.lng();
                console.log(posicoesIniciais.fimLat, posicoesIniciais.fimLng);
            }
            else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };
    HomePage.prototype.CalcRadiusDistance = function (lat1, lon1, lat2, lon2) {
        //RADIUSMILES = 3961,
        var RADIUSKILOMETERS = 6373000, latR1 = this.deg2rad(lat1), lonR1 = this.deg2rad(lon1), latR2 = this.deg2rad(lat2), lonR2 = this.deg2rad(lon2), latDifference = latR2 - latR1, lonDifference = lonR2 - lonR1, a = Math.pow(Math.sin(latDifference / 2), 2) + Math.cos(latR1) * Math.cos(latR2) * Math.pow(Math.sin(lonDifference / 2), 2), c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), 
        //dm = c * RADIUSMILES,
        dk = c * RADIUSKILOMETERS;
        var km = this.round(dk);
        return (km);
    };
    HomePage.prototype.deg2rad = function (deg) {
        var rad = deg * Math.PI / 180;
        return rad;
    };
    HomePage.prototype.round = function (x) {
        return Math.round(x * 10) / 10;
    };
    HomePage.prototype.criaMarcador = function (marcador, mapa) {
        var posicao = new google.maps.LatLng(marcador.latitude, marcador.longitude);
        var opcoes = {
            position: posicao,
            title: marcador.titulo + " Velocidade: " + marcador.velocidade + " " + marcador.direcao,
            animation: google.maps.Animation.DROP,
            icon: {
                url: marcador.imagem || 'http://i.imgur.com/bFnWq8k.png',
                scaledSize: new google.maps.Size(50, 50)
            },
            map: mapa
        };
        var novoMarcador = new google.maps.Marker(opcoes);
        markers.push(novoMarcador);
    };
    HomePage.prototype.verificarRadares = function () {
        var res = respostaGoogle;
        console.log(radaresPerto.length);
        var steps = res.routes[0].legs[0].steps;
        console.log("todos", res.routes[0].legs[0]);
        for (var t = 0; t < steps.length; t++) {
            var pontoInicialLat = steps[t].start_location.lat();
            var pontoInicialLng = steps[t].start_location.lng();
            var miniSteps = steps[t].lat_lngs;
            for (var i = 0; i < miniSteps.length; i++) {
                var miniStepsInicialLat;
                var miniStepsInicialLng;
                if (i == 0) {
                    miniStepsInicialLat = pontoInicialLat;
                    miniStepsInicialLng = pontoInicialLng;
                }
                else {
                    miniStepsInicialLat = miniSteps[i - 1].lat();
                    miniStepsInicialLng = miniSteps[i - 1].lng();
                }
                var miniStepsFinallLat = miniSteps[i].lat();
                var miniStepsFinalLng = miniSteps[i].lng();
                var distanciaEntreOsPontos = this.CalcRadiusDistance(miniStepsInicialLat, miniStepsInicialLng, miniStepsFinallLat, miniStepsFinalLng);
                var direcaoPista = this.verificarDirecao(miniStepsInicialLat, miniStepsInicialLng, miniStepsFinallLat, miniStepsFinalLng);
                this.ProcurarRadar(miniStepsInicialLat, miniStepsInicialLng, distanciaEntreOsPontos, direcaoPista, miniStepsFinallLat, miniStepsFinalLng);
            }
        }
    };
    HomePage.prototype.ProcurarRadar = function (pontoDeraioLat, pontoDeraioLng, distanciaEntreOsPonto, direcaoPista, finalLat, finalLng) {
        var _this = this;
        radaresPerto.forEach(function (element) {
            var diststepsRadar = _this.CalcRadiusDistance(Number(element.latitude), Number(element.longitude), pontoDeraioLat, pontoDeraioLng);
            var direcaoRadar = element.direcao;
            if (diststepsRadar <= distanciaEntreOsPonto) {
                if ((Math.abs(direcaoRadar - direcaoPista) >= 45)) {
                    element.imagem = 'http://i.imgur.com/biRJBNL.png';
                }
                else {
                    //console.log(element.velocidade, direcaoRadar, direcaoPista/*+"   "+ pontoDeraioLat+","+pontoDeraioLng+"    "+finalLat+","+finalLng*/)
                    radaresSelecionados.push(element);
                }
            }
        });
    };
    HomePage.prototype.verificarDirecao = function (lat1, lon1, lat2, lon2) {
        var y = Math.sin(lon2 - lon1) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
        var brng = Math.atan2(y, x) * 180 / Math.PI;
        return (360 - brng) % 360;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('directionsPanel'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], HomePage.prototype, "directionsPanel", void 0);
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\Users\vando.rodrigues\Desktop\IONIC\radar\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Radar\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div id="floating-panel">\n        <button *ngIf="edited" (click)="addRadares()" id="botaoRadar">Radares</button>\n        <button *ngIf="edited2" (click)="removeRadares()" id="botaoRadar">Remover Radares</button>\n        <button *ngIf="edited3" (click)="calcularRota()" id="calcularRota">Calcular Rota</button>\n\n        <input id="address" type="textbox" value="Recanto das Emas" #ref>\n        <input (click)="procurarEndereco(ref.value)" id="submit" type="button" value="Procurar">\n      </div>\n\n\n    <ion-card>\n        <ion-card-content>\n            <div #directionsPanel></div>\n        </ion-card-content>\n    </ion-card>\n    \n\n  <div id="map_canvas"></div>\n  \n</ion-content>\n'/*ion-inline-end:"C:\Users\vando.rodrigues\Desktop\IONIC\radar\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* Platform */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(220);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_home_home__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_file__ = __webpack_require__(195);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 272:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(194);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\vando.rodrigues\Desktop\IONIC\radar\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"C:\Users\vando.rodrigues\Desktop\IONIC\radar\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[196]);
//# sourceMappingURL=main.js.map