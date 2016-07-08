angular.module('app.controllers', ['ngCordova'])

.controller('MenuCtrl', function ($scope, $cordovaAppRate) {
    $scope.avaliar = function () {
        document.addEventListener("deviceready", function () {
            $cordovaAppRate.navigateToAppStore();
        }, false);
    };
})

.controller('HomeCtrl', function ($state, $ionicPopup, $scope, Listas, Preferencias) {
    $scope.title = 'Teslo ToDo';
    $scope.listas = Listas.Listas();
    
    $scope.apenasPendentes = Preferencias.Get().ApenasPendentes;

    $scope.redirecionar = function (lista) {
        $state.go('lista', {
            "Id": lista.Id
        });
    };

    $scope.opcoes = function (lista) {
        var template = "";
        template +=
            '<ion-item class="item-icon-left" ng-click="editar(\'' + lista.Id + '\');">' +
            '<i class="icon ion-edit"></i>' +
            'Editar' +
            '</ion-item>';

        template +=
            '<ion-item class="item-icon-left" ng-click="excluir(\'' + lista.Id + '\');">' +
            '<i class="icon ion-trash-b"></i>' +
            'Excluir' +
            '</ion-item>';

        opcoesPopUp = $ionicPopup.show({
            title: lista.Nome,
            template: template,
            scope: $scope,
            buttons: [
                {
                    text: 'Fechar',
                    type: 'button-calm'
                }
            ]
        });
    };

    $scope.excluir = function (listaId) {
        var lista = Listas.BuscaListaPorId(listaId);
        Listas.RemoveLista(lista);
        if (Preferencias.Get().DefaultListId == listaId){
            Preferencias.Set(Preferencias.Get().ExcluirAoMarcar, 0, Preferencias.Get().ApenasPendentes);
        }
        opcoesPopUp.close();
    }

    $scope.editar = function (listaId) {
        var lista = Listas.BuscaListaPorId(listaId);
        $scope.data = {
            nome: lista.Nome
        };
        opcoesPopUp.close();
        opcoesPopUp.then(function () {
            $ionicPopup.show({
                title: lista.Nome,
                scope: $scope,
                template: '<label class="item item-input"><input type="text" ng-model="data.nome" placeholder="Digite o novo nome da lista"></label>',
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive'
                },
                    {
                        text: 'Salvar',
                        type: 'button-calm',
                        onTap: function (e) {
                            if (!$scope.data.nome) {
                                e.preventDefault();
                            } else {
                                Listas.EditaLista(lista, $scope.data.nome);
                            }
                        }
              },
            ]
            });
        });
    }

    $scope.novaLista = function () {
        $scope.data = {};
        $ionicPopup.show({
            title: 'Nova Lista',
            scope: $scope,
            template: '<label class="item item-input"><input type="text" ng-model="data.nome" placeholder="Digite o nome da nova lista"></label>',
            buttons: [
                {
                    text: 'Cancelar',
                    type: 'button-assertive'
                },
                {
                    text: 'Adicionar',
                    type: 'button-calm',
                    onTap: function (e) {
                        if (!$scope.data.nome) {
                            e.preventDefault();
                        } else {
                            Listas.AdicionaLista($scope.data.nome);
                        }
                    }
              },
            ]
        });
    };
})

