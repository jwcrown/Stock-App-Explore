// backbone model

var Stock = Backbone.Model.extend({
    defaults: {
        price: '',
        ticket: '',
    }
});

// backbone collection

var Stocks = Backbone.Collection.extend({
    url: 'http://localhost:8000/api/stocks'
});

// instantiate a collection

var stocks = new Stocks();

// backbone views

var StockView = Backbone.View.extend({
    model: new Stock(),
    tagName: 'tr',
    initialize: function () {
        this.template = _.template($('.stocks-list-template').html());
    },
    events: {
        'click .delete-stock': 'delete',
    },
    delete: function () {
        this.model.destroy();
    },
    
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var StocksView = Backbone.View.extend({
    model: stocks,
    el: $('.stocks-list'),
    initialize: function () {
        this.model.on('remove', this.render, this);
        this.model.on('add', this.render, this);
        

    },
    render: function () {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function (stock) {
            self.$el.append((new StockView({ model: stock })).render().$el);
        });
        return this;
    }
});

var stocksView = new StocksView();

$(document).ready(function () {
    $('.add-stock').on('click', function () {
        var stock = new Stock({
            ticket: $('.ticket-input').val(),
            price: "",
        });
        $('.ticket-input').val('');
        stocks.add(stock);
        

        stock.save(null, {
            success: function (response) {
                console.log('Successfully got stocks');
                console.log(response.attributes.ticket);
                for (var stockIdx in response.attributes["Stock Quotes"]){
                    var stock = new Stock({
                        ticket: response.attributes["Stock Quotes"][stockIdx]["1. symbol"],
                        price: "$" + response.attributes["Stock Quotes"][stockIdx]["2. price"]
                    });
                    stocks.add(stock);
                }
    
            },
            error: function () {
                console.log('Failed to get stocks!');
            }
        })
        stocks.remove(stock);
    });
});