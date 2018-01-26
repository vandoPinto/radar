import { Component, ViewChild, ElementRef } from '@angular/core';

declare var google;
var radaresPerto = [];
var marcadores;
var radaresSelecionados = [];

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;


  constructor() {

  }

  ionViewDidLoad() {

    this.InitDataMap();
  }

  InitDataMap() {
    fetch('./assets/coordenadas/maparadar.txt')
      .then(response => response.text())
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
        this.initializeMap(linhas);
      });

  }

  startNavigating(origem, destino) {

    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(this.map);
    directionsDisplay.setPanel(this.directionsPanel.nativeElement);

    directionsService.route({

      //-15.911610, -48.069302
      origin: { lat: origem.latitude, lng: origem.longitude },
      //destination: {lat: Number(destino.latitude), lng: Number(destino.longitude)},
      destination: { lat: Number(-15.911610), lng: Number(-48.069302) },

      travelMode: google.maps.TravelMode['DRIVING']
    }, (res, status) => {

      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(res);
        console.log("foram encontrados radares perto: ", radaresPerto.length);
        this.verificarRadares(res);

      } else {
        console.warn(status);
      }

    });

  }

  initializeMap(linhas) {

    let locationOptions = { timeout: 20000, enableHighAccuracy: true };
    marcadores = linhas;
    // var marcador = marcadores[0];

    navigator.geolocation.getCurrentPosition(

      (position) => {

        let options = {
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          //center: new google.maps.LatLng(-15.797792, -47.887632),
          zoom: 20,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(document.getElementById("map_canvas"), options);

        let selecionado = { latitude: Number(-15.911610), longitude: Number(-48.069302) };

        this.startNavigating(position.coords, selecionado);
        console.log("localização ", position.coords.latitude, position.coords.longitude);
        console.log("ate onde ", selecionado.latitude, selecionado.longitude);

        var distanciaTotal = this.CalcRadiusDistance(selecionado.latitude,selecionado.longitude,position.coords.latitude,position.coords.longitude)

        marcadores.forEach(element => {
          if (this.CalcRadiusDistance(element.latitude, element.longitude, position.coords.latitude, position.coords.longitude) <= distanciaTotal && element.velocidade > 0) {
            //console.log(element.velocidade);
            //selecionado = element;
            radaresPerto.push(element);
            //this.criaMarcador(element, this.map);
          }
        });


      },

      (error) => {
        console.log(error);
      }, locationOptions
    );







  }

  CalcRadiusDistance(lat1, lon1, lat2, lon2) {
    var RADIUSMILES = 3961,
      RADIUSKILOMETERS = 6373000,
      latR1 = this.deg2rad(lat1),
      lonR1 = this.deg2rad(lon1),
      latR2 = this.deg2rad(lat2),
      lonR2 = this.deg2rad(lon2),
      latDifference = latR2 - latR1,
      lonDifference = lonR2 - lonR1,
      a = Math.pow(Math.sin(latDifference / 2), 2) + Math.cos(latR1) * Math.cos(latR2) * Math.pow(Math.sin(lonDifference / 2), 2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
      dm = c * RADIUSMILES,
      dk = c * RADIUSKILOMETERS;
    //var mi = this.round(dm);
    var km = this.round(dk);
    //console.log(km);
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
      , title: marcador.titulo + " Velocidade: " + marcador.velocidade+" "+ marcador.direcao
      , animation: google.maps.Animation.DROP
      , icon: {
        url: marcador.imagem || 'http://i.imgur.com/bFnWq8k.png'
        , scaledSize: new google.maps.Size(50, 50)
      }
      , map: mapa
    }
    var novoMarcador = new google.maps.Marker(opcoes);
    marcadores.push(novoMarcador);
    //this.map.setCenter(novoMarcador.position)
  }

  verificarRadares(res) {

    console.log(radaresPerto.length)
    var steps = res.routes[0].legs[0].steps;
    console.log("todos",res.routes[0].legs[0]);
    var total=1;

    for(var t=0; t<steps.length; t++){
    //passos.forEach(element => {
      
      //let distanciaEntreOsPonto = steps[t].distance.value / 1000;
      var pontoInicialLat = steps[t].start_location.lat();
      var pontoInicialLng = steps[t].start_location.lng();
      var miniSteps = steps[t].lat_lngs;

      for(var i=0; i<miniSteps.length; i++){
        var miniStepsInicialLat;
        var miniStepsInicialLng;
        if(i==0){
          // o x,y receberar do pai
          //console.log("Inicio Recebendo do pai")
          miniStepsInicialLat = pontoInicialLat
          miniStepsInicialLng = pontoInicialLng
        }else{
          //console.log("REcebendo do anterior")
          miniStepsInicialLat = miniSteps[i-1].lat();
          miniStepsInicialLng = miniSteps[i-1].lng();
        }

        var miniStepsFinallLat = miniSteps[i].lat();
        var miniStepsFinalLng = miniSteps[i].lng();
        var distanciaEntreOsPontos = this.CalcRadiusDistance(miniStepsInicialLat, miniStepsInicialLng, miniStepsFinallLat, miniStepsFinalLng);
       
        total = total+distanciaEntreOsPontos;

        /*console.log(i,distanciaEntreOsPontos,(total));
        console.log(miniStepsInicialLat,miniStepsInicialLng)
        console.log(miniStepsFinallLat,miniStepsFinalLng)
        console.log("//////////////////////////////////////////////");
        */
        //var ponto1={x:miniStepsInicialLng, y:miniStepsInicialLat}
        //var ponto2 = {x: miniStepsFinalLng,y:miniStepsFinallLat}        
        var direcaoPista = this.verificarDirecao(miniStepsInicialLat, miniStepsInicialLng, miniStepsFinallLat, miniStepsFinalLng);

        this.ProcurarRadar(miniStepsInicialLat,miniStepsInicialLng,distanciaEntreOsPontos,direcaoPista,miniStepsFinallLat,miniStepsFinalLng);
      }

    }
    
    radaresSelecionados.forEach(element => {
      this.criaMarcador(element, this.map);
    });

  }

  ProcurarRadar(pontoDeraioLat,pontoDeraioLng,distanciaEntreOsPonto,direcaoPista, finalLat, finalLng){
    
    
    radaresPerto.forEach(element => {
      var diststepsRadar:Number = this.CalcRadiusDistance(Number(element.latitude), Number(element.longitude), pontoDeraioLat, pontoDeraioLng);
      //console.log("--->"+diststepsRadar, distanciaEntreOsPonto);
      
      //////-------------------------
      var direcaoRadar = element.direcao;
      
      /////------------------------------
      if ( diststepsRadar <= distanciaEntreOsPonto ) {
        if((Math.abs(direcaoRadar-direcaoPista) >= 45)){
          element.imagem = 'http://i.imgur.com/biRJBNL.png';
        }
        console.log(element.velocidade, direcaoRadar, direcaoPista/*+"   "+ pontoDeraioLat+","+pontoDeraioLng+"    "+finalLat+","+finalLng*/)
        
        radaresSelecionados.push(element);
        //this.criaMarcador(element, this.map);
        //console.log("COLOCOU UM RADAR")
        

      }
    });

  }

  verificarDirecao(lat1, lon1, lat2, lon2){
    
      var y = Math.sin(lon2 - lon1) * Math.cos(lat2);
      var x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    
      var brng = Math.atan2(y, x) * 180/Math.PI;
      return (360-brng) % 360;
    
  }



  CriarPontosApagar(latitude, longitude, mapa, distancia) {
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
    marcadores.push(novoMarcador);
    //this.map.setCenter(novoMarcador.position)
  }

}



