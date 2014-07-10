var Mayocat = (function (Mayocat) {

    var currentLocale,
        messageFormat,
        messageTemplates,
        templatesCache = {};

    $(function () {
        currentLocale = $("meta[property='mayocat:locale']").attr("content");
        if (typeof currentLocale !== 'undefined') {
            messageFormat = new MessageFormat(currentLocale);

            $.getJSON("/api/localization/theme/" + currentLocale + "?ajax", function (json)
            {
                messageTemplates = json;
            });
        }
    });

    Mayocat.localization = Mayocat.localization || {};

    Mayocat.localization.getMessage = function (key, args)
    {
        if (typeof currentLocale === 'undefined') {
            console.warn("We could not find the current locale.");
            console.warn("Please add the following meta tag to your index.html template:")
            console.warn('<meta property="mayocat:locale" content="{{locale.tag}}"/>')
            return;
        }
        if (typeof messageTemplates !== 'undefined') {
            try {
                var template = messageTemplates[key].value;
                return messageFormat.compile(template)(args);
            }
            catch (err) {
                console.warn(err);
            }
        }
        else {
            console.warn("We don't have localization for this locale: ", currentLocale);
        }
    };

    if (typeof Handlebars !== 'undefined') {
        Handlebars.registerHelper('message', function (key, options)
        {
            return String(Mayocat.localization.getMessage(key, options.hash));
        });
    }

    $(function(){

        $("html").addClass("js").removeClass("no-js");

        if ($("#cart").length) {
            // We are on the cart page, augment the cart with dynamic functionalities

            var template = Handlebars.compile($("#cart-table-template").html());

            var updateCart = function () {
                $.getJSON("/cart?ajax", function (result) {
                    var cart = result.cart,
                        updatedTable = template(cart);

                    $("#cart").html(updatedTable);
                    augmentCart();
                    window.picturefill && window.picturefill();
                });
            }

            var augmentCart = function () {

                var isUpdating = false;

                // AJAX change quantity
                $("#cart tr .plus, #cart tr .minus").click(function () {

                    if (isUpdating) {
                        return;
                    }
                    isUpdating = true;

                    var index = $(this).parents(".item").data("index"),
                        quantity = parseInt($(this).parents(".item").data("quantity")),
                        isAdd = $(this).hasClass("plus"),
                        data = {};

                    if (!isAdd && quantity == 1) {
                        // Delete item
                        isUpdating = true;

                        // Remove product asynchronously, then fetch updated cart and update HTML

                        var index = $(this).parents(".item").data("index"),
                            data = {},
                            item = $(this);

                        data["remove_" + index] = 1;

                        $.post("/cart/update?ajax", data, function () {
                            item.parents(".item").fadeOut(500, function () {
                                $(this).remove();

                                updateCart();
                            });
                        });
                    }

                    data["quantity_" + index] = isAdd ? quantity + 1 : quantity - 1;

                    $.post("/cart/update?ajax", data, function () {
                        updateCart();
                    });
                });

                // AJAX change shipping option
                $("[name='shipping_option']").change(function () {
                    isUpdating = true;
                    $.post("/cart/update?ajax", {
                        "shipping_option": $("[name='shipping_option']").val()
                    }, function () {
                        updateCart();
                    });
                });
            }

            augmentCart();


        }
    });


    Mayocat.render = function(templateId, context) {

        if (typeof templatesCache[templateId] === "undefined") {
            templatesCache[templateId] = Handlebars.compile($(templateId).html());
        }

        return templatesCache[templateId](context);
    }

    return Mayocat;

})(Mayocat || {});
