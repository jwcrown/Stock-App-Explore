//backbone model
var StockModel = Backbone.Model.extend({  //Wanted to match model from API but format causes issue in HTML
    defaults: {
        symbol: null,
        price: null
    },
    initialize: function(){
        console.log("Stock model created!");
    }
});

// backbone collection
var StockCollection = Backbone.Collection.extend({
    model: StockModel,
    url: 'http://localhost:8000/api/stocks',
    parse: function(data){
        return data["Stock Quotes"]
    }
});

// instantiate a collection
var StockTable = new StockCollection();

// backbone views
var StockView = Backbone.View.extend({
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

var StockListView = Backbone.View.extend({
    model: StockTable,
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

var stocksView = new StockListView();

$(document).ready(function () {
    $('.add-stock').on('click', function () {
        var stock = new StockModel({
            symbol: $('.ticket-input').val()
        });
        $('.ticket-input').val('');
        StockTable.add(stock);
        
        stock.save(null, {
            success: function (response) {
                console.log('Successfully got stocks');
                for (var stockIdx in response.attributes["Stock Quotes"]){
                    var stock = new StockModel({
                        symbol: response.attributes["Stock Quotes"][stockIdx]["1. symbol"],
                        price: "$" + response.attributes["Stock Quotes"][stockIdx]["2. price"]
                    });
                    StockTable.add(stock);
                }
    
            },
            error: function () {
                console.log('Failed to get stocks!');
            }
        });
        StockTable.remove(stock);  //How can I avoid this?
    });
});