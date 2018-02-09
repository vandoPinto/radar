import { Component, ViewChild, ElementRef } from '@angular/core';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';

declare var google;
var radaresPerto = [];
var marcadores;
var radaresSelecionados = [];
var markers = []
var posicoesIniciais;
var respostaGoogle;
var jaAdicionados = false;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  constructor(private file: File, public platform: Platform) {

  }

  ionViewDidLoad() {

    this.initializeMap();
//    this.carregarLocalizacaoRadares(); 
  }

  carregarLocalizacaoRadares(){
    var path = ""+this.file.applicationDirectory+"www/assets/coordenadas/";
    //this.file.checkFile(path,'maparadar.txt').then( ()=> {alert("achou")}).catch(()=>{alert("nao achou o arquivo")})
    
    this.file.readAsText(path,'maparadar.txt')
    .then((text) => {
      var imagens = {
        muitoBom: 'http://i.imgur.com/bFnWq8k.png'
        , bom: 'http://i.imgur.com/VnlbIoL.png'
        , medio: 'http://i.imgur.com/eNAvIvr.png'
        , ruim: 'http://i.imgur.com/uCRXqdV.png'
        , pessimo: 'http://i.imgur.com/biRJBNL.png'
      }

      var linhas = [];
      (text.split("\n")).slice(1, -1).forEach(element => {
        var linha = element.split(",");
        //X,Y,TYPE,SPEED,DirType,Direction
        let marcador = {
          latitude: linha[1]
          , longitude: linha[0]
          , titulo: 'Radar'
          , velocidade: linha[3]
          , direcao: linha[5]
          , imagem: imagens.medio
        }
        linhas.push(marcador);
      });
      marcadores = linhas;
    })
    .catch(err => alert("Erro ao carregar as localizações dos radares, por favor reinicie o aplicativo"))
  }

  public edited = false;
  public edited2 = false;
  public edited3 = false;

  

  startNavigating() {

    console.log("startNavigation", posicoesIniciais)
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer({
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
    }, (res, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(res);
        respostaGoogle = res;

      } else {
        console.warn(status);
      }
    });
    //this.edited3 = true;

  }

  calcularRota() {
    this.edited = true;
    this.edited3 = false;
    //iniciarDepois que selecinar o destino
    this.startNavigating();
    //this.edited = true;

  }
  addRadares() {
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    this.edited = false;
    this.edited2 = true;
    if (!jaAdicionados) {
      console.log("localização ", posicoesIniciais.inicioLat, posicoesIniciais.inicioLng);
      console.log("ate onde ", posicoesIniciais.fimLat, posicoesIniciais.fimLng);

      var distanciaTotal = this.CalcRadiusDistance(posicoesIniciais.inicioLat, posicoesIniciais.inicioLng, posicoesIniciais.fimLat, posicoesIniciais.fimLng)
      console.log("olha", distanciaTotal)
      marcadores.forEach(element => {
        if (this.CalcRadiusDistance(element.latitude, element.longitude, posicoesIniciais.inicioLat, posicoesIniciais.inicioLng) <= distanciaTotal && element.velocidade > 0) {
          radaresPerto.push(element);

        }
      });
      /////////////////////////////////////////////////////////////////////////////////////////////////////
      this.verificarRadares();

      this.removerDuplicados(radaresSelecionados, null);
      radaresSelecionados.forEach(element => {
        this.criaMarcador(element, this.map);
      });
      jaAdicionados = true;
    } else {
      markers.forEach(element => {
        element.setMap(this.map)
      });
    }

  }

  removeRadares() {
    this.edited = true;
    this.edited2 = false;

    markers.forEach(element => {
      element.setMap(null)
    });


  }

  initializeMap() {
    console.log("Iniciando mapa")
    let locationOptions = { timeout: 20000, enableHighAccuracy: true };
    //marcadores = linhas;
    navigator.geolocation.getCurrentPosition(

      (position) => {

        let options = {
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(document.getElementById("map_canvas"), options);
        //-15.506533, -47.329646
        //let selecionado = { latitude: Number(-15.903582), longitude: Number(-48.070680) };

        posicoesIniciais = {
          inicioLat: position.coords.latitude
          , inicioLng: position.coords.longitude
          , fimLat: ""
          , fimLng: ""
        }
      },
      (error) => {
        console.log(error);
      }, locationOptions
    );

    this.carregarLocalizacaoRadares();
  }

  procurarEndereco(value) {
    var geocoder = new google.maps.Geocoder();
    this.geocodeAddress(geocoder, this.map, value);
    this.edited3 = true;
  }

  geocodeAddress(geocoder, resultsMap, value) {
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
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }


  CalcRadiusDistance(lat1, lon1, lat2, lon2) {
    //RADIUSMILES = 3961,
    var RADIUSKILOMETERS = 6373000,
      latR1 = this.deg2rad(lat1),
      lonR1 = this.deg2rad(lon1),
      latR2 = this.deg2rad(lat2),
      lonR2 = this.deg2rad(lon2),
      latDifference = latR2 - latR1,
      lonDifference = lonR2 - lonR1,
      a = Math.pow(Math.sin(latDifference / 2), 2) + Math.cos(latR1) * Math.cos(latR2) * Math.pow(Math.sin(lonDifference / 2), 2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
      //dm = c * RADIUSMILES,
      dk = c * RADIUSKILOMETERS;
    var km = this.round(dk);
    return (km);
  }

  deg2rad(deg) {
    var rad = deg * Math.PI / 180;
    return rad;
  }

  round(x) {
    return Math.round(x * 10) / 10;
  }

  criaMarcador(marcador, mapa) {
    var posicao = new google.maps.LatLng(marcador.latitude, marcador.longitude);
    var opcoes = {
      position: posicao
      , title: marcador.titulo + " Velocidade: " + marcador.velocidade + " " + marcador.direcao
      , animation: google.maps.Animation.DROP
      , icon: {
        url: marcador.imagem || 'http://i.imgur.com/bFnWq8k.png'
        , scaledSize: new google.maps.Size(50, 50)
      }
      , map: mapa
    }
    var novoMarcador = new google.maps.Marker(opcoes);
    markers.push(novoMarcador);
  }

  verificarRadares() {
    var res = respostaGoogle;
    console.log(radaresPerto.length)
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
          miniStepsInicialLat = pontoInicialLat
          miniStepsInicialLng = pontoInicialLng
        } else {
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
  }

  removerDuplicados = function (a, s) {
    console.log("antes array de radares", a.length)
    var p, i, j;
    if (s) for (i = a.length; i > 1;) {
      if (a[--i] === a[i - 1]) {
        for (p = i - 1; p-- && a[i] === a[p];);
        i -= a.splice(p + 1, i - p - 1).length;
      }
    }
    else for (i = a.length; i;) {
      for (p = --i; p > 0;)
        if (a[i] === a[--p]) {
          for (j = p; p-- && a[i] === a[p];);
          i -= a.splice(p + 1, j - p).length;
        }
    }
    console.log("Depois array de radares", a.length)
    return a;
  };


  ProcurarRadar(pontoDeraioLat, pontoDeraioLng, distanciaEntreOsPonto, direcaoPista, finalLat, finalLng) {
    radaresPerto.forEach(element => {
      var diststepsRadar: Number = this.CalcRadiusDistance(Number(element.latitude), Number(element.longitude), pontoDeraioLat, pontoDeraioLng);
      var direcaoRadar = element.direcao;
      if (diststepsRadar <= distanciaEntreOsPonto) {
        if ((Math.abs(direcaoRadar - direcaoPista) >= 45)) {
          element.imagem = 'http://i.imgur.com/biRJBNL.png';
        } else {
          //console.log(element.velocidade, direcaoRadar, direcaoPista/*+"   "+ pontoDeraioLat+","+pontoDeraioLng+"    "+finalLat+","+finalLng*/)
          radaresSelecionados.push(element);
        }
      }
    });
  }

  verificarDirecao(lat1, lon1, lat2, lon2) {

    var y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    var x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    var brng = Math.atan2(y, x) * 180 / Math.PI;
    return (360 - brng) % 360;

  }

  /* CriarPontosApagar(latitude, longitude, mapa, distancia) {
     var posicao = new google.maps.LatLng(latitude, longitude);
     var opcoes = {
       position: posicao
       , title: "Raio de distancia: " + distancia
       , animation: google.maps.Animation.DROP
       , icon: {
         path: google.maps.SymbolPath.CIRCLE,
         fillColor: 'red',
         fillOpacity: .2,
         strokeColor: 'white',
         strokeWeight: .5,
         scale: distancia
       }
       , map: mapa
     }
     var novoMarcador = new google.maps.Marker(opcoes);
     //marcadores.push(novoMarcador);
     //this.map.setCenter(novoMarcador.position)
   }*/

}