.controller('ListaCtrl', function ($cordovaToast, $stateParams, $scope, $ionicPopup, Listas, Preferencias) {
    var lista = Listas.BuscaListaPorId(JSON.parse($stateParams.Id));
    $scope.items = lista.Items;
    $scope.title = lista.Nome;
    $scope.data = {
        item: ""
    };

    $scope.adicionar = function (_item) {
        if (_item.length > 0) {
            Listas.AdicionaItem(lista, _item);
            $scope.data = {
                item: ""
            };
        }
    };

    $scope.marcarDersmarcar = function (item) {
        Listas.AlteraStatusItem(lista, item);
    };

    $scope.excluir = function (item) {
        Listas.RemoveItem(lista, item);
    }

    $scope.concluirTodos = function () {
        if (Preferencias.Get().ExcluirAoMarcar == true) {
            Listas.LimparLista(lista);
            $scope.items = [];
        } else {
            for (i = 0; i < $scope.items.length; i++) {
                if ($scope.items[i].Feito == false) {
                    Listas.AlteraStatusItem(lista, $scope.items[i]);
                }
            };
        }
    }

    $scope.excluirTodosConcluidos = function () {
        var temItensMarcados = false;
        for (i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].Feito == true) {
                temItensMarcados = true;
                break;
            }
        };

        if (temItensMarcados == true) {
            Listas.RemoveItensConcluidos(lista);
        } else {
            $cordovaToast.showLongBottom('Nenhum item concluído para excluir');
        }
    }

    $scope.editar = function (item, novoNome) {
        Listas.EditaItem(lista, item, novoNome);
    }
})

.controller('PreferenciasCtrl', function ($ionicPopup, $scope, Preferencias, Listas) {
    $scope.title = 'Preferências';
    $scope.preferencias = Preferencias.Get();

    if (parseInt($scope.preferencias.DefaultListId) > 0) {
        var listaPadrao = Listas.BuscaListaPorId($scope.preferencias.DefaultListId);
        $scope.listaPadrao = listaPadrao.Nome;
        $scope.idListaPadrao = listaPadrao.Id;
    } else {
        $scope.listaPadrao = 'Nenhuma';
        $scope.idListaPadrao = 0;
    }

    $scope.abreListas = function (idListaPadrao) {
        var template = "";
        template +=
            '<label class="item item-radio" ng-click="selecionarLista(\'0\', \'Nenhuma\');">' +
            '<input type="radio" name="group" checked>' +
            '<div class="item-content">' +
            'Nenhuma' +
            '</div>' +
            '<i class="radio-icon ion-checkmark"></i>' +
            '</label>';
        for (i = 0; i < Listas.Listas().length; i++) {
            var _lista = Listas.Listas()[i];
            var checked = '';
            if (parseInt(idListaPadrao) == _lista.Id) {
                checked = 'checked';
            }
            template +=
                '<label class="item item-radio" ng-click="selecionarLista(\'' + _lista.Id + '\', \'' + _lista.Nome + '\');">' +
                '<input type="radio" name="group" ' + checked + '>' +
                '<div class="item-content">' +
                _lista.Nome +
                '</div>' +
                '<i class="radio-icon ion-checkmark"></i>' +
                '</label>';
        }

        listasPopup = $ionicPopup.show({
            title: 'Lista Padrão',
            template: template,
            scope: $scope,
            buttons: [
                {
                    text: 'Fechar',
                    type: 'button-calm'
                }
            ]
        });
    };

    $scope.selecionarLista = function (listaId, listaNome) {
        $scope.listaPadrao = listaNome;
        $scope.idListaPadrao = listaId;
        $scope.preferencias.DefaultListId = listaId;

        salvar();
        listasPopup.close();
    };

    $scope.excluirAoMarcar = function (preferencias) {
        $scope.preferencias.ExcluirAoMarcar = !preferencias.ExcluirAoMarcar;
        salvar();
    };

    $scope.apenasPendentes = function (preferencias) {
        $scope.preferencias.ApenasPendentes = !preferencias.ApenasPendentes;
        salvar();
    };

    function salvar() {
        Preferencias.Set($scope.preferencias.ExcluirAoMarcar, $scope.preferencias.DefaultListId, $scope.preferencias.ApenasPendentes);
    };
})

.controller('SobreCtrl', function ($scope, $cordovaAppRate) {
    $scope.title = 'Sobre';
    
    $scope.avaliar = function () {
        document.addEventListener("deviceready", function () {
            $cordovaAppRate.navigateToAppStore();
        }, false);
    };
    
    $scope.maisApps = function(){
        window.open('market://search?q=pub:Teslo Studio', '_system');
    };
    
    $scope.site = function(){
        window.open('http://teslo.com.br', '_system');
    };
})
