angular.module('app.services', [])

.factory('Preferencias', function ($localStorage) {
    return {
        Get: function () {
            if ($localStorage.preferencias) {
                return $localStorage.preferencias;
            } else {
                var preferencias = {
                    ExcluirAoMarcar: false,
                    DefaultListId: 0,
                    ApenasPendentes: false
                };
                $localStorage.preferencias = preferencias;
				return $localStorage.preferencias;
            }
        },
        Set: function (excluirAoMarcar, defaultListId, apenasPendentes) {
            var preferencias = {
                ExcluirAoMarcar: excluirAoMarcar,
                DefaultListId: defaultListId,
                ApenasPendentes: apenasPendentes
            };
            $localStorage.preferencias = preferencias;
        },
    };
})

.factory('Listas', function ($localStorage, Preferencias) {
    return {
        BuscaItemPorId: function (listaId, itemId) {
            var lista = this.BuscaListaPorId(listaId);
            for (i = 0; i < lista.Items.length; i++) {
                if (lista.Items[i].Id == itemId) {
                    return lista.Items[i];
                }
            }
            return null;
        },
        BuscaListaPorId: function (id) {
            var listas = this.Listas();
            for (i = 0; i < listas.length; i++) {
                if (listas[i].Id == id) {
                    return listas[i];
                }
            }
            return null;
        },
        Listas: function () {
            if (!$localStorage.listas) {
                var listasPadrao = [];
                listasPadrao.push({
                    Id: 1,
                    Nome: 'Lista de Mercado',
                    Items: []
                });
                listasPadrao.push({
                    Id: 2,
                    Nome: 'No Trabalho',
                    Items: []
                });
                listasPadrao.push({
                    Id: 3,
                    Nome: 'Em Casa',
                    Items: []
                });
                listasPadrao.push({
                    Id: 4,
                    Nome: 'Na Faculdade',
                    Items: []
                });
                $localStorage.listas = listasPadrao;
            }
            return $localStorage.listas.sort(function (a, b) {
                return parseInt(a.Id) - parseInt(b.Id);
            });
        },
        AdicionaLista: function (nome) {
            listas = this.Listas();
            var id = 0;
            if (listas.length > 0) {
                id = listas[listas.length - 1].Id;
            }
            id = parseInt(id) + 1;

            var obj = {
                Id: id,
                Nome: nome,
                Items: []
            };

            listas.push(obj);
            $localStorage.listas = listas;

            return obj;
        },
        EditaLista: function (lista, novoNome) {
            $localStorage.listas[$localStorage.listas.indexOf(lista)].Nome = novoNome;
        },
        EditaItem: function (lista, item, novoNome) {
            $localStorage.listas[$localStorage.listas.indexOf(lista)].
            Items[$localStorage.listas[$localStorage.listas.indexOf(lista)].Items.indexOf(item)].Nome = novoNome;
        },
        RemoveLista: function (lista) {
            $localStorage.listas.splice($localStorage.listas.indexOf(lista), 1);
        },
        AdicionaItem: function (lista, nome) {
            items = lista.Items;
            var id = 0;
            if (items.length > 0) {
                id = items[items.length - 1].Id;
            }
            id = parseInt(id) + 1;

            $localStorage.listas[$localStorage.listas.indexOf(lista)].Items.push({
                Id: id,
                Nome: nome,
                Feito: false
            });
        },
        LimparLista: function (lista){
            $localStorage.listas[$localStorage.listas.indexOf(lista)].Items = [];
        },
        RemoveItem: function (lista, item) {
            $localStorage.listas[$localStorage.listas.indexOf(lista)].Items.splice(lista.Items.indexOf(item), 1);
        },
        RemoveItensConcluidos: function (lista) {
            var itensParaRemocao = [];
            for (i = 0; i < $localStorage.listas[$localStorage.listas.indexOf(lista)].Items.length; i++) {
                if ($localStorage.listas[$localStorage.listas.indexOf(lista)].Items[i].Feito == true) {
                    itensParaRemocao.push($localStorage.listas[$localStorage.listas.indexOf(lista)].Items[i]);
                }
            }
            for (i = 0; i < itensParaRemocao.length; i++) {
                this.RemoveItem(lista, itensParaRemocao[i]);
            }
        },
        AlteraStatusItem: function (lista, item) {
            if (!item.Feito && Preferencias.Get().ExcluirAoMarcar == true) {
                this.RemoveItem(lista, item);
            } else {
                $localStorage.listas[$localStorage.listas.indexOf(lista)].
                Items[$localStorage.listas[$localStorage.listas.indexOf(lista)].Items.indexOf(item)].Feito = !item.Feito;
            }
        },
    };
})