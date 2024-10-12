var app = angular.module('pokerApp', [])

app.controller('pokerController', function($scope) {

    $scope.getRandomInt = function(min, max) {
        return Math.floor(Math.random()*(max-min)+min)
    }

    $scope.getCartas = function(n) {
        var arr = []
        for(var i = 0; i < n; i++) {
            arr.push({ 
                numero: $scope.getRandomInt(2, 15),
                naipe: $scope.getRandomInt(1, 5) 
            })
        }
        return arr
    }

    $scope.naipes = ['S', 'C', 'H', 'D']

    $scope.getCodigoCarta = function(carta) {
        var codigo = ''
        if(carta.numero < 10) {codigo += carta.numero}

        if(carta.numero === 10) {codigo += '0'}
        if(carta.numero === 11) {codigo += 'J'}
        if(carta.numero === 12) {codigo += 'Q'}
        if(carta.numero === 13) {codigo += 'K'}
        if(carta.numero === 14) {codigo += 'A'}

        codigo += $scope.naipes[carta.naipe-1]
        
        return codigo
    }

    $scope.cartasMesa = $scope.getCartas(5)
    $scope.cartasMao = $scope.getCartas(2)

    const count = (arr, value) => {
        var count = 0
        arr.map(x => {if(x === value) {count++}})
        return count
    }

    const getNomeHighCard = (n) => {
        if(n === 11) {return 'VALETE'}
        if(n === 12) {return 'DAMA'}
        if(n === 13) {return 'REI'}
        if(n === 14) {return 'ÁS'}
        
        if(n <= 10) return n
    }

    const isPar = (mesa, mao) => {
        var numerosMesa = []
        var numerosMao = []

        mesa.map(carta => numerosMesa.push(carta.numero))
        mao.map(carta => numerosMao.push(carta.numero))

        var pares = 0

        for(var i = 2; i <= 15; i++) {
            if(
                ((count(numerosMao, i) === 2) && (count(numerosMesa, i) === 0)) || 
                ((count(numerosMesa, i)+count(numerosMao, i) === 2) && (count(numerosMesa, i) === 1))
            ) {
                $scope.n_resultado = getNomeHighCard(i)
                pares++
            }
        }
        return pares
    }

    const isTrinca = (mesa, mao) => {
        var numerosMesa = []
        var numerosMao = []

        mesa.map(carta => numerosMesa.push(carta.numero))
        mao.map(carta => numerosMao.push(carta.numero))

        var trinca = false

        for(var i = 2; i <= 15; i++) {
            if((count(numerosMesa, i)+count(numerosMao, i) === 3) && (count(numerosMao, i) > 0)) {
                $scope.n_resultado = getNomeHighCard(i)
                trinca = true
            }
        }
        return trinca
    }

    const isStraight = (mesa, mao) => {
        var numerosMesa = []
        var numerosMao = []

        mesa.map(carta => {numerosMesa.push(carta.numero)})
        mao.map(carta => {numerosMao.push(carta.numero)})

        var possibilidades = []

        for(var n = 0; n < numerosMao.length; n++) {
            var bottom = -4
            var top = 0

            for(var i = 0; i <= 4; i++) {
                var range = []

                for(var j = numerosMao[n]+bottom; j <= numerosMao[n]+top; j++) {
                    if(numerosMao[0] !== j && numerosMao[1] !== j) {
                        range.push(j)   
                    }
                }
                if(
                    !range.includes(15) && !range.includes(16) && !range.includes(17) && !range.includes(18) && 
                    !range.includes(-2) && !range.includes(-1) && !range.includes(0) &&!range.includes(1)
                ) {
                    possibilidades.push(range)                    // dps eu arrumo essa aberração
                }
                bottom++; top++;
            }
        }
            

        const checker = (arr, target) => target.every(v => arr.includes(v));
        
        possibilidades.map(range => {
            if(checker(numerosMesa, range)) {
                straight = true
            }
        })
        return straight
    }

    const isFlush = (mesa, mao) => {
        var naipesMesa = []
        var naipesMao = []

        mesa.map(carta => naipesMesa.push(carta.naipe))
        mao.map(carta => naipesMao.push(carta.naipe))

        var flush = false

        for(var i = 1; i <= 5; i++) {
            if((count(naipesMesa, i)+count(naipesMao, i) >= 5) && (count(naipesMao, i) > 0)) {
                flush = true
            }
        }
        return flush
    }

    const isQuadra = (mesa, mao) => {
        var numerosMesa = []
        var numerosMao = []

        mesa.map(carta => numerosMesa.push(carta.numero))
        mao.map(carta => numerosMao.push(carta.numero))

        var quadra = false

        for(var i = 2; i <= 15; i++) {
            if((count(numerosMesa, i)+count(numerosMao, i) === 4) && (count(numerosMao, i) > 0)) {
                $scope.n_resultado = getNomeHighCard(i)
                quadra = true
            }
        }
        return quadra
    }

    $scope.analise = function(mesa, mao) {
        if(isPar(mesa, mao) === 1) {
            $scope.resultado = `PAR DE ${$scope.n_resultado}`
        }
        if(isPar(mesa, mao) === 2) {
            $scope.resultado = 'DOIS PARES'
        }
        if(isTrinca(mesa, mao)) {
            $scope.resultado = `TRINCA DE ${$scope.n_resultado}`
        }
        if(isStraight(mesa, mao)) {
            $scope.resultado = 'SEQUÊNCIA'
        }
        if(isFlush(mesa, mao)) {
            $scope.resultado = 'FLUSH'
        }
        if(isTrinca(mesa, mao) && isPar(mesa, mao)) {
            // tem uma regrinha chata mas a gente deixa de lado
            $scope.resultado = 'FULL HOUSE'
        }
        if(isQuadra(mesa, mao)) {
            $scope.resultado = `QUADRA DE ${$scope.n_resultado}`
        }
    }

    $scope.analise($scope.cartasMesa, $scope.cartasMao)
})